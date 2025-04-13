"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/i18n';
import { supabase } from '@/lib/supabase';

interface NewsletterPageProps {
  params: {
    locale: string;
  };
}

export default function NewsletterPage({ params }: NewsletterPageProps) {
  const { t, dir } = useTranslation();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subscribeToOffers, setSubscribeToOffers] = useState(true);
  const [subscribeToNewArrivals, setSubscribeToNewArrivals] = useState(true);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset messages
    setSuccessMessage(null);
    setErrorMessage(null);
    
    // Basic email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMessage(t('newsletter.invalidEmail'));
      return;
    }
    
    try {
      setLoading(true);
      
      // Check if email already exists
      const { data: existingSubscriber, error: checkError } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('email', email)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingSubscriber) {
        // Update existing subscription
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({
            name,
            subscribe_to_offers: subscribeToOffers,
            subscribe_to_new_arrivals: subscribeToNewArrivals,
            updated_at: new Date().toISOString()
          })
          .eq('email', email);
        
        if (updateError) throw updateError;
        
        setSuccessMessage(t('newsletter.updateSuccess'));
      } else {
        // Create new subscription
        const { error: insertError } = await supabase
          .from('newsletter_subscribers')
          .insert({
            email,
            name,
            subscribe_to_offers: subscribeToOffers,
            subscribe_to_new_arrivals: subscribeToNewArrivals,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (insertError) throw insertError;
        
        setSuccessMessage(t('newsletter.subscribeSuccess'));
      }
      
      // Clear form on success
      if (!existingSubscriber) {
        setEmail('');
        setName('');
      }
      
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      setErrorMessage(error.message || t('newsletter.error'));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-12" dir={dir}>
      <div className="max-w-md mx-auto bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <Link href={`/${params.locale}`} className="inline-block">
              <div className="h-10 w-10 rounded-md bg-helden-purple flex items-center justify-center">
                <span className="text-white font-bold">H</span>
              </div>
            </Link>
            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              {t('newsletter.title')}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {t('newsletter.description')}
            </p>
          </div>
          
          {successMessage && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ms-3">
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              </div>
            </div>
          )}
          
          {errorMessage && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ms-3">
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('newsletter.emailLabel')} *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-helden-purple focus:border-helden-purple sm:text-sm"
                placeholder={t('newsletter.emailPlaceholder')}
              />
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                {t('newsletter.nameLabel')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-helden-purple focus:border-helden-purple sm:text-sm"
                placeholder={t('newsletter.namePlaceholder')}
              />
            </div>
            
            <div className="space-y-3">
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="offers"
                    name="offers"
                    type="checkbox"
                    checked={subscribeToOffers}
                    onChange={(e) => setSubscribeToOffers(e.target.checked)}
                    className="focus:ring-helden-purple h-4 w-4 text-helden-purple border-gray-300 rounded"
                  />
                </div>
                <div className="ms-3 text-sm">
                  <label htmlFor="offers" className="font-medium text-gray-700">
                    {t('newsletter.offersLabel')}
                  </label>
                  <p className="text-gray-500">{t('newsletter.offersDescription')}</p>
                </div>
              </div>
              
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="new-arrivals"
                    name="new-arrivals"
                    type="checkbox"
                    checked={subscribeToNewArrivals}
                    onChange={(e) => setSubscribeToNewArrivals(e.target.checked)}
                    className="focus:ring-helden-purple h-4 w-4 text-helden-purple border-gray-300 rounded"
                  />
                </div>
                <div className="ms-3 text-sm">
                  <label htmlFor="new-arrivals" className="font-medium text-gray-700">
                    {t('newsletter.newArrivalsLabel')}
                  </label>
                  <p className="text-gray-500">{t('newsletter.newArrivalsDescription')}</p>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              {t('newsletter.privacyNotice')}
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-helden-purple hover:bg-helden-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-helden-purple disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ms-1 me-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('newsletter.subscribing')}
                  </>
                ) : (
                  t('newsletter.subscribe')
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <Link
              href={`/${params.locale}`}
              className="text-sm font-medium text-helden-purple hover:text-helden-purple-dark"
            >
              {t('newsletter.backToStore')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 