"use client";

/**
 * This component is a utility for generating 360-degree product images.
 * It's not meant to be used in production but as a tool for developers
 * to create sample frames for the 360-degree product view.
 */

import React, { useState, useRef, useEffect } from 'react';
import { FiCamera, FiDownload, FiX } from 'react-icons/fi';
import { useTranslation } from '@/i18n';

interface GenerateProduct360FramesProps {
  onClose: () => void;
  onFramesGenerated: (frames: string[]) => void;
}

const GenerateProduct360Frames: React.FC<GenerateProduct360FramesProps> = ({
  onClose,
  onFramesGenerated
}) => {
  const { t } = useTranslation();
  const [frames, setFrames] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const productRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Capture a frame at the current rotation angle
  const captureFrame = () => {
    if (!productRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = productRef.current.offsetWidth;
    canvas.height = productRef.current.offsetHeight;
    
    // Draw the current view to canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw product representation (in real implementation, this would be the actual product)
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotationAngle * Math.PI) / 180);
    ctx.fillStyle = '#7C3AED'; // helden-purple
    ctx.fillRect(-50, -100, 100, 200); // Simple product representation
    ctx.restore();
    
    // Convert canvas to data URL and add to frames
    const frameDataUrl = canvas.toDataURL('image/png');
    setFrames(prev => [...prev, frameDataUrl]);
  };
  
  // Start 360-degree capture process
  const startCapture = () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setFrames([]);
    setRotationAngle(0);
  };
  
  // When rotation angle changes, capture a frame
  useEffect(() => {
    if (!isCapturing) return;
    
    captureFrame();
    
    // If we've completed a full rotation, stop capturing
    if (rotationAngle >= 360) {
      setIsCapturing(false);
      onFramesGenerated(frames);
      return;
    }
    
    // Otherwise, continue rotation
    const timer = setTimeout(() => {
      setRotationAngle(prev => prev + 30); // 30 degrees per frame = 12 frames for 360 degrees
    }, 500);
    
    return () => clearTimeout(timer);
  }, [rotationAngle, isCapturing, frames, onFramesGenerated]);
  
  // Download all frames as a zip (simulated here)
  const downloadFrames = () => {
    alert(`In a real implementation, this would download ${frames.length} frames as a ZIP file.`);
    // In a real implementation, use a library like JSZip to package the frames
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            360° Frame Generator
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div 
            ref={productRef} 
            className="w-full h-64 bg-gray-100 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden"
          >
            {isCapturing ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-helden-purple mx-auto mb-4"></div>
                <p>Capturing frame {frames.length + 1} / 12</p>
                <p className="text-sm text-gray-500">Rotation: {rotationAngle}°</p>
              </div>
            ) : (
              <div 
                className="w-20 h-40 bg-helden-purple rounded"
                style={{ transform: `rotate(${rotationAngle}deg)` }}
              ></div>
            )}
          </div>
          
          <canvas ref={canvasRef} className="hidden"></canvas>
          
          <div className="flex justify-between items-center">
            <button
              onClick={startCapture}
              disabled={isCapturing}
              className="bg-helden-purple text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
            >
              <FiCamera size={18} />
              Generate 360° Frames
            </button>
            
            <button
              onClick={downloadFrames}
              disabled={frames.length === 0}
              className="border border-helden-purple text-helden-purple px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
            >
              <FiDownload size={18} />
              Download Frames
            </button>
          </div>
        </div>
        
        {frames.length > 0 && (
          <div className="p-6 border-t">
            <h3 className="text-lg font-medium mb-4">Generated Frames ({frames.length})</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {frames.map((frame, index) => (
                <div key={index} className="border rounded overflow-hidden">
                  <img 
                    src={frame} 
                    alt={`Frame ${index + 1}`}
                    className="w-full h-auto"
                  />
                  <div className="p-2 text-center text-sm bg-gray-50">
                    Frame {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateProduct360Frames; 