"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Navbar } from "@/components/layout/navbar";
import { ShoppingBag, Shield, Truck } from "lucide-react";

export default function Home() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen">
      
      
      {/* Hero Section */}
      <section className="pt-20 lg:pt-32 pb-16 bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover Amazing Products
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Shop the latest trends with confidence. Quality products, competitive prices, and exceptional service.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="/shop"
                className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Start Shopping
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={ref} className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={{
              visible: { transition: { staggerChildren: 0.2 } },
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={fadeInUp}
              className="text-center p-6"
            >
              <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
                <ShoppingBag className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">Thousands of products to choose from</p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="text-center p-6"
            >
              <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
                <Truck className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable shipping worldwide</p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="text-center p-6"
            >
              <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
              <p className="text-gray-600">Safe and protected transactions</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}