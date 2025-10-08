
import React, { useState } from 'react';
import { useInventory } from '../../hooks/useInventory';

const ProductForm = ({ product, onSubmit }) => {
    const [name, setName] = useState(product ? product.name : '');
    const [price, setPrice] = useState(product ? product.price : '');
    const [quantity, setQuantity] = useState(product ? product.quantity : '');
    const [image, setImage] = useState(product ? product.image : '');

    const { addProduct, updateProduct } = useInventory();

    const handleSubmit = (e) => {
        e.preventDefault();
        const productData = { name, price, quantity, image };

        if (product) {
            updateProduct(product.id, productData);
        } else {
            addProduct(productData);
        }

        if (onSubmit) {
            onSubmit();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">
                {product ? 'Update Product' : 'Add Product'}
            </button>
        </form>
    );
};

export default ProductForm;