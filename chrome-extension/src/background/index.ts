import { popturn } from './popturn';
import { detectNegative } from './detect_negative';

chrome.runtime.onMessage.addListener(async function (message, sender) {
  // ネガティブ判定
  if (message.type === 'DETECT_NEGATIVE') {
    const selectedText = message.data.selectedText ?? '';
    const isNegative = await detectNegative(selectedText);
    if (sender.tab?.id !== undefined) {
      chrome.tabs.sendMessage(sender.tab.id, {
        type: 'IS_NEGATIVE',
        data: {
          isNegative: isNegative,
        },
      });
    }
  }

  // ポジティブ変換
  if (message.type === 'POPTURN') {
    const selectedText = message.data.selectedText ?? '';
    const selectionId = message.data.selectionId ?? '';

    const translatedText = await popturn(selectedText);

    if (sender.tab?.id !== undefined) {
      chrome.tabs.sendMessage(sender.tab.id, {
        type: 'REPLACE_TEXT',
        data: {
          newText: translatedText,
          selectionId: selectionId,
        },
      });
    }
  }
});
