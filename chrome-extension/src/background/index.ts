import { popturn } from './popturn';
import { detectNegative } from './detect_negative';
import { useModeStorage } from '@extension/storage';

type UseMode = 0 | 1 | 2;

chrome.runtime.onMessage.addListener(async (message, sender) => {
  // タブID を取得して返答先を特定
  const tabId = sender.tab?.id;
  if (!tabId) return;

  // ストレージからモードを取得
  const mode = (await useModeStorage.get()) as UseMode;

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

    let isNegative: boolean;
    if (mode === 2) {
      // モード2: すべてネガティブと判断
      isNegative = true;
    } else if (mode === 1) {
      // モード1: ネガティブ判定このまま
      isNegative = await detectNegative(selectedText, 1);
    } else {
      // モード0: 明らかにネガティブなものだけ検出
      isNegative = await detectNegative(selectedText, 2);
    }

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
