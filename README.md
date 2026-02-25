# Exclusive AutoVault

## 🚀 Live Preview
**Check out the live website here:** [https://exclusive-autovault.vercel.app/](https://exclusive-autovault.vercel.app/)

> **Note:** The live deployed version is currently **not connected to the database API** (environment variables are yet to be configured on the hosting platform). Because of this, certain dynamic features like signing up, logging in, and loading the image gallery currently will not function in the live preview.

---

## 📖 About The Project

**Exclusive AutoVault** is a premium, full-stack web application designed for browsing, searching, and purchasing high-quality, ultra-high-resolution images of modern and classic exclusive cars and bikes. 

The application features a stunning ultra-modern luxury aesthetic, utilizing a sleek black and gold color palette, glassmorphism UI elements, and smooth micro-animations powered by Framer Motion. 

### Key Features (Local Development):
* **Robust Authentication:** Secure JWT-based login and registration.
* **Premium Gallery:** Browse, filter, and search through a curated collection of vehicle images.
* **Image Detail & Magnifier:** High-resolution viewing with a custom hover-zoom magnifier effect.
* **Stripe Integration:** Secure checkout sessions for purchasing premium downloadable images.
* **Admin Dashboard:** A protected area for managing inventory and uploading new images.

---

## 🛠️ Technology Stack

* **Frontend:** React.js, Vite, Tailwind CSS (v4), Zustand, Framer Motion, React Router.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (Mongoose).
* **Authentication:** JSON Web Tokens (JWT) & bcrypt.
* **Payment Processing:** Stripe API.

---

## 📂 Directory Structure

```text
exclusive-autovault/
├── api/                    # Vercel Serverless Function entry point
│   └── index.js            # Express server initialization
├── backend/                # Node.js Express API source code
│   ├── src/
│   │   ├── config/         # Database connection configuration
│   │   ├── controllers/    # API endpoint logic (auth, images, payments)
│   │   ├── middleware/     # JWT authentication and error handling
│   │   ├── models/         # Mongoose schemas (User, Image, Order)
│   │   └── routes/         # Express route definitions
├── frontend/               # React Vite frontend application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI elements (Navbar, Cards, Footer)
│   │   ├── pages/          # Main application views (Home, Category, Detail, Admin)
│   │   ├── services/       # Axios API integration
│   │   ├── store/          # Zustand global state management
│   │   ├── App.jsx         # React Router setup
│   │   ├── index.css       # Global Tailwind CSS and custom theming
│   │   └── main.jsx        # React DOM rendering
├── .gitignore              # Git ignore rules
├── package.json            # Root workspace dependencies (for Vercel builds)
├── render.yaml             # Render deployment configuration (alternative)
└── vercel.json             # Vercel Serverless & Static routing configuration
```

---

## 💻 Local Development Setup

To run this project locally with full database functionality:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Priyam2xx3/exclusive-autovault.git
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file inside the `backend/` directory with the following variables:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:5173
   STRIPE_SECRET_KEY=your_stripe_secret
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

4. **Run the Application:**
   * **Start the Backend:** `cd backend && npm run dev`
   * **Start the Frontend:** `cd frontend && npm run dev`
   
   The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:5000`.
