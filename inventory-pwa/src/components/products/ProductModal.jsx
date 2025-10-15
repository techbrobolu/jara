import React from 'react';
import useInventory from '../../hooks/useInventory';
import { formatCurrency } from '../../utils/helpers';

const ProductModal = ({ 
    product, 
    isOpen = false, 
    onClose = () => {}, 
    onEdit = () => {}, 
    onSale = () => {} 
}) => {
    const { updateProduct, deleteProduct } = useInventory();

    if (!isOpen || !product) return null;

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        
        try {
            await deleteProduct(product.id);
            onClose();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const ProductImage = () => product.image && (
        <img
            src={product.image}
            alt={product.name}
            className="w-full aspect-video object-cover rounded-lg"
        />
    );

    const ProductDetails = () => (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="form-label">Price</label>
                <div className="font-semibold">
                    {formatCurrency(product.price)}
                </div>
            </div>
            <div>
                <label className="form-label">Stock</label>
                <div className="font-semibold">
                    {product.quantity || 0}
                    <span className="text-sm text-gray-500 ml-1">units</span>
                </div>
            </div>
        </div>
    );

    const ActionButtons = () => (
        <div className="flex space-x-3 mt-6">
            <button 
                className="btn btn-primary flex-1"
                onClick={() => {
                    onSale(product);
                    onClose();
                }}
                disabled={!product.quantity}
            >
                Record Sale
            </button>
            <button 
                className="btn btn-secondary"
                onClick={() => {
                    onEdit(product);
                    onClose();
                }}
            >
                Edit
            </button>
            <button 
                className="btn btn-danger"
                onClick={handleDelete}
            >
                Delete
            </button>
        </div>
    );

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div className="card w-full max-w-lg mx-4 animate-slide-up">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{product.name}</h2>
                    <button 
                        onClick={onClose}
                        className="btn btn-secondary"
                        aria-label="Close modal"
                    >
                        Close
                    </button>
                </div>

                <div className="space-y-4">
                    <ProductImage />
                    
                    {product.description && (
                        <p className="text-gray-600 dark:text-gray-300">
                            {product.description}
                        </p>
                    )}
                    
                    <ProductDetails />
                    <ActionButtons />
                </div>
            </div>
        </div>
    );
};

export default ProductModal;