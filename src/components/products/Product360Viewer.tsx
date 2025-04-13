"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { useTranslation } from '@/i18n';

interface Product360ViewerProps {
  productId: string;
  productType?: 'abaya' | 'casual' | 'bodyshaper';
  frames?: string[];
  className?: string;
}

const Product360Viewer: React.FC<Product360ViewerProps> = ({
  productId,
  productType = 'abaya',
  frames,
  className = '',
}) => {
  const { t } = useTranslation();
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedFrames, setLoadedFrames] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Load frames if they're not provided
  useEffect(() => {
    if (frames && frames.length > 0) {
      setLoadedFrames(frames);
      setIsLoading(false);
      return;
    }

    // In a real implementation, fetch frames from the server
    // Simulating frame loading
    setIsLoading(true);
    
    // Example implementation - in a real app, you would fetch from your API
    const loadFrames = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Create dummy frames for demo
        const dummyFrames = Array.from({ length: 12 }, (_, i) => 
          `/products/${productId}/360/${i + 1}.jpg`
        );
        
        setLoadedFrames(dummyFrames);
      } catch (error) {
        console.error('Error loading product frames:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFrames();
  }, [productId, frames]);
  
  // Handle mouse/touch events for dragging
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
  };
  
  const handleDragMove = (clientX: number) => {
    if (!isDragging || loadedFrames.length === 0) return;
    
    const deltaX = clientX - startX;
    if (Math.abs(deltaX) < 20) return; // Threshold to prevent small movements
    
    // Calculate new frame based on drag distance
    const framesToMove = Math.floor(Math.abs(deltaX) / 20);
    if (framesToMove === 0) return;
    
    // Update current frame based on drag direction
    const direction = deltaX > 0 ? -1 : 1;
    setCurrentFrame(prev => {
      const newFrame = (prev + direction * framesToMove) % loadedFrames.length;
      return newFrame < 0 ? loadedFrames.length + newFrame : newFrame;
    });
    
    setStartX(clientX);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };
  
  const handleMouseUp = () => {
    handleDragEnd();
  };
  
  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    handleDragEnd();
  };
  
  // Auto-rotate the product
  const startAutoRotation = () => {
    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % loadedFrames.length);
    }, 100);
    
    // Stop rotation after one full cycle
    setTimeout(() => {
      clearInterval(interval);
    }, 100 * loadedFrames.length);
  };
  
  // 3D model fallback option
  const viewIn3D = () => {
    // In a real implementation, this would open a 3D model viewer
    const modelPath = `/models/${productType}.glb`;
    alert(`In a real implementation, this would open the 3D model: ${modelPath}`);
  };
  
  return (
    <div className={`relative rounded-lg overflow-hidden aspect-square ${className}`}>
      {/* Product view container */}
      <div 
        ref={containerRef}
        className="w-full h-full bg-gray-100 flex items-center justify-center cursor-grab select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-helden-purple mx-auto mb-4"></div>
            <p className="text-gray-600">{t('common.loading')}...</p>
          </div>
        ) : loadedFrames.length > 0 ? (
          <img 
            src={loadedFrames[currentFrame]} 
            alt={`${productId} - view ${currentFrame + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="text-center p-4">
            <p className="text-red-500 mb-2">{t('product.noFramesAvailable')}</p>
            <button
              onClick={viewIn3D}
              className="bg-helden-purple text-white px-3 py-1 rounded text-sm"
            >
              View 3D Model
            </button>
          </div>
        )}
      </div>
      
      {/* Controls */}
      {!isLoading && loadedFrames.length > 0 && (
        <div className="absolute bottom-3 right-3">
          <button
            onClick={startAutoRotation}
            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            title={t('product.rotate360')}
          >
            <FiRefreshCw className="text-helden-purple" size={20} />
          </button>
        </div>
      )}
      
      {/* Instructions overlay */}
      {!isLoading && loadedFrames.length > 0 && (
        <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-1 text-sm">
          {t('product.dragToRotate')}
        </div>
      )}
    </div>
  );
};

export default Product360Viewer; 