import React, { Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import NotificationDrawer from './components/NotificationDrawer';
import PrivateRoute from './components/PrivateRoute';
import PageLoadingSpinner from './components/PageLoadingSpinner';

// Lazy load all page components for better code splitting
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Clients = React.lazy(() => import('./pages/Clients'));
const ClientProjects = React.lazy(() => import('./pages/ClientProjects'));
const StatPage = React.lazy(() => import('./pages/StatPage'));
const InvoicePage = React.lazy(() => import('./pages/InvoicePage'));
const UserProfile = React.lazy(() => import('./pages/UserProfile'));
const Landing = React.lazy(() => import('./pages/Landing'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));

function App() {
  const location = useLocation();
  
  return (
    <>
      <ToastContainer />
      <NotificationDrawer />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <Landing />
            </Suspense>
          } />
          
          <Route path="/login" element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <Login />
            </Suspense>
          } />
          
          <Route path="/register" element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <Register />
            </Suspense>
          } />
          
          <Route path='/:user_id/dashboard' element={
            <PrivateRoute>
              <Suspense fallback={<PageLoadingSpinner />}>
                <Dashboard />
              </Suspense>
            </PrivateRoute>
          } />
          
          <Route path="/:user_id/clients" element={
            <PrivateRoute>
              <Suspense fallback={<PageLoadingSpinner />}>
                <Clients />
              </Suspense>
            </PrivateRoute>
          } />
          
          <Route path='/:user_id/statistics' element={
            <PrivateRoute>
              <Suspense fallback={<PageLoadingSpinner />}>
                <StatPage />
              </Suspense>
            </PrivateRoute>
          } />
          
          <Route path="/:user_id/:client_id/:project_id/viewinvoice" element={
            <PrivateRoute>
              <Suspense fallback={<PageLoadingSpinner />}>
                <InvoicePage />
              </Suspense>
            </PrivateRoute>
          } />
          
          <Route path='/:user_id/:client_id/projects' element={
            <PrivateRoute>
              <Suspense fallback={<PageLoadingSpinner />}>
                <ClientProjects />
              </Suspense>
            </PrivateRoute>
          } />

          <Route path='/:user_id/userprofile' element={
            <PrivateRoute>
              <Suspense fallback={<PageLoadingSpinner />}>
                <UserProfile />
              </Suspense>
            </PrivateRoute>
          } />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;