import { supabase } from '../services/supabase';
import db from './dexieDB';

export const syncData = async () => {
    try {
        // Sync local changes to Supabase
        const localChanges = await db.products.toArray();
        for (const product of localChanges) {
            const { id, ...data } = product;
            await supabase
                .from('products')
                .upsert({ id, ...data });
        }

        // Fetch remote updates from Supabase
        const { data: remoteProducts } = await supabase
            .from('products')
            .select('*');

        // Update local IndexedDB with remote data
        remoteProducts.forEach(async (product) => {
            await db.products.put(product);
        });
    } catch (error) {
        console.error('Error syncing data:', error);
    }
};

export const setupRealtimeSync = () => {
    supabase
        .from('products')
        .on('INSERT', payload => {
            db.products.put(payload.new);
        })
        .on('UPDATE', payload => {
            db.products.put(payload.new);
        })
        .on('DELETE', payload => {
            db.products.delete(payload.old.id);
        })
        .subscribe();
};