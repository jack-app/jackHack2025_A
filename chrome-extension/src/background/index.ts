import { popturn } from './popturn';

chrome.runtime.onMessage.addListener(async function (message, sender) {
  if (message.type === 'POPTURN') {
    const selectedText = message.data.selectedText ?? '';
    const translatedText = await popturn(selectedText);

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
