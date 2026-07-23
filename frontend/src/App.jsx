import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MainLayout from './layouts/MainLayout';
import { VehicleProvider } from './context/VehicleContext';
import { ToastProvider } from './context/ToastContext';
import './index.css';

function App() {
  return (
    <ToastProvider>
      <VehicleProvider>
        <Router>
          <Routes>
            {/* Routes with persistent Header */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
            </Route>

            {/* Standalone auth pages (no header) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
      </VehicleProvider>
    </ToastProvider>
  );
}

export default App;
