# API Банківських Транзакцій

API для роботи з банківськими транзакціями, створене в рамках тестового завдання.

## Функціональність

- Зберігання та керування банківськими транзакціями
- Автоматичний перерахунок балансу при зміні транзакцій
- Кешування для оптимізації продуктивності

## Технічний стек

- Node.js / TypeScript
- PostgreSQL (модель даних)
- Redis (для кешування)

## API Ендпоінти

- GET /transactions — отримання списку транзакцій
- PUT /transactions/:id — оновлення транзакції за ID

## Встановлення та запуск

1. Cклонуйте цей репозиторій: `git clone https://github.com/MaksymChukhrai/backend-test-task.git`
2. Встановіть залежності: `npm install`
3. Запустіть сервер: `npm run dev`
4. Сервер буде доступний за адресою: `http://localhost:3333`
