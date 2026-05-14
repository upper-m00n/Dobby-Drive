const Folder = require('../models/Folder');
const { calculateFolderSize, recursiveDelete, getFolderPath } = require('../utils/recursive');

// @desc   Create a folder
// @route  POST /api/folders
// @access Private
const createFolder = async (req, res, next) => {
  try {
    const { name, parentFolderId, color } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Folder name is required.' });
    }

    // Validate parent belongs to user
    if (parentFolderId) {
      const parent = await Folder.findOne({ _id: parentFolderId, ownerId: req.user._id });
      if (!parent) {
        return res.status(404).json({ success: false, message: 'Parent folder not found.' });
      }
    }

    const folder = await Folder.create({
      name,
      parentFolderId: parentFolderId || null,
      ownerId: req.user._id,
      color: color || '#6366f1',
    });

    res.status(201).json({ success: true, folder });
  } catch (error) {
    next(error);
  }
};

// @desc   Get folder by ID with size and breadcrumb
// @route  GET /api/folders/:id
// @access Private
const getFolder = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 'root' is a special virtual ID meaning top-level
    if (id === 'root') {
      const folders = await Folder.find({ ownerId: req.user._id, parentFolderId: null }).sort({ createdAt: -1 });

      // Attach sizes
      const foldersWithSize = await Promise.all(
        folders.map(async (f) => ({
          ...f.toObject(),
          size: await calculateFolderSize(f._id),
        }))
      );

      return res.json({ success: true, folder: null, subfolders: foldersWithSize, breadcrumbs: [] });
    }

    const folder = await Folder.findOne({ _id: id, ownerId: req.user._id });
    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found.' });
    }

    const subfolders = await Folder.find({ parentFolderId: id, ownerId: req.user._id }).sort({ createdAt: -1 });
    const foldersWithSize = await Promise.all(
      subfolders.map(async (f) => ({
        ...f.toObject(),
        size: await calculateFolderSize(f._id),
      }))
    );

    const size = await calculateFolderSize(id);
    const breadcrumbs = await getFolderPath(id);

    res.json({
      success: true,
      folder: { ...folder.toObject(), size },
      subfolders: foldersWithSize,
      breadcrumbs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get all user folders (flat list for tree)
// @route  GET /api/folders
// @access Private
const getAllFolders = async (req, res, next) => {
  try {
    const folders = await Folder.find({ ownerId: req.user._id }).sort({ name: 1 });
    res.json({ success: true, folders });
  } catch (error) {
    next(error);
  }
};

// @desc   Update folder
// @route  PATCH /api/folders/:id
// @access Private
const updateFolder = async (req, res, next) => {
  try {
    const { name, color } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (color) updates.color = color;

    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found.' });
    }

    res.json({ success: true, folder });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete folder recursively
// @route  DELETE /api/folders/:id
// @access Private
const deleteFolder = async (req, res, next) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, ownerId: req.user._id });
    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found.' });
    }

    await recursiveDelete(folder._id, req.user._id);

    res.json({ success: true, message: 'Folder deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createFolder, getFolder, getAllFolders, updateFolder, deleteFolder };
