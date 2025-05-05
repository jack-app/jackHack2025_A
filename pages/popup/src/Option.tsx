import '@src/Option.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { useState, useEffect } from 'react';
// ここで先ほど作成した useModeStorage をインポート
import { useModeStorage, UseMode } from '@extension/storage';

const Option = () => {
  // ストレージからスナップショットを取得し、なければデフォルトの 0 を使う
  const [isPushed, setIsPushed] = useState<UseMode>(useModeStorage.getSnapshot() ?? 0);

  const handleClick = (index: UseMode) => {
    // 同じボタンを押したらモードを 0 に戻し、そうでなければ押したボタンの index
    const newMode: UseMode = isPushed === index ? 0 : index;
    setIsPushed(newMode);
    useModeStorage.set(newMode);
  };

  useEffect(() => {
    // マウント時にストレージから読み込み
    useModeStorage.get().then(setIsPushed);
    // 変更通知にも反応して state を更新
    const unsubscribe = useModeStorage.subscribe(() => {
      useModeStorage.get().then(setIsPushed);
    });
    return () => unsubscribe();
  }, []);

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
