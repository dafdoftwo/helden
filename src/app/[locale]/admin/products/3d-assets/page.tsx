"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/i18n';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FiUpload, FiRefreshCw, FiTrash2, FiEye, FiCheck, FiX } from 'react-icons/fi';
import { TbAugmentedReality, TbView360 } from 'react-icons/tb';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  main_image: string;
  has_3d_model: boolean;
  has_360_view: boolean;
}

interface File3D {
  id: number;
  product_id: number;
  file_path: string;
  type: '3d' | '360';
  created_at: string;
}

export default function Product3DAssetsPage() {
  const { t } = useTranslation();
  const { locale } = useParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { user, loading: authLoading } = useAuth();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [uploading3D, setUploading3D] = useState(false);
  const [uploading360, setUploading360] = useState(false);
  const [assets, setAssets] = useState<File3D[]>([]);
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}/login?redirect=/admin/products/3d-assets`);
    }
  }, [user, authLoading, router, locale]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real implementation, this would fetch from your Supabase database
        const { data, error } = await supabase
          .from('products')
          .select('id, name, main_image')
          .order('name', { ascending: true });
          
        if (error) throw error;
        
        // For simulation, we'll add has_3d_model and has_360_view flags
        const productsWithFlags = data.map((product, index) => ({
          ...product,
          has_3d_model: index % 3 === 0, // Every 3rd product has a 3D model
          has_360_view: index % 2 === 0, // Every 2nd product has a 360 view
        }));
        
        setProducts(productsWithFlags);
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchProducts();
    }
  }, [user, supabase]);
  
  useEffect(() => {
    const fetchAssets = async () => {
      if (!selectedProduct) return;
      
      try {
        setLoading(true);
        
        // In a real implementation, fetch 3D assets for the selected product
        // For simulation purposes, we'll create dummy data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Create dummy assets
        const dummyAssets: File3D[] = selectedProduct % 2 === 0 
          ? [
              {
                id: 1,
                product_id: selectedProduct,
                file_path: `/models/${selectedProduct % 3 === 0 ? 'abaya' : 'casual'}.glb`,
                type: '3d',
                created_at: new Date().toISOString(),
              }
            ]
          : [];
          
        if (selectedProduct % 3 === 0) {
          // Add 360 frames for some products
          for (let i = 1; i <= 12; i++) {
            dummyAssets.push({
              id: i + 100,
              product_id: selectedProduct,
              file_path: `/products/${selectedProduct}/360/${i}.jpg`,
              type: '360',
              created_at: new Date().toISOString(),
            });
          }
        }
        
        setAssets(dummyAssets);
      } catch (err: any) {
        console.error('Error fetching assets:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssets();
  }, [selectedProduct]);
  
  const handleUpload3D = () => {
    // In a real implementation, this would upload a 3D model file
    // For simulation, we'll just toggle the uploading state
    setUploading3D(true);
    
    setTimeout(() => {
      setUploading3D(false);
      
      // Add a new asset to the list
      if (selectedProduct) {
        setAssets(prev => [
          ...prev,
          {
            id: Date.now(),
            product_id: selectedProduct,
            file_path: `/models/bodyshaper.glb`,
            type: '3d',
            created_at: new Date().toISOString(),
          }
        ]);
        
        // Update the product has_3d_model flag
        setProducts(prev => 
          prev.map(p => 
            p.id === selectedProduct 
              ? { ...p, has_3d_model: true } 
              : p
          )
        );
      }
    }, 2000);
  };
  
  const handleUpload360 = () => {
    // In a real implementation, this would upload 360° frames
    // For simulation, we'll just toggle the uploading state
    setUploading360(true);
    
    setTimeout(() => {
      setUploading360(false);
      
      // Add new 360 assets to the list
      if (selectedProduct) {
        const new360Assets: File3D[] = [];
        
        for (let i = 1; i <= 12; i++) {
          new360Assets.push({
            id: Date.now() + i,
            product_id: selectedProduct,
            file_path: `/products/${selectedProduct}/360/${i}.jpg`,
            type: '360',
            created_at: new Date().toISOString(),
          });
        }
        
        setAssets(prev => [...prev, ...new360Assets]);
        
        // Update the product has_360_view flag
        setProducts(prev => 
          prev.map(p => 
            p.id === selectedProduct 
              ? { ...p, has_360_view: true } 
              : p
          )
        );
      }
    }, 2000);
  };
  
  const handleDeleteAsset = (assetId: number, type: '3d' | '360') => {
    // In a real implementation, this would delete the asset
    // For simulation, we'll just remove it from the list
    setAssets(prev => prev.filter(a => a.id !== assetId));
    
    // If we deleted all assets of a type, update the product flag
    const remainingOfType = assets.filter(a => a.id !== assetId && a.type === type);
    
    if (remainingOfType.length === 0 && selectedProduct) {
      setProducts(prev => 
        prev.map(p => 
          p.id === selectedProduct 
            ? { 
                ...p, 
                has_3d_model: type === '3d' ? false : p.has_3d_model,
                has_360_view: type === '360' ? false : p.has_360_view,
              } 
            : p
        )
      );
    }
  };
  
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-helden-purple"></div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect via the useEffect
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">
          {t('admin.manage3DAssets')}
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Product List */}
            <div className="md:w-1/3">
              <h2 className="text-lg font-medium mb-4">{t('admin.products')}</h2>
              
              <div className="bg-gray-50 rounded-lg h-[600px] overflow-y-auto">
                {loading && !products.length ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-helden-purple"></div>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {products.map(product => (
                      <li 
                        key={product.id}
                        className={`p-4 cursor-pointer hover:bg-gray-100 transition-colors ${
                          selectedProduct === product.id ? 'bg-helden-purple bg-opacity-10 border-l-4 border-helden-purple' : ''
                        }`}
                        onClick={() => setSelectedProduct(product.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                            <img 
                              src={product.main_image} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{product.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                product.has_3d_model 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                <TbAugmentedReality className="mr-1" />
                                3D
                              </span>
                              
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                product.has_360_view 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                <TbView360 className="mr-1" />
                                360°
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            {/* Asset Management */}
            <div className="md:w-2/3">
              {selectedProduct ? (
                <>
                  <h2 className="text-lg font-medium mb-4">
                    {t('admin.assets')} {' - '}
                    {products.find(p => p.id === selectedProduct)?.name}
                  </h2>
                  
                  <div className="flex space-x-4 mb-6">
                    <button
                      onClick={handleUpload3D}
                      disabled={uploading3D}
                      className="bg-helden-purple hover:bg-helden-purple-dark text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
                    >
                      {uploading3D ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <FiUpload size={16} />
                      )}
                      {t('admin.upload3DModel')}
                    </button>
                    
                    <button
                      onClick={handleUpload360}
                      disabled={uploading360}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
                    >
                      {uploading360 ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <FiUpload size={16} />
                      )}
                      {t('admin.upload360Frames')}
                    </button>
                  </div>
                  
                  {/* 3D Models Section */}
                  <div className="mb-8">
                    <h3 className="text-md font-medium mb-3 flex items-center">
                      <TbAugmentedReality className="mr-2" />
                      {t('admin.3dModels')}
                    </h3>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      {loading ? (
                        <div className="flex items-center justify-center h-40">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-helden-purple"></div>
                        </div>
                      ) : (
                        <>
                          {assets.filter(a => a.type === '3d').length > 0 ? (
                            <div className="space-y-3">
                              {assets
                                .filter(a => a.type === '3d')
                                .map(asset => (
                                  <div 
                                    key={asset.id}
                                    className="bg-white p-3 rounded border flex items-center justify-between"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="h-10 w-10 bg-helden-purple bg-opacity-10 rounded-md flex items-center justify-center text-helden-purple">
                                        <TbAugmentedReality size={20} />
                                      </div>
                                      <div>
                                        <p className="font-medium">{asset.file_path.split('/').pop()}</p>
                                        <p className="text-xs text-gray-500">
                                          {new Date(asset.created_at).toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => alert(`Preview 3D model: ${asset.file_path}`)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                                        title={t('admin.preview')}
                                      >
                                        <FiEye size={18} />
                                      </button>
                                      
                                      <button
                                        onClick={() => handleDeleteAsset(asset.id, '3d')}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                                        title={t('admin.delete')}
                                      >
                                        <FiTrash2 size={18} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <div className="text-center py-10">
                              <p className="text-gray-500 mb-4">{t('admin.no3DModels')}</p>
                              <button
                                onClick={handleUpload3D}
                                className="text-helden-purple hover:underline inline-flex items-center"
                              >
                                <FiUpload size={16} className="mr-1" />
                                {t('admin.upload3DModel')}
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* 360 Frames Section */}
                  <div>
                    <h3 className="text-md font-medium mb-3 flex items-center">
                      <TbView360 className="mr-2" />
                      {t('admin.360Frames')}
                    </h3>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      {loading ? (
                        <div className="flex items-center justify-center h-40">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-helden-purple"></div>
                        </div>
                      ) : (
                        <>
                          {assets.filter(a => a.type === '360').length > 0 ? (
                            <div>
                              <div className="flex justify-between items-center mb-3">
                                <p className="text-sm text-gray-500">
                                  {assets.filter(a => a.type === '360').length} {t('admin.framesUploaded')}
                                </p>
                                <Link 
                                  href={`/${locale}/demo-360?product=${selectedProduct}`}
                                  className="text-helden-purple hover:underline text-sm inline-flex items-center"
                                >
                                  <FiEye size={14} className="mr-1" />
                                  {t('admin.preview')}
                                </Link>
                              </div>
                              
                              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                {assets
                                  .filter(a => a.type === '360')
                                  .map((asset, index) => (
                                    <div 
                                      key={asset.id}
                                      className="relative group"
                                    >
                                      <div className="bg-white rounded overflow-hidden aspect-square border">
                                        <img 
                                          src={asset.file_path} 
                                          alt={`Frame ${index + 1}`}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <button
                                          onClick={() => handleDeleteAsset(asset.id, '360')}
                                          className="p-1.5 bg-red-500 text-white rounded-full"
                                          title={t('admin.delete')}
                                        >
                                          <FiTrash2 size={16} />
                                        </button>
                                      </div>
                                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
                                        {index + 1}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-10">
                              <p className="text-gray-500 mb-4">{t('admin.no360Frames')}</p>
                              <button
                                onClick={handleUpload360}
                                className="text-helden-purple hover:underline inline-flex items-center"
                              >
                                <FiUpload size={16} className="mr-1" />
                                {t('admin.upload360Frames')}
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 h-full flex items-center justify-center">
                  <div className="text-center">
                    <TbView360 size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {t('admin.select3DAssets')}
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      {t('admin.select3DAssetsDescription')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 