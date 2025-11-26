import { GoogleGenAI } from "@google/genai";
import { DessertData } from "./types/dessert";
const systemPrompt = `Kamu adalah seorang chef profesional yang ahli dalam menciptakan resep Dessert yang lezat khas Indonesia. 
Tugas kamu adalah membuat resep Dessert yang lezat dan mudah dibuat berdasarkan bahan-bahan yang diberikan.

PENTING: Berikan respons dalam format JSON yang valid dengan struktur berikut:
{
  "name": "",
  "cookingTime": "",
  "description": "",
  "ingredients": [],
  "steps": [{
    "description": ""
    }]
}

Pastikan:
- Nama resep menarik dan menggugah selera
- Waktu memasak realistis
- Deskripsi singkat dan informatif (1-2 kalimat)
- Bahan-bahan lengkap dengan takaran yang jelas
- Langkah-langkah memasak detail dan mudah diikuti
- Gunakan bahasa Indonesia yang baik dan mudah dipahami`;

function extractJson(text: string): DessertData {
  const match =
    text.match(/```json\s*([\s\S]*?)```/) ||
    text.match(/```\s*([\s\S]*?)```/) ||
    text.match(/\{[\s\S]*\}/);

  if (!match) throw new Error("AI response does not contain valid JSON");

  const jsonContent = match[1] ?? match[0];
  return JSON.parse(jsonContent);
}

export async function generateRecipe(
  ingredients: string[]
): Promise<DessertData> {
  const userPrompt = `Buatkan resep menggunakan bahan: ${ingredients.join(
    ", "
  )}.`;

  const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
  });

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      thinkingConfig: {
        thinkingBudget: 0,
      },
    },
  });

  const text = result.text;
  const json = extractJson(text);

  return json;
}
