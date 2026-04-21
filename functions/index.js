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
              content: `You are a bridge and structural safety diagnosis expert. Analyze the inspection image and respond ONLY in valid JSON using exactly these keys:
{
  "rebar": "Whether exposed rebar is visible and corrosion risk if leakage is detected",
  "size": "Estimated crack length and width relative to the structure boundary",
  "probability": "Probability this is a structural crack vs. surface-level crack",
  "morphology": "Crack orientation: vertical / horizontal / diagonal",
  "leakage": "Leakage presence and internal rebar corrosion risk assessment",
  "pattern": "Overall crack distribution pattern across the surface"
}
Rules:
- Estimate crack size relative to visible structural boundaries, not in absolute units.
- If leakage is detected, always note the possibility of internal rebar corrosion.`
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
              content: `You are a bridge and structural safety diagnosis expert. Analyze the 15-second vibration sensor data and respond ONLY in valid JSON using exactly these keys:
{
  "frequency": "Dominant frequency with Hz unit (e.g. '0.35 Hz'). Flag as structural instability if outside 0.1–0.5 Hz range.",
  "summary": "One sentence summarizing overall structural vibration status.",
  "anomaly": true or false,
  "advice": "One sentence of immediate action. Use CRITICAL rating if both visual and vibration data indicate abnormality."
}
Rules:
- Vibrations outside the 0.1–0.5 Hz range must be classified as structural instability.
- Any high-amplitude spike between 8–10 seconds must be labeled as a Transient Event.`
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