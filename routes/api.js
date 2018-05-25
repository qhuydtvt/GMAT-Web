const express = require('express');
const router = express.Router();

const auth = require('./auth');
const questionRouter = require('./question');
const questionPackRouter = require('./questionPack');
const classroomRouter = require('./classroom');
const resultRouter = require('./result');
const studentRouter = require('./student');

router.get('/', (req, res) => {
    res.json({success: 1, message: "Api Router"});
});

router.post('/signup', auth.signUp);

router.post('/signin', auth.signIn);

router.use(auth.isAuthenticated);

router.post('/change-password', auth.changePassword);

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

router.use('/results', resultRouter);

router.use('/students', studentRouter);

module.exports = router;