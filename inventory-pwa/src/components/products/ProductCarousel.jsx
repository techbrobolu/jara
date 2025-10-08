import React from 'react';
import { useInventory } from '../../hooks/useInventory';

const ProductCarousel = ({ products }) => {
    return (
        <div className="product-carousel overflow-x-auto">
            <div className="flex space-x-4">
                {products.map(product => (
                    <div 
                        key={product.id}
                        className="flex-none w-64"
                    >
                        <div className="card h-full">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-40 object-cover rounded-md mb-3"
                            />
                            <h3 className="font-medium mb-2">{product.name}</h3>
                            <div className="text-warning font-semibold">
                                Only {product.quantity} left
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductCarousel;