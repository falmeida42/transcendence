import { useEffect, useState } from "react";
import "./App.css";
import Website from "./Website.tsx";
import { useApi } from "./apiStore.tsx";
import { Link, Route, Switch, useLocation } from 'wouter';
import { navigate } from "wouter/use-location";
import AuthApi from "./ApiAuth.tsx";
import React from "react";
import ApiData2faProvider from "./ApiData2faProvider.tsx";


function App() {
  const {auth} = useApi();
  // const location = useLocation();

  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];

  const token2fa = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token2fa='))
    ?.split('=')[1];

  useEffect(() => {
    // Check if both tokens exist
    if (token && token2fa) {
      // Redirect to the appropriate page based on your logic
      // For example, redirect to "/dashboard" if both tokens exist
      // document.cookie = `${'token'}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=localhost;`;
      // document.cookie = `${'token2fa'}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=localhost; SameSite=None`;
      // navigate('/dashboard');
    } else if (token) {
      // Redirect to another page if only token exists
      // document.cookie = `${'token2fa'}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=localhost; SameSite=None`;
      navigate('/');
    } else if (token2fa) {
      // Redirect to another page if only token exists
      <ApiData2faProvider/>
      navigate('/2fa');
    } else {
      navigate('/login');
    }
    // Add more conditions based on your requirements

  }, [token, token2fa, navigate]);
    const handleButtonClick = () => {
      window.location.href = "http://localhost:3000/auth/login";
    };

  return (
      <Switch>
        <Route path="/login">
          <div className="background-image">
            <div className="centered-container">
              <div className="special-button" onClick={handleButtonClick}>
                LOGIN
              </div>
            </div>
          </div>
        </Route>
        <Route path="/2fa">
          <AuthApi code="" />
        </Route>
        <Route>
         <Website />
        </Route>
      </Switch>
  );
}

export default App;
