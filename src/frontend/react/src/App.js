import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';


const App = ({ customText }) => {

  const [responseData, setResponseData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customText();
        console.log('customText Response Data:', response)
        setResponseData(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [customText])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {responseData ? (
            responseData
          ) : (
            <>
              Edit <code>src/App.js</code> and save to reload
            </>
          )}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
