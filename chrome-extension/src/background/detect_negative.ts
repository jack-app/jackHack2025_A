import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.CEB_API_KEY as string,
});

export async function detectNegative(text: string, mode: number): Promise<boolean> {
  if (mode === 1) {
    const req = {
      model: 'gemini-2.0-flash',
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
  if (mode === 2) {
    const req = {
      model: 'gemini-2.0-flash',
      contents: `「${text}」が明らかにネガティブな文かどうか判断して、明らかにネガティブなら1を、そうでないなら0を出力してください。必ず1か0のどちらかを出力してください。`,
    };

    const res = await ai.models.generateContent(req);
    console.log('detectNegative', res);

    if (!res.text) {
      return false;
    }
    const raw = res.text.trim();
    console.log('detectNegative answer', raw);
    return raw.includes('1');
  }
  return true;
}
