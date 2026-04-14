import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.CEB_API_KEY as string,
});

export async function detectNegative(text: string): Promise<boolean> {
  const req = {
    model: 'gemini-3.1-flash-lite-preview',
    contents: `「${text}」がネガティブな文かどうか判断して、ネガティブなら1を、そうでないなら0を出力してください。必ず1か0のどちらかを出力してください。`,
  };

  const res = await ai.models.generateContent(req);
  console.log('detectNegative', res);

  if (!res.text) {
    return true;
  }
  const raw = res.text.trim();
  console.log('detectNegative answer', raw);
  return raw.includes('1');
}
