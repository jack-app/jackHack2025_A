import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ClickAwayListener } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type {} from '@mui/material/themeCssVarsAugmentation';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { v4 as uuidv4 } from 'uuid';
import CutieRabbit from '../images/CutieRabbit.png';
import CutieRabbitHammerDown from '../images/CutieRabbitHammerDown.png';
import CutieRabbitHammerUp from '../images/CutieRabbitHammerUp.png';
import { Icon } from './Icon';

const root = document.createElement('chrome-extension-boilerplate-react-vite-content-view-root');
root.style.zIndex = '2147483647';
document.body.after(root);

const shadowRootElement = document.createElement('div');
shadowRootElement.id = 'shadow-root';
const shadowContainer = root.attachShadow({ mode: 'open' });
shadowContainer.appendChild(shadowRootElement);

// Shadow DOM対応（おまじない）
const cache = createCache({ key: 'shadow-css', prepend: true, container: shadowContainer });
const theme = createTheme({
  cssVariables: { rootSelector: '#shadow-root', colorSchemeSelector: 'class' },
  components: {
    MuiPopover: { defaultProps: { container: shadowRootElement, style: { zIndex: 2147483647 } } },
    MuiPopper: { defaultProps: { container: shadowRootElement, style: { zIndex: 2147483647 } } },
  },
});

// 各選択位置の状態を表す型定義
interface SelectionState {
  id: string;
  position: { x: number; y: number };
  selectedText: string;
  range: Range;
  isLoading: boolean;
  mode: 'icon' | 'loading' | 'idle';
}

const App = () => {
  // 複数の選択位置を管理する配列
  const [selections, setSelections] = useState<SelectionState[]>([]);
  const [imageIndex, setImageIndex] = useState(0);
  const images = [CutieRabbitHammerUp, CutieRabbitHammerDown];

  // 新しい選択を追加する関数
  const addSelection = (position: { x: number; y: number }, text: string, range: Range) => {
    const newSelection: SelectionState = {
      id: uuidv4(),
      position,
      selectedText: text,
      range,
      isLoading: false,
      mode: 'icon',
    };

    setSelections(prev => [...prev, newSelection]);
    return newSelection.id;
  };

  // 特定の選択の状態を更新する関数
  const updateSelection = (id: string, updates: Partial<SelectionState>) => {
    setSelections(prev => prev.map(sel => (sel.id === id ? { ...sel, ...updates } : sel)));
  };

  // 特定の選択を削除する関数
  const removeSelection = (id: string) => {
    setSelections(prev => prev.filter(sel => sel.id !== id));
  };

  // アイコンがクリックされたときの処理
  const handleIconClick = (id: string) => {
    updateSelection(id, { mode: 'loading', isLoading: true });

    chrome.runtime.sendMessage({
      type: 'POPTURN',
      data: {
        selectedText: selections.find(sel => sel.id === id)?.selectedText || '',
        selectionId: id,
      },
    });
  };

  // 選択位置の外側をクリックしたときの処理
  const handleClickAway = (id: string) => {
    if (selections.find(sel => sel.id === id)?.isLoading) return; // ロード中は無視
    removeSelection(id);
  };

  useEffect(() => {
    const handleMessage = (message: any, sender: chrome.runtime.MessageSender, sendResponse: (resp?: any) => void) => {
      if (message.type !== 'REPLACE_TEXT') return;
      const { newText, selectionId } = message.data;
      const sel = selections.find(s => s.id === selectionId);
      if (!sel) return;

      // sel.range に保存された範囲を使って置換
      sel.range.deleteContents();
      sel.range.insertNode(document.createTextNode(newText));

      if (selections.length === 1) {
        window.getSelection()?.removeAllRanges();
      }

      removeSelection(selectionId);
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [selections]);

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const text = selection.toString().trim();
      if (!text) return;

      const origRange = selection.getRangeAt(0);
      const range = origRange.cloneRange();
      const rect = range.getBoundingClientRect();
      const position = {
        x: window.scrollX + rect.right,
        y: window.scrollY + rect.bottom,
      };

      addSelection(position, text, range);
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  useEffect(() => {
    // ロード中の選択がある場合、アニメーションを開始
    const hasLoadingSelections = selections.some(sel => sel.isLoading);

    if (!hasLoadingSelections) return;

    const intervalId = setInterval(() => {
      setImageIndex(prev => (prev === 0 ? 1 : 0));
    }, 500);

    return () => clearInterval(intervalId);
  }, [selections]);

  // アイコン注入のロジック
  useEffect(() => {
    const injectIcon = (el: HTMLElement) => {
      if (el.classList.contains('has-icon')) return;
      el.classList.add('has-icon');
      el.style.position = 'relative';

      const wrapper = document.createElement('div');
      wrapper.className = 'my-injected-icon';
      Object.assign(wrapper.style, {
        position: 'absolute',
        right: '0px',
        bottom: '0px',
        zIndex: '1',
        width: '24px',
        height: '24px',
      });

      const iconRoot = document.createElement('div');
      wrapper.appendChild(iconRoot);
      createRoot(iconRoot).render(<img src={CutieRabbit} alt="" width="24px" height="24px" />);

      el.appendChild(wrapper);
    };

    // マウント時に既存の要素へ注入
    document.querySelectorAll<HTMLElement>('[data-testid="question-text"]').forEach(injectIcon);

    // 以降、追加された要素を監視
    const observer = new MutationObserver(mutations => {
      for (const { addedNodes } of mutations) {
        addedNodes.forEach(node => {
          if (!(node instanceof HTMLElement)) return;

          // 直接マッチする要素
          if (node.matches('[data-testid="question-text"]')) {
            injectIcon(node);
          }

          // サブツリー内にある場合もキャッチ
          node.querySelectorAll<HTMLElement>('[data-testid="question-text"]').forEach(injectIcon);
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {selections.map(selection => (
        <div key={selection.id}>
          {/* アイコンモードの表示 */}
          {selection.mode === 'icon' && !selection.isLoading && (
            <ClickAwayListener onClickAway={() => handleClickAway(selection.id)} mouseEvent="onMouseDown">
              <div
                onMouseDown={e => e.stopPropagation()}
                onMouseUp={e => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  left: selection.position.x + 30,
                  top: selection.position.y - 50,
                  zIndex: 1,
                }}>
                <Icon handleClick={() => handleIconClick(selection.id)} />
              </div>
            </ClickAwayListener>
          )}

          {/* ローディングモードの表示 */}
          {selection.isLoading && (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: selection.position.x - 10,
                  top: selection.position.y - 100,
                  zIndex: 1,
                }}>
                <img src={images[imageIndex]} alt="" width="150px" height="150px" />
              </div>
            </>
          )}
        </div>
      ))}
    </>
  );
};

createRoot(shadowRootElement).render(
  <CacheProvider value={cache}>
    <ThemeProvider theme={theme} colorSchemeNode={shadowRootElement}>
      <App />
    </ThemeProvider>
  </CacheProvider>,
);
