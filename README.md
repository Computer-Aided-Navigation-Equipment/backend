# Backend

This repository contains the backend services for managing database operations and server-side logic for both web and mobile applications. It is built using **Node.js**, **Express**, and **TypeScript**, with **MongoDB** as the database.

## Features

- **Authentication and Authorization**:
  - User login and registration.
  - Role-based access control (RBAC) for different user types.
  - JWT-based authentication.

- **File Upload**:
  - Integration with AWS S3 for file storage using `multer` and `multer-s3`.

- **Database Management**:
  - MongoDB models for users, locations, contacts, and path logs.
  - Middleware to ensure database connectivity.

- **Email Notifications**:
  - Integration with Brevo (Sendinblue) for sending transactional emails.

- **API Documentation**:
  - Swagger integration for API documentation.

- **Utilities**:
  - Validation utilities for email, password, and username.
  - Helper functions for generating presigned URLs for S3.

## Project Structure

```
src/
├── config/              # Configuration files (e.g., multer for file uploads)
├── controllers/         # Controllers for handling API logic
├── middlewares/         # Middleware for authentication, authorization, and database connection
├── models/              # Mongoose models for MongoDB collections
├── routes/              # API route definitions
├── types/               # TypeScript type definitions
├── utils/               # Utility functions and helpers
├── index.ts             # Entry point of the application
```

## Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or cloud instance)
- **AWS S3** (for file storage)
- **Brevo (Sendinblue)** API key (for email notifications)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Computer-Aided-Navigation-Equipment/backend.git
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```env
   PORT=6001
   DBURI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
   AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
   AWS_REGION=<your-aws-region>
   S3_BUCKET_NAME=<your-s3-bucket-name>
   BREVO_API_KEY=<your-brevo-api-key>
   FRONTEND_URL=<your-frontend-url>
   ```

4. Build the project:

   ```bash
   npm run build
   ```

5. Start the server:

   ```bash
   npm run dev
   ```

## API Endpoints

### User Routes

- `POST /api/user/register` - Register a new user.
- `POST /api/user/login` - Login a user.
- `POST /api/user/change-password` - Change user password.
- `GET /api/user/profile` - Get user profile.

### Location Routes

- `POST /api/location/create` - Create a new location.
- `GET /api/location/get-user` - Get all locations for a user.
- `POST /api/location/delete/:locationId` - Delete a location.

### Contact Routes

- `POST /api/contact/create` - Create a new contact.
- `GET /api/contact/get-user` - Get all contacts for a user.
- `POST /api/contact/delete/:contactId` - Delete a contact.

### Path Log Routes

- `POST /api/pathlog/create` - Create a new path log.

### Swagger Documentation

Access the API documentation at `http://localhost:6001/api-docs`.

## Scripts

- `npm run build` - Compile TypeScript to JavaScript.
- `npm run start` - Start the production server.
- `npm run dev` - Start the development server with hot-reloading.
- `npm run test` - Run tests using Jest.

## Database Design

## Entity-Relationship Diagram

![er_diagram](https://github.com/user-attachments/assets/7ad1cb6a-b545-4d60-927c-da5ce0374c08)

## Enhanced Entity-Relationship Diagram

![eerd_diagram](https://github.com/user-attachments/assets/96f6a27e-0136-4205-ab4d-444d2c7f33a7)
