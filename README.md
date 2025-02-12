# Zanyi App

A simple to-do list web application built with Node.js, Express, EJS, and PostgreSQL.

## Features
- Add, edit, and delete tasks.
- Uses PostgreSQL for data persistence.
- Deployed on Render.

## Installation

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### Clone the Repository
```bash
git clone https://github.com/yourusername/zanyi.git
cd zanyi
```

### Install Dependencies
```bash
npm install
```

### Setup Environment Variables
Create a `.env` file in the root directory and add:
```env
DATABASE_URL=postgresql://user:password@host:port/database
```
Replace `user`, `password`, `host`, `port`, and `database` with your PostgreSQL details.

### Initialize Database
Connect to your PostgreSQL database and run:
```sql
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL
);
```

### Run the App Locally
```bash
npm start
```
Then open `http://localhost:3000` in your browser.

## Deployment

### Deploy to Render
1. Push your code to GitHub.
2. Create a **Web Service** on Render and connect your repository.
3. Set the `DATABASE_URL` in **Environment Variables**.
4. Deploy and access your app via `https://your-app-name.onrender.com`.

## .gitignore
Ensure your `.gitignore` includes:
```
node_modules/
.env
.DS_Store
```
