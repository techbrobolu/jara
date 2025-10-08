import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-blue-600 text-white p-4">
            <h1 className="text-2xl font-bold">Inventory Management</h1>
            <nav className="mt-2">
                <ul className="flex space-x-4">
                    <li>
                        <Link to="/" className="hover:underline">Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/products" className="hover:underline">Products</Link>
                    </li>
                    <li>
                        <Link to="/login" className="hover:underline">Login</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;