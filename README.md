# BudgetWise AI Driven Expense Tracker and Budget Advisor

BudgetWise is a full-stack personal finance management web application designed to help users manage their daily expenses, track transactions, set financial goals, and receive AI-powered financial advice.

The application provides a secure and user-friendly platform where users can monitor their financial activities in one place.

## Features

* Secure User Authentication using JWT
* User Registration & Login
* Email OTP Verification
* Add, Update & Delete Transactions
* Track Income & Expenses
* Financial Goal Management
* AI-Based Financial Advisor
* Responsive Dashboard UI
* Secure Backend APIs
* MySQL Database Integration

## Tech Stack

### Frontend

* React.js
* Vite
* Axios
* Context API
* CSS

### Backend

* Java
* Spring Boot
* Spring Security
* JWT Authentication
* Maven
* MySQL

### APIs & Services

* OpenRouter API
* Gmail SMTP Service

## Project Structure

```text id="j27x1m"
BudgetWise
├── frontend
│   ├── Components
│   ├── Pages
│   ├── Context
│   └── assets
│
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── model
│   ├── security
│   └── config
```

## How It Works

1. Users can register and verify their email using OTP.
2. After login, JWT authentication is used for secure access.
3. Users can manage transactions and track expenses.
4. Financial data is stored securely in MySQL database.
5. AI advisor provides financial suggestions using OpenRouter API.

## Installation & Setup

### Clone Repository

```bash id="wnvt06"
git clone https://github.com/Ketaki79/BudgetWise.git
```

## Frontend Setup

```bash id="w0p5r5"
cd frontend
npm install
npm run dev
```

## Backend Setup

```bash id="zkmh5e"
cd backend
mvn spring-boot:run
```

## Environment Variables

Configure the following environment variables before running the project:

```text id="lq4r88"
DB_URL
DB_USERNAME
DB_PASSWORD
MAIL_USERNAME
MAIL_PASSWORD
OPENROUTER_API_KEY
```


