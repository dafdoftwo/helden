"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera, Environment } from '@react-three/drei';
import { useTranslation } from '@/i18n';
import { FiCamera, FiCameraOff, FiRefreshCw, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductARViewProps {
  productName: string;
  modelPath: string;
  onClose: () => void;
}

// Model component to load and render the 3D model
function Model({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath);
  
  return <primitive object={scene} scale={0.5} position={[0, -1, 0]} />;
}

const ProductARView: React.FC<ProductARViewProps> = ({ productName, modelPath, onClose }) => {
  const { t } = useTranslation();
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [arSupported, setArSupported] = useState(false);

  useEffect(() => {
    // Check if device has camera
    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoInput = devices.some(device => device.kind === 'videoinput');
        setHasCamera(hasVideoInput);
        
        // Check if browser supports AR
        setArSupported(
          'xr' in navigator && 
          'isSessionSupported' in (navigator as any).xr && 
          await (navigator as any).xr.isSessionSupported('immersive-ar')
        );
        
        setLoading(false);
      } catch (error) {
        console.error('Error checking camera:', error);
        setHasCamera(false);
        setLoading(false);
      }
    };
    
    checkCamera();
    
    // Cleanup function for camera permissions
    return () => {
      if (cameraActive) {
        // Stop any active streams
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            stream.getTracks().forEach(track => track.stop());
          })
          .catch(err => console.error('Error stopping camera:', err));
      }
    };
  }, [cameraActive]);
  
  const toggleCamera = async () => {
    if (cameraActive) {
      setCameraActive(false);
    } else {
      try {
        // Request camera permissions
        await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraActive(true);
      } catch (error) {
        console.error('Error requesting camera permission:', error);
        alert(t('products.cameraPermissionDenied'));
      }
    }
  };
  
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-helden-purple mx-auto mb-4"></div>
          <p className="text-lg font-medium">{t('common.loading')}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col">
      <div className="absolute top-4 right-4 z-50">
        <button 
          onClick={onClose}
          className="text-white p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition"
          aria-label={t('common.close')}
        >
          <FiX size={28} />
        </button>
      </div>
      
      <div className="absolute top-4 left-4 z-50">
        <h2 className="text-white text-xl font-bold">
          {t('products.viewIn3D')}: {productName}
        </h2>
      </div>
      
      <div className="flex-1 relative">
        <Canvas>
          <Suspense fallback={null}>
            <Environment preset="apartment" />
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <Model modelPath={modelPath} />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          </Suspense>
        </Canvas>
      </div>
      
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
        {hasCamera && (
          <button
            onClick={toggleCamera}
            className="bg-helden-purple text-white px-4 py-2 rounded-full flex items-center gap-2"
          >
            {cameraActive ? <FiCameraOff size={20} /> : <FiCamera size={20} />}
            {cameraActive ? t('products.disableAR') : t('products.enableAR')}
          </button>
        )}
        
        <button
          onClick={() => window.location.reload()}
          className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full flex items-center gap-2"
        >
          <FiRefreshCw size={20} />
          {t('products.resetView')}
        </button>
      </div>
      
      {!arSupported && hasCamera && (
        <div className="absolute top-16 left-0 right-0 flex justify-center">
          <div className="bg-yellow-600 text-white px-4 py-2 rounded-lg">
            {t('products.arNotSupported')}
          </div>
        </div>
      )}
      
      <div className="absolute bottom-20 left-0 right-0 flex justify-center">
        <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
          {t('products.dragToRotate')}
        </div>
      </div>
    </div>
  );
};

export default ProductARView; 