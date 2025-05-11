# Loan Application System

A full-stack web application for managing loan applications with role-based access. Built with React.js on the frontend and Node.js with Express and MongoDB on the backend.

## Features

- Role-based routing and dashboards for users and admins.
- Users can apply for loans and track their application status.
- Admins can view all loans and manage applications.
- Analytics with bar charts for visual insights.
- Persistent chat-like loan history (optional).
- Authentication with role persistence using local storage.

## Tech Stack

### Frontend
- React.js with Vite
- React Router DOM
- Tailwind CSS for UI
- Framer Motion (for chart animations)
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- dotenv for environment config
- CORS

## Project Structure

root/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── server.js
│ └── .env
└── frontend/
├── src/
│ ├── components/
│ ├── hooks/
│ ├── pages/
│ ├── App.jsx
│ └── main.jsx
└── vite.config.js


## Setup Instructions

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
Install dependencies:

bash
Copy
Edit
npm install
Create a .env file and add the following:

ini
Copy
Edit
MONGODB_URI=your_mongodb_connection_string
PORT=5000
Start the backend server:

bash
Copy
Edit
node server.js

MongoDB connected
Server running on port 5000
2️⃣ Frontend
Open another terminal and navigate to frontend:


Edit
cd frontend
Install frontend dependencies:

bash
Copy
Edit
npm install
Start the Vite development server:


Edit
npm run dev
Visit the link shown in terminal (usually http://localhost:5173).

🔧 Configuration Tips
Ensure the API URL in your custom hook (e.g., useChatData.js) matches the backend:



