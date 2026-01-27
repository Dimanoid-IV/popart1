# Настройка переменных окружения в Vercel

## Обязательные переменные для работы проекта

Добавьте следующие переменные окружения в Vercel Dashboard:

### 1. Resend (Email сервис)
```
RESEND_API_KEY=re_ваш_ключ_здесь
RESEND_FROM_EMAIL=orders@popart.ee
ADMIN_EMAIL=dmitri.ivkin@gmail.com
```

**Важно для продакшена:**
- `RESEND_FROM_EMAIL` должен использовать верифицированный домен (например, `orders@popart.ee`)
- Для этого нужно верифицировать домен `popart.ee` в Resend Dashboard: https://resend.com/domains
- После верификации домена можно отправлять письма на любые email адреса

### 2. Stripe (Платежи)
```
STRIPE_SECRET_KEY=sk_live_... (для продакшена)
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Примечание:** 
- Для тестирования используйте `sk_test_...`
- Для продакшена используйте `sk_live_...`
- `STRIPE_WEBHOOK_SECRET` получается при создании webhook endpoint в Stripe Dashboard

### 3. NanoBanana API (Генерация изображений)
```
NANOBANANA_API_KEY=ваш_ключ_здесь
```

### 4. ImgBB (Хостинг изображений, опционально)
```
IMGBB_API_KEY=ваш_ключ_здесь
```

## Как добавить переменные в Vercel:

1. Зайдите в Vercel Dashboard: https://vercel.com/dashboard
2. Выберите ваш проект `popart1` (или как он называется)
3. Перейдите в **Settings** → **Environment Variables**
4. Добавьте каждую переменную:
   - **Name**: название переменной (например, `RESEND_API_KEY`)
   - **Value**: значение переменной
   - **Environment**: выберите `Production`, `Preview`, и/или `Development` (рекомендуется выбрать все)
5. Нажмите **Save**
6. После добавления всех переменных, перезапустите деплоймент (Redeploy)

## Проверка после деплоя:

После деплоя проверьте, что переменные загружены:
- Откройте: `https://ваш-домен.vercel.app/api/test-email` (GET запрос)
- Должен вернуться JSON с информацией о конфигурации

## Важные замечания:

1. **Домен для Resend:** 
   - В тестовом режиме можно отправлять только на email, привязанный к аккаунту Resend
   - Для продакшена обязательно верифицируйте домен `popart.ee` в Resend
   - После верификации измените `RESEND_FROM_EMAIL` на `orders@popart.ee` или `system@popart.ee`

2. **Webhook URL в Stripe:**
   - После деплоя на Vercel, добавьте webhook endpoint в Stripe Dashboard:
   - URL: `https://ваш-домен.vercel.app/api/webhooks/stripe`
   - События: `checkout.session.completed`
   - Скопируйте `Signing secret` и добавьте как `STRIPE_WEBHOOK_SECRET`

3. **Безопасность:**
   - Никогда не коммитьте `.env.local` в git (он уже в .gitignore)
   - Все секретные ключи храните только в Vercel Environment Variables
