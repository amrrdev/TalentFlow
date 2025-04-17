TalentFlow - Freelance Marketplace Platform
TalentFlow is a scalable and efficient platform designed to connect freelancers with businesses, streamlining the hiring process and fostering seamless real-time communication. Built with a modern tech stack, TalentFlow leverages advanced technologies to optimize project-freelancer matching, enhance security, and ensure smooth user interactions.
Key Features and Implementation

Asynchronous Job Queue: TalentFlow utilizes Redis and BullMQ to power an asynchronous job queue, enabling efficient handling of background tasks such as email notifications. This ensures non-blocking operations and enhances the platform's performance under high load.

AI-Powered Matching: The platform integrates AI-driven algorithms to provide bid suggestions for freelancers and recommend top freelancers to clients. By analyzing project requirements, bid amounts, and estimated work, TalentFlow optimizes hiring decisions, saving time and improving match accuracy.

Secure Authentication System: A robust role-based authentication system is implemented using JSON Web Tokens (JWT). TalentFlow enhances session security through refresh tokens and refresh token rotation, ensuring secure and seamless user sessions.

Real-Time Communication: TalentFlow features a WebSocket-based chat system powered by Socket.io, enabling instant client-freelancer communication. Messages are persisted in the database, ensuring reliability and accessibility even after sessions end.


Tech Stack

Backend: NestJS with RESTful APIs
Database: PostgreSQL with Prisma ORM
Queue System: Redis with BullMQ
Real-Time: WebSockets (Socket.io)
Authentication: JWT
Email Notifications: Nodemailer

Installation

Clone the Repository:
git clone <repository-url>
cd talentflow


Install Dependencies:
npm install


Set Up Environment Variables:

Create a .env file in the root directory.

Add the necessary variables (adjust as needed):
DATABASE_URL=postgresql://user:password@localhost:5432/talentflow_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.example.com
EMAIL_USER=your_email
EMAIL_PASS=your_email_password




Run Database Migrations:
npx prisma migrate dev


Start the Application:
npm run start:dev



Once started, TalentFlow will be accessible at http://localhost:3000, ready to connect freelancers and businesses efficiently.
