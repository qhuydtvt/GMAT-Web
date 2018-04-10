const jwt = require('jsonwebtoken');

const hash = require('../../helpers/hash');
const settings = require('../../settings');
const UserModel = require('../../models/user.model');

const signUp =  (req, res) => {
    const body = req.body;
    const masterPassword = body.masterPassword;
    if (!masterPassword) {
        res.status(400).json({
            success: 0,
            messaage: "You must provide masterPassword!"
        });
    }
    else if (!hash.compareHash(masterPassword, settings.masterPasswordHash)) {
        res.status(401).json({
            success: 0,
            messaage: "Master password is invalid!"
        });
    }
    else {
        if (!body.username) {
            res.status(400).json({
                success: 0,
                messaage: "You must provide username!"
            });
        } else if (!body.password) {
            res.status(400).json({
                success: 0,
                messaage: "You must provide password!"
            });
        } else {
            let newUser = {
                username: body.username,
                hashPassword: hash.generateHash(body.password)
            }
            UserModel.create(newUser, (err, createdUser) => {
                if (err) {
                    res.status(500).json({
                        success: 0,
                        messaage: "Could not create user!",
                        error: err
                    });
                } else {
                    let now = new Date();
                    let expiredIn = now.setDate(now.getDate() + 7);

                    const token = jwt.sign({
                        _id: createdUser._id,
                        username: createdUser.username,
                        exp: expiredIn
                    }, settings.superSecret);

                    res.status(201).json({
                        success: 1,
                        messaage: "Sign-up success!",
                        token
                    });
                }
            });
        }
    }
};

const signIn = (req, res) => {
    const body = req.body;
    if (!body.username) {
        res.status(400).json({
            success: 0,
            messaage: "You must provide username!"
        });
    } else if (!body.password) {
        res.status(400).json({
            success: 0,
            messaage: "You must provide password!"
        });
    } else {
        UserModel.findOne({ username: body.username }, (err, foundUser) => {
            if (err) {
                res.status(500).json({
                    success: 0,
                    messaage: "Could not find user!",
                    error: err
                });
            }
            else if (!foundUser) {
                res.status(401).json({
                    success: 0,
                    messaage: "No such user!"
                });
            } 
            else {
                const hashPassword = foundUser.hashPassword;
                if (!hash.compareHash(body.password, hashPassword)) {
                    res.status(401).json({
                        success: 0,
                        messaage: "Wrong password!"
                    });
                } else {
                    let now = new Date();
                    let expiredIn = now.setDate(now.getDate() + 7);

                    const token = jwt.sign({
                        _id: foundUser._id,
                        username: foundUser.username,
                        exp: expiredIn
                    }, settings.superSecret);

                    res.json({
                        success: 1,
                        message: "Logged in succesfully!",
                        token
                    });
                }
            }
        });   
    }
};

const checkToken = (req, res) => {
    const body = req.body;
    if (!body.token) {
        res.status(400).json({
            success: 0,
            message: "You must provide token!"
        });
    } else {
        jwt.verify(body.token, settings.superSecret, (err, user) => {
            if (!user || typeof user._id == 'undefined' || ( typeof user._id != 'undefined' && user._id == null )) {
                res.status(401).json({
                    success: 0,
                    message: "Token is invalid!"
                });
            } else {
                UserModel.findById(user._id, (err, foundUser) => {
                    if (err) {
                        res.status(500).json({
                            success: 0,
                            message: "Could not find user!"
                        });
                    } else if (!foundUser) {
                        res.status(401).json({
                            success: 0,
                            message: "No such user!"
                        });
                    } else {                        
                        if (new Date().valueOf() > user.exp) {
                            res.json({
                                success: 0,
                                message: "Token is expired!"
                            });
                        } else {
                            res.json({
                                success: 1,
                                message: "Auth token success!",
                                user: user
                            });
                        }
                    }
                });
            }
            console.log(user);
        });
    }
}

module.exports = {
    signUp,
    signIn,
    checkToken
};