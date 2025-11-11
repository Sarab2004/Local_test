# HSE Action Tracker Lite

یک پروژه‌ی فول‌استک مینیمال برای مدیریت اقدامات HSE با احراز هویت JWT، بک‌اند Django و فرانت‌اند React + Vite.

## پیش‌نیازها
- Python 3.11+
- Node.js 18+
- Git

## راه‌اندازی سریع (۳ گام)
1. **Backend**
   ```bash
   cd backend
   ./setup_dev.sh
   ```
   این اسکریپت یک محیط مجازی می‌سازد، پکیج‌ها را نصب می‌کند، مهاجرت‌ها را اجرا می‌کند، داده‌ی نمونه را با کاربر `demo@example.com / demo1234` اضافه می‌کند و سرور را روی `http://localhost:8000` بالا می‌آورد.
2. **Frontend** (در ترمینال جدید)
   ```bash
   cd frontend
   cp .env.example .env
   npm install
   npm run dev
   ```
   سپس به `http://localhost:5173` مراجعه کنید.
3. **ورود**
   با کاربر نمونه `demo@example.com` و گذرواژه‌ی `demo1234` وارد شوید و اقدام‌ها را مدیریت کنید.

## URLهای مهم
- API: http://localhost:8000
- Frontend: http://localhost:5173
- Swagger UI: http://localhost:8000/api/docs/

## دستورات متداول
- ایجاد سوپرکاربر: `python manage.py createsuperuser`
- اجرای تست‌های بک‌اند: `python manage.py test`
- اجرای تست‌های فرانت‌اند: `npm run test`
- فرمت/لینت (دلخواه): می‌توانید از ابزار دلخواه خود استفاده کنید.

## ساختار پروژه
```
.
├── LICENSE
├── README.md
├── backend
│   ├── actions
│   │   ├── management
│   │   │   └── commands
│   │   │       └── seed_demo.py
│   │   ├── migrations
│   │   ├── tests
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── permissions.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── core
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── .env.example
│   ├── manage.py
│   ├── requirements.txt
│   └── setup_dev.sh
├── frontend
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.cjs
│   ├── public (در صورت نیاز ایجاد کنید)
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── pages
│   │   ├── routes
│   │   ├── lib
│   │   └── main.tsx و App.tsx
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   └── vitest.config.ts
└── .gitignore
```

## امکانات کلیدی
- احراز هویت JWT با SimpleJWT
- مدیریت اقدامات با فیلتر، جستجو، مرتب‌سازی و برچسب‌ها
- API مستند شده با drf-spectacular (Swagger)
- Seed داده‌ی نمونه با کاربر دمو
- فرانت‌اند واکنش‌گرا با React Query، Tailwind و چند کامپوننت سبک shadcn/ui
- تست واحد نمونه برای بک‌اند و فرانت‌اند

با اجرای مراحل بالا پروژه آماده‌ی توسعه و آزمایش است.
