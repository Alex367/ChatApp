const express = require('express');
const settingsController = require('../controllers/settingsUser');

const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/settings', settingsController.getUserInfo);

router.patch('/settings', settingsController.patchUserInfo);

router.post("/settings/avatar", fileUpload.single('file'), settingsController.sendAvatar)

router.delete("/settings", settingsController.deleteAccount)

module.exports = router;
