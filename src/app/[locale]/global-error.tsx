"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiRefreshCw, FiHome } from 'react-icons/fi';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);
  
  return (
    <html lang="en">
      <head>
        <title>Critical Error - HELDEN</title>
        <meta name="description" content="An error has occurred on HELDEN" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-gradient-to-b from-white to-helden-purple-lighter m-0 p-0">
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 sm:p-12 flex flex-col items-center text-center">
              <div className="mb-8">
                <h1 className="text-7xl font-bold bg-gradient-to-r from-red-500 to-helden-purple bg-clip-text text-transparent">
                  Error
                </h1>
              </div>
              
              <h2 
                className="text-2xl sm:text-3xl font-bold text-helden-purple-dark mb-4"
              >
                Critical Error
              </h2>
              
              <div 
                className="relative w-60 h-60 sm:w-72 sm:h-72 my-6"
              >
                <Image
                  src="/images/error-general.svg"
                  alt="Critical Error"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              <p 
                className="text-gray-600 text-lg mb-3"
              >
                A critical error has occurred in the application.
              </p>
              
              <p 
                className="text-gray-500 mb-8"
              >
                Please try refreshing the page or contact support if the problem persists.
              </p>
              
              <div 
                className="flex flex-col sm:flex-row gap-4"
              >
                <a 
                  href="/"
                  className="bg-helden-purple hover:bg-helden-purple-dark text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <FiHome className="w-5 h-5" />
                  Back to Home
                </a>
                
                <button 
                  onClick={reset}
                  className="bg-white border-2 border-helden-purple-dark text-helden-purple-dark px-8 py-3 rounded-full font-medium hover:bg-helden-purple-dark hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <FiRefreshCw className="w-5 h-5" />
                  Try Again
                </button>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-100 text-sm text-gray-500">
                <p>Error Reference: {error.digest}</p>
                <p className="mt-2">If this problem persists, please contact our support team.</p>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} HELDEN. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  );
} 