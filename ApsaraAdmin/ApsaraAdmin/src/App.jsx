import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './Components/Header';
import Categories from './Pages/Categories';
import Clients from './Pages/Clients';
import Orders from './Pages/Orders';
import Products from './Pages/Products';
import Blogs from './Pages/Blogs';
import Login from './Pages/Login';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  const location = useLocation();
  const hideHeader = location.pathname === "/"; // hide on login page

  return (
    <>
      {!hideHeader && <Header />}

      <Routes>
        <Route path="/" element={<Login />} />

        {/* protected routes */}
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
        <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/blogs" element={<ProtectedRoute><Blogs /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

export default App;
