import OpenAI from "openai";
import { Crop, User } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getCropRecommendations(
  user: User,
  weather: { temperature: number; humidity: number; rainfall: number },
  crops: Crop[],
): Promise<{ cropId: number; confidence: number; notes: string; notesHi: string }[]> {
  const prompt = `Given these parameters:
- Farmer location: ${user.location}
- Land size: ${user.landSize} acres
- Current weather: Temperature ${weather.temperature}°C, Humidity ${weather.humidity}%, Rainfall ${weather.rainfall}mm
- Available crops: ${crops.map((c) => c.name).join(", ")}

Recommend up to 3 suitable crops. For each crop provide:
1. The crop name from the available list
2. Confidence score (0-100)
3. Brief notes in English explaining the recommendation
4. Same notes translated to Hindi

Return as JSON array with format:
[{
  "cropName": string,
  "confidence": number,
  "notes": string,
  "notesHi": string
}]`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content || "[]";
  const recommendations = JSON.parse(content);
  return recommendations.map((rec: any) => ({
    cropId: crops.find((c) => c.name === rec.cropName)!.id,
    confidence: rec.confidence,
    notes: rec.notes,
    notesHi: rec.notesHi,
  }));
}