#!/bin/bash
set -e

echo "=== تحديث المشروع وتحسين الأداء ==="
# تثبيت الاعتمادات المطلوبة
npm ci --production

# نقل ملفات البيئة
echo "تكوين بيئة النشر..."
cp .env.production .env.local

# بناء المشروع
echo "بناء المشروع..."
npm run build
# بفضل إعدادات next.config.js سيتم إنشاء مجلد out تلقائياً

# نشر القواعد أولاً
echo "نشر قواعد Firestore وStorage..."
firebase deploy --only firestore,storage

# نشر الموقع
echo "نشر الموقع..."
firebase deploy --only hosting:production

# حالة النشر
echo "===== تم النشر بنجاح! ====="
echo "موقعك متاح على:"
echo "الرابط الرئيسي: https://helden-ef55f.web.app"
echo "الرابط الثاني: https://helden-store.web.app"
echo "==========================" 