import { Avatar, IconButton, Tooltip } from '@mui/material';
import CutieRabbit from '../images/CutieRabbit.png';

export interface IconProps {
  handleClick: () => void;
}

export const Icon = (props: IconProps) => {
  return (
    <>
      <Tooltip title="選択したテキストを翻訳" placement="top" arrow>
        <IconButton onClick={props.handleClick} size="small">
          <Avatar src={CutieRabbit} sx={{ width: 200, height: 200, bgcolor: 'white' }} />
        </IconButton>
      </Tooltip>
    </>
  );
};
