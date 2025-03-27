import React, { useState } from 'react';
import './App.css';
import { Route, Router, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import Dashboard from './pages/Dashboard/Dashboard';
import { SignedIn } from '@clerk/clerk-react';
import { ToastContainer } from 'react-toastify'

const App = () => {

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
      </Routes>
    </>
  );
};

export default App;

// CSS File