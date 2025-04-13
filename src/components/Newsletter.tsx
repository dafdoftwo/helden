"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../i18n';

// Type for decorative dots
type Dot = {
  top: string;
  left: string;
  width: string;
  height: string;
  opacity: number;
};

const Newsletter: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Store decorative dots in a ref to ensure consistency
  const dotsRef = useRef<Dot[]>([]);
  const [dotsGenerated, setDotsGenerated] = useState(false);
  
  // Generate dots only on client-side
  useEffect(() => {
    if (dotsRef.current.length === 0) {
      dotsRef.current = Array(30).fill(null).map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 6 + 2}px`,
        height: `${Math.random() * 6 + 2}px`,
        opacity: Math.random() * 0.5 + 0.2,
      }));
      setDotsGenerated(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setSubmitStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form and show success message
      setEmail('');
      setSubmitStatus('success');
      
      // Reset success message after some time
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-gradient-to-r from-helden-purple-dark to-helden-purple text-white py-16 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute w-40 h-40 bg-white/20 rounded-full -top-10 -left-10"></div>
        <div className="absolute w-60 h-60 bg-white/10 rounded-full -bottom-20 -right-20"></div>
        {dotsGenerated && dotsRef.current.map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/30"
            style={{
              top: dot.top,
              left: dot.left,
              width: dot.width,
              height: dot.height,
              opacity: dot.opacity,
            }}
          ></div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated with HELDEN</h2>
            <p className="mb-6 opacity-90">
              Subscribe to our newsletter and be the first to know about new collections, 
              exclusive offers, and fashion trends.
            </p>
            
            <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-5 py-3 pr-32 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className={`absolute right-1 top-1 px-5 py-2 bg-helden-gold text-helden-purple-dark font-medium rounded-full transition-all hover:bg-white ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Sending...</span>
                  </span>
                ) : (
                  'Subscribe'
                )}
              </button>
            </form>
            
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-sm text-white bg-white/10 backdrop-blur-sm px-4 py-2 rounded-md inline-block"
              >
                <span role="img" aria-label="success" className="mr-2">✓</span>
                Thank you for subscribing to our newsletter!
              </motion.div>
            )}
            
            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-sm text-white bg-white/10 backdrop-blur-sm px-4 py-2 rounded-md inline-block"
              >
                <span role="img" aria-label="error" className="mr-2">⚠️</span>
                {errorMessage}
              </motion.div>
            )}
            
            <p className="mt-4 text-sm opacity-70">
              We respect your privacy and will never share your email address.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter; 