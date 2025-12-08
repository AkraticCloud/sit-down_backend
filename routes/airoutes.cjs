const express = require('express');
const Groq = require("groq-sdk").default;
const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getGroqChatCompletion(userPrompt) {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
    model: "llama3-8b-8192",
  });
  
  return completion.choices[0]?.message?.content || "";
}

router.post('/recommend', async(req, res) => {
    try {
        const { history, preferences } = req.body;

        // Check if history is empty
        if (!history || history.length === 0) {
            return res.status(400).json({ 
                error: "No dining history available. Please swipe on some restaurants first!" 
            });
        }

        // Build the prompt with user data
        const prompt = `
          You are a restaurant curator assistant. Based on the user's dining history and preferences, recommend ONE restaurant.

          User's Dining History:
          ${JSON.stringify(history, null, 2)}

          User's Preferences:
          ${JSON.stringify(preferences, null, 2)}

          Analyze their liked, favorited, and passed restaurants along with their preferences (cuisines, dietary restrictions, dining style, price range).

          Respond with ONLY this exact format (no extra text, no markdown):

          [Restaurant Name]
          [Full Address]

          Why this choice?
          [Your reasoning here - mention what they like and how this restaurant matches their preferences]

          Example:
          Five Guys
          936 York Rd Towson, MD 21204

          Why this choice?
          You like American cuisine and prefer places with dine-in and takeout options. This place matches most of your likes and fits your $$ price range.
          `;

        const chatCompletion = await getGroqChatCompletion(prompt);

        // Parse the response into structured format
        const lines = chatCompletion.trim().split('\n').filter(line => line.trim());
        
        const name = lines[0] || "Unknown Restaurant";
        const address = lines[1] || "Address not available";
        const reasoningIndex = lines.findIndex(line => line.includes("Why this choice?"));
        const reasoning = lines.slice(reasoningIndex + 1).join(' ').trim() || "No reasoning provided";

        res.json({
            name,
            address,
            reasoning
        });

    } catch (error) {
        console.error("AI Recommendation Error:", error);
        res.status(500).json({ error: "Failed to generate recommendation" });
    }
});

module.exports = router;