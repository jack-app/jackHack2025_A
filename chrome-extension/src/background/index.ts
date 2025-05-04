import { popturn } from './popturn';

chrome.runtime.onMessage.addListener(async function (message, sender) {
  if (message.type === 'POPTURN') {
    const selectedText = message.data.selectedText ?? '';
    const translatedText = 'ここにいい感じにポジティブに変換した文章を入れる';

    if (sender.tab?.id !== undefined) {
      chrome.tabs.sendMessage(sender.tab.id, {
        type: 'REPLACE_TEXT', // ← SHOW ではなく新しいタイプ名にする
        data: {
          newText: translatedText,
        },
      });
    }
  }
});
