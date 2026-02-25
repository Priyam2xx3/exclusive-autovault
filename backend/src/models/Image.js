import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    category: {
        type: String,
        required: true,
        enum: ['car', 'bike', 'old', 'modern']
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    imageUrl: {
        type: String,
        required: [true, 'Please add an image URL']
    },
    isPremium: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Image = mongoose.model('Image', imageSchema);
export default Image;
