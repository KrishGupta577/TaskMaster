import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import { Route, Router, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import Dashboard from './pages/Dashboard/Dashboard';
import { SignedIn } from '@clerk/clerk-react';
import { ToastContainer } from 'react-toastify'
import { StoreContext } from './Context/StoreContext';
import InsightsPage from './pages/Insights/InsightsPage';

const App = () => {


  const { colorTheme } = useContext(StoreContext)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorTheme);
  }, [colorTheme]);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<LandingPage />}></Route>
        <Route
          path='/dashboard'
          element={
            <SignedIn>
              <Dashboard />
            </SignedIn>
          }
        >
        </Route>
        <Route
          path='/insights'
          element={
            <SignedIn>
              <InsightsPage />
            </SignedIn>
          }
        >
        </Route>
      </Routes>
    </>
  );
};

export default App;

// CSS File