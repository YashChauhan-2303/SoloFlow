# SoloFlow

SoloFlow is a full-stack productivity and client management platform built for freelancers, consultants, student entrepreneurs, and solo creators. It centralizes project tracking, task management, client relationships, invoicing, analytics, and automated notifications into a single modern dashboard.

---

## Live Demo

Frontend: https://soloflow-yash.vercel.app/

---

## Features

### Authentication & Security
- JWT-based Authentication
- Secure Password Hashing
- Protected Routes
- Role-based Access Ready

### Client & Project Management
- Client Management System
- Project Tracking
- Project Timeline Monitoring
- Centralized Workspace

### Productivity Tools
- Kanban Task Board
- Deadline Tracking
- Automated Notifications
- Productivity Analytics

### Billing & Invoicing
- Professional Invoice Generation
- Email Invoice Delivery
- Client Billing Management

### Dashboard & Analytics
- Interactive Dashboard
- Project Statistics
- Revenue Tracking
- Productivity Insights

### DevOps & Cloud
- Dockerized Frontend & Backend
- Docker Compose Orchestration
- AWS EC2 Deployment
- MongoDB Atlas Integration
- GitHub Actions CI
- CodeQL Security Scanning
- Dependabot Dependency Monitoring

---

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Recharts
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Bcrypt
- Node Cron

### Email Services
- Resend API
- EasyInvoice

### DevOps & Infrastructure
- Docker
- Docker Compose
- AWS EC2
- GitHub Actions
- CodeQL
- Dependabot

---

## Architecture

```text
┌─────────────────┐
│ React Frontend  │
│     (Vite)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Express Backend │
│   REST APIs     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ MongoDB Atlas   │
└─────────────────┘

         │
         ▼

┌─────────────────┐
│ Resend Service  │
│ Email Delivery  │
└─────────────────┘
```

---

## Project Structure

```text
SOLOFLOW
├── .github/
│   └── workflows/
│       ├── backend.yml
│       ├── frontend.yml
│       └── codeql.yml
│
├── Documentation/
│
├── SoloFlow/
│   ├── backend/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── cron/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── tests/
│   │   ├── utils/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── app.js
│   │
│   ├── frontend/
│   │   ├── src/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── vercel.json
│   │
│   └── docker-compose.yml
│
└── README.md
```

---

## Local Setup

### Clone Repository

```bash
git clone https://github.com/YashChauhan-2303/SoloFlow.git
cd SoloFlow/SoloFlow
```

---

## Backend Setup

```bash
cd backend
npm install
npm start
```

Create a `.env` file:

```env
PORT=3000

MONGO_URI=your_mongodb_uri

JWT_SECRET_KEY=your_jwt_secret

RESEND_API_KEY=your_resend_api_key

FRONTEND_URL=http://localhost:5173
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

---

# Docker Deployment

### Build & Run

From the root project directory:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up -d --build
```

### Services

| Service | Port |
|----------|------|
| Frontend | 5173 |
| Backend | 3000 |

### Stop Containers

```bash
docker compose down
```

---

# AWS Deployment

SoloFlow is deployed on AWS EC2 using Docker Compose.

### Infrastructure

- AWS EC2 (Ubuntu)
- Docker Engine
- Docker Compose
- MongoDB Atlas
- Resend Email Service

### Deployment Steps

```bash
git clone https://github.com/YashChauhan-2303/SoloFlow.git

cd SoloFlow/SoloFlow

docker compose up -d --build
```

Application becomes accessible through:

```text
http://<EC2_PUBLIC_IP>:5173
```

---

## CI/CD & Security

### GitHub Actions

Automated workflows for:

- Frontend Build Validation
- Backend Verification
- Pull Request Checks

### CodeQL

Automated security scanning for:

- JavaScript
- Node.js
- Dependency Vulnerabilities

### Dependabot

Automatic dependency update monitoring and pull requests.

---

## Roadmap

- Mobile App Support
- Custom Invoice Templates
- Advanced Productivity Analytics
- Team Collaboration Features
- AI-Powered Productivity Insights
- Exportable Reports
- Multi-Tenant Support

---

## Author

### Yash Chauhan

GitHub:
https://github.com/YashChauhan-2303

---

## License

This project is licensed under the MIT License.