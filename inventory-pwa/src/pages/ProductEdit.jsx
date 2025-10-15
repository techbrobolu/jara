import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InventoryContext } from '../context/InventoryContext';
import ProductForm from '../components/products/ProductForm';
import { toast } from 'sonner';

const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getProductById, updateProduct } = useContext(InventoryContext);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const fetchedProduct = await getProductById(id);
            setProduct(fetchedProduct);
        };
        fetchProduct();
    }, [id, getProductById]);

    const handleUpdate = async (updatedProduct) => {
        try {
            await updateProduct(id, updatedProduct);
            toast.success('Product updated successfully!');
            navigate('/products');
        } catch (error) {
            toast.error('Failed to update product.');
        }
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
            <ProductForm product={product} onSubmit={handleUpdate} />
        </div>
    );
};

export default ProductEdit;