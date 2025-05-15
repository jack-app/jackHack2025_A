import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.CEB_API_KEY as string,
});

export async function popturn(text: string): Promise<string> {
  // リクエストを組み立て
  const req = {
    model: 'gemini-2.0-flash',
    contents: `「${text}」を同じくらいな文字数のポジティブな文章に変換して語尾を"ﾋﾟｮﾝ"にしてください。必ず変換後の文章のみを返してください。`,
  };

  // 実際の API 呼び出し
  const res = await ai.models.generateContent(req);

  // 結果のテキストを返す
  return res.text ?? '';
}
