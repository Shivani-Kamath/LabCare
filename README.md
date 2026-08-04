# 🧪 LabCare – AI-Enabled Digital Fault Monitoring and Reporting System

LabCare is a full-stack MERN application developed to modernize laboratory management in educational institutions. It streamlines equipment tracking, fault reporting, technician assignment, inventory management, and maintenance through a centralized platform. The system also integrates AI-based analytics to assist in predictive maintenance and improve lab efficiency.

---

## ✨ Features

- 🔐 Secure JWT Authentication
- 👥 Role-Based Access Control
  - Admin
  - Lab Staff
  - Technician
- 🖥️ Equipment Fault Reporting
- 📦 Inventory Management
- 🔍 Search & Filter Equipment
- 📊 Interactive Dashboard
- 🤖 AI-Based Fault Prediction
- ⚙️ Technician Workload Balancing
- 📈 Maintenance Analytics
- 📢 Issue Status Tracking

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JSON Web Token (JWT)
- bcrypt.js

### AI & Machine Learning
- Python
- Scikit-learn
- Random Forest
- K-Means Clustering

---

## 📂 Project Structure

```
LabCare
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   └── server.js
│
├── ai-model
│   ├── datasets
│   ├── models
│   └── training
│
└── README.md
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Shivani-Kamath/LabCare.git
cd LabCare
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npm run dev
```

---

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
npm run dev
```

The application will run on:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## 🤖 AI Module

The integrated AI module analyzes historical equipment data to:

- Predict potential equipment failures
- Support preventive maintenance
- Balance technician workloads
- Generate maintenance insights

Algorithms used:

- Random Forest
- K-Means Clustering
- NLP

---


## 🔮 Future Enhancements

- QR Code Equipment Tracking
- Email Notifications
- Real-Time Alerts
- Mobile Application
- Cloud Deployment

---
