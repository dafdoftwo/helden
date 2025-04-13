"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CategoryCard from '../components/CategoryCard';
import FeaturedProducts from '../components/FeaturedProducts';
import TestimonialSlider from '@/components/TestimonialSlider';
import Contact from '@/components/Contact';
import Newsletter from '@/components/Newsletter';
import { useTranslation } from '../i18n';
import { motion } from 'framer-motion';
import { FaInstagram } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-r from-purple-600 to-indigo-800 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Welcome to HELDEN
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Saudi Arabia's Premier Women's Clothing Store
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/en" className="bg-white text-purple-700 hover:bg-gray-100 font-bold py-3 px-6 rounded-full shadow-lg transition duration-300">
            Shop in English
          </Link>
          <Link href="/ar" className="bg-transparent border-2 border-white hover:bg-white hover:text-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300">
            تسوق بالعربية
          </Link>
        </div>
        <div className="mt-12 text-sm opacity-75">
          <p>Some features require database connection and may not work in this demo.</p>
          <p>Contact the administrator to enable full functionality.</p>
        </div>
      </div>
    </div>
  );
} 