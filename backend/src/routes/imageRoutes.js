import express from 'express';
import { getImages, getImageById, createImage, updateImage, deleteImage } from '../controllers/imageController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getImages)
    .post(protect, admin, createImage);

router.route('/:id')
    .get(getImageById)
    .put(protect, admin, updateImage)
    .delete(protect, admin, deleteImage);

export default router;
