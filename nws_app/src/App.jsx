import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'; // Import your CSS file
import Login from "./component/Login";
import Signup from './component/Signup';
import Home from './component/Homw'; // Corrected 'Homw' to 'Home'
import Layout from './component/Layout';
import Profile from './component/Profile';
import { ArticlesProvider } from './component/ArticlesContext.jsx';

function App() {
  return (
    <ArticlesProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Layout />}>
            {/* Ensure Home is displayed on the "/" path */}
            <Route index element={<Home />} /> {/* For base URL '/' */}
            <Route path="home" element={<Home />} /> {/* Explicit /home path */}
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </ArticlesProvider>
  );
}

export default App;
