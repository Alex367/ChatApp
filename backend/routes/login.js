const express = require('express');
const loginControllers = require('../controllers/loginUser');
const router = express.Router();


router.post('/login', loginControllers.postLogin);

module.exports = router;
