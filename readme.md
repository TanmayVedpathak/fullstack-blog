# 📝 Fullstack Blog App

A full-featured Blog Application built using Node.js, Express, MongoDB, and EJS.
It supports user authentication, CRUD operations on posts and comments, profile editing, and image uploads via Cloudinary.

## 🚀 Tech Stack

**Backend:**

- Node.js
- Express.js
- MongoDB + Mongoose
- Passport.js (for authentication)
- Cloudinary (for image upload and storage)
- EJS (templating engine)

## ✨ Features

✅ User Authentication — Register, login, and logout securely via Passport.js  
✅ Post Management — Create, update, and delete your own blog posts  
✅ Image Uploads — Attach images to posts using Cloudinary  
✅ Comment System — Add comments on any post (including your own)  
✅ Comment Permissions — Delete only comments written by you  
✅ Profile Management — Edit your user profile details and profile picture  
✅ Protected Routes — Only logged-in users can access post creation, editing, and profile routes

## 📂 Project Structure

📦 fullstack-blog  
├── 📁 config/ # Passport, Cloudinary, and DB configuration  
├── 📁 controllers/ # Route controllers (auth, posts, comments)  
├── 📁 models/ # Mongoose schemas (User, Post, Comment)  
├── 📁 routes/ # Express route files  
├── 📁 views/ # EJS templates  
├── 📁 public/ # Static files (CSS, JS, images)  
├── .env # Environment variables  
├── app.js # Main application entry  
├── package.json  
└── README.md

## ⚙️ Installation and Setup

1️⃣ **Clone the Repository**

`git clone https://github.com/yourusername/fullstack-blog-app.git`  
`cd fullstack-blog-app`

2️⃣ **Install Dependencies**

`npm install`

3️⃣ **Setup MongoDB Atlas**

1. Go to MongoDB Atlas.
2. Create a free cluster.
3. In the Database Access tab → Add a new database user and password.
4. In the Network Access tab → Allow access from anywhere (0.0.0.0/0).
5. Copy your connection string — it will look like this:  
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/blog-app`
6. Use this in your .env as:  
   `MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/blog-app`

4️⃣ **Setup Cloudinary**

1. Go to Cloudinary Dashboard
2. Sign up or log in.
3. In the Dashboard, find your credentials:

   - Cloud Name
   - API Key
   - API Secret

4. Add these to your .env:

   `CLOUDINARY_CLOUD_NAME=your_cloud_name`  
   `CLOUDINARY_API_KEY=your_api_key`  
   `CLOUDINARY_API_SECRET=your_api_secret`

5️⃣ **Create a .env File**

Create a .env file in the root directory and add the following remaining environment variables:

`PORT = 8080`  
`SESSION_SECRET_KEY = your_secret_key`

## 4️⃣ Run the Application

`npm start`

or in development mode (with nodemon):

`npm run dev`

The app will run on http://localhost:8080

## 🔒 Authentication

Authentication handled by Passport.js (Local Strategy).

User passwords are hashed using bcrypt.

Sessions are managed using express-session.

## ☁️ Image Uploads

Integrated with Cloudinary for secure image storage.

Images are uploaded directly from the browser and stored with the post document in MongoDB.

Each post has a public_id and url field for easy Cloudinary image management.

## 🧠 Routes Overview

| Method | Route                 | Description           | Auth Required |
| ------ | --------------------- | --------------------- | ------------- |
| GET    | `/`                   | Homepage              | ❌            |
| GET    | `/login`              | Login form            | ❌            |
| GET    | `/register`           | Register form         | ❌            |
| POST   | `/login`              | Authenticate user     | ❌            |
| POST   | `/register`           | Create user           | ❌            |
| GET    | `/posts`              | View all posts        | ❌            |
| GET    | `/posts/:id`          | View single post      | ❌            |
| GET    | `/posts/add`          | Create post form      | ✅            |
| POST   | `/posts/add`          | Submit new post       | ✅            |
| GET    | `/posts/:id/edit`     | Edit post form        | ✅            |
| PUT    | `/posts/:id     `     | Edit post             | ✅            |
| DELETE | `/posts/:id`          | Delete post           | ✅            |
| POST   | `/posts/:id/comments` | Add comment on post   | ✅            |
| GET    | `/comments/:id/edit`  | Get comment edit form | ✅            |
| PUT    | `/comments/:id`       | Update comment        | ✅            |
| DELETE | `/comments/:id`       | Delete comment        | ✅            |
| GET    | `/user/profile`       | Show user profile     | ✅            |
| GET    | `/user/edit`          | Render user edit form | ✅            |
| POST   | `/user/edit`          | Edit user             | ✅            |
| DELETE | `/user/delete`        | Deletex user          | ✅            |
