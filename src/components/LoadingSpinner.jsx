import React from 'react';

export const LoadingSpinner = ({ text = 'Loading...', fullScreen = false }) => {
  const content = (
    <div className="spinner-container">
      <div className="spinner" />
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="fullscreen-loading">{content}</div>;
  }

  return content;
};

export default LoadingSpinner;
