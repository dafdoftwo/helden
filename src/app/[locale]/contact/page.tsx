"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/i18n';
import { motion } from 'framer-motion';
import { Breadcrumb } from '@/components/Breadcrumb';
import { FiMap, FiPhone, FiMail, FiClock, FiSend, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

export default function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setFormStatus('loading');
    
    try {
      // تمثيل لإرسال البيانات إلى API (في التطبيق الحقيقي سيكون هناك استدعاء API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // تنظيف النموذج بعد النجاح
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setFormStatus('success');
      
      // إعادة النموذج إلى الحالة الطبيعية بعد فترة
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');
      
      // إعادة النموذج إلى الحالة الطبيعية بعد فترة
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    }
  };

  const contactInfo = [
    {
      icon: <FiMap className="text-helden-gold text-2xl" />,
      title: t('contact.address.title'),
      content: t('contact.address.content')
    },
    {
      icon: <FiPhone className="text-helden-gold text-2xl" />,
      title: t('contact.phone.title'),
      content: '+966 53 123 4567'
    },
    {
      icon: <FiMail className="text-helden-gold text-2xl" />,
      title: t('contact.email.title'),
      content: 'info@helden.sa'
    },
    {
      icon: <FiClock className="text-helden-gold text-2xl" />,
      title: t('contact.hours.title'),
      content: t('contact.hours.content')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-helden-purple-dark text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="/images/casual_clothes/Saudi_casual_clothes_3.jpg"
            alt="Contact HELDEN"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <Breadcrumb 
            items={[
              { label: t('common.home'), href: '/' },
              { label: t('contact.title'), href: '/contact' }
            ]}
            className="mb-8 text-white/80"
          />
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('contact.title')}
          </motion.h1>
          <motion.div 
            className="w-20 h-1 bg-helden-gold mb-6"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 80 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          ></motion.div>
          <motion.p 
            className="text-xl max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {t('contact.heroSubtitle')}
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6 text-helden-purple-dark">
                {t('contact.getInTouch')}
              </h2>
              <div className="w-16 h-1 bg-helden-gold mb-8"></div>
              <p className="text-gray-700 mb-8">
                {t('contact.getInTouchText')}
              </p>

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="mr-4 p-3 bg-helden-purple-lighter rounded-full">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-helden-purple-dark">{item.title}</h3>
                      <p className="text-gray-600">{item.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-bold mb-4 text-helden-purple-dark">
                  {t('contact.followUs')}
                </h3>
                <div className="flex space-x-4">
                  <a href="https://instagram.com/helden_sa" target="_blank" rel="noopener noreferrer" className="p-3 bg-helden-purple text-white rounded-full hover:bg-helden-purple-dark transition-colors">
                    <FiInstagram size={24} />
                  </a>
                  <a href="https://twitter.com/helden_sa" target="_blank" rel="noopener noreferrer" className="p-3 bg-helden-purple text-white rounded-full hover:bg-helden-purple-dark transition-colors">
                    <FiTwitter size={24} />
                  </a>
                  <a href="https://facebook.com/helden_sa" target="_blank" rel="noopener noreferrer" className="p-3 bg-helden-purple text-white rounded-full hover:bg-helden-purple-dark transition-colors">
                    <FiFacebook size={24} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 md:p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 text-helden-purple-dark">
              {t('contact.sendMessage')}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.name')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-helden-purple focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.email')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-helden-purple focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.phone')}
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-helden-purple focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.subject')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-helden-purple focus:border-transparent"
                  >
                    <option value="">{t('contact.form.selectSubject')}</option>
                    <option value="order">{t('contact.form.subjects.order')}</option>
                    <option value="product">{t('contact.form.subjects.product')}</option>
                    <option value="shipping">{t('contact.form.subjects.shipping')}</option>
                    <option value="returns">{t('contact.form.subjects.returns')}</option>
                    <option value="other">{t('contact.form.subjects.other')}</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.message')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-helden-purple focus:border-transparent"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={formStatus === 'loading'}
                className="flex items-center justify-center w-full md:w-auto px-8 py-3 rounded-full bg-helden-purple hover:bg-helden-purple-dark text-white font-medium transition-colors duration-300"
              >
                {formStatus === 'loading' ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <FiSend className="mr-2" />
                )}
                {formStatus === 'loading' ? t('contact.form.sending') : t('contact.form.send')}
              </button>

              {formStatus === 'success' && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200 text-green-700">
                  {t('contact.form.successMessage')}
                </div>
              )}

              {formStatus === 'error' && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200 text-red-700">
                  {t('contact.form.errorMessage')}
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>

      <div className="h-96 relative mt-8">
        <Image 
          src="/images/map.jpg"
          alt="HELDEN Store Location"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white shadow-xl rounded-xl p-4 flex items-center">
            <div className="bg-helden-purple rounded-full p-3 mr-3">
              <FiMap className="text-white text-xl" />
            </div>
            <div>
              <p className="font-semibold text-helden-purple-dark">{t('contact.ourLocation')}</p>
              <p className="text-sm text-gray-600">Al Olaya, Riyadh, Saudi Arabia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 