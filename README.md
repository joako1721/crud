# CRUD App with Node.js, Express, TypeORM, MySQL, and Vue.js

This is a simple CRUD (Create, Read, Update, Delete) application built using Node.js, Express, TypeORM, MySQL, and Vue.js.

## Prerequisites

Before running the application, make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)

## Getting Started

### Clone with https
```bash
git clone https://github.com/joako1721/crud.git
cd crud
```

### Clone with ssh
```bash
git clone git@github.com:joako1721/crud.git
cd crud
```

## Run the app

### Run with docker-composea (recommended)
```bash
docker-compose up --build
```

### Run standalone

#### backend 
```bash
# for backend make sure to have node.js^16.6.0 or higher
cd backend && npm install
# modify .env as needed if not exist copy the .env.example file and rename it to .env

# run the backend
npm run start
```

#### frontend

```bash
# for frontend make sure to have node.js^22.6.0 or higher
cd frontend && npm install

#if needed modify src/services/BaseService.ts with the correct API_URL 

# run the frontend
npm run dev
```

#### database
```bash
# make sure to have mysql^8.0.26 or higher running
# configurate backend/.env with the correct database credentials
```
