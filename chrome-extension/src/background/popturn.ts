/*
これは翻訳をする場合のコード（GASを使って、DeepL APIを使用している）
ここをGeminiAPIを使って、ポジティブな文章に変更するコードに書き換えたい
参考：https://zenn.dev/alvinvin/books/chrome_extension/viewer/chapter05
参考：https://zenn.dev/alvinvin/books/chrome_extension/viewer/chapter09
*/

const API_URL =
  'https://script.google.com/macros/s/AKfycbwaZkRiYyf84rK_FyPYtAfLVUfJaNP51QnXzKAxz0lFaTv9JVSUUpjVJK59X247el-m/exec';

export async function popturn(text: string, targetLang: string): Promise<string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    // Authorization: `DeepL-Auth-Key ${API_KEY}`, // DeepL API を使用する場合のみ
  };
  const requestBody = { text: [text], target_lang: targetLang };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
      mode: 'cors',
    });
    if (!response.ok) {
      throw new Error(`Translation API request failed with status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.translations || !Array.isArray(data.translations) || data.translations.length === 0) {
      throw new Error('Invalid response from Translation API');
    }

    return data.translations[0].text;
  } catch (error) {
    console.error('Translation Error:', error);
    return '';
  }
}
