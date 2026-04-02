const { onCall, HttpsError } = require("firebase-functions/v2/https");
const OpenAI = require("openai");

exports.analyzeStructuralData = onCall(
  { 
    secrets: ["OPENAI_API_KEY"],
    cors: true
  },
  async (request) => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { type, payload } = request.data;

    try {
      if (type === "image") {
        const response = await openai.chat.completions.create({
          model: "gpt-5.4", 
          messages: [
            {
              role: "system",
              content: `You are a Bridge Structural Safety Diagnosis AI. Look at the attached photo and provide a response ONLY in valid JSON format regarding the following items. Use exactly these keys:
              {
                "Crack_Morphology": "vertical/horizontal/diagonal",
                "Estimated_Size": "Estimated length and width",
                "Distribution_Pattern": "Distribution pattern",
                "Structural_Probability": "Surface vs. structural crack probability",
                "Leakage_Signs": "Presence of leakage signs",
                "Exposed_Rebar": "Presence of exposed rebar"
              }`
            },
            {
              role: "user",
              content: [
                { type: "text", text: "Analyze this bridge inspection image." },
                { type: "image_url", image_url: { url: payload } } 
              ]
            }
          ],
          response_format: { type: "json_object" }
        });

        return JSON.parse(response.choices[0].message.content);

      } else if (type === "csv") {
        const response = await openai.chat.completions.create({
          model: "gpt-5.4",
          messages: [
            {
              role: "system",
              content: `You are an AI analyzing 15-second vibration data of a bridge structure.
        Respond ONLY in valid JSON format using the exact keys below. Keep the values extremely concise and structured:
        {
          "Summary": "Provide a maximum 1-sentence summary of the overall status.",
          "Dominant_Frequency": "Numeric value with 'Hz' unit (e.g., '2.4 Hz').",
          "Anomaly_Detected": "Respond strictly with 'Yes' or 'No'.",
          "Advice": "Provide 1 short sentence of immediate action required."
        }`
            },
            {
              role: "user",
              content: `Here is the parsed sensor data summary: ${JSON.stringify(payload)}`
            }
          ],
          response_format: { type: "json_object" }
        });

        return JSON.parse(response.choices[0].message.content);
      } else {
        throw new HttpsError("invalid-argument", "Invalid data type.");
      }
    } catch (error) {
      console.error("OpenAI Error:", error);
      throw new HttpsError("internal", "Failed to analyze data via AI.");
    }
  }
);