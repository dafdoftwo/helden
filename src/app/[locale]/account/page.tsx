"use client";

import React, { useState } from 'react';
import { useTranslation } from '@/i18n';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiUser, 
  FiHeart, 
  FiShoppingBag, 
  FiMapPin, 
  FiSettings, 
  FiLogOut, 
  FiEdit2,
  FiEye,
  FiCalendar,
  FiChevronRight
} from 'react-icons/fi';

export default function AccountPage() {
  const { t, dir } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // بيانات وهمية للمستخدم - في التطبيق الحقيقي ستأتي من API
  const user = {
    name: "منيرة العتيبي",
    email: "munirah@example.com",
    image: "/images/avatar-female.jpg",
    joinDate: "15/03/2023",
    orders: [
      { id: "ORD-2305", date: "18/05/2023", status: "completed", total: 650, items: 3 },
      { id: "ORD-2198", date: "02/04/2023", status: "processing", total: 450, items: 2 },
      { id: "ORD-1987", date: "12/02/2023", status: "completed", total: 780, items: 4 }
    ],
    wishlist: [
      { id: 1, name: "عباية مطرزة فاخرة", image: "/images/Abayas/Saudi_Abayas_1.jpg", price: 450 },
      { id: 2, name: "فستان سهرة أنيق", image: "/images/Abayas/Saudi_Abayas_2.jpg", price: 680 }
    ],
    addresses: [
      { id: 1, default: true, name: "المنزل", street: "حي الياسمين", city: "الرياض", postalCode: "12345" },
      { id: 2, default: false, name: "العمل", street: "شارع العليا", city: "الرياض", postalCode: "54321" }
    ]
  };
  
  // التبويبات المتاحة
  const tabs = [
    { id: 'dashboard', label: t('account.dashboard') || 'لوحة التحكم', icon: <FiUser /> },
    { id: 'orders', label: t('account.orders') || 'طلباتي', icon: <FiShoppingBag /> },
    { id: 'wishlist', label: t('account.wishlist') || 'المفضلة', icon: <FiHeart /> },
    { id: 'addresses', label: t('account.addresses') || 'العناوين', icon: <FiMapPin /> },
    { id: 'settings', label: t('account.settings') || 'الإعدادات', icon: <FiSettings /> },
  ];
  
  // أنيميشن 
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  const getOrderStatusClass = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
  }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-helden-purple-lighter py-16" dir={dir}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-helden-purple to-helden-purple-light bg-clip-text text-transparent mb-4">
              {t('account.myAccount') || 'حسابي'}
            </h1>
            <div className="h-1 w-24 bg-helden-gold mx-auto mb-4"></div>
          </motion.div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* القسم الجانبي */}
              <div className="lg:w-1/4 bg-helden-purple-lighter p-6">
                <div className="flex items-center gap-4 mb-8 p-4 bg-white rounded-xl shadow-sm">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={user.image}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-helden-purple-dark">{user.name}</h3>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
        </div>

                <nav>
                  <ul className="space-y-2">
                    {tabs.map((tab) => (
                      <li key={tab.id}>
                  <button
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            activeTab === tab.id
                              ? 'bg-helden-purple text-white shadow-md'
                              : 'text-gray-600 hover:bg-white hover:text-helden-purple'
                    }`}
                          onClick={() => setActiveTab(tab.id)}
                        >
                          <span className="text-lg">{tab.icon}</span>
                          <span>{tab.label}</span>
                        </button>
                      </li>
                    ))}
                    <li>
                      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                        <span className="text-lg"><FiLogOut /></span>
                        <span>{t('account.logout') || 'تسجيل الخروج'}</span>
                  </button>
                    </li>
                  </ul>
                </nav>
              </div>
              
              {/* المحتوى الرئيسي */}
              <div className="lg:w-3/4 p-6 md:p-8">
                {/* لوحة التحكم */}
                {activeTab === 'dashboard' && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants}>
                      <h2 className="text-2xl font-bold text-helden-purple-dark mb-6">
                        {t('account.welcomeBack') || 'مرحباً بعودتك'}, {user.name}
                      </h2>
                      
                      <p className="text-gray-600 mb-8">
                        {t('account.accountSince') || 'عضو منذ'} {user.joinDate}
                      </p>
                    </motion.div>
                  
                    <motion.div 
                      variants={itemVariants}
                      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
                    >
                      <div className="bg-gradient-to-br from-helden-purple-lighter to-white rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-helden-purple-dark">
                            {t('account.totalOrders') || 'إجمالي الطلبات'}
                          </h3>
                          <span className="p-2 bg-white rounded-lg text-helden-purple">
                            <FiShoppingBag />
                          </span>
                </div>
                        <p className="text-3xl font-bold text-helden-purple">{user.orders.length}</p>
              </div>
                      
                      <div className="bg-gradient-to-br from-helden-purple-lighter to-white rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-helden-purple-dark">
                            {t('account.wishlistItems') || 'المنتجات المفضلة'}
                          </h3>
                          <span className="p-2 bg-white rounded-lg text-helden-purple">
                            <FiHeart />
                          </span>
            </div>
                        <p className="text-3xl font-bold text-helden-purple">{user.wishlist.length}</p>
          </div>

                      <div className="bg-gradient-to-br from-helden-purple-lighter to-white rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-helden-purple-dark">
                            {t('account.savedAddresses') || 'العناوين المحفوظة'}
                          </h3>
                          <span className="p-2 bg-white rounded-lg text-helden-purple">
                            <FiMapPin />
                          </span>
                        </div>
                        <p className="text-3xl font-bold text-helden-purple">{user.addresses.length}</p>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <h3 className="text-xl font-semibold text-helden-purple-dark mb-4">
                        {t('account.recentOrders') || 'آخر الطلبات'}
                      </h3>
                      
                      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  {t('account.order') || 'الطلب'}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  {t('account.date') || 'التاريخ'}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  {t('account.status') || 'الحالة'}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  {t('account.total') || 'المجموع'}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  {t('account.actions') || 'الإجراءات'}
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {user.orders.slice(0, 3).map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-helden-purple-dark">{order.id}</div>
                                    <div className="text-xs text-gray-500">{order.items} {t('account.items') || 'منتجات'}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center text-sm text-gray-600">
                                      <FiCalendar className="mr-2" /> {order.date}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs rounded-full ${getOrderStatusClass(order.status)}`}>
                                      {t(`account.${order.status}`) || order.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {order.total} {t('common.sar') || 'ريال'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <Link href={`/orders/${order.id}`} className="text-helden-purple hover:text-helden-purple-dark">
                                      {t('account.viewDetails') || 'عرض التفاصيل'} <FiChevronRight className="inline ml-1" />
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        {user.orders.length > 3 && (
                          <div className="p-4 text-center">
                            <button 
                              onClick={() => setActiveTab('orders')}
                              className="text-helden-purple hover:text-helden-purple-dark font-medium transition-colors"
                            >
                              {t('account.viewAllOrders') || 'عرض جميع الطلبات'}
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* الطلبات */}
                {activeTab === 'orders' && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants}>
                      <h2 className="text-2xl font-bold text-helden-purple-dark mb-6">
                        {t('account.myOrders') || 'طلباتي'}
                      </h2>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      {user.orders.length > 0 ? (
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('account.order') || 'الطلب'}
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('account.date') || 'التاريخ'}
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('account.status') || 'الحالة'}
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('account.total') || 'المجموع'}
                                  </th>
                                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('account.actions') || 'الإجراءات'}
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {user.orders.map((order) => (
                                  <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm font-medium text-helden-purple-dark">{order.id}</div>
                                      <div className="text-xs text-gray-500">{order.items} {t('account.items') || 'منتجات'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center text-sm text-gray-600">
                                        <FiCalendar className="mr-2" /> {order.date}
                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`px-2 py-1 text-xs rounded-full ${getOrderStatusClass(order.status)}`}>
                                        {t(`account.${order.status}`) || order.status}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {order.total} {t('common.sar') || 'ريال'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                      <Link href={`/orders/${order.id}`} className="text-helden-purple hover:text-helden-purple-dark">
                                        {t('account.viewDetails') || 'عرض التفاصيل'} <FiChevronRight className="inline ml-1" />
                                      </Link>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                      </div>
                    </div>
                      ) : (
                        <div className="bg-white rounded-xl p-10 text-center shadow-sm">
                          <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {t('account.noOrders') || 'لا توجد طلبات'}
                          </h3>
                          <p className="text-gray-500 mb-6">
                            {t('account.noOrdersDesc') || 'لم تقومي بعمل أي طلبات حتى الآن.'}
                          </p>
                          <Link href="/products" className="bg-helden-purple hover:bg-helden-purple-dark text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center">
                            {t('common.shopNow') || 'تسوق الآن'}
                          </Link>
                  </div>
                )}
                    </motion.div>
                  </motion.div>
                )}
                
                {/* المفضلة */}
                {activeTab === 'wishlist' && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants}>
                      <h2 className="text-2xl font-bold text-helden-purple-dark mb-6">
                        {t('account.myWishlist') || 'المفضلة'}
                      </h2>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      {user.wishlist.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {user.wishlist.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex">
                              <div className="relative w-1/3 h-auto">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={150}
                                  height={150}
                                  className="object-cover h-full w-full"
                                />
                              </div>
                              <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                  <h3 className="font-medium text-helden-purple-dark mb-2">{item.name}</h3>
                                  <p className="text-helden-purple font-semibold">{item.price} {t('common.sar') || 'ريال'}</p>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                  <button className="text-helden-purple hover:text-helden-purple-dark text-sm font-medium flex items-center gap-1">
                                    <FiShoppingBag />
                                    {t('common.addToCart') || 'أضف إلى السلة'}
                                  </button>
                                  <button className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1">
                                    <FiHeart />
                                    {t('account.removeWishlist') || 'إزالة'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white rounded-xl p-10 text-center shadow-sm">
                          <FiHeart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {t('account.noWishlist') || 'قائمة المفضلة فارغة'}
                          </h3>
                          <p className="text-gray-500 mb-6">
                            {t('account.noWishlistDesc') || 'لم تقومي بإضافة أي منتجات إلى المفضلة.'}
                          </p>
                          <Link href="/products" className="bg-helden-purple hover:bg-helden-purple-dark text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center">
                            {t('common.shopNow') || 'تسوق الآن'}
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                )}
                
                {/* العناوين */}
                {activeTab === 'addresses' && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-helden-purple-dark">
                        {t('account.myAddresses') || 'العناوين المحفوظة'}
                      </h2>
                      
                      <button className="bg-helden-purple text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-helden-purple-dark transition-colors">
                        <FiEdit2 />
                        {t('account.addAddress') || 'إضافة عنوان'}
                      </button>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      {user.addresses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {user.addresses.map((address) => (
                            <div key={address.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative">
                              {address.default && (
                                <div className="absolute top-3 right-3 bg-helden-gold text-helden-purple-dark text-xs font-bold py-1 px-3 rounded-full">
                                  {t('account.defaultAddress') || 'العنوان الافتراضي'}
                                </div>
                              )}
                              
                              <h3 className="font-semibold text-helden-purple-dark text-lg mb-1">{address.name}</h3>
                              <div className="text-gray-700 space-y-1 mt-3">
                                <p>{address.street}</p>
                                <p>{address.city}</p>
                                <p>{address.postalCode}</p>
                      </div>

                              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4">
                                <button className="text-helden-purple hover:text-helden-purple-dark text-sm font-medium flex items-center gap-1">
                                  <FiEdit2 />
                                  {t('account.edit') || 'تعديل'}
                                </button>
                                
                                {!address.default && (
                                  <button className="text-helden-purple hover:text-helden-purple-dark text-sm font-medium flex items-center gap-1">
                                    <FiMapPin />
                                    {t('account.setDefault') || 'تعيين كافتراضي'}
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white rounded-xl p-10 text-center shadow-sm">
                          <FiMapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {t('account.noAddresses') || 'لا توجد عناوين محفوظة'}
                          </h3>
                          <p className="text-gray-500 mb-6">
                            {t('account.noAddressesDesc') || 'لم تقومي بإضافة أي عناوين حتى الآن.'}
                          </p>
                          <button className="bg-helden-purple hover:bg-helden-purple-dark text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center gap-2">
                            <FiEdit2 />
                            {t('account.addAddress') || 'إضافة عنوان'}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                )}
                
                {/* الإعدادات */}
                {activeTab === 'settings' && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants}>
                      <h2 className="text-2xl font-bold text-helden-purple-dark mb-6">
                        {t('account.accountSettings') || 'إعدادات الحساب'}
                      </h2>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-medium text-helden-purple-dark mb-4">
                          {t('account.personalInfo') || 'المعلومات الشخصية'}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                              {t('account.fullName') || 'الاسم الكامل'}
                        </label>
                          <input
                            type="text"
                              value={user.name}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helden-purple focus:border-transparent"
                              readOnly
                          />
                        </div>
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                              {t('account.email') || 'البريد الإلكتروني'}
                        </label>
                          <input
                              type="email" 
                              value={user.email}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helden-purple focus:border-transparent"
                              readOnly
                          />
                        </div>
                      </div>

                        <button className="mt-4 text-helden-purple hover:text-helden-purple-dark font-medium flex items-center gap-1">
                          <FiEdit2 />
                          {t('account.editInfo') || 'تعديل المعلومات'}
                        </button>
                      </div>
                      
                      <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-medium text-helden-purple-dark mb-4">
                          {t('account.passwordSecurity') || 'كلمة المرور والأمان'}
                        </h3>
                        
                        <button className="bg-helden-purple hover:bg-helden-purple-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                          {t('account.changePassword') || 'تغيير كلمة المرور'}
                      </button>
                    </div>
                      
                      <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-medium text-helden-purple-dark mb-4">
                          {t('account.notifications') || 'الإشعارات'}
                        </h3>
                        
                        <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-800">
                                {t('account.emailNotifications') || 'إشعارات البريد الإلكتروني'}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {t('account.emailNotificationsDesc') || 'استلام إشعارات حول طلباتك والمنتجات الجديدة'}
                              </p>
                            </div>
                            <div className="relative inline-block w-12 h-6 bg-gray-200 rounded-full cursor-pointer transition-colors duration-300 ease-in-out hover:bg-gray-300">
                              <input type="checkbox" id="emailNotif" className="sr-only" defaultChecked={true} />
                              <span className="absolute left-1 top-1 bg-white h-4 w-4 rounded-full transition-transform duration-300 ease-in-out transform translate-x-0 checked:translate-x-6"></span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-800">
                                {t('account.marketingNotifications') || 'إشعارات تسويقية'}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {t('account.marketingNotificationsDesc') || 'استلام عروض وكوبونات خصم'}
                            </p>
                          </div>
                            <div className="relative inline-block w-12 h-6 bg-gray-200 rounded-full cursor-pointer transition-colors duration-300 ease-in-out hover:bg-gray-300">
                              <input type="checkbox" id="marketingNotif" className="sr-only" defaultChecked={false} />
                              <span className="absolute left-1 top-1 bg-white h-4 w-4 rounded-full transition-transform duration-300 ease-in-out transform translate-x-0"></span>
                            </div>
                          </div>
                        </div>
                        </div>
                      
                      <div className="p-6">
                        <h3 className="text-lg font-medium text-red-600 mb-4">
                          {t('account.dangerZone') || 'منطقة الخطر'}
                        </h3>
                        
                        <button className="border border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                          {t('account.deleteAccount') || 'حذف الحساب'}
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 