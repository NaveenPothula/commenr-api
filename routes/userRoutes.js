const express = require("express");

const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

//router.post('/forgot', authController.forgotPassword);
//router.get('/reset/:token', authController.renderResetPasswordForm);
//router.post('/reset/:token', authController.resetPassword); // No authMiddleware.protect here
router.post("/login", authController.login);
router.get("/logout", authController.logout);

// Protect all routes after this middleware!
router.use(authController.protect);

router.get("/getUser", userController.getUser);
router.post(
  "/analyzeCompany",
  upload.single("file"),
  userController.analyzeCompany
);
//router.put('/updatePassword', authController.updatePassword);
//router.put('/profile', authController.updateUserProfile);

// routes for dates
// router.patch('/dates', userController.saveSlots);
// router.get('/dates/:date', userController.getSlotsByDate);
// router.get('/dates', userController.getAllSlots);
// router.delete('/dates/:date', userController.deleteSlotsByDate);

// restricting permissions
//router.use(authController.restrictTo('admin'));

module.exports = router;
