# SoloFlow

SoloFlow is a full-stack productivity and client management platform designed for freelancers, consultants, and solo entrepreneurs. It combines project tracking, task management, client management, invoicing, analytics, and notifications into a single dashboard.

## Features

- JWT Authentication
- Client Management
- Project Management
- Kanban Task Board
- Invoice Generation & Email Delivery
- Productivity Analytics
- Deadline Notifications
- Dark Mode Interface
- Responsive Dashboard

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- React Router

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication

### DevOps & Tooling
- GitHub Actions
- CodeQL Security Scanning
- Dependabot
- Vercel
- Render
- UptimeRobot

## Project Structure

```text
SOLOFLOW
├── .github/
│   └── workflows/
├── Documentation/
├── SoloFlow/
│   ├── backend/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── cron/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── tests/
│   │   ├── utils/
│   │   └── app.js
│   │
│   └── frontend/
│       ├── src/
│       └── vercel.json
│
└── README.md
```

## Local Setup

### Backend

```bash
cd SoloFlow/backend
npm install
npm start
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET_KEY=your_jwt_secret
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=your_verified_email
```

### Frontend

```bash
cd SoloFlow/frontend
npm install
npm run dev
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

## Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |
| Email Service | Resend |

## Roadmap

- Improve mobile responsiveness
- Custom invoice templates
- Advanced analytics
- Team collaboration support
- AI-powered productivity insights

## Author

**Yash Chauhan**

GitHub: https://github.com/YashChauhan-2303