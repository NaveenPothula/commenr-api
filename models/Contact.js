const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: false,
  },
  contactId: {
    type: String,
    required: true,
    unique: true,
  },
});

const Contact = new mongoose.model("Contact", ContactSchema);

module.exports = Contact;
