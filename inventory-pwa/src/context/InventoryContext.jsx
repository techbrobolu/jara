import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../db/dexieDB';
import { syncData } from '../db/syncService';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastSync, setLastSync] = useState(null);

    // Initial load and sync
    useEffect(() => {
        const initializeInventory = async () => {
            try {
                setLoading(true);
                // Load from local DB first
                const localData = await db.products.toArray();
                setInventory(localData);

                // Then sync with backend
                await syncData();
                const updatedData = await db.products.toArray();
                setInventory(updatedData);
                setLastSync(new Date());
            } catch (err) {
                setError(err.message);
                console.error('Failed to initialize inventory:', err);
            } finally {
                setLoading(false);
            }
        };

        initializeInventory();
    }, []);

    // Auto-sync every 5 minutes
    useEffect(() => {
        const syncInterval = setInterval(async () => {
            try {
                await syncData();
                const updatedData = await db.products.toArray();
                setInventory(updatedData);
                setLastSync(new Date());
            } catch (err) {
                console.error('Auto-sync failed:', err);
            }
        }, 5 * 60 * 1000);

        return () => clearInterval(syncInterval);
    }, []);

    // Manual sync function
    const manualSync = async () => {
        try {
            setLoading(true);
            await syncData();
            const updatedData = await db.products.toArray();
            setInventory(updatedData);
            setLastSync(new Date());
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Error handling
    const clearError = () => setError(null);

    // Provide loading and error states
    const value = {
        inventory,
        setInventory,
        loading,
        error,
        clearError,
        lastSync,
        manualSync
    };

    return (
        <InventoryContext.Provider value={value}>
            {children}
        </InventoryContext.Provider>
    );
};

// Custom hook for using inventory context
export const useInventoryContext = () => {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error('useInventoryContext must be used within an InventoryProvider');
    }
    return context;
};

// Export context for testing purposes
export { InventoryContext };