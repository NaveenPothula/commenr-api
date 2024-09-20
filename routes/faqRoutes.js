const express = require("express");

const authController = require("../controllers/authController");
const FAQController = require("../controllers/faqController");

const router = express.Router();
router.get("/getFaqs", FAQController.getFAQs);

router.use(authController.protect);

router.post(
  "/addFaq",
  //   authController.restrictTo("admin"),
  FAQController.addFAQ
);
router.delete("/:id", FAQController.deleteFAQ);
router.get("/:id", FAQController.getFAQ);
router.patch("/:id", FAQController.updateFAQ);

module.exports = router;
