import React from 'react';

const SyncIndicator = ({ isSyncing }) => {
    return (
        <div className={`fixed bottom-4 right-4 p-3 rounded-lg shadow-lg ${isSyncing ? 'bg-blue-500' : 'bg-green-500'} text-white`}>
            {isSyncing ? 'Syncing...' : 'Sync Complete'}
        </div>
    );
};

export default SyncIndicator;