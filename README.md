# ♟️ Checkmate Arena

**Checkmate Arena** is a full-stack web platform for organizing and managing online chess tournaments.

The platform provides Google authentication, tournament discovery, player registration, registration verification, admin management, and a secure backend architecture for handling authenticated users.

> Built as a full-stack project using React, Node.js, Express, MongoDB, and Firebase Authentication.

---

## ✨ Features

### 🔐 Authentication
- Continue with Google using Firebase Authentication
- Persistent authentication state
- Login and logout functionality
- User profile information in the navigation bar
- Firebase ID token-based authentication
- Backend token verification using Firebase Admin SDK
- Protected backend routes
- Authenticated user synchronization with MongoDB

### ♟️ Tournament Platform
- Tournament details page
- Prize pool information
- Tournament rules
- Tournament registration flow
- Chess.com username-based registration
- Registered players page
- Registration verification page
- Previous tournament results section
- FAQ and support pages

### 🛡️ Admin & Backend
- Admin dashboard architecture
- Registration management
- Tournament management
- Player verification workflow
- MongoDB database integration
- REST API architecture
- Secure authentication middleware
- Environment-based configuration

---

## 🔐 Authentication Flow

Checkmate Arena uses **Firebase Authentication** for Google Sign-In and the **Firebase Admin SDK** for secure server-side authentication.

```text
User
  ↓
Continue with Google
  ↓
Firebase Authentication
  ↓
Firebase ID Token
  ↓
React Frontend
  ↓
Authorization: Bearer <ID_TOKEN>
  ↓
Express Backend
  ↓
Firebase Admin SDK
  ↓
verifyIdToken()
  ↓
Authenticated User
  ↓
MongoDB User
  ↓
Protected Registration APIs
```

The backend does not rely on user identity information sent directly from the client. Protected endpoints verify the Firebase ID token before processing authenticated requests.

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Firebase Authentication
- React Context API
- CSS

### Backend

- Node.js
- Express.js
- Firebase Admin SDK
- REST APIs

### Database

- MongoDB
- Mongoose

### Authentication

- Firebase Authentication
- Google Sign-In
- Firebase ID Token Verification

### Development Tools

- Git
- GitHub
- npm
- VS Code / Cursor

---

## 📁 Project Structure

```text
checkmate-arena/
│
├── client/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ContinueWithGoogleButton.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ...
│   │   │
│   │   ├── config/
│   │   │   └── firebase.js
│   │   │
│   │   ├── context/
│   │   │   └── PlayerAuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── TournamentDetails.jsx
│   │   │   ├── PrizePoolPage.jsx
│   │   │   ├── RulesPage.jsx
│   │   │   ├── RegisteredPlayersPage.jsx
│   │   │   ├── VerifyRegistrationPage.jsx
│   │   │   ├── PreviousTournamentsPage.jsx
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   └── ...
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   ├── firebaseAdmin.js
│   │   │   └── razorpay.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── registrationController.js
│   │   │   ├── tournamentController.js
│   │   │   └── ...
│   │   │
│   │   ├── middleware/
│   │   │   ├── firebaseAuth.js
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Registration.js
│   │   │   ├── Tournament.js
│   │   │   └── ...
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── registrationRoutes.js
│   │   │   ├── tournamentRoutes.js
│   │   │   └── ...
│   │   │
│   │   └── server.js
│   │
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── package.json
├── run-dev.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB
- Git

You will also need a Firebase project with Google Authentication enabled.

---

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd checkmate-arena
```

---

### 2. Install Dependencies

Install root dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

Then return to the project root:

```bash
cd ..
```

---

## ⚙️ Environment Variables

The repository contains `.env.example` files showing the required configuration.

Create your own local `.env` files.

### Frontend

Create:

```text
client/.env
```

Example:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_API_URL=/api
```

Firebase web configuration values can be obtained from your Firebase project's web app configuration.

---

### Backend

Create:

```text
server/.env
```

Example:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

MONGODB_URI=mongodb://localhost:27017/chess-tournament

JWT_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

> **Never commit `.env` files, Firebase Admin private keys, database credentials, payment secrets, or service-account JSON files to GitHub.**

---

## ▶️ Running the Application

From the project root:

```bash
npm run dev
```

The development environment starts the frontend and backend.

### Frontend

```text
http://localhost:5173
```

### Backend

```text
http://localhost:5000
```

### Backend Health Check

```text
http://localhost:5000/api/health
```

---

## 🔑 Google Authentication Setup

To use Google Sign-In:

1. Create a Firebase project.
2. Add a Web App to the Firebase project.
3. Open **Firebase Authentication**.
4. Enable the **Google** sign-in provider.
5. Add your Firebase Web configuration to `client/.env`.
6. Configure Firebase Admin credentials in `server/.env`.
7. Add the required development and production domains to Firebase Authorized Domains when necessary.

---

## 🛡️ Security

Security practices used in the project include:

- Firebase ID token verification on the backend
- Protected API routes
- Server-side Firebase Admin authentication
- Environment variables for sensitive configuration
- `.env` files excluded from Git
- Firebase Admin credentials kept server-side
- Authentication identity derived from verified tokens
- Separation between client and server credentials

The frontend sends Firebase ID tokens using the authorization header:

```text
Authorization: Bearer <Firebase-ID-Token>
```

The backend verifies the token before allowing protected operations.

---

## ♟️ Tournament Registration Flow

The intended tournament experience is:

```text
Visit Checkmate Arena
        ↓
Browse Tournament
        ↓
View Details / Prize Pool / Rules
        ↓
Register Now
        ↓
Not Logged In?
        ↓
Continue with Google
        ↓
Tournament Registration
        ↓
Payment
        ↓
Registration Confirmation
        ↓
Player Verification
        ↓
Tournament Participation
```

Visitors can browse tournament information without authentication. Authentication is required when accessing protected registration functionality.

---

## 💳 Payment Integration

The project contains architecture for integrating online tournament payments.

Production payment processing and complete payment verification should be configured before accepting real tournament payments.

Planned payment flow:

```text
Registration
    ↓
Create Payment Order
    ↓
Payment Gateway
    ↓
Server-side Verification
    ↓
Successful Registration
    ↓
Unique Registration ID
```

---

## 🗺️ Roadmap

Planned improvements include:

- Production-ready payment gateway integration
- Automated registration IDs
- Enhanced tournament management
- Improved admin analytics
- Player dashboard
- Player tournament history
- Automated tournament notifications
- Improved registration verification workflow
- Deployment and production monitoring
- Additional tournament formats

---

## 📸 Screenshots

Add screenshots of the application here.

### Home Page

<!-- Add screenshot here -->

### Tournament Details

<!-- Add screenshot here -->

### Google Sign-In

<!-- Add screenshot here -->

### Registration Page

<!-- Add screenshot here -->

### Admin Dashboard

<!-- Add screenshot here -->

---

## 🤝 Contributing

This project is currently being developed as a personal full-stack project.

Suggestions, issues, and constructive feedback are welcome.

---

## ⚠️ Disclaimer

Checkmate Arena is an independent project.

Any third-party names, trademarks, platforms, or services referenced by the application belong to their respective owners.

The project should not be interpreted as an official product of or endorsement by any third-party chess platform unless explicitly stated.

---

## 👨‍💻 Author

**Somya Yadav**

Computer Science & Engineering  
India

---

## ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

<p align="center">
  <strong>♟️ Checkmate Arena</strong><br>
  Play. Compete. Checkmate.
</p>
