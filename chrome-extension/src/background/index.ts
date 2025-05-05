import { popturn } from './popturn';
import { detectNegative } from './detect_negative';

chrome.runtime.onMessage.addListener(async (message, sender) => {
  // タブID を取得して返答先を特定
  const tabId = sender.tab?.id;
  if (!tabId) return;

  // 手動ポップ変換
  if (message.type === 'MANUAL_POP_TURN') {
    const selectedText = message.data.selectedText ?? '';
    const selectionId = message.data.selectionId ?? '';
    const newText = await popturn(selectedText);
    chrome.tabs.sendMessage(tabId, {
      type: 'MANUAL_REPLACE_TEXT',
      data: { selectionId, newText },
    });
  }

  // ネガティブ判定
  if (message.type === 'DETECT_NEGATIVE') {
    const selectedText = message.data.selectedText ?? '';
    const selectionId = message.data.selectionId ?? '';
    const isNegative = await detectNegative(selectedText);
    chrome.tabs.sendMessage(tabId, {
      type: 'IS_NEGATIVE',
      data: { selectionId, isNegative },
    });
  }

  // 自動ポップ変換
  if (message.type === 'AUTO_POP_TURN') {
    const selectedText = message.data.selectedText ?? '';
    const selectionId = message.data.selectionId ?? '';
    const newText = await popturn(selectedText);
    chrome.tabs.sendMessage(tabId, {
      type: 'AUTO_REPLACE_TEXT',
      data: { selectionId, newText },
    });
  }
});
