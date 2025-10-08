import React from 'react';
import { useInventory } from '../../hooks/useInventory';

const ProductModal = ({ product, isOpen, onClose }) => {
    const { updateProduct, deleteProduct } = useInventory();

    const handleUpdate = () => {
        // Logic to update the product
        updateProduct(product.id, { /* updated product data */ });
        onClose();
    };

    const handleDelete = () => {
        // Logic to delete the product
        deleteProduct(product.id);
        onClose();
    };

    return (
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center
            ${isOpen ? 'modal-enter-active' : 'modal-exit-active'}`}
        >
          <div className="card w-full max-w-lg mx-4 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <button 
                onClick={onClose}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              {/* Product details */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full aspect-video object-cover rounded-lg"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Price</label>
                  <div className="font-semibold">
                    {formatCurrency(product.price)}
                  </div>
                </div>
                <div>
                  <label className="form-label">Stock</label>
                  <div className="font-semibold">{product.quantity}</div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button className="btn btn-primary flex-1">
                  Record Sale
                </button>
                <button className="btn btn-secondary">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
    );
};

export default ProductModal;