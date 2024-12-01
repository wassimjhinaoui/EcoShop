"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
}

export default function Shop() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }

    async function fetchProducts() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products/`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.details || `HTTP error! status: ${response.status}`
          );
        }
        const data = await response.json();
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchProducts();
    }
  }, [status, router]);

  const addToCart = (product: Product) => {
    if (!session?.user?.id) {
      router.push("/auth/signin");
      return;
    }
    
    // Check if product is already in cart
    const isProductInCart = cart.some(item => item.id === product.id);
    if (!isProductInCart) {
      setCart([...cart, product]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, product) => total + Number(product.price).toFixed(2), 0);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-2xl text-indigo-600"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900">Our Products</h1>
          
          <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
            <DialogTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative bg-indigo-600 text-white px-6 py-3 rounded-md flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {cart.length}
                  </span>
                )}
              </motion.button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Your Cart</DialogTitle>
              </DialogHeader>
              {cart.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div className="flex items-center space-x-4">
                        {item.image_url && (
                          <img 
                            src={item.image_url} 
                            alt={item.name} 
                            className="h-16 w-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-gray-500">${item.price}</p>
                        </div>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                  <Button className="w-full">Checkout</Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {products.map((product) => (
            <motion.div 
              key={product.id}
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-indigo-600">
                    ${product.price}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addToCart(product)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}