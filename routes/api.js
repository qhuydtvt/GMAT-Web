const express = require('express');
const router = express.Router();

const auth = require('./auth');

router.get('/', (req, res) => {
    res.send('Api Router');
});

router.post('/signup', auth.signUp);

router.post('/signin', auth.signIn);

module.exports = router;