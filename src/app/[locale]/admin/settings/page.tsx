"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Save, 
  Users, 
  Globe, 
  Bell, 
  Mail, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface SettingsPageProps {
  params: {
    locale: string;
  };
}

interface StoreSetting {
  id: string;
  key: string;
  value: string;
  description: string;
  category: string;
}

export default function SettingsPage({ params: { locale } }: SettingsPageProps) {
  const t = useTranslations('Admin');
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Settings state
  const [storeSettings, setStoreSettings] = useState<StoreSetting[]>([]);
  
  // User roles state
  const [userRoles, setUserRoles] = useState<{
    id: string;
    email: string;
    role: string;
    full_name: string;
  }[]>([]);
  
  useEffect(() => {
    const checkAdminAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push(`/${locale}/auth/login?redirect=/admin/settings`);
        return;
      }
      
      // Check for admin role
      const { data: userData, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
        
      if (error || !userData || userData.role !== 'admin') {
        // Not an admin, redirect to home
        router.push(`/${locale}`);
        return;
      }
      
      fetchSettings();
      if (activeTab === 'users') {
        fetchUserRoles();
      }
    };
    
    checkAdminAuth();
  }, [locale, router, activeTab]);
  
  const fetchSettings = async () => {
    setLoading(true);
    try {
      // In a real app, you'd fetch from a settings table in your database
      // For now, we'll use mock data
      const mockSettings: StoreSetting[] = [
        {
          id: '1',
          key: 'store_name',
          value: 'HELDEN Store',
          description: 'Name of the store',
          category: 'general'
        },
        {
          id: '2',
          key: 'store_email',
          value: 'info@heldenstore.sa',
          description: 'Primary email for store communications',
          category: 'general'
        },
        {
          id: '3',
          key: 'store_phone',
          value: '+966 12 345 6789',
          description: 'Customer service phone number',
          category: 'general'
        },
        {
          id: '4',
          key: 'currency',
          value: 'SAR',
          description: 'Store currency',
          category: 'general'
        },
        {
          id: '5',
          key: 'default_language',
          value: 'ar',
          description: 'Default language for the store',
          category: 'localization'
        },
        {
          id: '6',
          key: 'tax_rate',
          value: '15',
          description: 'Tax rate percentage',
          category: 'payment'
        },
        {
          id: '7',
          key: 'enable_apple_pay',
          value: 'true',
          description: 'Enable Apple Pay payments',
          category: 'payment'
        },
        {
          id: '8',
          key: 'enable_mada',
          value: 'true',
          description: 'Enable Mada payments',
          category: 'payment'
        },
        {
          id: '9',
          key: 'enable_email_notifications',
          value: 'true',
          description: 'Send email notifications for new orders',
          category: 'notifications'
        },
        {
          id: '10',
          key: 'low_stock_threshold',
          value: '5',
          description: 'Threshold for low stock alerts',
          category: 'inventory'
        }
      ];
      
      setStoreSettings(mockSettings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setErrorMessage(t('settings_fetch_error'));
    } finally {
      setLoading(false);
    }
  };
  
  const fetchUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, role, full_name')
        .order('full_name');
        
      if (error) throw error;
      
      setUserRoles(data || []);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setErrorMessage(t('user_roles_fetch_error'));
    }
  };
  
  const handleSettingChange = (id: string, value: string) => {
    setStoreSettings(prevSettings => 
      prevSettings.map(setting => 
        setting.id === id ? { ...setting, value } : setting
      )
    );
  };
  
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
        
      if (error) throw error;
      
      // Update local state
      setUserRoles(prevRoles => 
        prevRoles.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      
      setSuccessMessage(t('role_updated_success'));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating user role:', error);
      setErrorMessage(t('role_update_error'));
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };
  
  const saveSettings = async () => {
    try {
      setSaving(true);
      
      // In a real app, you'd save to your database
      // For demo, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage(t('settings_saved_success'));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setErrorMessage(t('settings_save_error'));
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-helden-purple"></div>
      </div>
    );
  }
  
  const getSettingsByCategory = (category: string) => {
    return storeSettings.filter(setting => setting.category === category);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t('settings')}</h1>
        
        <button
          onClick={saveSettings}
          disabled={saving}
          className={`px-4 py-2 rounded-md flex items-center ${
            saving 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-helden-purple text-white hover:bg-purple-700'
          }`}
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? t('saving') : t('save_changes')}
        </button>
      </div>
      
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {errorMessage}
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`px-6 py-3 flex items-center ${
              activeTab === 'general' 
                ? 'border-b-2 border-helden-purple text-helden-purple' 
                : 'text-gray-600 hover:text-helden-purple'
            }`}
            onClick={() => setActiveTab('general')}
          >
            <Globe className="mr-2 h-4 w-4" />
            {t('general_settings')}
          </button>
          
          <button
            className={`px-6 py-3 flex items-center ${
              activeTab === 'localization' 
                ? 'border-b-2 border-helden-purple text-helden-purple' 
                : 'text-gray-600 hover:text-helden-purple'
            }`}
            onClick={() => setActiveTab('localization')}
          >
            <Globe className="mr-2 h-4 w-4" />
            {t('localization')}
          </button>
          
          <button
            className={`px-6 py-3 flex items-center ${
              activeTab === 'payment' 
                ? 'border-b-2 border-helden-purple text-helden-purple' 
                : 'text-gray-600 hover:text-helden-purple'
            }`}
            onClick={() => setActiveTab('payment')}
          >
            <Mail className="mr-2 h-4 w-4" />
            {t('payment_settings')}
          </button>
          
          <button
            className={`px-6 py-3 flex items-center ${
              activeTab === 'notifications' 
                ? 'border-b-2 border-helden-purple text-helden-purple' 
                : 'text-gray-600 hover:text-helden-purple'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell className="mr-2 h-4 w-4" />
            {t('notifications')}
          </button>
          
          <button
            className={`px-6 py-3 flex items-center ${
              activeTab === 'users' 
                ? 'border-b-2 border-helden-purple text-helden-purple' 
                : 'text-gray-600 hover:text-helden-purple'
            }`}
            onClick={() => setActiveTab('users')}
          >
            <Users className="mr-2 h-4 w-4" />
            {t('user_management')}
          </button>
          
          <button
            className={`px-6 py-3 flex items-center ${
              activeTab === 'security' 
                ? 'border-b-2 border-helden-purple text-helden-purple' 
                : 'text-gray-600 hover:text-helden-purple'
            }`}
            onClick={() => setActiveTab('security')}
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            {t('security')}
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium">{t('general_settings')}</h2>
              
              {getSettingsByCategory('general').map(setting => (
                <div key={setting.id} className="grid grid-cols-3 gap-4 items-center">
                  <div>
                    <label htmlFor={setting.key} className="block text-sm font-medium text-gray-700">
                      {t(setting.key) || setting.key}
                    </label>
                    <p className="text-xs text-gray-500">{t(`${setting.key}_desc`) || setting.description}</p>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      id={setting.key}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={setting.value}
                      onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'localization' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium">{t('localization')}</h2>
              
              {getSettingsByCategory('localization').map(setting => (
                <div key={setting.id} className="grid grid-cols-3 gap-4 items-center">
                  <div>
                    <label htmlFor={setting.key} className="block text-sm font-medium text-gray-700">
                      {t(setting.key) || setting.key}
                    </label>
                    <p className="text-xs text-gray-500">{t(`${setting.key}_desc`) || setting.description}</p>
                  </div>
                  <div className="col-span-2">
                    {setting.key === 'default_language' ? (
                      <select
                        id={setting.key}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={setting.value}
                        onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                      >
                        <option value="ar">العربية</option>
                        <option value="en">English</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        id={setting.key}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={setting.value}
                        onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium">{t('payment_settings')}</h2>
              
              {getSettingsByCategory('payment').map(setting => (
                <div key={setting.id} className="grid grid-cols-3 gap-4 items-center">
                  <div>
                    <label htmlFor={setting.key} className="block text-sm font-medium text-gray-700">
                      {t(setting.key) || setting.key}
                    </label>
                    <p className="text-xs text-gray-500">{t(`${setting.key}_desc`) || setting.description}</p>
                  </div>
                  <div className="col-span-2">
                    {setting.key.startsWith('enable_') ? (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={setting.key}
                          className="h-4 w-4 text-helden-purple focus:ring-helden-purple border-gray-300 rounded"
                          checked={setting.value === 'true'}
                          onChange={(e) => handleSettingChange(setting.id, e.target.checked ? 'true' : 'false')}
                        />
                        <label htmlFor={setting.key} className="ml-2 block text-sm text-gray-900">
                          {setting.value === 'true' ? t('enabled') : t('disabled')}
                        </label>
                      </div>
                    ) : (
                      <input
                        type="text"
                        id={setting.key}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={setting.value}
                        onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium">{t('notifications')}</h2>
              
              {getSettingsByCategory('notifications').map(setting => (
                <div key={setting.id} className="grid grid-cols-3 gap-4 items-center">
                  <div>
                    <label htmlFor={setting.key} className="block text-sm font-medium text-gray-700">
                      {t(setting.key) || setting.key}
                    </label>
                    <p className="text-xs text-gray-500">{t(`${setting.key}_desc`) || setting.description}</p>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={setting.key}
                        className="h-4 w-4 text-helden-purple focus:ring-helden-purple border-gray-300 rounded"
                        checked={setting.value === 'true'}
                        onChange={(e) => handleSettingChange(setting.id, e.target.checked ? 'true' : 'false')}
                      />
                      <label htmlFor={setting.key} className="ml-2 block text-sm text-gray-900">
                        {setting.value === 'true' ? t('enabled') : t('disabled')}
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'users' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium">{t('user_management')}</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('name')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('email')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('role')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userRoles.map(user => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.full_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1"
                          >
                            <option value="customer">{t('role_customer')}</option>
                            <option value="admin">{t('role_admin')}</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button 
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => {/* View user details */}}
                          >
                            {t('view_details')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium">{t('security')}</h2>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      {t('security_notice')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('two_factor_auth')}
                    </label>
                    <p className="text-xs text-gray-500">{t('two_factor_auth_desc')}</p>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="two_factor_auth"
                        className="h-4 w-4 text-helden-purple focus:ring-helden-purple border-gray-300 rounded"
                      />
                      <label htmlFor="two_factor_auth" className="ml-2 block text-sm text-gray-900">
                        {t('enabled')}
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('session_timeout')}
                    </label>
                    <p className="text-xs text-gray-500">{t('session_timeout_desc')}</p>
                  </div>
                  <div className="col-span-2">
                    <select className="border border-gray-300 rounded-md px-3 py-2">
                      <option value="30">{t('30_minutes')}</option>
                      <option value="60">{t('1_hour')}</option>
                      <option value="120">{t('2_hours')}</option>
                      <option value="1440">{t('24_hours')}</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <button 
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  {t('reset_admin_password')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 