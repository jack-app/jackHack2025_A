import '@src/Popup.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import Option from './Option';
import OnOff from './OnOff';

const Popup = () => {
  return (
    <>
      <div>popup</div>
      <Option />
      <OnOff />
    </>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
