const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Image name is required'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    publicId: {
      type: String, // Cloudinary public_id for deletion
      default: null,
    },
    size: {
      type: Number, // bytes
      required: true,
    },
    mimeType: {
      type: String,
      default: 'image/jpeg',
    },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

imageSchema.index({ folderId: 1, ownerId: 1 });
imageSchema.index({ ownerId: 1 });

module.exports = mongoose.model('Image', imageSchema);
