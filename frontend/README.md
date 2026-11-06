# AI-Powered Adaptive Study Partner

An AI-powered learning application that helps students identify their strengths and weaknesses, receive personalized learning recommendations, and track their progress through continuous assessment and reassessment.

## Overview

**AI-Powered Adaptive Study Partner** is a personalized learning platform designed to make the learning process more structured and responsive to individual student performance.

Instead of following the same learning path for every student, the application analyses assessment results, identifies areas that need improvement, and recommends topics based on the student's performance.

It also includes an AI Teacher feature that helps students understand recommended topics through an interactive conversational interface.

The application follows a continuous learning cycle:

**Assess → Analyse → Recommend → Learn → Reassess → Adapt**

The objective is to help students understand what they need to learn next and monitor their progress over time.

## Live Application

- **Frontend:** https://adaptive-study-partner-pied.vercel.app/
- **Backend:** https://adaptive-study-partner.onrender.com
- **GitHub Repository:** https://github.com/SmithKadu09/adaptive-study-partner

## Key Features

### 1. User Authentication

- User registration and login.
- Password hashing using bcrypt.
- JWT-based authentication.
- Protected application routes and API endpoints.

### 2. Personalized Assessments

Students can configure an assessment before starting by selecting:

- Subject
- Topic
- Number of questions
- Difficulty level

The application generates questions based on the selected parameters and displays the assessment results after completion.

### 3. Performance Analysis

After an assessment, the application uses the student's results to analyse their performance.

It helps identify:

- Topics where the student performs well.
- Areas that require further improvement.
- Changes in performance across assessments.

Assessment results are also reflected on the dashboard.

### 4. Adaptive Learning Recommendations

Based on assessment performance, the application generates personalized learning recommendations.

The recommendations include:

- Suggested topics to study next.
- Priority levels for recommended topics.
- A structured learning path based on the student's performance.

The recommendations can change when the student completes further assessments and their performance is updated.

### 5. AI Teacher

The application includes an AI-powered conversational learning feature called **AI Teacher**.

Students can use it to:

- Learn recommended topics.
- Ask questions about concepts.
- Get explanations through an interactive conversation.
- Clarify doubts during their learning process.

The AI component is instructed to respond in a teaching-oriented manner.

### 6. Reassessment

After completing the recommended learning activities, students can take another assessment.

The reassessment helps compare the student's updated performance with previous assessment results.

### 7. Progress Tracking

The application maintains learning and assessment information so students can monitor their progress.

The dashboard provides an overview of assessment performance and learning progress.

## How It Works

The application follows a continuous adaptive learning workflow.

```text
          Student Login
                |
                v
       Select Subject & Topic
                |
                v
       Configure Assessment
                |
                v
          Take Assessment
                |
                v
       Analyse Performance
                |
                v
     Identify Strengths & Weaknesses
                |
                v
     Generate Learning Recommendations
                |
                v
           AI Teacher
                |
                v
          Learn Topics
                |
                v
           Reassessment
                |
                v
       Update Performance
                |
                v
     Adapt Learning Recommendations
                |
                v
        Track Learning Progress
```

### Workflow Explanation

1. **Assessment:** The student selects a subject, topic, question count, and difficulty level and completes an assessment.
2. **Analysis:** The application analyses the assessment results to understand the student's performance.
3. **Recommendation:** Based on the results, the application generates suggested topics and their priorities.
4. **Learning:** The student uses the AI Teacher to learn the recommended topics and clarify doubts.
5. **Reassessment:** The student takes another assessment after learning.
6. **Adaptation:** The application updates performance information and adjusts learning recommendations based on the new results.

This cycle allows the learning path to respond to the student's changing performance.

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | Next.js, React.js, JavaScript |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JWT, bcrypt |
| AI Integration | OpenRouter-compatible LLM API |
| API Communication | REST API, JSON |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |
| Version Control | Git, GitHub |

## System Architecture

The application follows a frontend-backend architecture.

### Frontend

The frontend is developed using Next.js and React.js. It provides the user interface for authentication, assessments, dashboard information, learning recommendations, and AI Teacher interactions.

### Backend

The backend is developed using Node.js and Express.js.

It handles:

- Authentication and authorization.
- API requests from the frontend.
- Assessment-related operations.
- Database communication.
- AI service integration.
- Learning recommendation operations.

### Database

MongoDB Atlas is used to store application data.

Mongoose is used to define models and interact with the database.

### AI Integration

The application integrates with an LLM service through an API.

The AI functionality supports assessment-related content generation, personalized learning recommendations, and conversational teaching.

The backend communicates with the AI service so that sensitive API credentials remain on the server side.

## Project Structure

The repository is organized into separate frontend and backend applications.

```text
adaptive-study-partner/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── ...
│   └── package.json
│
├── .gitignore
└── README.md
```

The frontend contains the Next.js application, while the backend contains the Express.js server and related application logic.

*Note: The directory listing above is a simplified overview. Individual folders and files may differ in the current repository.*

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure the following tools are installed:

- Node.js
- npm
- Git
- MongoDB Atlas account or a MongoDB instance
- An API key for the configured LLM provider

### 1. Clone the Repository

```bash
git clone https://github.com/SmithKadu09/adaptive-study-partner.git
```

Navigate into the project directory:

```bash
cd adaptive-study-partner
```

### 2. Configure the Backend

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the backend directory.

Add the required environment variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_llm_api_key
```

Use the exact variable names expected by your current backend configuration. If your implementation uses a different LLM key name, configure that name instead.

Start the backend:

```bash
npm start
```

The backend should start on the configured port. The local development address used by the project is:

```text
http://localhost:5000
```

### 3. Configure the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file inside the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```

### 4. Run the Application

Make sure both frontend and backend servers are running.

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

You can now register an account, log in, take assessments, view recommendations, use the AI Teacher, and track your learning progress.

## Environment Variables

The application uses environment variables to keep configuration values and sensitive credentials outside the source code.

### Backend

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used for signing and verifying JWTs |
| `OPENROUTER_API_KEY` | API key for the configured LLM service |

### Frontend

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

**Important:** Never commit actual API keys, database credentials, JWT secrets, or other sensitive environment values to GitHub.

## Security

The application implements several fundamental security mechanisms:

- **Password Hashing:** Passwords