import '@src/OnOff.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';

const OnOff = () => {
  return (
    <>
      <div>onoff</div>
    </>
  );
};

export default withErrorBoundary(withSuspense(OnOff, <div> Loading ... </div>), <div> Error Occur </div>);
