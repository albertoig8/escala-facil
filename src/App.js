// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';

function App() {
    return (
        <div className="app-container">
            <Header />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/recepcao" element={<Recepcao />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
