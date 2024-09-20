const axios = require("axios");
const User = require("../models/User");
require("dotenv").config();

// Reddit App Credentials
const clientId = process.env.REDDIT_CLIENT_ID;
const clientSecret = process.env.REDDIT_CLIENT_SECRET;

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Make the request to Reddit's /api/v1/access_token endpoint
    const response = await axios.post(
      "https://www.reddit.com/api/v1/access_token",
      new URLSearchParams({
        grant_type: "password",
        username: username, // Reddit username
        password: password, // Reddit password
      }),
      {
        auth: {
          username: clientId, // Reddit App Client ID
          password: clientSecret, // Reddit App Client Secret
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "script:reddit:1.0.0 (by /u/Feeling_Salad_7306)",
        },
      }
    );
    // console.log(response.data.access_token);
    // console.log(response);
    res.cookie("access_token", response.data.access_token, {
      path: "/",
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "Strict",
    });

    const user = await axios.get("https://oauth.reddit.com/api/v1/me", {
      headers: {
        Authorization: `Bearer ${response.data.access_token}`,
      },
    });

    // Send back the access token to the client
    res.status(200).json({
      status: "success",
      user: user.data.name,
    });
  } catch (error) {
    // Handle any errors
    console.error(
      "Error fetching access token:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      error: "Failed to retrieve access token",
      details: error.response ? error.response.data : error.message,
    });
  }
};

// Replace with the access token you got from password authentication

exports.protect = async (req, res, next) => {
  console.log("request");
  try {
    // console.log(req.cookies);
    const token = req.cookies.access_token;
    // console.log(token);

    const response = await axios.get("https://oauth.reddit.com/api/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    req.username = response.data.name;

    next();
  } catch (error) {
    console.error(
      "Error fetching user information:",
      error.response ? error.response.data : error.message
    );
    res.status(400).json({
      status: "fail",
      message: "user not verified please login",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({ status: "success" });
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: e.message,
    });
  }
};

exports.signup = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json("success");
  } catch (e) {
    res.json("fail");
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin','user']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};
