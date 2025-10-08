// Sure, here's the contents for the file /inventory-pwa/inventory-pwa/src/context/InventoryContext.jsx:

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useInventory } from '../hooks/useInventory';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
    const { products, fetchProducts, addProduct, updateProduct, deleteProduct } = useInventory();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            await fetchProducts();
            setLoading(false);
        };
        loadProducts();
    }, [fetchProducts]);

    return (
        <InventoryContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, loading }}>
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventoryContext = () => {
    return useContext(InventoryContext);
};