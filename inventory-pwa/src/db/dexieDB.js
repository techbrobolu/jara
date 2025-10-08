// Sure, here's the contents for the file /inventory-pwa/inventory-pwa/src/db/dexieDB.js:

import Dexie from 'dexie';

const db = new Dexie('InventoryDB');

db.version(1).stores({
    products: '++id, name, price, quantity, totalSold, image',
    sales: '++id, productId, quantity, totalAmount, date',
});

export default db;