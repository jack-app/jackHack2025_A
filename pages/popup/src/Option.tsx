import '@src/Option.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import NormalImage from '../src/images/normal.png';
import YuruyuruImage from '../src/images/CutieRabbit.png';
import GitigitiImage from '../src/images/gitigiti.png';
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
    <Stack sx={{ margin: '20px' }}>
      <Typography sx={{ textAlign: 'center' }}>どのくらい？</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: '10px', gap: '10px' }}>
        <Box>
          <button
            className={`yuruyuru ${isPushed === 0 ? 'clicked' : ''}`}
            type="button"
            onClick={() => handleClick(0)}>
            <img src={YuruyuruImage} width="60" height="60" alt="ゆるゆるボタン画像" />
          </button>
          <Typography variant="body2" sx={{ paddingTop: '10px', textAlign: 'center' }}>
            ゆるゆる
          </Typography>
        </Box>
        <Box>
          <button className={`hutuu ${isPushed === 1 ? 'clicked' : ''}`} type="button" onClick={() => handleClick(1)}>
            <img src={NormalImage} width="60" height="60" alt="ふつうボタン画像" />
          </button>
          <Typography variant="body2" sx={{ paddingTop: '10px', textAlign: 'center' }}>
            ふつう
          </Typography>
        </Box>
        <Box>
          <button
            className={`gitigiti ${isPushed === 2 ? 'clicked' : ''}`}
            type="button"
            onClick={() => handleClick(2)}>
            <img src={GitigitiImage} width="60" height="60" alt="ぎちぎちボタン画像" />
          </button>
          <Typography variant="body2" sx={{ paddingTop: '10px', textAlign: 'center' }}>
            ぎちぎち
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
};

export default withErrorBoundary(withSuspense(Option, <div>Loading...</div>), <div>Error Occurred</div>);
