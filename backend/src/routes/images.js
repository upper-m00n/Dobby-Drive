const express = require('express');
const router = express.Router();
const { upload, uploadImage, getFolderImages, deleteImage } = require('../controllers/imageController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/upload', upload.single('image'), uploadImage);
router.get('/:folderId', getFolderImages);
router.delete('/:id', deleteImage);

module.exports = router;
