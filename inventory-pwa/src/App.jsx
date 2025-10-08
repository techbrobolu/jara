// Sure, here's the contents for the file /inventory-pwa/inventory-pwa/src/App.jsx:

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ProductAdd from './pages/ProductAdd';
import ProductEdit from './pages/ProductEdit';
import Products from './pages/Products';

const App = () => {
  return (
    <AuthProvider>
      <InventoryProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
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