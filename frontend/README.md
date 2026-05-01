# MSU International Student App

A full-stack web app for international students at Montclair State University to find jobs, events, community support, and AI-powered guidance.

## Features

- JWT authentication with MSU email validation
- User and admin roles
- Admin panel for managing jobs and events
- Job board with external application links
- Event RSVP system
- Community posts, comments, likes, and notifications
- Hawk AI assistant powered by Gemini
- User profile with editable details and profile picture
- Responsive React UI

## Tech Stack

Frontend: React, Vite, Tailwind CSS, Axios  
Backend: Node.js, Express.js, MongoDB, Mongoose  
Auth: JWT, bcrypt  
AI: Gemini API  
Deployment: Vercel + Render

## Environment Variables

See `.env.example` in both frontend and backend folders.

## Run Locally

Backend:

```bash
cd backend
npm install
npm run dev

