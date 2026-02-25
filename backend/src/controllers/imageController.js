import Image from '../models/Image.js';

// @desc    Fetch all images
// @route   GET /api/images
// @access  Public
export const getImages = async (req, res) => {
    try {
        const { category, search, type, sort } = req.query;

        let query = {};

        // Search filter
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        // Category filter (car, bike, old, modern)
        if (category) {
            query.category = category;
        }

        // Type filter (free, premium)
        if (type) {
            if (type === 'premium') {
                query.isPremium = true;
            } else if (type === 'free') {
                query.isPremium = false;
            }
        }

        let queryBuilder = Image.find(query);

        // Sorting
        if (sort) {
            if (sort === 'price_asc') queryBuilder = queryBuilder.sort({ price: 1 });
            if (sort === 'price_desc') queryBuilder = queryBuilder.sort({ price: -1 });
            if (sort === 'newest') queryBuilder = queryBuilder.sort({ createdAt: -1 });
        } else {
            queryBuilder = queryBuilder.sort({ createdAt: -1 }); // Default sort by newest
        }

        const images = await queryBuilder.exec();
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single image
// @route   GET /api/images/:id
// @access  Public
export const getImageById = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);

        if (image) {
            res.json(image);
        } else {
            res.status(404).json({ message: 'Image not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new image
// @route   POST /api/images
// @access  Private/Admin
export const createImage = async (req, res) => {
    try {
        const { title, description, category, price, imageUrl, isPremium } = req.body;

        const image = new Image({
            title,
            description,
            category,
            price: isPremium ? price : 0,
            imageUrl,
            isPremium
        });

        const createdImage = await image.save();
        res.status(201).json(createdImage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update an image
// @route   PUT /api/images/:id
// @access  Private/Admin
export const updateImage = async (req, res) => {
    try {
        const { title, description, category, price, imageUrl, isPremium } = req.body;

        const image = await Image.findById(req.params.id);

        if (image) {
            image.title = title || image.title;
            image.description = description || image.description;
            image.category = category || image.category;
            image.price = isPremium !== undefined ? (isPremium ? (price !== undefined ? price : image.price) : 0) : image.price;
            image.imageUrl = imageUrl || image.imageUrl;
            image.isPremium = isPremium !== undefined ? isPremium : image.isPremium;

            const updatedImage = await image.save();
            res.json(updatedImage);
        } else {
            res.status(404).json({ message: 'Image not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an image
// @route   DELETE /api/images/:id
// @access  Private/Admin
export const deleteImage = async (req, res) => {
    try {
        // using fineByIdAndDelete is simpler and avoids issues with document vs model methods
        const deletedImage = await Image.findByIdAndDelete(req.params.id);

        if (deletedImage) {
            res.json({ message: 'Image removed' });
        } else {
            res.status(404).json({ message: 'Image not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
