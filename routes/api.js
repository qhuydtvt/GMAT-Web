const express = require('express');
const router = express.Router();

const auth = require('./auth');

router.get('/', (req, res) => {
    res.send('Api Router');
});

router.post('/signup', auth.signUp);

router.post('/signin', auth.signIn);

router.post('/auth', auth.checkToken);

module.exports = router;