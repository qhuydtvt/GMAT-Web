const express = require('express');
const router = express.Router();

const auth = require('./auth');

router.get('/', (req, res) => {
    res.json({success: 1, message: "Api Router"});
});

router.post('/signup', auth.signUp);

router.post('/signin', auth.signIn);

router.post('/auth', auth.isAuthenticated, (req, res) => {
    res.json({
        success: 1,
        message: "Auth success!",
        user: req.user
    });
});

router.use('/classrooms', auth.isAuthenticated, auth.hasRole("lecture"), (req, res)=>{
    res.json({success: 1, message: "Classrooms api"});
});

router.get('/users/:id', auth.isAuthenticated, (req, res)=>{
    res.json({success: 1, message: "Students api"});
});

module.exports = router;