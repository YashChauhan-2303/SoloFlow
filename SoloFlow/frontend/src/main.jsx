import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import App from './App.jsx';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import ErrorBoundary from './components/ErrorBoundary';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <ThemeProvider>
    <NotificationProvider>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
    </NotificationProvider>
    </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)