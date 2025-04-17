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
- Queue System для фонової обробки даних

## Структура проекту

```
adonis-project/
├── app/                           # Основний код додатку
│   ├── Controllers/               # Контролери для обробки запитів
│   │   └── Http/                  # HTTP контролери
│   │       └── TransactionsController.ts # Контролер для транзакцій
│   ├── Models/                    # Моделі даних
│   │   ├── BankAccount.ts         # Модель банківського рахунку
│   │   └── Transaction.ts         # Модель транзакції
│   └── Services/                  # Сервіси
│       ├── QueueService.ts        # Сервіс для керування чергами завдань
│       └── RedisService.ts        # Сервіс для роботи з Redis
├── config/                        # Конфігураційні файли
│   └── database.ts                # Налаштування бази даних
├── database/                      # Файли для роботи з базою даних
│   ├── migrations/                # Міграції бази даних
│   │   ├── 1_bank_accounts.ts     # Міграція для таблиці bank_accounts
│   │   └── 2_transactions.ts      # Міграція для таблиці transactions
│   └── seeders/                   # Сіди для наповнення бази даних
│       ├── BankAccountSeeder.ts   # Сід для створення банківського рахунку
│       └── TransactionSeeder.ts   # Сід для створення транзакцій
├── start/                         # Файли для запуску додатку
│   └── routes.ts                  # Налаштування маршрутів
├── .env                           # Файл з змінними середовища
├── .gitignore                     # Файл для ігнорування у Git
├── index.ts                       # Головний файл додатку
├── package.json                   # Залежності проекту
├── README.md                      # Документація проекту
└── tsconfig.json                  # Налаштування TypeScript
```

## Ключові можливості

- CRUD операції для транзакцій
- Автоматичний перерахунок балансу при зміні транзакцій
- Кешування проміжних результатів у Redis
- Фоновий перерахунок балансів через систему черг завдань

## API Ендпоінти

- `GET /transactions` — отримання списку транзакцій
- `GET /transactions/:id` — отримання конкретної транзакції (наприклад, GET /transactions/1)
- `PUT /transactions/:id` — оновлення транзакції за ID

## Кешування з використанням Redis (імітація)

* Під час оновлення транзакції зберігаємо баланс у кеш
* Використовуємо кеш для оптимізації перерахунку балансів

## Система черг завдань

* Фонове опрацювання перерахунку балансів
* Обмеження на кількість одночасно виконуваних завдань
* API для отримання статусу завдань:
     - GET /jobs — отримання списку всіх завдань
     - GET /jobs/:id — отримання статусу конкретного завдання (наприклад, GET /jobs/m9lem3u8xn3jk)

## Структура проєкту за MVC-патерном

- Моделі (спрощені)
- Контролери для обробки HTTP-запитів
- Сервіси для відділення бізнес-логіки

## Встановлення та запуск

1. Cклонуйте цей репозиторій: `git clone https://github.com/MaksymChukhrai/backend-test-task.git`
2. Налаштуйте середовище:
   Створіть файл `.env` та вкажіть необхідні дані для підключення до PostgreSQL та Redis:

       ```
       PORT=3333
       HOST=0.0.0.0
       NODE_ENV=development
       DB_CONNECTION=pg
       PG_HOST=localhost
       PG_PORT=5432
       PG_USER=postgres
       PG_PASSWORD=postgres
       PG_DB_NAME=adonis_bank
       REDIS_CONNECTION=local
       REDIS_HOST=127.0.0.1
       REDIS_PORT=6379
       REDIS_PASSWORD=null
       ```

3. Встановіть залежності: `npm install`
4. Запустіть міграції та заповнення даними:

   `npm run migrate`

   `npm run seed`


5. Запустіть сервер: `npm run dev`
6. Сервер буде доступний за адресою: `http://localhost:3333`

## Перевірка функціоналу

Для перевірки роботи API та системи черг виконайте наступні команди в окремому терміналі консолі:

**1. Отримання домашньої сторінки:**

`curl http://localhost:3333`  

*Очікуваний результат: {"message":"Welcome to Bank Transactions API"}*

**2. Отримання списку всіх транзакцій:**

`curl http://localhost:3333/transactions`

*Очікуваний результат: список із 10 тестових транзакцій*

**3. Отримання однієї транзакції:**

`curl http://localhost:3333/transactions/1`

*Очікуваний результат: дані про транзакцію з id=1*

**4. Оновлення транзакції:**

`curl -X PUT -H "Content-Type: application/json" -d '{"price":1500}' http://localhost:3333/transactions/1`

*Очікуваний результат: список усіх завдань у системі*

**6. Перевірка статусу конкретного завдання:**

`curl http://localhost:3333/jobs/JOBID` , де замість `JOBID` вставте ідентифікатор завдання з попередньої операції.

*Очікуваний результат: статус завдання має змінитися на "completed" і містити результат обчислення*

**7. Перевірка завершення фонового обчислення:**

Під час тестування спостерігайте за виведенням інформації в консолі сервера. Ви повинні бачити повідомлення про наступне:

    7.1. Початок обробки завдання

    7.2. Перерахунок балансів для наступних 5 транзакцій

    7.3. Оновлення балансів у Redis
    
    7.4. Успішне завершення завдання

Ця фонова обробка демонструє, як система може ефективно обробляти великі обсяги транзакцій без блокування основного потоку виконання.

**Автор: [Максим Чухрай](https://www.mchukhrai.com/)**