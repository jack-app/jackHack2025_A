import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type {} from '@mui/material/themeCssVarsAugmentation';
import { ClickAwayListener } from '@mui/material';
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

const App = () => {
  const [mode, setMode] = useState<'dialog' | 'icon' | 'idle'>('idle');
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [iconPosition, setIconPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');

  const handleIconClick = () => {
    setMode('idle');
    setIconPosition(null);
    chrome.runtime.sendMessage({
      type: 'POPTURN',
      data: {
        selectedText: selectedText,
      },
    });
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'REPLACE_TEXT') {
        const newText = message.data.newText;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(newText));

        selection.removeAllRanges(); // ハイライト解除
      }
    });
  }, []);

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        setSelectedText(selection.toString());
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        setRect(rect);
        setIconPosition({ x: rect.right, y: rect.bottom });
        setMode('icon');
      }
    };
    if (mode !== 'dialog') {
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [mode]);

  return (
    <>
      {mode === 'icon' && iconPosition !== null && (
        <ClickAwayListener onClickAway={() => setMode('idle')} mouseEvent="onMouseDown">
          <div
            style={{
              position: 'absolute',
              left: window.scrollX + iconPosition.x + 30,
              top: window.scrollY + iconPosition.y - 50,
              zIndex: 2147483550,
            }}>
            <Icon handleClick={handleIconClick} />
          </div>
        </ClickAwayListener>
      )}
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
