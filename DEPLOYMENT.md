# Развёртывание на Vercel

## 1. Создать репозиторий на GitHub
1. Перейти на https://github.com/new
2. Название: `chatbot-ui-simple`
3. Создать репозиторий

## 2. Загрузить код
```bash
cd /Users/abramous/Desktop/chatbot-ui-custom
git init
git add .
git commit -m "Упрощённый Chatbot UI - только чат"
git branch -M main
git remote add origin https://github.com/ТВОЙ_USERNAME/chatbot-ui-simple.git
git push -u origin main
```

## 3. Развернуть на Vercel
1. Открыть https://vercel.com
2. New Project → Import репозиторий `chatbot-ui-simple`
3. Добавить Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = (твой Supabase URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (твой anon key)
   - `SUPABASE_SERVICE_ROLE_KEY` = (твой service role key)
   - `OPENROUTER_API_KEY` = (твой OpenRouter ключ)
4. Deploy!

## 4. База данных уже настроена
Все таблицы уже есть в Supabase (profiles, workspaces, chats, collections и т.д.)

✅ Готово! Чистый чат без лишних разделов!
