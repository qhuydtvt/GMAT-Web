const express = require('express');
const router = express.Router();

const auth = require('./auth');

router.post('/signup', auth.signUp);

router.post('/signin', auth.signIn);

module.exports = router;