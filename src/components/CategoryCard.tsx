"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryCardProps {
  title: string;
  image: string;
  href: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, image, href }) => {
  return (
    <Link href={href} className="block group">
      <div className="relative h-80 overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300 group-hover:translate-y-[-10px]">
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <div className="w-10 h-1 bg-helden-gold rounded group-hover:w-20 transition-all duration-300"></div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard; 