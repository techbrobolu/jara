import React, { useState } from 'react';
import ProductForm from '../components/products/ProductForm';
import useInventory from '../hooks/useInventory';
import { useNavigate } from 'react-router-dom';

const ProductAdd = () => {
    const { addProduct } = useInventory();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (productData) => {
        setLoading(true);
        setError(null);
        try {
            await addProduct(productData);
            navigate('/products');
        } catch (err) {
            setError('Failed to add product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
            {loading && (
                <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <span>Loading...</span>
                </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
            <ProductForm onSubmit={handleSubmit} />
        </div>
    );
};

export default ProductAdd;