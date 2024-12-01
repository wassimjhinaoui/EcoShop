'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Trash2, Edit2, PlusCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string | null;
  image_url?: string | null;
  is_active?: boolean;
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      y: -20, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100 
      }
    }
  };

  // Fetch products (existing logic)
  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (status === 'authenticated') {
      if (session?.user.email !== 'ssecritou@gmail.com') {
        router.push('/shop');
      }
      fetchProducts();
    } else if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

   const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct)
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      const createdProduct = await response.json();
      setProducts([...products, createdProduct]);
      setNewProduct({});
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  // Update an existing product
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
  
    try {
      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingProduct,
          // Ensure price is a number
          price: typeof editingProduct.price === 'string' 
            ? parseFloat(editingProduct.price) 
            : editingProduct.price
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update product');
      }
  
      const updatedProduct = await response.json();
      setProducts(products.map(p => 
        p.id === updatedProduct.id ? updatedProduct : p
      ));
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      // Optionally, add user-facing error handling
      alert(`Failed to update product: ${error.message}`);
    }
  };

  // Delete a product
  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white"
      >
        <div className="text-2xl font-semibold text-indigo-600">Loading...</div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-4xl font-bold text-gray-900 mb-8 text-center"
        >
          Admin Products Management
        </motion.h1>

        {/* Create/Edit Product Form */}
        <motion.div 
          variants={formVariants}
          className="bg-white shadow-lg rounded-lg p-8 mb-12"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            {editingProduct ? 'Edit Product' : 'Create New Product'}
          </h2>
          
          <form 
            onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <input
              type="text"
              placeholder="Product Name"
              value={editingProduct?.name || newProduct.name || ''}
              onChange={(e) => 
                editingProduct 
                  ? setEditingProduct({...editingProduct, name: e.target.value})
                  : setNewProduct({...newProduct, name: e.target.value})
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="number"
              placeholder="Price"
              step="0.01"
              value={editingProduct?.price || newProduct.price || ''}
              onChange={(e) => 
                editingProduct 
                  ? setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})
                  : setNewProduct({...newProduct, price: parseFloat(e.target.value)})
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              placeholder="Description"
              value={editingProduct?.description || newProduct.description || ''}
              onChange={(e) => 
                editingProduct 
                  ? setEditingProduct({...editingProduct, description: e.target.value})
                  : setNewProduct({...newProduct, description: e.target.value})
              }
              className="md:col-span-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
            <input
              type="text"
              placeholder="Image URL"
              value={editingProduct?.image_url || newProduct.image_url || ''}
              onChange={(e) => 
                editingProduct 
                  ? setEditingProduct({...editingProduct, image_url: e.target.value})
                  : setNewProduct({...newProduct, image_url: e.target.value})
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={editingProduct?.is_active ?? newProduct.is_active ?? true}
                onChange={(e) => 
                  editingProduct 
                    ? setEditingProduct({...editingProduct, is_active: e.target.checked})
                    : setNewProduct({...newProduct, is_active: e.target.checked})
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="text-gray-700">Active</label>
            </div>
            <div className="md:col-span-2 flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                {editingProduct ? 'Update Product' : 'Create Product'}
              </motion.button>
              {editingProduct && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="w-full bg-gray-200 text-gray-800 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Products List */}
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Product Inventory</h2>
          <AnimatePresence>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all hover:shadow-xl"
                >
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-indigo-600 font-semibold mb-2">${product.price}</p>
                    <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setEditingProduct(product)}
                        className="flex items-center justify-center w-full bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
                      >
                        <Edit2 className="mr-2 h-5 w-5" /> Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex items-center justify-center w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="mr-2 h-5 w-5" /> Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}