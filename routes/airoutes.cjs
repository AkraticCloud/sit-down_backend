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
        const { history, nearbyRestaurants } = req.body;

        if (!history || history.length === 0) {
            return res.status(400).json({ 
                error: "No dining history available. Please swipe on some restaurants first!" 
            });
        }

        if (!nearbyRestaurants || nearbyRestaurants.length === 0) {
            return res.status(400).json({ 
                error: "No nearby restaurants available." 
            });
        }

        const prompt = `
          You are a restaurant curator assistant. Based on the user's dining history, recommend ONE restaurant from the available nearby options.

          User's Dining History:
          ${JSON.stringify(history, null, 2)}

          Available Nearby Restaurants:
          ${nearbyRestaurants.map((r, i) => `${i}: ${r.name} - ${r.info} at ${r.address}`).join('\n')}

          Analyze their liked, favorited, and passed restaurants. Then pick the BEST match from the available nearby restaurants.

          Respond with ONLY valid JSON (no markdown, no extra text):
          {
            "index": 3,
            "reasoning": "You've liked Mexican and Mediterranean places. This restaurant offers similar cuisine and matches your $$ price preference."
          }
        `;

        const chatCompletion = await getGroqChatCompletion(prompt);
        const aiResponse = JSON.parse(chatCompletion);

        const recommendedIndex = aiResponse.index;
        const restaurant = nearbyRestaurants[recommendedIndex];

        if (typeof recommendedIndex !== 'number' || 
            recommendedIndex < 0 || 
            recommendedIndex >= nearbyRestaurants.length) {
            return res.status(500).json({ error: "AI returned invalid restaurant index" });
        }

        if (!aiResponse.reasoning || aiResponse.reasoning.trim().length < 10) {
            aiResponse.reasoning = "This restaurant matches your dining preferences.";
        }

        res.json({
            name: restaurant.name,
            address: restaurant.address,
            reasoning: aiResponse.reasoning
        });

    } catch (error) {
        console.error("AI Recommendation Error:", error);
        res.status(500).json({ error: "Failed to generate recommendation" });
    }
});

module.exports = router;