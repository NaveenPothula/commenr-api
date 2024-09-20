const mongoose = require("mongoose");

const KeywordSchema = new mongoose.Schema({
  keyword: String,
  relevance: String,
  redditCommunities: [String],
});

const CompanySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
  },
  coreIndustry: String,
  sector: String,
  mainProducts: [String],
  mainServices: [String],
  targetMarkets: [String],
  customerTypes: [String],
  keyPainPoints: [String],
  needsAddressed: [String],
  uniqueSellingPropositions: [String],
  competitiveAdvantages: [String],
  summary: String,
  keywords: [KeywordSchema],
  createdAt: { type: Date, default: Date.now },
});

const Company = mongoose.model("Company", CompanySchema);
module.exports = Company;
