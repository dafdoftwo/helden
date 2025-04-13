"use client";

import React, { useState } from 'react';
import { useTranslation } from '@/i18n';
import Product360Viewer from '@/components/products/Product360Viewer';
import GenerateProduct360Frames from '@/components/products/GenerateProduct360Frames';
import { FiPlus, FiCamera } from 'react-icons/fi';

export default function Demo360Page() {
  const { t } = useTranslation();
  const [showFrameGenerator, setShowFrameGenerator] = useState(false);
  const [generatedFrames, setGeneratedFrames] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<'abaya' | 'casual' | 'bodyshaper'>('abaya');
  
  const demoProducts = [
    { id: '1', name: 'Elegant Abaya', type: 'abaya' as const },
    { id: '2', name: 'Body Shaper', type: 'bodyshaper' as const },
    { id: '3', name: 'Casual Wear', type: 'casual' as const },
  ];
  
  const handleFramesGenerated = (frames: string[]) => {
    setGeneratedFrames(frames);
    setShowFrameGenerator(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        360° Product Viewer Demo
      </h1>
      
      <div className="mb-6 flex flex-wrap gap-4 justify-center">
        {demoProducts.map(product => (
          <button
            key={product.id}
            onClick={() => setSelectedProduct(product.type)}
            className={`px-4 py-2 rounded-lg ${
              selectedProduct === product.type 
                ? 'bg-helden-purple text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {product.name}
          </button>
        ))}
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">360° Product View</h2>
            <div className="h-[500px] bg-gray-50 rounded-lg">
              <Product360Viewer 
                productId={selectedProduct === 'abaya' ? '1' : selectedProduct === 'bodyshaper' ? '2' : '3'}
                productType={selectedProduct}
                frames={generatedFrames.length > 0 ? generatedFrames : undefined}
              />
            </div>
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Tools & Options</h2>
            
            <div className="space-y-4">
              <button
                onClick={() => setShowFrameGenerator(true)}
                className="w-full bg-helden-purple hover:bg-helden-purple-dark text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <FiCamera size={20} />
                Generate Custom 360° Frames
              </button>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">About This Demo</h3>
                <p className="text-gray-600 text-sm">
                  This demo showcases the 360-degree product viewer component. You can:
                </p>
                <ul className="list-disc text-sm text-gray-600 ml-5 mt-2">
                  <li>Switch between different product types</li>
                  <li>Drag to rotate the product</li>
                  <li>Generate custom frames</li>
                  <li>Test the auto-rotation feature</li>
                </ul>
                
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    <strong>Note:</strong> In a production environment, the 360° frames would be loaded from your product database or a CDN.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showFrameGenerator && (
        <GenerateProduct360Frames 
          onClose={() => setShowFrameGenerator(false)}
          onFramesGenerated={handleFramesGenerated}
        />
      )}
    </div>
  );
} 