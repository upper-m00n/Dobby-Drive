const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Image = require('../models/Image');
const Folder = require('../models/Folder');
const { cloudinary, isCloudinaryConfigured, deleteFromCloudinary } = require('../utils/cloudinary');

// ─── Multer config ───────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|svg|bmp|tiff/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) return cb(null, true);
  cb(new Error('Only image files are allowed.'), false);
};

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter,
});

// ─── Upload Image ─────────────────────────────────────────────────
// @route  POST /api/images/upload
// @access Private
const uploadImage = async (req, res, next) => {
  try {
    const { folderId } = req.body;

    if (!folderId) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'folderId is required.' });
    }

    // Verify folder ownership
    const folder = await Folder.findOne({ _id: folderId, ownerId: req.user._id });
    if (!folder) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: 'Folder not found.' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    let url = '';
    let publicId = null;

    if (isCloudinaryConfigured()) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: `cloudvault/${req.user._id}`,
        resource_type: 'image',
      });
      url = result.secure_url;
      publicId = result.public_id;
      // Remove local temp file
      fs.unlinkSync(req.file.path);
    } else {
      // Serve from local disk
      url = `/uploads/${req.file.filename}`;
    }

    const image = await Image.create({
      name: req.file.originalname,
      url,
      publicId,
      size: req.file.size,
      mimeType: req.file.mimetype,
      folderId,
      ownerId: req.user._id,
    });

    res.status(201).json({ success: true, image });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    next(error);
  }
};

// @desc   Get images in a folder
// @route  GET /api/images/:folderId
// @access Private
const getFolderImages = async (req, res, next) => {
  try {
    const { folderId } = req.params;

    // Verify folder ownership
    const folder = await Folder.findOne({ _id: folderId, ownerId: req.user._id });
    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found.' });
    }

    const images = await Image.find({ folderId, ownerId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, images });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete image
// @route  DELETE /api/images/:id
// @access Private
const deleteImage = async (req, res, next) => {
  try {
    const image = await Image.findOne({ _id: req.params.id, ownerId: req.user._id });
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found.' });
    }

    // Delete from Cloudinary if applicable
    if (image.publicId) {
      await deleteFromCloudinary(image.publicId);
    } else if (image.url.startsWith('/uploads/')) {
      // Delete local file
      const filePath = path.join(__dirname, '../../', image.url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await image.deleteOne();

    res.json({ success: true, message: 'Image deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { upload, uploadImage, getFolderImages, deleteImage };
