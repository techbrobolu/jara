import { useState, useEffect } from 'react';
import { useInventory } from '../hooks/useInventory';
import ProductGrid from '../components/products/ProductGrid';
import ProductCarousel from '../components/products/ProductCarousel';
import SearchBar from '../components/products/SearchBar';
import SortMenu from '../components/products/SortMenu';
import ProductModal from '../components/products/ProductModal';
import Loader from '../components/common/Loader';
import { toast } from 'sonner';

const Products = () => {
  const { products, loading, error } = useInventory();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ field: 'name', direction: 'asc' });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter and sort products
  useEffect(() => {
    if (!products) return;

    let result = [...products];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortConfig.field) {
        case 'mostSold':
          comparison = b.totalSold - a.totalSold;
          break;
        case 'price':
          comparison = b.price - a.price;
          break;
        case 'quantity':
          comparison = b.quantity - a.quantity;
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    setFilteredProducts(result);
  }, [products, searchQuery, sortConfig]);

  // Get low stock products
  const lowStockProducts = products?.filter(p => p.quantity < 10) || [];

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (error) {
    toast.error('Failed to load products');
    return <div className="p-4 text-red-500">Error loading products</div>;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Low stock carousel */}
      {lowStockProducts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Low Stock Alert</h2>
          <ProductCarousel products={lowStockProducts} />
        </div>
      )}

      {/* Search and sort controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <SearchBar onSearch={handleSearch} />
        <SortMenu 
          currentSort={sortConfig}
          onSort={handleSort}
        />
      </div>

      {/* Product grid */}
      <ProductGrid 
        products={filteredProducts}
        onProductClick={handleProductClick}
      />

      {/* Product detail modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Products;