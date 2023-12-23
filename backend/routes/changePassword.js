const express = require('express');
const changePasswordController = require('../controllers/changePasswordUser');
const router = express.Router();

router.patch('/changePassword', changePasswordController.changePassword);

module.exports = router;