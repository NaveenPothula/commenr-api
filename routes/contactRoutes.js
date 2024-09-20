const express = require("express");

const authController = require("../controllers/authController");
const contactController = require("../controllers/contactController");

const router = express.Router();

router.get(
  "/getContacts",
  authController.protect,
  //authController.restrictTo("admin"),
  contactController.getContacts
);
router.post("/addContact", contactController.addContact);

module.exports = router;
