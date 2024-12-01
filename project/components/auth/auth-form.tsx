import { motion } from "framer-motion";
import { InputField } from '@/components/ui/input-field';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface AuthFormProps {
  type: 'signin' | 'signup';
  onSubmit: (e: React.FormEvent) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  name?: string;
  setName?: (value: string) => void;
  error?: string | null;
}

export function AuthForm({
  type,
  onSubmit,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  error,
}: AuthFormProps) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren: 0.2 }
          }
        }}
        className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg"
      >
        <motion.div 
          variants={fadeInUp}
          className="text-center"
        >
          <h2 className="mt-6 text-4xl font-bold text-gray-900 mb-4">
            {type === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-600 mb-8">
            {type === 'signin' 
              ? 'Sign in to continue your shopping experience' 
              : 'Create an account to get started'}
          </p>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4 text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <motion.div 
            variants={fadeInUp}
            className="space-y-4"
          >
            {type === 'signup' && setName && (
              <InputField
                type="text"
                required
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
            <InputField
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <InputField
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </motion.div>

          <motion.div variants={fadeInUp}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              {type === 'signin' ? 'Sign In' : 'Sign Up'}
            </motion.button>
          </motion.div>
        </form>

        <motion.div 
          variants={fadeInUp}
          className="text-center mt-6"
        >
          <Link
            href={type === 'signin' ? '/auth/signup' : '/auth/signin'}
            className="text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            {type === 'signin'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}