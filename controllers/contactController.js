const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Contact = require("./../models/Contact");
const generateId = require("../utils/generateId");

const generateUniqueId = async () => {
  const contactId = generateId(6);
  const userExistsWithBusinessId = await Contact.findOne({ contactId });
  if (userExistsWithBusinessId) {
    return generateUniqueId(); // Recursively generate a new ID if it already exists
  }
  return contactId;
};

exports.getContacts = catchAsync(async (req, res, next) => {
  const contacts = await Contact.find();

  if (!contacts) {
    return next(new AppError("No contacts found", 400));
  }
  //console.log(contacts);

  res.status(200).json({
    status: "succcess",
    contacts,
  });
});

exports.addContact = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { name, email, description } = req.body;
  const contactId = await generateUniqueId();
  const newContact = await Contact.create({
    name,
    email,
    description,
    contactId,
  });

  if (!newContact) {
    return next(new AppError("contact was not created", 400));
  }

  res.status(200).json({
    status: "success",
    newContact,
  });
});
