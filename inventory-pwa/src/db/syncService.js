import supabase from '../services/supabase';
import db from './dexieDB';

// Constants
const SYNC_STATUS = {
    PENDING: 'pending',
    SUCCESS: 'success',
    ERROR: 'error'
};

// Utility to check network status
const checkOnlineStatus = () => navigator.onLine;

// Retry logic for failed operations
const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
    }
};

// Fetch all products from remote
export const fetchProducts = async () => {
    if (!checkOnlineStatus()) {
        return await db.products.toArray();
    }

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
};

// Add new product
export const addProduct = async (productData) => {
    const timestamp = new Date().toISOString();
    const newProduct = {
        ...productData,
        created_at: timestamp,
        updated_at: timestamp,
        last_synced: null
    };

    // Add to local DB first
    const id = await db.products.add(newProduct);
    newProduct.id = id;

    // Sync with remote if online
    if (checkOnlineStatus()) {
        const { data, error } = await supabase
            .from('products')
            .insert([newProduct])
            .single();

        if (error) throw error;
        await db.products.update(id, { last_synced: timestamp });
        return data;
    }

    return newProduct;
};

// Update existing product
export const updateProduct = async (id, updates) => {
    const timestamp = new Date().toISOString();
    const updatedProduct = {
        ...updates,
        updated_at: timestamp,
        last_synced: null
    };

    // Update local DB first
    await db.products.update(id, updatedProduct);
    const product = await db.products.get(id);

    // Sync with remote if online
    if (checkOnlineStatus()) {
        const { data, error } = await supabase
            .from('products')
            .update(updatedProduct)
            .match({ id })
            .single();

        if (error) throw error;
        await db.products.update(id, { last_synced: timestamp });
        return data;
    }

    return product;
};

// Delete product
export const deleteProduct = async (id) => {
    // Delete from local DB first
    await db.products.delete(id);

    // Sync with remote if online
    if (checkOnlineStatus()) {
        const { error } = await supabase
            .from('products')
            .delete()
            .match({ id });

        if (error) throw error;
    }
};

// Search products
export const searchProducts = async (query) => {
    const localProducts = await db.products.toArray();
    const searchTerm = query.toLowerCase();

    return localProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        (product.description && product.description.toLowerCase().includes(searchTerm))
    );
};

// Sync queue management
const syncQueue = new Set();

// Add item to sync queue
export const addToSyncQueue = (itemId) => {
    syncQueue.add(itemId);
    localStorage.setItem('syncQueue', JSON.stringify([...syncQueue]));
};

// Process sync queue
export const processSyncQueue = async () => {
    if (!checkOnlineStatus() || !syncQueue.size) return;

    for (const itemId of syncQueue) {
        try {
            await retryOperation(() => syncProduct(itemId));
            syncQueue.delete(itemId);
        } catch (error) {
            console.error(`Failed to sync item ${itemId}:`, error);
        }
    }

    localStorage.setItem('syncQueue', JSON.stringify([...syncQueue]));
};

// Network status listener
export const setupNetworkListener = () => {
    const handleOnline = () => {
        processSyncQueue();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
};

// Initialize sync service
export const initializeSyncService = async () => {
    // Load sync queue from storage
    const savedQueue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
    syncQueue.clear();
    savedQueue.forEach(id => syncQueue.add(id));

    // Setup listeners
    const cleanupNetwork = setupNetworkListener();
    const cleanupRealtime = setupRealtimeSync();
    const cleanupCrossTab = setupCrossTabSync();

    // Initial sync
    if (checkOnlineStatus()) {
        await syncData();
        await processSyncQueue();
    }

    return () => {
        cleanupNetwork();
        cleanupRealtime();
        cleanupCrossTab();
    };
};


// Sync local data with remote
export const syncData = async () => {
    try {
        // Start transaction
        await db.transaction('rw', db.products, async () => {
            // Get local changes
            const localChanges = await db.products.toArray();
            const syncPromises = [];

            // Sync local changes to Supabase
            for (const product of localChanges) {
                const { id, ...data } = product;
                syncPromises.push(
                    supabase
                        .from('products')
                        .upsert({ id, ...data, last_synced: new Date().toISOString() })
                );
            }

            // Wait for all sync operations to complete
            await Promise.all(syncPromises);

            // Fetch remote updates
            const { data: remoteProducts, error } = await supabase
                .from('products')
                .select('*')
                .order('updated_at', { ascending: false });

            if (error) throw error;

            // Bulk update local database
            await db.products.bulkPut(remoteProducts);
        });

        return { status: SYNC_STATUS.SUCCESS };
    } catch (error) {
        console.error('Sync failed:', error);
        return {
            status: SYNC_STATUS.ERROR,
            error: error.message
        };
    }
};

// Setup real-time sync
export const setupRealtimeSync = () => {
    const subscription = supabase
        .from('products')
        .on('INSERT', async (payload) => {
            try {
                await db.products.put(payload.new);
                broadcastUpdate('product-inserted', payload.new);
            } catch (error) {
                console.error('Real-time insert failed:', error);
            }
        })
        .on('UPDATE', async (payload) => {
            try {
                await db.products.put(payload.new);
                broadcastUpdate('product-updated', payload.new);
            } catch (error) {
                console.error('Real-time update failed:', error);
            }
        })
        .on('DELETE', async (payload) => {
            try {
                await db.products.delete(payload.old.id);
                broadcastUpdate('product-deleted', payload.old.id);
            } catch (error) {
                console.error('Real-time delete failed:', error);
            }
        })
        .subscribe();

    return () => {
        subscription.unsubscribe();
    };
};

// Broadcast channel for cross-tab sync
const broadcastChannel = new BroadcastChannel('inventory-sync');

// Broadcast updates to other tabs
const broadcastUpdate = (type, data) => {
    broadcastChannel.postMessage({ type, data });
};

// Listen for updates from other tabs
export const setupCrossTabSync = () => {
    broadcastChannel.addEventListener('message', async (event) => {
        const { type, data } = event.data;
        
        try {
            switch (type) {
                case 'product-inserted':
                case 'product-updated':
                    await db.products.put(data);
                    break;
                case 'product-deleted':
                    await db.products.delete(data);
                    break;
                default:
                    console.warn('Unknown sync event type:', type);
            }
        } catch (error) {
            console.error('Cross-tab sync failed:', error);
        }
    });

    return () => {
        broadcastChannel.close();
    };
};

// Force sync for specific product
export const syncProduct = async (productId) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();

        if (error) throw error;
        if (data) {
            await db.products.put(data);
            return { status: SYNC_STATUS.SUCCESS, data };
        }
    } catch (error) {
        console.error(`Failed to sync product ${productId}:`, error);
        return {
            status: SYNC_STATUS.ERROR,
            error: error.message
        };
    }
};

// Check sync status
export const checkSyncStatus = async () => {
    try {
        const localCount = await db.products.count();
        const { count: remoteCount } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });

        return {
            inSync: localCount === remoteCount,
            localCount,
            remoteCount
        };
    } catch (error) {
        console.error('Failed to check sync status:', error);
        throw error;
    }
};

// Export constants and types
export const SyncService = {
    SYNC_STATUS,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    syncData,
    syncProduct,
    checkSyncStatus,
    setupRealtimeSync,
    setupCrossTabSync,
    initializeSyncService,
    processSyncQueue
};

export default SyncService;