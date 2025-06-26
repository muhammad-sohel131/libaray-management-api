# Library Management API
A Node.js RESTful API built with Express, Mongoose, and TypeScript for managing a library's books and borrowing system.

## Features
* Add, update, retrieve, and delete books
* Borrow books with availability and stock validation
* View summarized report of borrowed books with book details
* Robust error handling (validation & internal)
* Mongoose static methods and middleware support

## Tech Stack
* TypeScript
* Node js
* Express Js
* MongoDB + Mongoose

## Setup Instructions

### 1. Clone the repository
``` bash
git clone https://github.com/muhammad-sohel131/libaray-management-api.git
cd libaray-management-api

```
### 2. Create .env file and Write
``` 
URI=mongodb+srv://<username>:<password>@cluster0.jd7el.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/databaseName
```
### 3. Install dependency
``` bash
    npm install
```

### 4. Run the server
``` bash
    npm run dev
```