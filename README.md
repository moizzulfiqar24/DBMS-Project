# Ecommerce Store Project

## Overview

This project is an eCommerce website developed as part of the Database Management System (DBMS) course at Institute of Business Administration - IBA Karachi. The project utilizes the PERN stack, with React for the frontend, Node.js for the backend, and PostgreSQL for the database.

## Project Structure

The project is organized into three main folders:

1. **frontend**: Contains the React-based frontend of the eCommerce website.
2. **backend**: Houses the Node.js backend, which handles server-side logic and interactions with the database.
3. **DB DDL Commands**: Includes the database DDL (Data Definition Language) commands required to set up the PostgreSQL database.

## Prerequisites

Before running the project, ensure you have the following software installed on your machine:

- Node.js
- npm (Node Package Manager)
- PostgreSQL

## Setting Up the Database

1. Open a terminal and navigate to the **DB DDL Commands** folder.
2. Connect to your PostgreSQL server using the psql command-line tool.
3. Execute the DDL commands provided in the `database.sql` file to create the necessary tables and schema for the eCommerce store.

```bash
psql -U your_username -d your_database_name -a -f database.sql
```

Replace `your_username` and `your_database_name` with your PostgreSQL username and the desired database name.

## Configuring Backend

1. Navigate to the **backend** folder.
2. Open the `config/db.js` file in a text editor.
3. Update the database connection credentials according to your PostgreSQL setup.

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: 'your_postgres_username',
  host: 'localhost',
  database: 'your_database_name',
  password: 'your_password',
  port: 5432,
});

module.exports = pool;
```

Replace `your_postgres_username`, `your_database_name`, and `your_password` with your PostgreSQL username, database name, and password.

## Running the Project

### Backend

1. Open a terminal and navigate to the **backend** folder.
2. Install the required dependencies using the following command:

```bash
npm install
```

3. Start the backend server:

```bash
npm start
```

The backend server will run on `http://localhost:3000`.

### Frontend

1. Open a new terminal and navigate to the **frontend** folder.
2. Install the required dependencies:

```bash
npm install
```

3. Start the frontend development server:

```bash
npm start
```

The frontend development server will run on `http://localhost:3000`.

Visit `http://localhost:3000` in your web browser to access the eCommerce website.

## Troubleshooting

- If you encounter database connection issues, ensure that the PostgreSQL server is running, and the credentials in the `config/db.js` file are correctly configured.
- For any other issues, check the console logs in the terminal for error messages and consult the project documentation.

## Contributors

- Anfa Majid
- Moiz Zulfiqar
- Ammar Lokhandwala
