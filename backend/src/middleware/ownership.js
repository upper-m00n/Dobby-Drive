const Folder = require('../models/Folder');
const Image = require('../models/Image');

// Verify folder ownership
const verifyFolderOwnership = async (req, res, next) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found.' });
    }
    if (folder.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access forbidden.' });
    }
    req.folder = folder;
    next();
  } catch (error) {
    next(error);
  }
};

// Verify image ownership
const verifyImageOwnership = async (req, res, next) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found.' });
    }
    if (image.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access forbidden.' });
    }
    req.image = image;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyFolderOwnership, verifyImageOwnership };
