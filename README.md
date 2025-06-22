## BACKEND:
## 📌 Overview
-Profile Matcher is a developer networking platform where users can create profiles and connect with other developers.

-Features secure authentication using JWT, an Express.js backend, and password encryption with bcryptjs.

-Users can view, edit profiles, and manage connection requests with real-time interaction.

-Built with React, Redux Toolkit for state management, Node.js, Express.js, and MongoDB — fully responsive across all devices. 

## 🛠️ Tech Stack
- Backend Framework: Node.js + Express.js

- Database: MongoDB + Mongoose

- Authentication: JWT (JSON Web Token) + Cookies

- Encryption: bcryptjs for password hashing

- API Testing: Postman

- Environment Variables: dotenv

- Package Manager: npm

## 🔑 Features Implemented
# 1. 🔐 Authentication System
- Signup, Login, and Logout endpoints

- JWT-based auth with secure cookies

- Password encryption via bcryptjs

- Route protection using middleware

# 2. User Profile Management
- View logged-in user profile

- Edit restricted profile fields

- Update password with validation

# 3.  Connection Request System
- Send connection requests (Interested / Ignored)

- Accept or reject incoming requests

- Prevent duplicates using MongoDB validation

- Prevent self-requests with .pre Mongoose middleware

# 4.  Feed API & Pagination
- Excludes: self, connected, pending, or ignored users

-  Pagination via skip & limit

- Optimized using $nin and $ne operators

# 5.  Database Design
- User Schema: sanitized fields, unique constraints

- ConnectionRequest Schema: validated fields, indexes

- Prevents multiple/invalid requests

#  6. 🚀 Query Optimization
- Indexes (index: true)

- Compound indexes for feed query performance

# 7. 🧱 Middleware Implementation
- Auth Middleware to protect private routes

- Centralized Error Middleware

- .pre middleware for self-request prevention

# 8. 📁 Modular Express Router
- Routes organized into: auth, profile, connections, users

- Clean structure for scalability & maintenance


