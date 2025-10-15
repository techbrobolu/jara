import { supabase } from '../services/supabase';
import db from './dexieDB';

// Constants
const SYNC_STATUS = {
    PENDING: 'pending',
    SUCCESS: 'success',
    ERROR: 'error'
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
    syncData,
    setupRealtimeSync,
    setupCrossTabSync,
    syncProduct,
    checkSyncStatus
};

export default SyncService;