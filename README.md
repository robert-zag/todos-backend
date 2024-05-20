# Todo List Sharing Platform API

## Overview

This repository contains the backend API for a todo list sharing platform

## Setup

### Installation

1. **Install dependencies**:

    ```
    npm install
    ```

2. **Start the test database**:
    ```
    docker-compose up database
    ```

### Configuration

Create a `.env` file in the root directory and populate it with the following environment variables:

```plaintext
DATABASE_URL="postgresql://postgres:root@localhost:5432/todos?schema=public"
JWT_SECRET="<your_random_secret_here>"
```

-   **Generate a secret for JWT**: Use OpenSSL or any similar tool to generate a secure secret:
    ```
    openssl rand -hex 32
    ```

### Database Migration

Once the environment variables are set and the database is running, apply the migrations:

```
npm run migrate
```

### Running the API

Start the API server with:

```
npm run start
```

## API Documentation

Access the API documentation by navigating to:
[http://localhost:8000/api-docs](http://localhost:8000/api-docs)

This will provide you with all the necessary details to interact with the API endpoints.
