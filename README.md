# 🍲 Recipe Backend API (Express + MongoDB)

This project is a **Node.js + Express + MongoDB backend API** for managing users, profiles, and recipes.  
It follows the **MVC pattern (Models, Controllers, Routes)** and demonstrates **real-world backend engineering practices**.

---

## 📌 Features Completed (Stage 1 → 6)

✅ Stage 1: Project Setup  
- Express server with `dotenv` for environment variables  
- MongoDB connection with Mongoose (`db.js`)  

✅ Stage 2: User & Profile Module  
- User registration & login (with **bcrypt** for password hashing)  
- JWT-based authentication (`auth_middleware.js`)  
- Profile creation & retrieval (linked to users)  

✅ Stage 3: Recipe Module  
- Create, read, update, delete recipes  
- Each recipe belongs to a user (One-to-Many relationship)  

✅ Stage 4: Relationships & Population  
- Populate user details in profiles and recipes  
- Populate recipe details under each profile  

✅ Stage 5: Likes & Comments  
- Like/unlike a recipe  
- Add, update, delete comments  
- Populate user info on comments  

✅ Stage 6: Universal Error Handling  
- 404 “Not Found” middleware  
- Centralized error handler (`error_middleware.js`)  
- Consistent error response structure with status codes  

---
## 📂 Project Structure
recipe-backend/
│── config/
│ └── db.js # MongoDB connection
│── controllers/
│ ├── auth_controller.js # Register & login logic
│ ├── profile_controller.js
│ ├── recipe_controller.js
│ └── comment_controller.js
│── middlewares/
│ ├── auth_middleware.js # JWT verification
│ └── error_middleware.js # 404 + error handler
│── models/
│ ├── user_model.js
│ ├── profile_model.js
│ └── recipe_model.js
│── routes/
│ ├── auth_routes.js
│ ├── profile_routes.js
│ ├── recipe_routes.js
│ └── comment_routes.js
│── .env # Environment variables
│── server.js # Main app entry
└── package.json

---

## ⚙️ Installation & Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/femilana/Recipe-Backend-API-.git
   cd Recipe-Backend-API-
2. Install dependencies
  npm install
3. Add environment variables (.env)
   MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
4. Start the server
   npm start



## 📂 Project Structure

