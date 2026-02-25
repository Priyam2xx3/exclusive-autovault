import express from 'express';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
    }
});

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'), false);
        }
    }
});

router.post('/', upload.single('image'), (req, res) => {
    if (req.file) {
        res.send(`/${req.file.path.replace(/\\/g, '/')}`);
    } else {
        res.status(400).send('No image uploaded');
    }
});

export default router;
