import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type {} from '@mui/material/themeCssVarsAugmentation';
import { ClickAwayListener, Typography } from '@mui/material';
import { Icon } from './Icon';
import CutieRabbitHammerUp from '../images/CutieRabbitHammerUp.png';
import CutieRabbitHammerDown from '../images/CutieRabbitHammerDown.png';
import CutieRabbit from '../images/CutieRabbit.png';

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
  isLoading: boolean;
  mode: 'icon' | 'loading' | 'idle';
}

const App = () => {
  // 複数の選択位置を管理する配列
  const [selections, setSelections] = useState<SelectionState[]>([]);
  const [imageIndex, setImageIndex] = useState(0);
  const images = [CutieRabbitHammerUp, CutieRabbitHammerDown];
  const [currentRect, setCurrentRect] = useState<DOMRect | null>(null);

  // 新しい選択を追加する関数
  const addSelection = (position: { x: number; y: number }, text: string) => {
    const newSelection: SelectionState = {
      id: `selection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      position,
      selectedText: text,
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

    // ここで必要ならバックグラウンドスクリプトにメッセージを送信
    // chrome.runtime.sendMessage({
    //   type: 'POPTURN',
    //   data: {
    //     selectedText: selections.find(sel => sel.id === id)?.selectedText || '',
    //     selectionId: id,
    //   },
    // });

    // テスト用のタイムアウト
    //5000はGeminiから返ってくる時間に変える
    setTimeout(() => {
      // 処理が完了したら選択を削除する
      removeSelection(id);
    }, 5000);
  };

  // 選択位置の外側をクリックしたときの処理
  const handleClickAway = (id: string) => {
    if (selections.find(sel => sel.id === id)?.isLoading) return; // ロード中は無視
    removeSelection(id);
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'REPLACE_TEXT') {
        const newText = message.data.newText;
        const selectionId = message.data.selectionId;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(newText));

        selection.removeAllRanges(); // ハイライト解除

        // 指定されたIDの選択を削除
        if (selectionId) {
          removeSelection(selectionId);
        }
      }
    });
  }, []);

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        const selectedText = selection.toString();
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        setCurrentRect(rect);

        // 新しい選択位置を追加
        const position = {
          x: window.scrollX + rect.right,
          y: window.scrollY + rect.bottom,
        };
        addSelection(position, selectedText);
      }
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
              <div
                style={{
                  position: 'absolute',
                  left: selection.position.x - 10,
                  top: selection.position.y + 15,
                  zIndex: 1,
                }}>
                {/* ここは消してもらって大丈夫です */}
                <Typography variant="h4">{selection.selectedText}</Typography>
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
