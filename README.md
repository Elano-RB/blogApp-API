App Building - In-Class Prototyping

Application Name
App Building - In-Class Prototyping

Developer
- Rolando Benjamin Elano

User Credentials

Admin User
- Email: admin@mail.com
- Password: admin123

Features

Below are the full-stack features implemented by Rolando, grouped by resources and based on your application's file and folder structure.

🌐 Client (Vue + Vite)

Pages
- Home Page (HomePage.vue)
- Login Page (LoginPage.vue)
- Register Page (RegisterPage.vue)
- Profile Page (ProfilePage.vue)
- Post List Page (PostListPage.vue)
- Single Post Page (SinglePostPage.vue)
- Create Post Page (CreatePostPage.vue)
- Edit Post Page (EditPostPage.vue)
- Admin Dashboard (AdminDashboard.vue)

Components
- Navbar.vue
- Banner.vue
- PostComments.vue

Store
- global.js – Global state management

api.js – (Centralized API wrapper)

Other Client Features
- Routing and navigation guards
- Token-based authentication
- Global CSS styling (main.css)
- Vite configuration (vite.config.js)

🖥️ Server (Node + Express + MongoDB)

User Resources
- User registration
- User login
- Retrieve user profile
- Update user profile
- Promote user to admin
- Post Resources
- Create a Post
- Retrieve all Posts
- Retrieve a Single Post
- Update Post
- Delete Post
- Retrieve Posts by User
- Comment Resources
- Add comment to a Post
- Retrieve comments for a Post
- Delete comment

Admin Resources
- Dashboard data retrieval
- Manage users
- Manage posts

📁 Other Backend Resources

Controllers
- adminController.js
- userController.js
- postController.js
- commentController.js

Models
- User.js – User schema
- Post.js – Blog post schema
- Comment.js – Comment schema

Routes
- user.js
- post.js
- comment.js
- admin.js

Utilities
- auth.js – Authentication middleware
- blogAPI.json – API testing collection
- package.json – Backend dependencies
- index.js – Main server entry point