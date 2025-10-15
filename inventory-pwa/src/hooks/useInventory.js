import { useContext, useEffect, useState, useCallback } from 'react';
import { InventoryContext } from '../context/InventoryContext';
import { 
    fetchProducts, 
    initializeSyncService,
    addProduct as dbAddProduct,
    updateProduct as dbUpdateProduct,
    deleteProduct as dbDeleteProduct,
    searchProducts as dbSearchProducts
} from '../db/syncService';

const useInventory = () => {
    const { inventory, setInventory } = useContext(InventoryContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load initial data
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const products = await fetchProducts();
                setInventory(products);
            } catch (err) {
                setError(err.message);
                console.error('Failed to load products:', err);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [setInventory]);

    // Sync with backend
    const syncData = useCallback(async () => {
        try {
            setLoading(true);
            await initializeSyncService();
            const products = await fetchProducts();
            setInventory(products);
        } catch (err) {
            setError(err.message);
            console.error('Sync failed:', err);
        } finally {
            setLoading(false);
        }
    }, [setInventory]);

    // Add new product
    const addProduct = useCallback(async (productData) => {
        try {
            setLoading(true);
            const newProduct = await dbAddProduct(productData);
            setInventory(prev => [...prev, newProduct]);
            return newProduct;
        } catch (err) {
            setError(err.message);
            console.error('Failed to add product:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setInventory]);

    // Update existing product
    const updateProduct = useCallback(async (id, updates) => {
        try {
            setLoading(true);
            const updatedProduct = await dbUpdateProduct(id, updates);
            setInventory(prev => 
                prev.map(p => p.id === id ? updatedProduct : p)
            );
            return updatedProduct;
        } catch (err) {
            setError(err.message);
            console.error('Failed to update product:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setInventory]);

    // Delete product
    const deleteProduct = useCallback(async (id) => {
        try {
            setLoading(true);
            await dbDeleteProduct(id);
            setInventory(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            setError(err.message);
            console.error('Failed to delete product:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setInventory]);

    // Search products
    const searchProducts = useCallback(async (query) => {
        try {
            setLoading(true);
            const results = await dbSearchProducts(query);
            return results;
        } catch (err) {
            setError(err.message);
            console.error('Search failed:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Clear error state
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        inventory,
        loading,
        error,
        clearError,
        syncData,
        addProduct,
        updateProduct,
        deleteProduct,
        searchProducts
    };
};

export default useInventory;