import '@src/Popup.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import Option from './Option';
import OnOff from './OnOff';
import { IconButton, Stack } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
const Popup = () => {
  const handleClick = () => {
    window.close();
  };
  return (
    <div className="haikei">
      <Stack width="100%">
        <IconButton sx={{ marginLeft: 'auto' }} onClick={handleClick}>
          <CancelIcon />
        </IconButton>
      </Stack>

      <Option />
      <OnOff />
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
