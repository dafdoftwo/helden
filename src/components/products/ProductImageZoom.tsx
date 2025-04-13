"use client";

import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

interface ProductImageZoomProps {
  imageUrl: string;
  onClose: () => void;
}

const ProductImageZoom: React.FC<ProductImageZoomProps> = ({ imageUrl, onClose }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    // Add escape key listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(0.5, scale + delta), 4);
    setScale(newScale);
  };
  
  const handleDoubleClick = () => {
    if (scale !== 1) {
      // Reset zoom
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      // Zoom in
      setScale(2);
    }
  };
  
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center cursor-move"
      onClick={handleBackgroundClick}
    >
      <div className="absolute top-4 right-4">
        <button 
          onClick={onClose}
          className="text-white p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition"
        >
          <FiX size={32} />
        </button>
      </div>
      
      <div 
        className="relative overflow-hidden h-full w-full flex items-center justify-center"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
      >
        <img
          src={imageUrl}
          alt="Zoomed product"
          className="select-none"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.2s',
            transformOrigin: 'center',
          }}
          draggable={false}
        />
      </div>
      
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
          Use mouse wheel to zoom, drag to pan, double-click to reset
        </div>
      </div>
    </div>
  );
};

export default ProductImageZoom; 