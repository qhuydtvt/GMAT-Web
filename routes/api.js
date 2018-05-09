const express = require('express');
const router = express.Router();

const auth = require('./auth');
const questionRouter = require('./question');
const questionPackRouter = require('./questionPack');
const classroomRouter = require('./classroom');

router.get('/', (req, res) => {
    res.json({success: 1, message: "Api Router"});
});

router.post('/signup', auth.signUp);

router.post('/signin', auth.signIn);

router.use(auth.isAuthenticated);

router.use(auth.checkPermission);

router.post('/auth', (req, res) => {
    res.json({
        success: 1,
        message: "Auth success!",
        user: req.user
    });
});

router.use('/questions', questionRouter);

router.use('/questionpacks', questionPackRouter);

router.use('/classrooms', classroomRouter);

router.get('/users/:id', (req, res)=>{
    res.json({success: 1, message: "Students api"});
});

module.exports = router;