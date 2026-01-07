import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader">
      <div className="spinner"></div>
      <p className="loader-message">Fetching data from database</p>
      <p className="loader-info">Free hosted on Render - Initial load may take a moment</p>
    </div>
  );
};

export default Loader;