import '@src/Option.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';

const Option = () => {
  return (
    <>
      <div>ゆたん担当</div>
    </>
  );
};

export default withErrorBoundary(withSuspense(Option, <div> Loading ... </div>), <div> Error Occur </div>);
