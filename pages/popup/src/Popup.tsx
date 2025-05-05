import '@src/Popup.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import Option from './Option';
import OnOff from './OnOff';

const Popup = () => {
  return (
    <div className="haikei">
      <div>popup</div>
      <Option />
      <OnOff />
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
