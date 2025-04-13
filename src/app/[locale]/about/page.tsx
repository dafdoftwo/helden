"use client";

import React from 'react';
import Image from 'next/image';
import { useTranslation } from '@/i18n';
import { motion } from 'framer-motion';
import { Breadcrumb } from '@/components/Breadcrumb';
import { FiAward, FiStar, FiTrendingUp, FiHeart, FiMail, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

export default function AboutPage() {
  const { t } = useTranslation();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const values = [
    {
      icon: <FiAward className="text-helden-gold text-3xl" />,
      title: t('about.values.quality.title'),
      description: t('about.values.quality.description')
    },
    {
      icon: <FiStar className="text-helden-gold text-3xl" />,
      title: t('about.values.elegance.title'),
      description: t('about.values.elegance.description')
    },
    {
      icon: <FiTrendingUp className="text-helden-gold text-3xl" />,
      title: t('about.values.sustainability.title'),
      description: t('about.values.sustainability.description')
    },
    {
      icon: <FiHeart className="text-helden-gold text-3xl" />,
      title: t('about.values.passion.title'),
      description: t('about.values.passion.description')
    }
  ];

  const teamMembers = [
    {
      id: 'founder',
      image: '/images/team/founder.jpg',
      name: t('about.team.members.founder.name'),
      position: t('about.team.members.founder.position'),
      bio: t('about.team.members.founder.bio')
    },
    {
      id: 'operations',
      image: '/images/team/operations.jpg',
      name: t('about.team.members.operations.name'),
      position: t('about.team.members.operations.position'),
      bio: t('about.team.members.operations.bio')
    },
    {
      id: 'design',
      image: '/images/team/design.jpg',
      name: t('about.team.members.design.name'),
      position: t('about.team.members.design.position'),
      bio: t('about.team.members.design.bio')
    },
    {
      id: 'marketing',
      image: '/images/team/marketing.jpg',
      name: t('about.team.members.marketing.name'),
      position: t('about.team.members.marketing.position'),
      bio: t('about.team.members.marketing.bio')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-helden-purple-dark text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="/images/formal_dresses/Saudi_formal_dress_4.jpg" 
            alt="About HELDEN"
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <Breadcrumb 
            items={[
              { label: t('common.home'), href: '/' },
              { label: t('about.title'), href: '/about' }
            ]}
            className="mb-8 text-white/80"
          />
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('about.title')}
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
            {t('about.subtitle')}
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Story Section */}
        <div className="flex flex-col lg:flex-row gap-12 mb-24">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 text-helden-purple-dark">{t('about.heroTitle')}</h2>
            <div className="w-16 h-1 bg-helden-gold mb-8"></div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {t('about.heroContent')}
            </p>
          </motion.div>
          <motion.div 
            className="lg:w-1/2 relative h-80 lg:h-auto rounded-xl overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Image 
              src="/images/formal_dresses/Saudi_formal_dress_2.jpg" 
              alt="HELDEN Story"
              fill
              className="object-cover rounded-xl"
            />
          </motion.div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-helden-purple-lighter rounded-bl-full opacity-20"></div>
            <h3 className="text-2xl font-bold mb-4 text-helden-purple-dark">{t('about.missionTitle')}</h3>
            <div className="w-12 h-1 bg-helden-gold mb-6"></div>
            <p className="text-gray-700 relative z-10">
              {t('about.missionContent')}
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-helden-gold rounded-bl-full opacity-20"></div>
            <h3 className="text-2xl font-bold mb-4 text-helden-purple-dark">{t('about.visionTitle')}</h3>
            <div className="w-12 h-1 bg-helden-gold mb-6"></div>
            <p className="text-gray-700 relative z-10">
              {t('about.visionContent')}
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div 
          className="mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-helden-purple-dark">{t('about.values.title')}</h2>
          <div className="w-16 h-1 bg-helden-gold mx-auto mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center"
                variants={fadeIn}
              >
                <div className="p-4 bg-helden-purple-lighter rounded-full mb-5">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-helden-purple-dark">{value.title}</h3>
                <p className="text-gray-700">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div 
          className="mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          <h2 className="text-3xl font-bold mb-4 text-center text-helden-purple-dark">{t('about.team.title')}</h2>
          <p className="text-center text-gray-700 mb-8 max-w-2xl mx-auto">{t('about.team.subtitle')}</p>
          <div className="w-16 h-1 bg-helden-gold mx-auto mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <motion.div 
                key={member.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden group"
                variants={fadeIn}
              >
                <div className="relative h-80 w-full overflow-hidden">
                  <Image 
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 text-helden-purple-dark">{member.name}</h3>
                  <p className="text-helden-gold mb-3">{member.position}</p>
                  <p className="text-gray-700 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Join Us */}
        <motion.div 
          className="bg-helden-purple-dark text-white rounded-xl p-8 md:p-12 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 opacity-10">
            <Image 
              src="/images/casual_clothes/Saudi_casual_clothes_4.jpg" 
              alt="Join HELDEN"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('about.joinUs.title')}
            </h2>
            <motion.div 
              className="w-20 h-1 bg-helden-gold mx-auto mb-6"
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: 80 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            ></motion.div>
            <p className="text-lg mb-8 text-white/90">
              {t('about.joinUs.description')}
            </p>
            
            <div className="flex flex-col items-center">
              <div className="mb-8 flex items-center space-x-6">
                <a href="https://instagram.com/helden_sa" target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-helden-purple-dark rounded-full hover:bg-helden-gold hover:text-white transition-colors">
                  <FiInstagram size={24} />
                </a>
                <a href="https://twitter.com/helden_sa" target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-helden-purple-dark rounded-full hover:bg-helden-gold hover:text-white transition-colors">
                  <FiTwitter size={24} />
                </a>
                <a href="https://facebook.com/helden_sa" target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-helden-purple-dark rounded-full hover:bg-helden-gold hover:text-white transition-colors">
                  <FiFacebook size={24} />
                </a>
              </div>
              
              <div className="flex flex-col sm:flex-row w-full max-w-md">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="px-4 py-3 rounded-l-full w-full mb-3 sm:mb-0 text-gray-800 focus:outline-none focus:ring-2 focus:ring-helden-gold"
                />
                <button className="bg-helden-gold hover:bg-white hover:text-helden-purple-dark text-white transition-colors duration-300 py-3 px-6 rounded-r-full sm:rounded-l-none rounded-full sm:rounded-r-full font-medium flex items-center justify-center">
                  <FiMail className="mr-2" />
                  {t('about.joinUs.button')}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 