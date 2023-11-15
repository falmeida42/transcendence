import './App.css';
import React, { useEffect, useState } from 'react';
import Home from './Home';


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
    <Home/>
  );
}

export default App;
