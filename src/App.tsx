import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { authApi } from './mocks/mockApi.js';

import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import UploadUsers from './pages/UploadUsers.jsx';
import Members from './pages/Members.jsx';
import CreateRoutine from './pages/CreateRoutine.jsx';
import CreateExercise from './pages/CreateExercise.jsx';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authApi.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const isAuthenticated = authApi.isAuthenticated();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload-users" 
            element={
              <ProtectedRoute>
                <UploadUsers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/members" 
            element={
              <ProtectedRoute>
                <Members />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-routine" 
            element={
              <ProtectedRoute>
                <CreateRoutine />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-exercise" 
            element={
              <ProtectedRoute>
                <CreateExercise />
              </ProtectedRoute>
            } 
          />
        </Routes>
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;