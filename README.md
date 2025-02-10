# Scotties-E-Commerce-fullstack-project

# Technology

Frontend: Next.js, React.js, Zustand, TailwindCSS, Axios, Chart.js

Backend: Express.js, Prisma ORM, SQLite

Authentication: JWT, bcrypt

Third-party API: News API, Nodemailer, Stripe

# Installation

## 1. Clone the repository

Clone the repository and navigate into the project folder:

```bash
git clone https://github.com/tamatamagot01/fullstack-project.git
cd fullstack-project
```

## 2. Set up the backend environment

Navigate to the backend folder:

```bash
cd backend-final-project
```

Install the required dependencies:

```bash
npm install
```

Generate Prisma client:

```bash
npx prisma generate
```

Start the backend development server:

```bash
npm run dev
```

## 3. Set up the frontend environment

Navigate to the frontend folder:

```bash
cd frontend-final-project
```

Install the required dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

## 4. Set up environment variables

Important: You need to create a .env file in the backend folder and .env.local file in the frontend folder to set your environment variables.

Backend .env example:

```bash
DATABASE_URL=database-url
JWT_SECRET_KEY =jwt-secret-key
STRIPE_SECRET_KEY = stripe-secret-key
PW=stripe-password
```

Frontend .env.local example:

```bash
NEXT_PUBLIC_NEWS_API_KEY = news-api-key
```
