"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/i18n';

interface SocialMediaProps {
  instagramPosts?: InstagramPost[];
  showInstagram?: boolean;
  showFollowLinks?: boolean;
  className?: string;
}

interface InstagramPost {
  id: string;
  imageUrl: string;
  link: string;
  caption?: string;
}

export default function SocialMedia({
  instagramPosts = [],
  showInstagram = true,
  showFollowLinks = true,
  className = ''
}: SocialMediaProps) {
  const { t, dir } = useTranslation();
  
  // If no Instagram posts provided, use placeholder data
  const posts = instagramPosts.length > 0 ? instagramPosts : [
    {
      id: '1',
      imageUrl: '/images/instagram/post1.jpg',
      link: 'https://instagram.com/heldenstore',
      caption: t('social.instagramCaption1')
    },
    {
      id: '2',
      imageUrl: '/images/instagram/post2.jpg',
      link: 'https://instagram.com/heldenstore',
      caption: t('social.instagramCaption2')
    },
    {
      id: '3',
      imageUrl: '/images/instagram/post3.jpg',
      link: 'https://instagram.com/heldenstore',
      caption: t('social.instagramCaption3')
    },
    {
      id: '4',
      imageUrl: '/images/instagram/post4.jpg',
      link: 'https://instagram.com/heldenstore',
      caption: t('social.instagramCaption4')
    }
  ];
  
  // Social media URLs
  const socialLinks = {
    instagram: 'https://instagram.com/heldenstore',
    snapchat: 'https://snapchat.com/add/heldenstore',
    tiktok: 'https://tiktok.com/@heldenstore',
    facebook: 'https://facebook.com/heldenstore',
    twitter: 'https://twitter.com/heldenstore'
  };
  
  const ShareButton: React.FC<{ platform: string; url: string; title?: string; className?: string }> = ({
    platform,
    url,
    title,
    className = ''
  }) => {
    const getShareUrl = () => {
      const shareUrl = encodeURIComponent(url);
      const shareTitle = encodeURIComponent(title || 'HELDEN Store');
      
      switch (platform.toLowerCase()) {
        case 'facebook':
          return `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
        case 'twitter':
          return `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`;
        case 'whatsapp':
          return `https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`;
        case 'telegram':
          return `https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`;
        case 'pinterest':
          return `https://pinterest.com/pin/create/button/?url=${shareUrl}&description=${shareTitle}`;
        default:
          return '#';
      }
    };
    
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      window.open(getShareUrl(), '_blank', 'width=600,height=400');
    };
    
    return (
      <a 
        href={getShareUrl()}
        onClick={handleClick}
        aria-label={`Share on ${platform}`}
        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:text-helden-purple transition-colors ${className}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {platform === 'facebook' && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
          </svg>
        )}
        {platform === 'twitter' && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        )}
        {platform === 'whatsapp' && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M17.415 14.382c-.298-.149-1.759-.867-2.031-.967-.272-.099-.47-.148-.67.15-.198.296-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.432.302 2.797.84 4.035l-1.898 5.57a1 1 0 001.202 1.202l5.571-1.898A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 2c4.418 0 8 3.582 8 8s-3.582 8-8 8c-1.266 0-2.464-.296-3.526-.813a1 1 0 00-.683-.13l-3.764 1.286 1.283-3.765a1 1 0 00-.129-.684A7.962 7.962 0 014 12c0-4.418 3.582-8 8-8z" clipRule="evenodd" />
          </svg>
        )}
        {platform === 'pinterest' && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
          </svg>
        )}
        {platform === 'telegram' && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
        )}
      </a>
    );
  };
  
  return (
    <div className={`py-12 ${className}`} dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        {showInstagram && (
          <>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                {t('social.instagramTitle')}
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                {t('social.instagramSubtitle')}
              </p>
            </div>
            
            {/* Instagram Feed */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-lg aspect-square"
                >
                  <Image
                    src={post.imageUrl}
                    alt={post.caption || 'Instagram post'}
                    width={500}
                    height={500}
                    className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                      <svg className="h-8 w-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
        
        {/* Social Follow Links */}
        {showFollowLinks && (
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {t('social.followUs')}
              </h3>
              <p className="mt-2 text-gray-600">
                {t('social.followUsText')}
              </p>
            </div>
            
            <div className="flex justify-center space-x-8">
              <a 
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center"
              >
                <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-yellow-300 via-red-500 to-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </div>
                <span className="mt-2 text-sm text-gray-600 group-hover:text-helden-purple">Instagram</span>
              </a>
              
              <a 
                href={socialLinks.snapchat}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center"
              >
                <div className="h-12 w-12 rounded-full bg-yellow-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.206 1c2.286.016 4.467.89 6.105 2.407 1.676 1.55 2.73 3.537 2.902 5.896.11 1.483.08 2.972.242 4.453.055.51.175 1.013.372 1.489.413.999 1.09 1.695 2.053 2.132.23.104.469.189.707.282.28.11.35.241.177.463-.196.253-.445.444-.713.601-.713.42-1.465.674-2.272.607-.816-.068-1.585-.334-2.252-.809-.234-.168-.463-.178-.713-.041-.76.418-1.565.709-2.412.887-.922.193-1.857.23-2.798.124-.896-.1-1.766-.314-2.59-.685-.257-.116-.488-.103-.732.056-.698.455-1.462.724-2.27.796-1.02.091-1.981-.174-2.879-.712-.213-.128-.236-.232-.09-.405a6.258 6.258 0 001.077-.795c.474-.474.78-1.026.92-1.658.07-.318.124-.64.17-.963.033-.236-.02-.446-.15-.654-.534-.85-.79-1.796-.764-2.8.015-.597-.001-1.197.05-1.79.226-2.62 1.339-4.748 3.4-6.361C8.05 1.825 10.015 1.043 12.206 1z" />
                  </svg>
                </div>
                <span className="mt-2 text-sm text-gray-600 group-hover:text-helden-purple">Snapchat</span>
              </a>
              
              <a 
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center"
              >
                <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </div>
                <span className="mt-2 text-sm text-gray-600 group-hover:text-helden-purple">TikTok</span>
              </a>
            </div>
            
            {/* Share Section */}
            <div className="mt-10 text-center">
              <h3 className="text-lg font-medium text-gray-900">
                {t('social.shareTitle')}
              </h3>
              
              <div className="flex justify-center mt-4 space-x-2">
                <ShareButton
                  platform="facebook"
                  url="https://heldenstore.com"
                  title="HELDEN Store - Women's Fashion in Saudi Arabia"
                  className="bg-gray-100 hover:bg-gray-200"
                />
                <ShareButton
                  platform="twitter"
                  url="https://heldenstore.com"
                  title="HELDEN Store - Women's Fashion in Saudi Arabia"
                  className="bg-gray-100 hover:bg-gray-200"
                />
                <ShareButton
                  platform="whatsapp"
                  url="https://heldenstore.com"
                  title="HELDEN Store - Women's Fashion in Saudi Arabia"
                  className="bg-gray-100 hover:bg-gray-200"
                />
                <ShareButton
                  platform="telegram"
                  url="https://heldenstore.com"
                  title="HELDEN Store - Women's Fashion in Saudi Arabia"
                  className="bg-gray-100 hover:bg-gray-200"
                />
                <ShareButton
                  platform="pinterest"
                  url="https://heldenstore.com"
                  title="HELDEN Store - Women's Fashion in Saudi Arabia"
                  className="bg-gray-100 hover:bg-gray-200"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Product sharing component
export function ShareProduct({ product, className = '' }: { product: any, className?: string }) {
  const { t } = useTranslation();
  
  const productUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/product/${product.id}` 
    : `https://heldenstore.com/product/${product.id}`;
  
  return (
    <div className={`${className}`}>
      <h3 className="text-sm font-medium text-gray-900 mb-2">
        {t('social.shareProduct')}
      </h3>
      <div className="flex space-x-2">
        <ShareButton
          platform="facebook"
          url={productUrl}
          title={product.name}
        />
        <ShareButton
          platform="twitter"
          url={productUrl}
          title={product.name}
        />
        <ShareButton
          platform="whatsapp"
          url={productUrl}
          title={product.name}
        />
        <ShareButton
          platform="pinterest"
          url={productUrl}
          title={product.name}
        />
      </div>
    </div>
  );
} 