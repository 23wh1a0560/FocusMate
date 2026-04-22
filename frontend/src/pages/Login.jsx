import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Sign Up
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    
    try {
      const { data } = await API.post(endpoint, formData);
      localStorage.setItem('token', data.token); // Store the JWT token
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gelato/20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-4xl shadow-2xl w-full max-w-md border border-white"
      >
        <h1 className="text-4xl font-black text-amalfi mb-2 tracking-tighter text-center">FocusMate</h1>
        <p className="text-amalfi/60 mb-8 font-medium text-center">
          {isLogin ? "Welcome back to your space." : "Start your journey with us today."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.input 
                key="name"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                type="text" 
                placeholder="Full Name" 
                className="w-full p-4 rounded-2xl bg-gelato/10 border-none focus:ring-2 focus:ring-seabreeze outline-none"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            )}
          </AnimatePresence>

          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full p-4 rounded-2xl bg-gelato/10 border-none focus:ring-2 focus:ring-seabreeze outline-none"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-4 rounded-2xl bg-gelato/10 border-none focus:ring-2 focus:ring-seabreeze outline-none"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="w-full bg-amalfi text-white p-4 rounded-2xl font-bold text-lg shadow-lg shadow-amalfi/20 mt-4"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-amalfi font-bold hover:underline"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;