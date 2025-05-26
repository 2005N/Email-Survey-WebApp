#  Emaily – Email Campaign Web App

Emaily is a full-stack web application that lets users create, manage, and send email surveys to recipients. Designed for marketing teams and small businesses, it supports OAuth login, tracks responses, and provides a user-friendly interface for email-based campaigns.

<br/>

##  Live Demo
🔗 [Deployed on Render](https://emaily-2nzb.onrender.com)

<br/>

## ✨ Features

-  Google & GitHub OAuth 2.0 authentication
-  Create and send email surveys
-  Collect feedback from recipients via embedded survey links
-  Track number of responses (Yes/No)
-  Stripe-based credits system for sending emails
-  Hosted on Render with MongoDB Atlas backend
-  Session management with cookie-based auth
-  Optional Dark Mode

<br/>

##  Tech Stack

**Frontend**:
- React.js
- Redux
- Materialize CSS

**Backend**:
- Node.js
- Express
- MongoDB (via Mongoose)
- Passport.js (OAuth Authentication)
- SendGrid (Transactional Email Service)
- Stripe API (Payments)

<br/>

## 📷 Screenshots


<br/>

##  Run Locally

### Prerequisites
- Node.js & npm
- MongoDB Atlas account
- Stripe & SendGrid API keys
- Google OAuth credentials (Client ID + Secret)

### Installation

```bash
git clone https://github.com/2005N/Emaily.git
cd Emaily
npm install
cd client
npm install
cd ..
```
#### Set environment variables
- Create a dev.js file in the config folder:
  ```bash
  module.exports = {
    googleClientID: your_id_here,
    googleClientSecret: your_secret,
    mongoURI: your_mongo_uri,
    cookieKey: random_secure_string,
    stripePublishableKey: your_publishable_key,
    stripeSecretKey: your_secret_key,
    sendGridKey: your_key,
    redirectDomain: 'http://localhost:3000'
  }
  ```

#### Run the app
```bash
# Run both client and server concurrently
npm run dev
```
