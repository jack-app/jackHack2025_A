import '@src/Option.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { useState } from 'react';
const Option = () => {
  const [isPushed, setIsPushed] = useState<number | null>(null); // クリックされたボタンのインデックスを管理

  const handleClick = (index: number) => {
    setIsPushed(isPushed === index ? null : index); // 既にクリックされている場合はnullにしてリセット、他は新しいインデックスに設定
  };
  return (
    <div className="buttons">
      <button className={`yuruyuru ${isPushed === 0 ? 'clicked' : ''}`} type="button" onClick={() => handleClick(0)}>
        <img
          src="c:/Users/shuni/Downloads/ChatGPT Image 2025年5月5日 21_41_16.png"
          width="60"
          height="60"
          alt="ボタン画像"
        />
      </button>

      <button className={`hutuu ${isPushed === 1 ? 'clicked' : ''}`} type="button" onClick={() => handleClick(1)}>
        <img
          src="c:/Users/shuni/Downloads/ChatGPT_Image_2025年5月5日_11_41_10-removebg-preview.png"
          width="60"
          height="60"
          alt="ボタン画像"
        />
      </button>

      <button className={`gitigiti ${isPushed === 2 ? 'clicked' : ''}`} type="button" onClick={() => handleClick(2)}>
        <img
          src="c:/Users/shuni/Downloads/ChatGPT Image 2025年5月5日 21_49_08.png"
          width="60"
          height="60"
          alt="ボタン画像"
        />
      </button>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Option, <div>Loading...</div>), <div>Error Occurred</div>);
