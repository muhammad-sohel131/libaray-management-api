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

## API Endpoints

### 1\. Create Book

**POST** `/api/books`

#### Request:

```json
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "An overview of cosmology and black holes.",
  "copies": 5,
  "available": true
}
```

#### Response:

```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-19T10:23:45.123Z"
  }
}
```

* * *

### 2\. Get All Books

**GET** `/api/books`

Supports filtering, and sorting.

#### Example Query:

`/api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5`

#### Query Parameters:

*   `filter`: Filter by genre
*   `sort`: `asc` or `desc`
*   `limit`: Number of results (default: 10)

#### Response:

```json
{
  "success": true,
  "message": "Books retrieved successfully",
  "data": [
    {
      "_id": "64f123abc4567890def12345",
      "title": "The Theory of Everything",
      "author": "Stephen Hawking",
      "genre": "SCIENCE",
      "isbn": "9780553380163",
      "description": "An overview of cosmology and black holes.",
      "copies": 5,
      "available": true,
      "createdAt": "2024-11-19T10:23:45.123Z",
      "updatedAt": "2024-11-19T10:23:45.123Z"
    }
    {...}
  ]
}
```

* * *

### 3\. Get Book by ID

**GET** `/api/books/:bookId`

#### Response:

```json
{
  "success": true,
  "message": "Book retrieved successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-19T10:23:45.123Z"
  }
}
```

* * *

### 4\. Update Book

**PUT** `/api/books/:bookId`

#### Request:

```json
{
  "copies": 50
}
```

#### Response:

```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 50,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-20T08:30:00.000Z"
  }
}
```

* * *

### 5\. Delete Book

**DELETE** `/api/books/:bookId`

#### Response:

```json
{
  "success": true,
  "message": "Book deleted successfully",
  "data": null
}
```

* * *

### 6\. Borrow a Book

**POST** `/api/borrow`

#### Request:

```json
{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```

#### Response:

```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "_id": "64bc4a0f9e1c2d3f4b5a6789",
    "book": "64ab3f9e2a4b5c6d7e8f9012",
    "quantity": 2,
    "dueDate": "2025-07-18T00:00:00.000Z",
    "createdAt": "2025-06-18T07:12:15.123Z",
    "updatedAt": "2025-06-18T07:12:15.123Z"
  }
}
```

* * *

### 7\. Borrowed Books Summary (Using Aggregation)

`GET /api/borrow`

**Response:**

```json
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully",
  "data": [
    {
      "book": {
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 5
    },
    {
      "book": {
        "title": "1984",
        "isbn": "9780451524935"
      },
      "totalQuantity": 3
    }
  ]
}
```

## Future Improvements
- JWT-based Authentication
- Pagination and Search



## Author
Made with ❤️ by Md Sohel