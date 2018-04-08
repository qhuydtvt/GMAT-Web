const express = require('express');
const router = express.Router();

const auth = require('./auth');

router.post('/signUp', auth.signUp);

router.post('/signIn', auth.signIn);

module.exports = router;