const FAQ = require("./../models/Faq");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const generateId = require("../utils/generateId");

const generateUniqueId = async () => {
  const faqId = generateId(6);
  const userExistsWithBusinessId = await FAQ.findOne({ faqId });
  if (userExistsWithBusinessId) {
    return generateUniqueId(); // Recursively generate a new ID if it already exists
  }
  return faqId;
};

exports.getFAQs = catchAsync(async (req, res, next) => {
  const response = await FAQ.find();
  console.log(response);
  if (!response) {
    return next(new AppError("FAQ not found", 404));
  }
  res.status(200).json({
    status: "success",
    response,
  });
});

exports.addFAQ = catchAsync(async (req, res, next) => {
  console.log("add faq");
  const { question, answer } = req.body;
  const faqId = await generateUniqueId();
  const newFAQ = await FAQ.create({ question, answer, faqId });
  console.log(newFAQ);

  if (!newFAQ) {
    return next(new AppError("FAQ was not added"));
  }

  res.status(200).json({
    status: "success",
    newFAQ,
  });
});

exports.deleteFAQ = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const faq = await FAQ.findOneAndDelete({ faqId: id });

  if (!faq) {
    return next(new AppError("faq not found"));
  }

  res.status(200).json({
    status: "success",
    faq,
  });
});

exports.getFAQ = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  const faq = await FAQ.findOne({ faqId: id });
  console.log(faq);
  if (!faq) {
    return next(new AppError("faq not found"));
  }

  res.status(200).json({
    status: "success",
    faq,
  });
});

exports.updateFAQ = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const faq = await FAQ.findOneAndUpdate({ faqId: id }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!faq) {
    return next(new AppError("faq not found"));
  }

  res.status(200).json({
    status: "success",
    faq,
  });
});
