"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import ProductImageZoom from './ProductImageZoom';
import { useTranslation } from '@/i18n';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const { t } = useTranslation();

  // Ensure we have at least one image
  const imageList = images.length > 0 ? images : ['/images/placeholder.jpg'];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % imageList.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const selectImage = (index: number) => {
    setCurrentIndex(index);
  };

  const openZoom = () => {
    setShowZoom(true);
  };

  const closeZoom = () => {
    setShowZoom(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {/* Thumbnails - Vertical on desktop, horizontal on mobile */}
      <div className="flex md:flex-col order-2 md:order-1 md:w-20 overflow-x-auto md:overflow-y-auto md:h-[500px] gap-2 md:flex-shrink-0">
        {imageList.map((image, index) => (
          <button
            key={index}
            className={`relative w-16 h-16 md:w-20 md:h-20 border-2 rounded overflow-hidden flex-shrink-0 transition-all ${
              index === currentIndex ? 'border-helden-purple' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => selectImage(index)}
            aria-label={`${t('products.viewImage')}`}
          >
            <Image
              src={image}
              alt={`${productName} - ${t('products.smallImage')} ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] order-1 md:order-2 flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full"
          >
            <Image
              src={imageList[currentIndex]}
              alt={`${productName} - ${t('products.image')} ${currentIndex + 1}`}
              fill
              className="object-contain cursor-zoom-in"
              onClick={openZoom}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        {imageList.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md text-helden-purple transition-all z-10"
              onClick={prevImage}
              aria-label={t('products.previousImage')}
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md text-helden-purple transition-all z-10"
              onClick={nextImage}
              aria-label={t('products.nextImage')}
            >
              <FiChevronRight size={24} />
            </button>
          </>
        )}

        {/* Image counter */}
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded-full">
          {currentIndex + 1} / {imageList.length}
        </div>

        {/* Zoom hint */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded-full flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m4-3H6" />
          </svg>
          {t('products.clickToZoom')}
        </div>
      </div>

      {/* Zoom Modal */}
      {showZoom && (
        <ProductImageZoom
          imageUrl={imageList[currentIndex]}
          onClose={closeZoom}
        />
      )}
    </div>
  );
};

export default ProductGallery; 