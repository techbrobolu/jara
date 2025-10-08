import React from 'react';

const SortMenu = ({ sortBy, setSortBy, sortOrder, toggleSortOrder }) => {
    return (
        <div className="flex items-center justify-between p-4">
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded p-2"
            >
                <option value="mostSold">Most Sold</option>
                <option value="price">Price</option>
                <option value="quantity">Quantity</option>
            </select>
            <button onClick={toggleSortOrder} className="ml-2 p-2 border rounded">
                {sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
            </button>
        </div>
    );
};

export default SortMenu;