import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <h1 className="header-title">MSM Mapping</h1>
      <div className="header-actions">
        <button className="header-btn">Edit</button>
        <button className="header-btn">History</button>
        <button className="header-btn">Export</button>
        <button className="header-btn">GPS Traces</button>
        <button className="header-btn">User Diaries</button>
        <button className="header-btn">Communities</button>
        <button className="header-btn">Copyright</button>
        <button className="header-btn">Help</button>
        <button className="header-btn">About</button>
      </div>
      <div className="header-search">
        <input 
          type="text" 
          placeholder="Search features..." 
          className="search-input"
        />
        <button className="search-btn">Search</button>
      </div>
    </header>
  );
};

export default Header;