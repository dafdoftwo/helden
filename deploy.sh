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

# نشر على Vercel
echo "نشر على Vercel..."
if [ -x "$(command -v vercel)" ]; then
  vercel --prod
else
  echo "أداة Vercel CLI غير مثبتة. لتثبيتها قم بتنفيذ: npm i -g vercel"
  echo "ثم قم بتسجيل الدخول باستخدام: vercel login"
  echo "ويمكنك النشر يدويًا باستخدام: vercel --prod"
fi

# حالة النشر
echo "===== تم بناء المشروع بنجاح! ====="
echo "لنشر موقعك على Vercel:"
echo "1. قم بزيارة https://vercel.com/import"
echo "2. اختر مستودع GitHub الخاص بك"
echo "3. تأكد من إعداد المتغيرات البيئية"
echo "أو استخدم Vercel CLI كما هو موضح أعلاه"
echo "==========================" 