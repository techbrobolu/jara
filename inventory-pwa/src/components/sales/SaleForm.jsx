import React, { useState, useContext } from 'react';
import { InventoryContext } from '../../context/InventoryContext';
import { toast } from 'react-hot-toast';

const SaleForm = ({ product }) => {
    const { recordSale } = useContext(InventoryContext);
    const [quantity, setQuantity] = useState(1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (quantity <= 0 || quantity > product.quantity) {
            toast.error('Invalid quantity');
            return;
        }

        try {
            await recordSale(product.id, quantity);
            toast.success('Sale recorded successfully');
            setQuantity(1); // Reset quantity after successful sale
        } catch (error) {
            toast.error('Failed to record sale');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <h2 className="text-lg font-semibold">Record Sale for {product.name}</h2>
            <div>
                <label htmlFor="quantity" className="block text-sm font-medium">Quantity Sold</label>
                <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                    min="1"
                    max={product.quantity}
                />
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                Record Sale
            </button>
        </form>
    );
};

export default SaleForm;