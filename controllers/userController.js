const mammoth = require("mammoth");
const User = require("./../models/User");

const { OpenAI } = require("openai");

require("dotenv").config();
const llm = new OpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
  apiKey: process.env.OPEN_AI_API_KEY,
});

exports.getUser = async (req, res) => {
  try {
    const username = req.username;
    const user = await User.findOne({ username: username });
    // console.log(user);

    res.status(200).json({
      status: "success",
      user: user.username,
    });
  } catch (e) {}
};

exports.analyzeCompany = async (req, res) => {
  try {
    //console.log(req.file);
    // Read and extract text from the uploaded Word file
    const result = await mammoth.extractRawText({ path: req.file.path });
    const extractedText = result.value;
    //console.log(extractedText);

    const prompt = `Analyze the following company profile and extract these key information:
    1. Core industry and sector of the company
    2. Main products and/or services offered
    3. Target market(s) or types of customers the company serves
    4. Key pain points or needs that the company's products/services address
    5. Any unique selling propositions or competitive advantages
    Provide a concise summary of these elements to create a clear understanding of the company's business.
    
    Format your response as a JSON object with the following structure  without markdown syntax or code block delimiters.:
    {
      "coreIndustry": "",
      "sector": "",
      "mainProducts": [],
      "mainServices": [],
      "targetMarkets": [],
      "customerTypes": [],
      "keyPainPoints": [],
      "needsAddressed": [],
      "uniqueSellingPropositions": [],
      "competitiveAdvantages": [],
      "summary": ""
    }
    
    Company Profile:
    ${extractedText}`;

    const response = await llm.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const rawresponse = response.choices[0].message.content;
    const finalResponse = JSON.parse(rawresponse);
    // console.log(response);

    // let cleanedResponse = rawresponse.replace(/```json\n|```/g, "");
    // let finalResponse = JSON.parse(cleanedResponse);
    const keywordPrompt = `Based on the following company profile analysis, please perform the following tasks:

    1. Generate a list of 10 relevant keywords and phrases that accurately represent the company's:
       - Core industry and sector
       - Main products and services
       - Target market(s)
       - Key pain points or needs addressed
       - Unique selling propositions

    2. For each keyword or phrase:
       - Provide a brief explanation of its relevance to the company (1-2 sentences)
       - Generate a list of 50 Reddit communities (subreddits) that are most likely to contain discussions related to this keyword or phrase

    Format your response as a JSON object with the following structure  without markdown syntax or code block delimiters.:
    {
      "keywords": [
        {
          "keyword": "",
          "relevance": "",
          "redditCommunities": []
        } 
      ]
    }

    Company Profile Analysis:
    ${JSON.stringify(finalResponse)}`;

    const keywordCompletion = await llm.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: keywordPrompt }],
    });

    const keywordJson = JSON.parse(
      keywordCompletion.choices[0].message.content
    );

    console.log(keywordJson.keywords);
    keywordJson.keywords.forEach((element) => {
      console.log(element.redditCommunities.length);
    });

    res.status(200).json({
      status: "success",
      response: finalResponse,
      keywordJson: keywordJson,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process the document" });
  }
};
