const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Folder name is required'],
      trim: true,
      maxlength: [100, 'Folder name cannot exceed 100 characters'],
    },
    parentFolderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
      default: null, // null = root level
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    color: {
      type: String,
      default: '#6366f1', // default indigo
    },
  },
  { timestamps: true }
);

// Index for fast owner+parent lookups
folderSchema.index({ ownerId: 1, parentFolderId: 1 });
folderSchema.index({ ownerId: 1 });

module.exports = mongoose.model('Folder', folderSchema);
