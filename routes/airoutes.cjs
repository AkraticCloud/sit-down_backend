import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `You are a restaurant curator assistant. The user has liked, disliked, favorited, and gathered nearby restaurants. The user has also chosen from these set of preferences:
        Cuisines:
        American, Indian, Mexican, Italian, Japanese, Chinese, Thai, Mediterranean

        Dietary Restrictions:
        Gluten-free, Vegetarian, Vegan, Kosher, Halal, Nut Allergy

        Dining Preferences:
        Drive-thru, Dine-in, Counter Service, Outdoor Seating, Takeout, Family Friendly

        Price Range:
        $, $$, $$$, $$$$
        
        Review all of these data points to select the best fit restaurant option and provide a short reasoning.
        Include in your response:
        Restaurant Name
        Restaurant Address
        
        Why this choice?
        (Your reasoning goes here)
        
        <Example Response>
        Five Guys
        936 York Rd Towson, MD 21204

        Why this choice?
        You like American cuisine and prefer places with dine-in and takeout options. This place matches most of your likes.
        </Example Response>
        `
        ,
      },
    ],
    model: "openai/gpt-oss-20b",
  });
}

router.post('/recommend'), async(req, res) => {
    const chatCompletion = await getGroqChatCompletion();
}

module.exports = router