"use client";

import React from 'react';
import ErrorUI from '@/components/ErrorUI';

export default function ServerErrorPage() {
  return <ErrorUI statusCode={500} />;
} 