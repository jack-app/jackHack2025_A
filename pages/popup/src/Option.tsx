import '@src/Option.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';

const Option = () => (
  <>
    <div>
      <button
        type="button"
        name="name"
        value="value"
        style={{
          background: '#ccff00',
          color: '#ff9911',
          boxShadow: '0 5px 0 rgb(153, 204, 102)',
          borderRadius: '0.25em',
          padding: '0.05em 0.05em 0.05em',
          lineHeight: 1,
          display: 'inline-block',
          cursor: 'pointer',
        }}>
        <img
          src="c:\Users\shuni\Downloads\ChatGPT_Image_2025年5月5日_11_41_10-removebg-preview.png"
          width="70"
          height="70"
        />
      </button>
      <button
        type="button"
        name="name"
        value="value"
        style={{
          background: '#ff9911',
          color: '#ff9911',
          boxShadow: '0 5px 0rgb(216, 151, 10)',
          borderRadius: '0.25em',
          padding: '0.05em 0.05em 0.05em',
          lineHeight: 1,
          display: 'inline-block',
          cursor: 'pointer',
        }}>
        <img
          src="c:\Users\shuni\Downloads\ChatGPT_Image_2025年5月5日_11_41_10-removebg-preview.png"
          width="70"
          height="70"
        />
      </button>
      <button
        type="button"
        name="name"
        value="value"
        style={{
          background: '#ff3300',
          color: '#ff9911',
          boxShadow: '0 5px 0rgb(216, 151, 10)',
          borderRadius: '0.25em',
          padding: '0.05em 0.05em 0.05em',
          lineHeight: 1,
          display: 'inline-block',
          cursor: 'pointer',
        }}>
        <img
          src="c:\Users\shuni\Downloads\ChatGPT_Image_2025年5月5日_11_41_10-removebg-preview.png"
          width="70"
          height="70"
        />
      </button>
    </div>
  </>
);

export default withErrorBoundary(withSuspense(Option, <div>Loading...</div>), <div>Error Occurred</div>);
