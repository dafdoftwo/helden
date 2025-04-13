"use client";

import React, { useState } from 'react';
import { useTranslation } from '@/i18n';
import Link from 'next/link';

export default function TestErrorPage() {
  const { t, dir } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  // Function to simulate an error
  const simulateError = () => {
    try {
      // Generate a random error
      const errorTypes = [
        'TypeError',
        'SyntaxError',
        'ReferenceError',
        'RangeError',
      ];
      
      const randomError = errorTypes[Math.floor(Math.random() * errorTypes.length)];
      throw new Error(`Simulated ${randomError}`);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
        console.error('Simulated error:', e);
      }
    }
  };

  // Function to throw an actual error for error boundary testing
  const throwRealError = () => {
    throw new Error('This is a real error that will trigger the error boundary');
  };

  return (
    <div className="min-h-screen bg-helden-gradient" dir={dir}>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-helden-purple-dark mb-6">
            Error Testing Page
          </h1>
          
          <p className="mb-8 text-gray-600">
            This page allows you to test different error scenarios to see how the application handles them.
          </p>
          
          <div className="space-y-8">
            <div className="p-6 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">404 Error</h2>
              <p className="mb-4 text-gray-600">
                Navigate to a non-existent page to test the 404 error handling.
              </p>
              <Link 
                href="/non-existent-page" 
                className="btn-primary"
              >
                Go to non-existent page
              </Link>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Simulated Error</h2>
              <p className="mb-4 text-gray-600">
                Simulate an error without crashing the page.
              </p>
              <button 
                onClick={simulateError}
                className="btn-secondary"
              >
                Simulate Error
              </button>
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600">{error}</p>
                </div>
              )}
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Error Boundary Test</h2>
              <p className="mb-4 text-gray-600">
                Trigger an actual error to test the error boundary component.
              </p>
              <button 
                onClick={throwRealError}
                className="btn-secondary bg-red-100 text-red-700 hover:bg-red-200"
              >
                Trigger Error Boundary
              </button>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">500 Error Page</h2>
              <p className="mb-4 text-gray-600">
                Visit the dedicated 500 error page.
              </p>
              <Link 
                href="/500" 
                className="btn-secondary"
              >
                View 500 Error Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}