# Node.js API with MongoDB and Redis Caching

This Node.js API application provides endpoints to manage a collection of books stored in a MongoDB database. It utilizes Redis caching to improve performance by caching retrieved data for a certain period.

## Features

- **GET /api/books**: Retrieves all books from the database in a paginated fashion. If available, data is fetched from the Redis cache. Pagination parameters (`page` and `limit`) can be provided as query parameters in the URL.
- **POST /api/books**: Adds one or more books to the database.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web application framework for Node.js.
- **MongoDB**: NoSQL database for storing book data.
- **Redis**: In-memory data store used for caching book data.
- **Mongoose**: MongoDB object modeling tool for Node.js.
- **Cors**: Middleware for enabling Cross-Origin Resource Sharing (CORS).
- **Body-Parser**: Middleware for parsing request bodies.

## Installation

1. Clone this repository to your local machine.
2. Install dependencies using `npm install`.
3. Make sure MongoDB and Redis servers are running locally on their default ports.

## Usage

- Run the server using `npm start`.
- Access the API endpoints using a tool like Postman or a web browser.

## Endpoints

- **GET /books**: Retrieves all books. Pagination parameters (`page` and `limit`) can be provided as query parameters.
- **POST /books-add**: Adds one or more books to the database.

## How it Works

- When a GET request is made to fetch all books, the application first checks if the data is cached in Redis. If found, it retrieves the data from the cache. If not found, it fetches the data from MongoDB, caches it in Redis, and returns the data.
- Pagination is implemented by skipping the correct number of documents in the database query based on the `page` and `limit` parameters.
- When adding a book using a POST request, the application saves the book data to the MongoDB database.

## Contributing

Contributions are welcome! Feel free to submit pull requests or open issues for any bugs or feature requests.

