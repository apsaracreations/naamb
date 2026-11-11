import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Clients from "./pages/Clients";
import Blogs from "./pages/Blogs";
import { getAdminToken } from "./api";

const RequireAdmin = ({ children }) => (getAdminToken() ? children : <Navigate to="/admin" replace />);

// Mounted by the website at /admin/*
const AdminApp = () => (
  <>
    <Toaster position="top-right" toastOptions={{ style: { fontSize: "14px" } }} />
    <Routes>
      <Route index element={<Login />} />
      <Route element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
        <Route path="orders" element={<Orders />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="clients" element={<Clients />} />
        <Route path="blogs" element={<Blogs />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  </>
);

export default AdminApp;
