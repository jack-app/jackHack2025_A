import '@src/Option.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import NormalImage from '../src/images/normal.png';
import YuruyuruImage from '../src/images/CutieRabbit.png';
import GitigitiImage from '../src/images/gitigiti.png';
const Option = () => {
  const [isPushed, setIsPushed] = useState<number | null>(null); // クリックされたボタンのインデックスを管理

  const handleClick = (index: number) => {
    setIsPushed(isPushed === index ? null : index); // 既にクリックされている場合はnullにしてリセット、他は新しいインデックスに設定
  };
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
