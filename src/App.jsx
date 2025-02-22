import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import SignInPage from './Pages/Signin';
import RegistrationsList from './Pages/Dashboard';
import TEDxRegistration from './Pages/Register';
import NotFound from './Pages/NotFound';

const App = () => {
  return (
    <Router> 
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<TEDxRegistration />} />
        <Route path="/admin/signin" element={<SignInPage />} />
        <Route path="/admin/dashboard" element={<RegistrationsList />} /> 
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
