# 🚀 Job Posting Platform

---

## 🛠️ Design

This project is a **job posting platform** built with a modern web stack:

- **Backend (`jobapp-backend/`):**  
  Developed using **Node.js** and **Express.js**, the backend provides RESTful APIs for user management, job postings, and a 🤖 ChatGPT-powered chatbot feature. Data models for users and jobs are defined with MongoDB (`models/Job.js`, `models/User.js`).

- **Frontend (`src/`):**  
  The frontend is built with **React.js** ⚛️. It includes pages for home, job details, login/register, and job search. Reusable components such as `ChatBot` and `Navbar` enhance the user experience.

---

## 📌 Assumptions

- 👤 Users can register and log in to the system.
- 🔒 Only authenticated users are allowed to add job postings.
- 🤖 The ChatGPT integration assists users with job searching and application processes.
- 🔗 Frontend and backend communicate via API calls.
- 📦 All required dependencies are listed in the respective `package.json` files.

---

## 🐞 Issues Encountered

- **Authentication:**  
  Implementing secure, token-based authentication (e.g., JWT) required careful handling of token storage and management.

- **ChatGPT Integration:**  
  Storing the OpenAI API key securely and managing API request limits were important considerations.

- **CORS Issues:**  
  Since the frontend and backend run on different ports during development, proper CORS configuration was necessary.

- **Data Validation:**  
  Additional validation was implemented to ensure the integrity of user input and prevent invalid data from being processed.

- **Error Handling:**  
  Custom middleware was developed to handle API errors and provide meaningful feedback to users.

---
