# 🧪 LabCare – AI-Enabled Digital Fault Monitoring and Reporting System

![MERN](https://img.shields.io/badge/MERN-Stack-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-brightgreen)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-success)
![Python](https://img.shields.io/badge/AI-Python-yellow)
![License](https://img.shields.io/badge/License-Educational-orange)

LabCare is an AI-enabled laboratory management system developed using the **MERN Stack** to simplify equipment management, fault reporting, inventory tracking, and maintenance in educational institutions. The platform provides role-based access for students, lab staff, technicians, and administrators while leveraging Machine Learning and Natural Language Processing to enhance maintenance efficiency and user support.

---

## 📌 Features

- 🔐 Secure JWT Authentication
- 👥 Role-Based Access Control
  - Admin
  - Lab Staff
  - Technician
- 📝 Equipment Fault Reporting
- 📦 Inventory Management
- 🔍 Search & Filter Equipment
- 📊 Dashboard & Analytics
- 🤖 AI-Based Equipment Failure Prediction
- 💬 NLP Chatbot for User Assistance
- ⚙️ Technician Workload Balancing
- 📈 Maintenance Reports
- 🔄 Issue Status Tracking

---

## 🛠 Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt.js

### AI & Machine Learning

#### Backend ML

- Random Forest
- Decision Tree
- K-Means Clustering

Used for:

- Predictive Equipment Failure Analysis
- Maintenance Analytics
- Technician Workload Distribution

#### NLP Service

- Python
- Flask
- Scikit-learn

Used for:

- AI Chatbot
- Intent Classification
- User Query Processing

---

## 📂 Project Structure

```text
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
│   ├── ml
│   ├── scripts
│   └── server.js
│
├── nlp-service
│   ├── app.py
│   ├── intents.json
│   ├── requirements.txt
│   ├── train_chatbot.py
│   └── model.pkl
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

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. NLP Chatbot Setup

```bash
cd nlp-service
pip install -r requirements.txt
python app.py
```

---

## ⚙ Environment Variables

Create a `.env` file inside the backend directory (if using environment variables):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

> **Note:** The current backend configuration uses a local MongoDB connection. Update `db.config.js` to use `dotenv` if you prefer environment-based configuration.

---

## 🤖 AI Components

### 📊 Predictive Analytics

The Machine Learning module analyzes historical equipment data to:

- Predict possible equipment failures
- Improve preventive maintenance
- Generate maintenance insights
- Assist administrators in monitoring equipment health

Algorithms Used:

- Random Forest
- Decision Tree
- K-Means Clustering

### 💬 NLP Chatbot

The chatbot helps users by:

- Answering common laboratory-related questions
- Understanding user intents using Natural Language Processing
- Providing quick troubleshooting assistance

Technologies:

- Python
- Flask
- Scikit-learn

---

## 📸 Screenshots

Add screenshots of:

- Login Page
- Student Dashboard
- Admin Dashboard
- Inventory Management
- Fault Reporting
- Technician Dashboard
- Analytics Dashboard
- AI Chatbot

---

## 🔮 Future Enhancements

- 📱 Mobile Application
- ☁ Cloud Deployment
- 📧 Email Notifications
- 📷 QR Code Equipment Tracking
- 🔔 Real-Time Alerts
- 📊 Advanced Predictive Analytics
- 🤖 Enhanced AI Chatbot
- 📈 Interactive Visualization Dashboard

---

## 👩‍💻 Author

**Shivani Kamath**

Computer Science & Engineering

GitHub: **https://github.com/Shivani-Kamath**

---


## 📄 License

This project was developed as an academic final-year project and is intended for educational purposes.

---

## ⭐ Support

If you found this project helpful, please consider giving it a ⭐ on GitHub!
