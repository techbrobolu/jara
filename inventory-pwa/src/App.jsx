import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import MainLayout from './components/layouts/MainLayout';
import Dashboard from './components/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register'
import Products from './components/products/Products';
import ProductAdd from './components/products/ProductAdd';
import ProductEdit from './components/products/ProductEdit';

function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/add" element={<ProductAdd />} />
              <Route path="/products/edit/:id" element={<ProductEdit />} />
            </Routes>
          </MainLayout>
        </Router>
      </InventoryProvider>
    </AuthProvider>
  );
};

export default App;