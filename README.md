# Store Rating Application

A full-stack web application allowing users to register, browse stores, and submit ratings. Built with role-based access control (RBAC) supporting System Administrators, Store Owners, and Normal Users.

## How It Works

The application operates on a role-based structure designed around three types of users:

1. **System Administrators:**
   - Act as top-level managers with system-wide oversight.
   - Access a dashboard showing overall metrics, including total users, stores, and ratings submitted.
   - Have exclusive permission to create Store Owner accounts and register new stores assigned to those owners.

2. **Normal Users:**
   - Can register for an account and log in to browse available stores.
   - Search and filter stores by name or address, and sort results by name, address, or average rating.
   - Submit a rating from 1 to 5 stars for any store, or update their existing rating at any time.

3. **Store Owners:**
   - Access a dedicated dashboard for their assigned store.
   - Monitor their store's average rating in real time.
   - View customer feedback, including reviewer names, email addresses, and ratings received.

## Tech Stack

- **Frontend:** React.js (Vite), React Router, Bootstrap, Axios
- **Backend:** Node.js, Express.js, JSON Web Tokens (JWT), bcrypt
- **Database:** PostgreSQL with raw SQL queries

## Prerequisites

Before getting started, make sure you have the following installed:
- Node.js (version 16 or higher)
- PostgreSQL (version 13 or higher)

## Installation and Setup

### 1. Database Configuration
1. Open your PostgreSQL terminal (or a database client like pgAdmin or DBeaver).
2. Run the queries in the `database.sql` file located in the root of this project.
   This creates the database, custom role types, and the required tables with constraints.

### 2. Environment Variables
1. Navigate to the `store-rating-backend` folder.
2. Create a `.env` file based on `.env.example`.
3. Update the values with your local PostgreSQL credentials:

```env
PORT=5000
DB_USER=your_postgres_username
DB_HOST=localhost
DB_NAME=store_ratings_db
DB_PASSWORD=your_postgres_password
DB_PORT=5432
JWT_SECRET=your_super_secret_jwt_key
```

### 3. Install Dependencies
Install the required packages for both the backend and frontend.

```bash
# Install backend dependencies
cd store-rating-backend
npm install

# Install frontend dependencies
cd ../store-rating-frontend
npm install
```

### 4. Seed the Administrator Account
Since only an administrator can create other Admin and Store Owner accounts, run the seed script to create the initial System Administrator:

```bash
cd store-rating-backend
node scripts/seedAdmin.js
```

## Running the Application

Start both the backend and frontend servers in separate terminals.

**Terminal 1 (Backend):**
```bash
cd store-rating-backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd store-rating-frontend
npm run dev
```

Once running, open your browser and navigate to `http://localhost:5173`.

## Test Credentials

You can use these credentials to test the different role-based views without needing to register first:

| Role | Email | Password | Notes |
| --- | --- | --- | --- |
| System Admin | admin.system@example.com | AdminPassword123! | Full administrative access |
| Normal User | - | - | Create via the `/signup` page |
| Store Owner | - | - | Create through the Admin Dashboard |

## Core Features

- **Role-Based Access:** Dedicated routes and views for Admin, Store Owner, and Normal User accounts.
- **Input Validation:** Client-side checks alongside backend validation for string lengths, email format, and password requirements (8-16 characters, uppercase, and special character).
- **SQL Queries:** PostgreSQL queries using `COALESCE`, `JOIN`, and dynamic sorting logic handled at the database level.
- **Authentication and Security:** Passwords hashed with bcrypt and API endpoints secured using JWT middleware.