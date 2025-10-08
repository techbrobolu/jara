import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    return (
        <div className="w-full sm:max-w-md">
            <input
                type="search"
                placeholder="Search products..."
                onChange={(e) => onSearch(e.target.value)}
                className="form-input"
            />
        </div>
    );
};

export default SearchBar;