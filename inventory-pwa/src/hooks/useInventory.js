import { useContext, useEffect, useState } from 'react';
import { InventoryContext } from '../context/InventoryContext';
import { fetchProducts, syncInventory } from '../db/syncService';

const useInventory = () => {
    const { inventory, setInventory } = useContext(InventoryContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const products = await fetchProducts();
                setInventory(products);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [setInventory]);

    const syncData = async () => {
        try {
            await syncInventory();
        } catch (err) {
            setError(err);
        }
    };

    return { inventory, loading, error, syncData };
};

export default useInventory;