const mongoose = require("mongoose");
// const bcrypt = require('bcryptjs');
// const validator = require('validator');
//const crypto = require('crypto');   /

const FAQSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  faqId: {
    type: String,
    required: true,
    unique: true,
  },
});

const Faq = mongoose.model("Faq", FAQSchema);

module.exports = Faq;
