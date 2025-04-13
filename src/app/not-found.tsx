"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslation } from '@/i18n';
import ErrorUI from '@/components/ErrorUI';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <ErrorUI 
      statusCode={404} 
      title={t('error.404.title')} 
      message={t('error.404.message')}
      suggestion={t('error.404.suggestion')}
      showHomeLink={true}
      showContinueShoppingLink={true}
    />
  );
} 