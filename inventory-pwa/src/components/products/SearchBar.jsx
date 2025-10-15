import React, { useState, useCallback } from 'react';
import { debounce } from '../../utils/helpers';

const SearchBar = ({ onSearch, placeholder = "Search products...", initialValue = "" }) => {
    const [searchTerm, setSearchTerm] = useState(initialValue);

    // Debounce search to avoid too many API calls
    const debouncedSearch = useCallback(
        debounce((value) => {
            onSearch(value);
        }, 300),
        [onSearch]
    );

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const handleClear = () => {
        setSearchTerm("");
        onSearch("");
    };

    return (
        <div className="relative w-full sm:max-w-md">
            <div className="relative">
                <input
                    type="search"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder={placeholder}
                    className="form-input pl-10 pr-10"
                    aria-label="Search products"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg 
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                        />
                    </svg>
                </span>
                {searchTerm && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label="Clear search"
                    >
                        <svg 
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M6 18L18 6M6 6l12 12" 
                            />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;