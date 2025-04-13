"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { useTranslation } from '../i18n';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    // Simulate form submission
    try {
      // In a real app, you would send this data to your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="w-5 h-5" />,
      title: "Visit Our Store",
      details: ["123 Fashion Street", "Riyadh, Saudi Arabia", "12345"]
    },
    {
      icon: <FaPhoneAlt className="w-5 h-5" />,
      title: "Call Us",
      details: ["+966 12 345 6789", "+966 98 765 4321"]
    },
    {
      icon: <FaEnvelope className="w-5 h-5" />,
      title: "Email Us",
      details: ["info@heldenstore.com", "support@heldenstore.com"]
    },
    {
      icon: <FaClock className="w-5 h-5" />,
      title: "Working Hours",
      details: ["Sunday - Thursday: 10AM - 9PM", "Friday - Saturday: 2PM - 10PM"]
    }
  ];

  return (
    <div className="bg-gradient-to-r from-helden-purple-dark/5 to-helden-purple/10 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-helden-purple-dark mb-4">Get In Touch</h2>
          <div className="w-24 h-1 bg-helden-gold mx-auto mb-4"></div>
          <p className="max-w-2xl mx-auto text-gray-600">
            We'd love to hear from you! Whether you have a question about our products, 
            orders, or anything else, our team is ready to answer your questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 h-full">
              <h3 className="text-xl font-bold text-helden-purple-dark mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-helden-purple/10 flex items-center justify-center text-helden-purple">
                      {item.icon}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-md font-medium text-gray-900">{item.title}</h4>
                      <div className="mt-1 text-sm text-gray-600">
                        {item.details.map((detail, i) => (
                          <p key={i}>{detail}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-md font-medium text-gray-900 mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  {[
                    { name: 'facebook', icon: <FaFacebook /> },
                    { name: 'instagram', icon: <FaInstagram /> },
                    { name: 'twitter', icon: <FaTwitter /> },
                    { name: 'linkedin', icon: <FaLinkedin /> }
                  ].map((social) => (
                    <a 
                      key={social.name}
                      href={`#${social.name}`} 
                      className="h-10 w-10 rounded-full bg-helden-purple/10 flex items-center justify-center text-helden-purple hover:bg-helden-purple hover:text-white transition-colors"
                      aria-label={`HELDEN on ${social.name}`}
                    >
                      <span className="sr-only">HELDEN on {social.name}</span>
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-md p-6 md:p-8"
            >
              <h3 className="text-xl font-bold text-helden-purple-dark mb-6">Send Us a Message</h3>
              
              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}
              
              {submitError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                  {submitError}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helden-purple focus:border-helden-purple transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helden-purple focus:border-helden-purple transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helden-purple focus:border-helden-purple transition-colors"
                      placeholder="+966 XX XXX XXXX"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helden-purple focus:border-helden-purple transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="Product Inquiry">Product Inquiry</option>
                      <option value="Order Status">Order Status</option>
                      <option value="Returns">Returns & Exchanges</option>
                      <option value="Shipping">Shipping & Delivery</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helden-purple focus:border-helden-purple transition-colors"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-3 bg-helden-purple text-white font-medium rounded-lg hover:bg-helden-purple-dark transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : 'Send Message'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 