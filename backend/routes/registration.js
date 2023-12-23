const express = require('express');
const registrationController = require('../controllers/registrationUser');
const router = express.Router();

router.post('/registration', registrationController.postRegistration);

module.exports = router;