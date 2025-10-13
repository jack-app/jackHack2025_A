import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ClickAwayListener } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type {} from '@mui/material/themeCssVarsAugmentation';
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { v4 as uuidv4 } from 'uuid';
import CutieRabbitHammerDown from '../images/CutieRabbitHammerDown.png';
import CutieRabbitHammerUp from '../images/CutieRabbitHammerUp.png';
import { Icon } from './Icon';

/* ─────────────────────────────── DOM / Shadow DOM ─────────────────────────────── */
const root = document.createElement('chrome-extension-boilerplate-react-vite-content-view-root');
root.style.zIndex = '2147483647';
document.body.after(root);

const shadowRootElement = document.createElement('div');
shadowRootElement.id = 'shadow-root';
const shadowContainer = root.attachShadow({ mode: 'open' });
shadowContainer.appendChild(shadowRootElement);

/* ─────────────────────────────── Emotion / MUI ─────────────────────────────── */
const cache = createCache({
  key: 'shadow-css',
  prepend: true,
  container: shadowContainer,
});

const theme = createTheme({
  cssVariables: { rootSelector: '#shadow-root', colorSchemeSelector: 'class' },
  components: {
    MuiPopover: { defaultProps: { container: shadowRootElement, style: { zIndex: 2147483647 } } },
    MuiPopper: { defaultProps: { container: shadowRootElement, style: { zIndex: 2147483647 } } },
  },
});

/* ─────────────────────────────── 型定義 ─────────────────────────────── */
interface SelectionState {
  id: string; // manual: uuid, auto: data-qid
  position: { x: number; y: number };
  selectedText: string;
  range: Range | null; // manual 用
  isLoading: boolean;
  mode: 'icon' | 'loading';
}

/* ─────────────────────────────── 定数 ─────────────────────────────── */
const spanSelector = 'div[data-testid="question-text"] span';

/* ─────────────────────────────── React アプリ ─────────────────────────────── */
const App: React.FC = () => {
  const [selections, setSelections] = useState<SelectionState[]>([]);
  const [qidList, setQidList] = useState<string[]>([]); // 取得済み QID
  const [imageIndex, setImageIndex] = useState(0);
  const images = [CutieRabbitHammerUp, CutieRabbitHammerDown];

  /** 既読・実行数管理 */
  const seenQidsRef = useRef<Set<string>>(new Set());
  const pendingDetectsRef = useRef(0); // 同時 isNegative 実行数 (<=10)

  /** 「初期バッチ」ウィンドウ 3 秒 */
  const firstDetectTimeRef = useRef<number | null>(null);
  const initialWindowOverRef = useRef(false);

  const startInitialWindow = () => {
    if (firstDetectTimeRef.current !== null) return; // すでに開始済み
    firstDetectTimeRef.current = Date.now();
    initialWindowOverRef.current = false;
    setTimeout(() => {
      initialWindowOverRef.current = true;
    }, 2000);
  };

  /* ─────────── SPA ナビゲーションでリセット ─────────── */
  useEffect(() => {
    const clearAll = () => {
      setSelections([]);
      setQidList([]);
      seenQidsRef.current.clear();
      pendingDetectsRef.current = 0;
      firstDetectTimeRef.current = null;
      initialWindowOverRef.current = false;
    };

    const origPush = history.pushState;
    const origReplace = history.replaceState;

    const wrap = (type: 'pushState' | 'replaceState', orig: typeof history.pushState) => {
      (history as any)[type] = function (data: any, unused: string, url?: string | URL | null) {
        const res = orig.apply(this, [data, unused, url]);
        window.dispatchEvent(new Event('locationchange'));
        return res;
      };
    };
    wrap('pushState', origPush);
    wrap('replaceState', origReplace);

    window.addEventListener('popstate', clearAll);
    window.addEventListener('locationchange', clearAll);

    return () => {
      history.pushState = origPush;
      history.replaceState = origReplace;
      window.removeEventListener('popstate', clearAll);
      window.removeEventListener('locationchange', clearAll);
    };
  }, []);

  /* ─────────── 初期ロードで既存 QID を収集 ─────────── */
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('div[data-testid="question"]');
    if (els.length > 0) startInitialWindow();

    const initQids: string[] = [];
    els.forEach(el => {
      const qid = el.dataset.qid;
      if (qid && !seenQidsRef.current.has(qid)) {
        initQids.push(qid);
        seenQidsRef.current.add(qid);
      }
    });
    if (initQids.length) setQidList(initQids);
  }, []);

  /* ─────────── manual selection 追加 ─────────── */
  const addSelection = (position: { x: number; y: number }, text: string, range: Range) => {
    const sel: SelectionState = {
      id: uuidv4(),
      position,
      selectedText: text,
      range,
      isLoading: false,
      mode: 'icon',
    };
    setSelections(prev => [...prev, sel]);
    return sel.id;
  };

  /* ─────────── auto selection 追加 ─────────── */
  const addAutoSelection = (qid: string, outerEl: HTMLElement) => {
    const span = outerEl.querySelector<HTMLElement>(spanSelector) ?? outerEl;
    const rect = span.getBoundingClientRect();
    const pos = { x: window.scrollX + rect.right, y: window.scrollY + rect.bottom };

    const sel: SelectionState = {
      id: qid,
      position: pos,
      selectedText: span.innerText.trim(),
      range: null,
      isLoading: true,
      mode: 'loading',
    };
    setSelections(prev => [...prev, sel]);
  };

  const updateSel = (id: string, updates: Partial<SelectionState>) =>
    setSelections(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  const removeSel = (id: string) => setSelections(prev => prev.filter(s => s.id !== id));

  /* ─────────── manual icon クリック ─────────── */
  const handleIconClick = (id: string) => {
    updateSel(id, { isLoading: true, mode: 'loading' });
    const sel = selections.find(s => s.id === id);
    chrome.runtime.sendMessage({
      type: 'MANUAL_POP_TURN',
      data: { selectedText: sel?.selectedText || '', selectionId: id },
    });
  };
  const handleClickAway = (id: string) => {
    if (selections.find(s => s.id === id)?.isLoading) return;
    removeSel(id);
  };

  /* ─────────── runtime メッセージ受信 ─────────── */
  useEffect(() => {
    const handler = (message: any) => {
      /* isNegative 完了 → 同時実行枠を空ける */
      if (message.type === 'IS_NEGATIVE') {
        pendingDetectsRef.current = Math.max(0, pendingDetectsRef.current - 1);

        const { selectionId: qid, isNegative } = message.data;
        if (!isNegative) return;

        const outer = document.querySelector<HTMLElement>(`div[data-testid="question"][data-qid="${qid}"]`);
        if (outer) {
          addAutoSelection(qid, outer);
          const span = outer.querySelector<HTMLSpanElement>(spanSelector);
          const txt = span?.innerText.trim() ?? '';
          chrome.runtime.sendMessage({
            type: 'AUTO_POP_TURN',
            data: { selectedText: txt, selectionId: qid },
          });
        }
        return;
      }

      /* manual replace (1.5秒待ってから実行) */
      if (message.type === 'MANUAL_REPLACE_TEXT') {
        const { selectionId, newText } = message.data;
        setTimeout(() => {
          const manual = selections.find(s => s.id === selectionId);
          if (manual?.range && manual.range.commonAncestorContainer.isConnected) {
            manual.range.deleteContents();
            manual.range.insertNode(document.createTextNode(newText));
          }
          window.getSelection()?.removeAllRanges();
          removeSel(selectionId);
        }, 1500);
        return;
      }

      /* auto replace (1.5秒待ってから実行) */
      if (message.type === 'AUTO_REPLACE_TEXT') {
        const { selectionId: qid, newText } = message.data;
        setTimeout(() => {
          const outer = document.querySelector<HTMLElement>(`div[data-testid="question"][data-qid="${qid}"]`);
          const spanElement = outer?.querySelector<HTMLSpanElement>(spanSelector);
          if (spanElement) {
            spanElement.innerText = newText;
          }
          removeSel(qid);
        }, 1500);
        return;
      }
    };

    chrome.runtime.onMessage.addListener(handler);
    return () => chrome.runtime.onMessage.removeListener(handler);
  }, [selections]);

  /* ─────────── manual ドラッグ検知 ─────────── */
  useEffect(() => {
    const onMouseUp = () => {
      const sel = window.getSelection();
      if (!sel?.rangeCount) return;
      const text = sel.toString().trim();
      if (!text) return;
      const range = sel.getRangeAt(0).cloneRange();
      const rect = range.getBoundingClientRect();
      addSelection({ x: window.scrollX + rect.right, y: window.scrollY + rect.bottom }, text, range);
    };
    document.addEventListener('mouseup', onMouseUp);
    return () => document.removeEventListener('mouseup', onMouseUp);
  }, []);

  /* ─────────── loading アニメ切替 ─────────── */
  const hasLoading = selections.some(s => s.isLoading);
  useEffect(() => {
    if (!hasLoading) return;
    const iv = setInterval(() => setImageIndex(i => (i ? 0 : 1)), 500);
    return () => clearInterval(iv);
  }, [hasLoading]);

  /* ─────────── 自動スキャン (MutationObserver) ─────────── */
  useEffect(() => {
    const mo = new MutationObserver(mutations => {
      const candidates: HTMLElement[] = [];
      for (const m of mutations) {
        m.addedNodes.forEach(node => {
          if (!(node instanceof HTMLElement)) return;

          if (node.matches('div[data-testid="question"]')) candidates.push(node);
          node.querySelectorAll<HTMLElement>('div[data-testid="question"]').forEach(el => candidates.push(el));
        });
      }
      if (!candidates.length) return;

      // 初回に要素が追加されたら初期ウィンドウ開始
      startInitialWindow();

      for (let i = 0; i < candidates.length; i++) {
        const outer = candidates[i];
        const qid = outer.dataset.qid;
        // 初期既存のQIDはスキップ
        if (!qid || qidList.includes(qid)) continue;
        // 無効な qid やすでに既読ならスキップ
        if (seenQidsRef.current.has(qid)) continue;

        if (!initialWindowOverRef.current) {
          // 初期バッチ期間中は既読登録のみでスキップ
          seenQidsRef.current.add(qid);
          setQidList(prev => [...prev, qid]);
          continue;
        }
        // 同時実行上限に達したら、残りの候補をすべて「既読」にマークしてスキップ
        if (pendingDetectsRef.current >= 10) {
          const remaining = candidates.slice(i);
          const newQids: string[] = [];
          for (const el of remaining) {
            const skipQid = el.dataset.qid;
            if (skipQid && !seenQidsRef.current.has(skipQid)) {
              seenQidsRef.current.add(skipQid);
              newQids.push(skipQid);
            }
          }
          if (newQids.length) {
            setQidList(prev => [...prev, ...newQids]);
          }
          break;
        }

        // 初期バッチ期間中は登録のみ
        if (!initialWindowOverRef.current) {
          seenQidsRef.current.add(qid);
          setQidList(prev => [...prev, qid]);
          continue;
        }

        // 通常フロー
        seenQidsRef.current.add(qid);
        setQidList(prev => [...prev, qid]);
        pendingDetectsRef.current += 1;

        const span = outer.querySelector<HTMLSpanElement>(spanSelector);
        const txt = span?.innerText.trim() ?? '';
        if (!txt) {
          pendingDetectsRef.current -= 1;
          continue;
        }
        chrome.runtime.sendMessage({
          type: 'DETECT_NEGATIVE',
          data: { selectedText: txt, selectionId: qid },
        });
      }
    });

    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [qidList]);

  /* ─────────── render ─────────── */
  return (
    <>
      {selections.map(s => (
        <React.Fragment key={s.id}>
          {s.mode === 'icon' && !s.isLoading && (
            <ClickAwayListener onClickAway={() => handleClickAway(s.id)} mouseEvent="onMouseDown">
              <div
                onMouseDown={e => e.stopPropagation()}
                onMouseUp={e => e.stopPropagation()}
                style={{ position: 'absolute', left: s.position.x + 30, top: s.position.y - 50, zIndex: 1 }}>
                <Icon handleClick={() => handleIconClick(s.id)} />
              </div>
            </ClickAwayListener>
          )}

          {s.isLoading && (
            <div style={{ position: 'absolute', left: s.position.x - 10, top: s.position.y - 100, zIndex: 1 }}>
              <img src={images[imageIndex]} alt="" width="150px" height="150px" />
            </div>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

/* ─────────────────────────────── React DOM ─────────────────────────────── */
createRoot(shadowRootElement).render(
  <CacheProvider value={cache}>
    <ThemeProvider theme={theme} colorSchemeNode={shadowRootElement}>
      <App />
    </ThemeProvider>
  </CacheProvider>,
);
