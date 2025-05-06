import '@src/OnOff.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { useState, useEffect } from 'react';
// ストレージから boolean 値を保持する isUsed をインポート
import { isUsed } from '@extension/storage';

const OnOff = () => {
  // スナップショットまたはデフォルト false
  const [isOn, setIsOn] = useState<boolean>(isUsed.getSnapshot() ?? false);

  useEffect(() => {
    // 初回マウント時にストレージ値を読み込む
    isUsed.get().then(setIsOn);
    // 外部からの変更にも反応
    const unsubscribe = isUsed.subscribe(() => {
      isUsed.get().then(setIsOn);
    });
    return () => unsubscribe();
  }, []);

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.checked;
    setIsOn(newValue);
    // ストレージにも書き込み
    isUsed.set(newValue);
  };

  return (
    <div className="onoff-container">
      <label className="switch">
        <input type="checkbox" checked={isOn} onChange={handleToggle} />
        <span className="slider" />
      </label>
      <span className="status-label">{isOn ? 'ON' : 'OFF'}</span>
    </div>
  );
};

export default withErrorBoundary(withSuspense(OnOff, <div> Loading ... </div>), <div> Error Occur </div>);
