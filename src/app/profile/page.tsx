"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/i18n';
import { supabase, getCurrentUser, auth, orders as ordersAPI } from '@/lib/supabase';

export default function ProfilePage() {
  const { t, language, dir } = useTranslation();
  const router = useRouter();
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('profile'); // profile, orders, favorites, settings
  
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          // إذا لم يكن هناك مستخدم، توجيه إلى صفحة تسجيل الدخول
          router.push(`/${language === 'en' ? '' : language + '/'}auth/login`);
          return;
        }
        
        setUser(currentUser);
        
        // إحضار المعلومات الإضافية للمستخدم إذا كانت متوفرة
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();
          
        if (profile) {
          setUser({ ...currentUser, ...profile });
        }
        
        // إحضار الطلبات إذا كان التبويب النشط هو الطلبات
        if (activeTab === 'orders') {
          fetchOrders(currentUser.id);
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [language, router, activeTab]);
  
  const fetchOrders = async (userId: string) => {
    try {
      const userOrders = await ordersAPI.getUserOrders(userId);
      setOrders(userOrders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push(`/${language === 'en' ? '' : language + '/'}`);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    if (tab === 'orders' && user) {
      fetchOrders(user.id);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-helden-purple"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50" dir={dir}>
      <div className="bg-helden-purple text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold">
            {t('profile.title')}
          </h1>
          <p className="text-helden-purple-light mt-2">
            {`${t('profile.welcome')} ${user?.user_metadata?.full_name || user?.email}`}
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 text-center border-b">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  {user?.avatar_url ? (
                    <Image 
                      src={user.avatar_url} 
                      alt={user?.user_metadata?.full_name || ''} 
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-helden-purple text-white flex items-center justify-center text-2xl font-bold">
                      {(user?.email?.charAt(0) || '').toUpperCase()}
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-semibold">
                  {user?.user_metadata?.full_name || t('profile.user')}
                </h2>
                <p className="text-gray-500 mt-1">{user?.email}</p>
              </div>
              
              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => handleTabChange('profile')}
                      className={`w-full text-start px-4 py-2 rounded-lg flex items-center transition-colors ${
                        activeTab === 'profile' 
                          ? 'bg-helden-purple text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {t('profile.tabs.profile')}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleTabChange('orders')}
                      className={`w-full text-start px-4 py-2 rounded-lg flex items-center transition-colors ${
                        activeTab === 'orders' 
                          ? 'bg-helden-purple text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      {t('profile.tabs.orders')}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleTabChange('favorites')}
                      className={`w-full text-start px-4 py-2 rounded-lg flex items-center transition-colors ${
                        activeTab === 'favorites' 
                          ? 'bg-helden-purple text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {t('profile.tabs.favorites')}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleTabChange('settings')}
                      className={`w-full text-start px-4 py-2 rounded-lg flex items-center transition-colors ${
                        activeTab === 'settings' 
                          ? 'bg-helden-purple text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {t('profile.tabs.settings')}
                    </button>
                  </li>
                  <li className="pt-4 mt-4 border-t">
                    <button
                      onClick={handleSignOut}
                      className="w-full text-start px-4 py-2 rounded-lg flex items-center text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {t('profile.signOut')}
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Main content */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-lg shadow p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">{t('profile.personalInfo')}</h2>
                  
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('profile.fullName')}
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helden-purple focus:border-transparent"
                          defaultValue={user?.user_metadata?.full_name || ''}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('profile.email')}
                        </label>
                        <input
                          type="email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          value={user?.email || ''}
                          readOnly
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('profile.phone')}
                        </label>
                        <input
                          type="tel"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helden-purple focus:border-transparent"
                          defaultValue={user?.phone || ''}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('profile.dateJoined')}
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          value={new Date(user?.created_at).toLocaleDateString()}
                          readOnly
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('profile.address')}
                      </label>
                      <textarea
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helden-purple focus:border-transparent"
                        rows={3}
                        defaultValue={user?.address || ''}
                        readOnly
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        className="px-6 py-2 bg-helden-purple text-white rounded-lg hover:bg-helden-purple-dark transition-colors"
                      >
                        {t('profile.editProfile')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">{t('profile.orderHistory')}</h2>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <p className="mt-4 text-gray-600">{t('profile.noOrders')}</p>
                      <Link
                        href={`/${language === 'en' ? '' : language + '/'}`}
                        className="mt-4 inline-block px-6 py-2 bg-helden-purple text-white rounded-lg hover:bg-helden-purple-dark transition-colors"
                      >
                        {t('profile.startShopping')}
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                            <div>
                              <span className="text-sm text-gray-500">{t('profile.orderNumber')}: </span>
                              <span className="font-medium">#{order.id}</span>
                            </div>
                            <div>
                              <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {t(`profile.orderStatus.${order.status}`)}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between mb-4">
                              <div>
                                <div className="text-sm text-gray-500">{t('profile.orderDate')}</div>
                                <div>{new Date(order.order_date).toLocaleDateString()}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">{t('profile.total')}</div>
                                <div className="font-semibold">{order.total.toFixed(2)} {t('common.price')}</div>
                              </div>
                            </div>
                            
                            <div className="border-t pt-4">
                              <h4 className="font-medium mb-2">{t('profile.items')}</h4>
                              <div className="space-y-3">
                                {order.order_items.map((item: any) => (
                                  <div key={item.id} className="flex items-center">
                                    <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                      <Image
                                        src={item.products.images[0]}
                                        alt={item.products.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="ms-4 flex-grow">
                                      <div className="font-medium">{item.products.name}</div>
                                      <div className="text-sm text-gray-500">
                                        {t('profile.quantity')}: {item.quantity} × {item.price.toFixed(2)} {t('common.price')}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mt-4 flex justify-end">
                              <Link
                                href={`/${language === 'en' ? '' : language + '/'}orders/${order.id}`}
                                className="text-helden-purple hover:text-helden-purple-dark font-medium"
                              >
                                {t('profile.viewOrderDetails')}
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Favorites Tab */}
              {activeTab === 'favorites' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">{t('profile.favorites')}</h2>
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <p className="mt-4 text-gray-600">{t('profile.noFavorites')}</p>
                    <Link
                      href={`/${language === 'en' ? '' : language + '/'}`}
                      className="mt-4 inline-block px-6 py-2 bg-helden-purple text-white rounded-lg hover:bg-helden-purple-dark transition-colors"
                    >
                      {t('profile.exploreProducts')}
                    </Link>
                  </div>
                </div>
              )}
              
              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">{t('profile.accountSettings')}</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">{t('profile.changePassword')}</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('profile.currentPassword')}
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helden-purple focus:border-transparent"
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('profile.newPassword')}
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helden-purple focus:border-transparent"
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('profile.confirmNewPassword')}
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helden-purple focus:border-transparent"
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <button className="px-6 py-2 bg-helden-purple text-white rounded-lg hover:bg-helden-purple-dark transition-colors">
                            {t('profile.updatePassword')}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-3">{t('profile.emailNotifications')}</h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="orders"
                              type="checkbox"
                              className="focus:ring-helden-purple h-4 w-4 text-helden-purple border-gray-300 rounded"
                              defaultChecked
                            />
                          </div>
                          <div className="ms-3 text-sm">
                            <label htmlFor="orders" className="font-medium text-gray-700">
                              {t('profile.orderUpdates')}
                            </label>
                            <p className="text-gray-500">{t('profile.orderUpdatesDescription')}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="promotions"
                              type="checkbox"
                              className="focus:ring-helden-purple h-4 w-4 text-helden-purple border-gray-300 rounded"
                              defaultChecked
                            />
                          </div>
                          <div className="ms-3 text-sm">
                            <label htmlFor="promotions" className="font-medium text-gray-700">
                              {t('profile.promotions')}
                            </label>
                            <p className="text-gray-500">{t('profile.promotionsDescription')}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="news"
                              type="checkbox"
                              className="focus:ring-helden-purple h-4 w-4 text-helden-purple border-gray-300 rounded"
                            />
                          </div>
                          <div className="ms-3 text-sm">
                            <label htmlFor="news" className="font-medium text-gray-700">
                              {t('profile.newsletter')}
                            </label>
                            <p className="text-gray-500">{t('profile.newsletterDescription')}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <button className="px-6 py-2 bg-helden-purple text-white rounded-lg hover:bg-helden-purple-dark transition-colors">
                          {t('profile.savePreferences')}
                        </button>
                      </div>
                    </div>
                    
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-3 text-red-600">{t('profile.dangerZone')}</h3>
                      <p className="text-gray-500 mb-4">{t('profile.dangerZoneDescription')}</p>
                      <button className="px-6 py-2 bg-white border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                        {t('profile.deleteAccount')}
                      </button>
                    </div>
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