import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from '../backend/src/config/db.js';
import authRoutes from '../backend/src/routes/authRoutes.js';
import imageRoutes from '../backend/src/routes/imageRoutes.js';
import paymentRoutes from '../backend/src/routes/paymentRoutes.js';
import uploadRoutes from '../backend/src/routes/uploadRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
// Stripe webhook needs raw body, so we'll configure that specifically
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);

// Fix static folder serving for serverless functions
// We omit production frontend serving logic since Vercel handles frontend hosting automatically.
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
