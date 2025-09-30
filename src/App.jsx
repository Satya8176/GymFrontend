import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi } from './mocks/mockApi.js';
import { ThemeProvider } from './contexts/ThemeContext.jsx';

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
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route 
                path="/signup" 
                element={
                  <PublicRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Signup />
                    </motion.div>
                  </PublicRoute>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Login />
                    </motion.div>
                  </PublicRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Dashboard />
                    </motion.div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/upload-users" 
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <UploadUsers />
                    </motion.div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/members" 
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Members />
                    </motion.div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create-routine" 
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CreateRoutine />
                    </motion.div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create-exercise" 
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CreateExercise />
                    </motion.div>
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </AnimatePresence>
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              className: 'dark:bg-gray-800 dark:text-white',
              style: {
                background: 'var(--toast-bg, #363636)',
                color: 'var(--toast-color, #fff)',
              },
            }}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;