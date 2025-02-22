import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import SignInPage from './Signin';


import RegistrationsList from './Dashboard';
import RegistrationForm from './Pages/Register';
import TEDxRegistration from './Pages/Register';

const App = () => {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333333',
            color: '#ffffff',
          },
          success: {
            iconTheme: {
              primary: '#4ade80',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<TEDxRegistration />} />
        <Route path="/admin/signin" element={<SignInPage />} />
        <Route path="/dashboard" element={<RegistrationsList/>} /> 
        <Route path="/register" element={<RegistrationForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;