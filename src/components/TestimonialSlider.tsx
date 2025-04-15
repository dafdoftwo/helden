"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import { useTranslation } from '../i18n';

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: 'Sarah Al-Qahtani',
    role: 'testimonials.roles.loyalCustomer',
    avatar: '/images/avatar1.jpg',
    quote: 'testimonials.quotes.sarah',
    rating: 5,
    location: 'Riyadh'
  },
  {
    id: 2,
    name: 'Fatima Hassan',
    role: 'testimonials.roles.fashionBlogger',
    avatar: '/images/avatar2.jpg',
    quote: 'testimonials.quotes.fatima',
    rating: 5,
    location: 'Jeddah'
  },
  {
    id: 3,
    name: 'Noor Abdullah',
    role: 'testimonials.roles.professional',
    avatar: '/images/avatar3.jpg',
    quote: 'testimonials.quotes.noor',
    rating: 4,
    location: 'Dammam'
  },
  {
    id: 4,
    name: 'Amina Mohammed',
    role: 'testimonials.roles.student',
    avatar: '/images/avatar4.jpg',
    quote: 'testimonials.quotes.amina',
    rating: 5,
    location: 'Mecca'
  }
];

// Fallback avatar image
const fallbackAvatar = '/images/avatar-placeholder.jpg';

// Type for decorative dots
type Dot = {
  top: string;
  left: string;
  width: string;
  height: string;
  opacity: number;
};

const TestimonialSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useTranslation();
  
  // Store decorative dots in a ref to ensure consistency
  const dotsRef = useRef<Dot[]>([]);
  const [dotsGenerated, setDotsGenerated] = useState(false);
  
  // Generate dots only on client-side
  useEffect(() => {
    if (dotsRef.current.length === 0) {
      dotsRef.current = Array(20).fill(null).map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 8 + 2}px`,
        height: `${Math.random() * 8 + 2}px`,
        opacity: Math.random() * 0.5 + 0.2,
      }));
      setDotsGenerated(true);
    }
  }, []);
  
  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle manual navigation
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  
  return (
    <div className="relative px-4 py-16 overflow-hidden bg-gradient-to-br from-helden-purple-dark to-helden-purple">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-pattern bg-repeat opacity-20"></div>
        {dotsGenerated && dotsRef.current.map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
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
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('testimonials.title')}</h2>
          <div className="w-24 h-1 bg-helden-gold mx-auto"></div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl p-6 md:p-8 shadow-xl"
              >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="shrink-0">
                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-helden-gold shadow-md">
                      <Image
                        src={testimonials[currentIndex].avatar}
                        alt={testimonials[currentIndex].name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // If image fails to load, use fallback
                          const target = e.target as HTMLImageElement;
                          target.src = fallbackAvatar;
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="mb-4 flex justify-center md:justify-start">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`${
                            i < testimonials[currentIndex].rating
                              ? 'text-helden-gold'
                              : 'text-gray-300'
                          } w-5 h-5`}
                        />
                      ))}
                    </div>
                    
                    <div className="relative mb-4">
                      <FaQuoteLeft className="absolute -top-2 -left-2 w-8 h-8 text-helden-gold opacity-20" />
                      <p className="text-gray-700 italic relative z-10">
                        "{t(testimonials[currentIndex].quote)}"
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-helden-purple-dark text-lg">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-gray-500 text-sm">
                        {t(testimonials[currentIndex].role)}, {testimonials[currentIndex].location}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation buttons */}
            <button
              onClick={goToPrev}
              className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-6 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-helden-purple hover:text-helden-purple-dark transition-all duration-300 hover:scale-110 focus:outline-none"
              aria-label="Previous testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={goToNext}
              className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-6 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-helden-purple hover:text-helden-purple-dark transition-all duration-300 hover:scale-110 focus:outline-none"
              aria-label="Next testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-helden-gold w-6'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider; 