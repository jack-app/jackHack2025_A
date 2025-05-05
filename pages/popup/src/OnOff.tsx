import '@src/OnOff.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { useState } from 'react';
const OnOff = () => {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex justify-between p-4 ">
      <span
        // className="text-base text-pink-300 font-bold "
        className="moji">
        {' '}
        ネガティブはきらい？
      </span>
      {/* <button
          onClick={() => setChecked(!checked)}
          className="togurubotan"> 
          
        </button> */}
      <label className="toggle-button-4">
        <input type="checkbox" />
      </label>
    </div>
  );
};

export default withErrorBoundary(withSuspense(OnOff, <div> Loading ... </div>), <div> Error Occur </div>);
