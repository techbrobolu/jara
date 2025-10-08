import React, { useState } from 'react';
import ProductForm from '../components/products/ProductForm';
import { useInventory } from '../hooks/useInventory';
import { useHistory } from 'react-router-dom';

const ProductAdd = () => {
    const { addProduct } = useInventory();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (productData) => {
        setLoading(true);
        setError(null);
        try {
            await addProduct(productData);
            history.push('/products');
        } catch (err) {
            setError('Failed to add product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <ProductForm onSubmit={handleSubmit} />
        </div>
    );
};

export default ProductAdd;