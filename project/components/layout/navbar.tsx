"use client";
import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  console.log(session);
  const handleSignOut = async () => {
    try {
      // Sign out and redirect to home or sign-in page
      await signOut({ 
        redirect: true, 
        callbackUrl: '/auth/signin' 
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const menuVariants = {
    open: { opacity: 1, height: "auto" },
    closed: { opacity: 0, height: 0 }
  };

  return (
    <nav className="bg-white shadow-lg mb-6 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              EcoShop
            </Link>
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {session &&
            <Link href="/shop" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Shop
            </Link>}
            {session?.user.email === 'ssecritou@gmail.com' && 
              <Link href="/admin" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Admin Panel
            </Link>
            } 
            <Link href="/about" className="text-gray-600 hover:text-indigo-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Contact
            </Link>
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile">
                  <User className="h-6 w-6 text-gray-600 hover:text-indigo-600" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={menuVariants}
        className="md:hidden overflow-hidden"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
          <Link
            href="/shop"
            className="block px-3 py-2 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Shop
          </Link>
          <Link
            href="/about"
            className="block px-3 py-2 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="block px-3 py-2 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Contact
          </Link>
          {session ? (
            <button
              onClick={handleSignOut}
              className="block px-3 py-2 text-gray-600 hover:text-indigo-600 transition-colors w-full text-left"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/auth/signin"
              className="block px-3 py-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </motion.div>
    </nav>
  );
}