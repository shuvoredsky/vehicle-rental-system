# 🚗 Vehicle Rental System – Backend (Node.js + TypeScript + PostgreSQL)

A backend service for managing a **Vehicle Rental System**, built using **Node.js**, **Express**, **TypeScript**, and **PostgreSQL**.  
This project includes full CRUD operations for **Users** and **Vehicles**, along with **JWT-based authentication**.

---

## 📌 Features

### 🔐 Authentication

- User Registration
- User Login
- JWT Token Generation
- Protected Routes

### 👤 User Management

- Create User
- Get All Users
- Get Single User
- Update User
- Delete User

### 🚘 Vehicle Management

- Create Vehicle
- Get All Vehicles
- Get Vehicle by ID
- Update Vehicle
- Delete Vehicle
- Availability Status Handling

---

## 🛠️ Technologies Used

- **Node.js**
- **Express.js**
- **TypeScript**
- **PostgreSQL**
- **pg (node-postgres)**
- **bcryptjs**
- **jsonwebtoken**
- **dotenv**

---

## 📂 Project Structure

src/
├── app/
│ ├── modules/
│ │ ├── users/
│ │ ├── vehicles/
│ │ └── auth/
│ └── utils/
├── config/
│ ├── db.ts
│ └── index.ts
├── server.ts
└── app.ts

yaml
Copy code

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

CONNECTION_STR=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
PORT=5000

yaml
Copy code

🚫 **Do not upload `.env` to GitHub**.

---

## 🏗️ Database Initialization

The database automatically creates the required tables:

### **Users Table**

id, name, email, password, phone, role, created_at, updated_at

markdown
Copy code

### **Vehicles Table**

id, vehicle_name, type, registration_number, daily_rent_price,
availability_status, created_at, updated_at

yaml
Copy code

---

## ▶️ How to Run the Project

### 1. Install dependencies

npm install

shell
Copy code

### 2. Create `.env` file

(Add your connection string + jwt secret)

### 3. Start the server (development)

npm run dev

shell
Copy code

### 4. Build for production

npm run build

shell
Copy code

### 5. Run production build

npm start

yaml
Copy code

---

## 📡 API Endpoints

### 🔐 Auth Routes

| Method | Route              | Description             |
| ------ | ------------------ | ----------------------- |
| POST   | `/api/auth/signup` | Register a new user     |
| POST   | `/api/auth/login`  | Login user & return JWT |

---

### 👤 User Routes

| Method | Route            | Description     |
| ------ | ---------------- | --------------- |
| GET    | `/api/users`     | Get all users   |
| GET    | `/api/users/:id` | Get single user |
| PATCH  | `/api/users/:id` | Update user     |
| DELETE | `/api/users/:id` | Delete user     |

---

### 🚘 Vehicle Routes

| Method | Route               | Description        |
| ------ | ------------------- | ------------------ |
| POST   | `/api/vehicles`     | Add a new vehicle  |
| GET    | `/api/vehicles`     | Get all vehicles   |
| GET    | `/api/vehicles/:id` | Get single vehicle |
| PATCH  | `/api/vehicles/:id` | Update vehicle     |
| DELETE | `/api/vehicles/:id` | Delete vehicle     |

---

## 🔒 Authentication Example

Send JWT token in headers:

Authorization: Bearer <token>

yaml
Copy code

---

## 👤 Author

**Shuvo Chakrabarti**  
Full-stack Web Developer

---

## 📜 License

This project is licensed for educational purposes as part of the _Next Level Web Development_ Assignment-2.
