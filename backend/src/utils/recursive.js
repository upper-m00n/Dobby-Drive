const Folder = require('../models/Folder');
const Image = require('../models/Image');

/**
 * Recursively collect all subfolder IDs under a given folderId
 * Returns an array of ObjectIds including the root folderId
 */
const getAllDescendantFolderIds = async (folderId) => {
  const ids = [folderId];
  const queue = [folderId];

  while (queue.length > 0) {
    const currentId = queue.shift();
    const children = await Folder.find({ parentFolderId: currentId }).select('_id');
    for (const child of children) {
      ids.push(child._id);
      queue.push(child._id);
    }
  }

  return ids;
};

/**
 * Calculate total size (bytes) of all images inside a folder and its descendants
 */
const calculateFolderSize = async (folderId) => {
  const allFolderIds = await getAllDescendantFolderIds(folderId);
  const result = await Image.aggregate([
    { $match: { folderId: { $in: allFolderIds } } },
    { $group: { _id: null, totalSize: { $sum: '$size' } } },
  ]);
  return result.length > 0 ? result[0].totalSize : 0;
};

/**
 * Recursively delete all subfolders and images under folderId
 */
const recursiveDelete = async (folderId, ownerId) => {
  const subfolders = await Folder.find({ parentFolderId: folderId, ownerId });

  for (const subfolder of subfolders) {
    await recursiveDelete(subfolder._id, ownerId);
  }

  // Delete all images in this folder
  await Image.deleteMany({ folderId, ownerId });

  // Delete the folder itself
  await Folder.deleteOne({ _id: folderId, ownerId });
};

/**
 * Get folder path (breadcrumb trail)
 */
const getFolderPath = async (folderId) => {
  const path = [];
  let currentId = folderId;

  while (currentId) {
    const folder = await Folder.findById(currentId).select('name parentFolderId');
    if (!folder) break;
    path.unshift({ _id: folder._id, name: folder.name });
    currentId = folder.parentFolderId;
  }

  return path;
};

module.exports = { getAllDescendantFolderIds, calculateFolderSize, recursiveDelete, getFolderPath };
