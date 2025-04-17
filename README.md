# TalentFlow - Freelance Marketplace Platform

**TalentFlow** is a scalable and efficient platform designed to connect freelancers with businesses, streamlining the hiring process and fostering seamless real-time communication. Built with a modern tech stack, TalentFlow leverages advanced technologies to optimize project-freelancer matching, enhance security, and ensure smooth user interactions.

---

## 🚀 Key Features

- **Asynchronous Job Queue**  
  Utilizes **Redis** and **BullMQ** to manage background tasks like email notifications, ensuring non-blocking operations and high performance under load.

- **AI-Powered Matching**  
  Integrates intelligent algorithms to:
  - Suggest optimized bids for freelancers  
  - Recommend top freelancers to clients  
  Based on project requirements, bid amounts, and estimated effort.

- **Secure Authentication System**  
  Implements robust role-based authentication using **JWT** with:
  - Refresh token support  
  - Refresh token rotation  
  For secure and seamless user sessions.

- **Real-Time Communication**  
  Features **Socket.io**-based chat system for instant client-freelancer messaging with:
  - Message persistence in the database  
  - Reliable access even after session ends

---

## 🛠 Tech Stack

| Layer             | Technology              |
|------------------|-------------------------|
| Backend           | NestJS (RESTful APIs)   |
| Database          | PostgreSQL with Prisma  |
| Queue System      | Redis + BullMQ          |
| Real-Time Comm.   | WebSockets (Socket.io)  |
| Authentication    | JWT                     |
| Email             | Nodemailer              |

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd talentflow
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add the following:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/talentflow_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.example.com
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev
```

### 5. Start the Application

```bash
npm run start:dev
```

---

## 🌐 Access

Once started, visit [http://localhost:3000](http://localhost:3000) to explore TalentFlow and connect freelancers with businesses efficiently.
