import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

const url = 'http://localhost:3000/home'

const nestApi = axios.create(
  {
    baseURL: url,
    withCredentials: true
  }
);

const getResponse = async () => {
  try {
    const response = await nestApi.get()
    console.log("Response", response.data)
    return response.data
  } catch (error) {
    console.error("Error geting the nest response", error)
    return "Wellcome to Transcendence #Mocked"
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App customText={getResponse}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
