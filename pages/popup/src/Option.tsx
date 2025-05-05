import '@src/Option.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { useState } from 'react';
const Option = () => {
  const [isPushed, setIsPushed] = useState<boolean>(false);
  return (
    <div className="buttons">
      <button
        id="push1"
        onClick={() => setIsPushed(!isPushed)}
        className="yuruyuru"
        type="button"
        name="name"
        value="value">
        {/* // isPushedの真偽値で表示するかどうかを切り替える 
     {isPushed && (<img
       src="c:/Users/shuni/Downloads/ChatGPT_Image_2025年5月5日_11_41_10-removebg-preview.png"
       width="70"
       height="70"
       alt="ボタン画像"
      />)} */}
      </button>

      <button className="hutuu" type="button" name="name" value="value">
        <img
          src="c:/Users/shuni/Downloads/ChatGPT_Image_2025年5月5日_11_41_10-removebg-preview.png"
          width="70"
          height="70"
          alt="ボタン画像"
        />
      </button>
      <button className="gitigiti" type="button" name="name" value="value">
        <img
          src="c:/Users/shuni/Downloads/ChatGPT_Image_2025年5月5日_11_41_10-removebg-preview.png"
          width="70"
          height="70"
          alt="ボタン画像"
        />
      </button>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Option, <div>Loading...</div>), <div>Error Occurred</div>);
