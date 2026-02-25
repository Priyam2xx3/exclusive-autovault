import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Image'
    },
    paymentId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'completed'
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
