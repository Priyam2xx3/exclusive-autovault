import Stripe from 'stripe';
import Order from '../models/Order.js';
import Image from '../models/Image.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create Stripe Checkout Session
// @route   POST /api/payments/create-checkout-session
// @access  Private
export const createCheckoutSession = async (req, res) => {
    try {
        const { imageId } = req.body;

        const image = await Image.findById(imageId);

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        if (!image.isPremium) {
            return res.status(400).json({ message: 'This image is free, no payment required' });
        }

        // Check if user already purchased
        const user = await User.findById(req.user.id);
        if (user.purchasedImages.includes(imageId)) {
            return res.status(400).json({ message: 'You have already purchased this image' });
        }

        // Validate that Stripe key exists (skip during local initial dev setup)
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder_key') {
            console.log('Skipping real stripe logic to use local dummy checkout');

            // Simulate successful payment for dummy environment
            const dummyOrder = await Order.create({
                user: req.user.id,
                image: imageId,
                paymentId: 'dummy_payment_' + Date.now(),
                amount: image.price,
                status: 'completed'
            });

            user.purchasedImages.push(imageId);
            await user.save();

            return res.json({ id: 'dummy_session_id', url: `${process.env.FRONTEND_URL}/payment-success?session_id=dummy_session_id` });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: image.title,
                            images: [image.imageUrl],
                        },
                        unit_amount: image.price * 100, // Stripe expects cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/image/${imageId}`,
            metadata: {
                userId: req.user.id.toString(),
                imageId: imageId.toString(),
            }
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Webhook handler for Stripe
// @route   POST /api/payments/webhook
// @access  Public
export const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle successful checkout
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        try {
            const userId = session.metadata.userId;
            const imageId = session.metadata.imageId;
            const amount = session.amount_total / 100;

            // Create order
            await Order.create({
                user: userId,
                image: imageId,
                paymentId: session.payment_intent,
                amount: amount,
                status: 'completed'
            });

            // Add to user purchasedImages
            const user = await User.findById(userId);
            if (user && !user.purchasedImages.includes(imageId)) {
                user.purchasedImages.push(imageId);
                await user.save();
            }

        } catch (error) {
            console.error('Error fulfilling order:', error);
        }
    }

    res.status(200).json({ received: true });
};

// @desc    Get all orders for a user
// @route   GET /api/payments/orders
// @access  Private
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('image');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
