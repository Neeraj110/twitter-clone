﻿# Twitter-clone

A modern Twitter clone application built with the MERN stack, featuring real-time messaging, user profiles, and more. This project showcases the integration of frontend and backend technologies, providing a full-stack solution for building social networking applications.

Live Link - https://twitter-clone-329s.onrender.com

## Table of Contents

- Overview
- Features
- Tech Stack
- Installation
- Usage
- API Endpoints
- Folder Structure
- Contributing
- License

## Overview

Twitter Clone is designed to emulate the core functionalities of Twitter, including posting updates, following users, and engaging with content through likes and comments. It incorporates real-time messaging and notifications to enhance user interaction.

### Features

- User Authentication: Sign up, login, and secure routes.
- Profile Management: View and edit user profiles.
- Real-Time Messaging: Chat with users in real time.
- Post Management: Create, edit, and delete posts.
- Media Support: Upload images and videos.
- Notifications: Receive notifications for interactions.
- Responsive Design: Mobile-first design for all features.

## Tech Stack

### Backend

- Node.js: Runtime for server-side JavaScript.
- Express.js: Web application framework.
- MongoDB: NoSQL database for storing user data and posts.
- Mongoose: Object Data Modeling (ODM) for MongoDB.
- Socket.io: Real-time communication.
- jsonwebtoken: JSON Web Tokens for authentication.
- bcryptjs: Password hashing.
- multer: Handling file uploads.
- cloudinary: Media storage.
- nodemailer: Email sending for user verification.

### Frontend

- React: JavaScript library for building user interfaces.
- Vite: Build tool for development and production.
- Tailwind CSS: Utility-first CSS framework.
- Redux Toolkit: State management.
- react-router-dom: Routing library.
- socket.io-client: Real-time communication client.
- react-toastify: Notifications

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Neeraj110/twitter-clone.git

```

2. Navigate to the project directory

```bash
cd twitter-clone
```

3. Install backend dependencies:

```bash
npm install

```

4. Navigate to the frontend directory and install frontend dependencies:

```bash
cd frontend
 npm install
```

5. Build the frontend:

```bash
npm run build
```

6. Navigate back to the root directory and start the server:

```bash
Copy code
cd ..
npm run dev
```

### Usage

1. Open your browser and go to http://localhost:5173 to access the frontend.
2. The backend server will run on http://localhost:8000.

### API Endpoints

- POST /api/users/signup: Register a new user.
- POST /api/users/login: Authenticate a user.
- GET /api/posts: Retrieve all posts.
- POST /api/posts: Create a new post.
- GET /api/posts/
- : Get a specific post.
- PUT /api/posts/
- : Update a post.
- DELETE /api/posts/
- : Delete a post.
- POST /api/messages: Send a message.
- GET /api/messages: Retrieve messages.

### Folder Structure

- backend/: Contains server-side code and configuration.
- frontend/: Contains client-side code and assets.
- /frontend/src/: React components, pages, and utilities.
- /backend/models/: Mongoose models.
- /backend/routes/: API routes.
- /backend/controllers/: Business logic for routes.
- /backend/middleware/: Custom middleware.

## Contributing

> [!NOTE]
> Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (git checkout -b feature/your-feature).
3. Commit your changes (git commit -am 'Add new feature').
4. Push to the branch (git push origin feature/your-feature).
5. Create a new Pull Request.

## License

This project is licensed under the ISC License.
