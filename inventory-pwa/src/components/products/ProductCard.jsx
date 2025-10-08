import React from 'react';

const ProductCard = ({ product, onClick }) => {
  return (
    <div 
      className="card animate-fade-in dark-mode-transition cursor-pointer hover:shadow-lg"
      onClick={() => onClick(product)}
    >
      <div className="relative aspect-square mb-4">
        <img
          src={product.image || '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-cover rounded-md"
        />
        {product.quantity < 10 && (
          <span className="absolute top-2 right-2 px-2 py-1 text-xs bg-warning text-white rounded-full">
            Low Stock
          </span>
        )}
      </div>
      
      <h3 className="font-medium mb-2">{product.name}</h3>
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">
          {formatCurrency(product.price)}
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Stock: {product.quantity}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;