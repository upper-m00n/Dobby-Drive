const express = require('express');
const router = express.Router();
const { createFolder, getFolder, getAllFolders, updateFolder, deleteFolder } = require('../controllers/folderController');
const { protect } = require('../middleware/auth');

router.use(protect); // All folder routes require auth

router.get('/', getAllFolders);
router.post('/', createFolder);
router.get('/:id', getFolder);
router.patch('/:id', updateFolder);
router.delete('/:id', deleteFolder);

module.exports = router;
