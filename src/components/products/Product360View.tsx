"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { useTranslation } from '@/i18n';
import { motion } from 'framer-motion';

interface Product360ViewProps {
  images: string[];
  productName: string;
  onClose: () => void;
}

const Product360View: React.FC<Product360ViewProps> = ({ 
  images, 
  productName,
  onClose 
}) => {
  const { t } = useTranslation();
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Ensure we have at least one image
  const frameImages = images.length > 0 ? images : ['/images/placeholder.jpg'];
  const totalFrames = frameImages.length;
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onClose]);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleDrag(e.clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleDrag(e.touches[0].clientX);
  };
  
  const handleDrag = (clientX: number) => {
    const containerWidth = containerRef.current?.offsetWidth || 500;
    const sensitivityFactor = 2.5; // Higher value = more sensitive rotation
    const deltaX = clientX - startX;
    
    // Calculate frame change based on drag distance
    const frameChange = Math.floor((deltaX / containerWidth) * totalFrames * sensitivityFactor);
    
    if (frameChange !== 0) {
      let newFrame = (currentFrame - frameChange) % totalFrames;
      if (newFrame < 0) newFrame += totalFrames;
      
      setCurrentFrame(newFrame);
      setStartX(clientX);
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  const toggleAutoRotate = () => {
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
    } else {
      intervalRef.current = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % totalFrames);
      }, 100);
      setIsPlaying(true);
    }
  };
  
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
      onClick={handleBackgroundClick}
    >
      <motion.div 
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] relative overflow-hidden flex flex-col"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-helden-purple-dark">
            {productName} - {t('products.view360')}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={t('common.close')}
          >
            <FiX size={24} />
          </button>
        </div>
        
        <div 
          ref={containerRef}
          className="flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src={frameImages[currentFrame]} 
              alt={`${productName} - ${t('products.frame')} ${currentFrame + 1}`}
              className="max-h-full max-w-full object-contain"
              draggable={false}
            />
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {t('products.frame')} {currentFrame + 1} / {totalFrames}
          </div>
          
          <button
            onClick={toggleAutoRotate}
            className={`px-4 py-2 rounded-md ${
              isPlaying 
                ? 'bg-helden-purple-dark text-white' 
                : 'bg-helden-purple text-white'
            }`}
          >
            {isPlaying ? t('products.stopRotation') : t('products.autoRotate')}
          </button>
        </div>
        
        <div className="absolute bottom-20 left-0 right-0 flex justify-center">
          <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm pointer-events-none">
            {t('products.dragToSpin')}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Product360View; 