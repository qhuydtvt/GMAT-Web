const jwt = require('jsonwebtoken');

const hash = require('../../helpers/hash');
const settings = require('../../settings');
const UserModel = require('../../models/user.model');

const mongoose = require('mongoose');

const signUp =  (req, res) => {
    const body = req.body;
    const masterPassword = body.masterPassword;
    if (!masterPassword) {
        res.status(400).json({
            success: 0,
            message: "You must provide masterPassword!"
        });
    }
    else if (!hash.compareHash(masterPassword, settings.masterPasswordHash)) {
        res.status(401).json({
            success: 0,
            message: "Master password is invalid!"
        });
    }
    else {
        if (!body.username) {
            res.status(400).json({
                success: 0,
                message: "You must provide username!"
            });
        } else if (!body.password) {
            res.status(400).json({
                success: 0,
                message: "You must provide password!"
            });
        } else {
            let newUser = {
                username: body.username,
                hashPassword: hash.generateHash(body.password),
                role: body.role ? body.role : 'student'
            }
            UserModel.create(newUser, (err, createdUser) => {
                if (err) {
                    res.status(500).json({
                        success: 0,
                        message: "Could not create user!",
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
                        message: "Sign-up success!",
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
            message: "You must provide username!"
        });
    } else if (!body.password) {
        res.status(400).json({
            success: 0,
            message: "You must provide password!"
        });
    } else {
        UserModel.findOne({ username: body.username }, (err, foundUser) => {
            if (err) {
                res.status(500).json({
                    success: 0,
                    message: "Could not find user!",
                    error: err
                });
            }
            else if (!foundUser) {
                res.status(401).json({
                    success: 0,
                    message: "No such user!"
                });
            } 
            else {
                const hashPassword = foundUser.hashPassword;
                if (!hash.compareHash(body.password, hashPassword)) {
                    res.status(401).json({
                        success: 0,
                        message: "Wrong password!"
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
                        token,
                        user: {
                            username: foundUser.username,
                            role: foundUser.role,
                            id: foundUser._id
                        }
                    });
                }
            }
        });   
    }
};

const changePassword = (req, res) => {
    var { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        res.status(401).json({success: 0, message: "currentPassword and newPassword required"});
    } else {
        UserModel.findOne({"_id": req.user.id}, (err, foundUser) => {
            if (err || !foundUser) {
                res.status(500).json({success: 0, message: "change password failed, unable to find user.", err});
            } else {
                if(!hash.compareHash(currentPassword, foundUser.hashPassword)) {
                    res.status(500).json({success: 0, message: "Wrong old password"});
                } else {
                    foundUser.hashPassword = hash.generateHash(newPassword);
    
                    foundUser.save((error) => {
                        if (error) {
                            res.status(500).json({success: 0, message: "Unable to connect to server to save new password", error});
                        } else {
                            res.status(200).json({success: 1, message: "Changed password ok"});
                        }
                    });
                }
            }
        });
    }
}

const isAuthenticated = (req, res, next) => {
    const body = req.body;
    const token = body.token || req.headers.token || req.cookies.token || null;
    if (!token) {
        res.status(400).json({
            success: 0,
            message: "You must provide token!"
        });
    } else {
        jwt.verify(token, settings.superSecret, (err, user) => {
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
                            req.user = {
                                username: user.username,
                                role: foundUser.role,
                                id: user._id
                            };
                            next();
                        }
                    }
                });
            }
        });
    }
}

const checkPermission = (req, res, next) => {
    if(!req.user.role) {
        res.status(500).json({
            success: 0,
            message: "Must has role required!"
        });
    } else {
        let urlPath = req.url.slice(1);
        const removeAfter = (url, part) => {
          return url.indexOf(part) > -1 ? url.slice(0, url.indexOf(part)) : url;
        }

        let apiModule = removeAfter(urlPath, "/");
        apiModule = removeAfter(apiModule, "?");
        var userRoleLevel;
        switch(req.user.role) {
            case "lecture":
                userRoleLevel = 2;
                break;
            case "student":
                userRoleLevel = 1;
                break;
            default:
                userRoleLevel = 0;
                break;
        };

        if(Object.keys(settings.permission).indexOf(apiModule) > -1) {
            if(settings.permission[apiModule][req.method] <= userRoleLevel) {
                next();
            } else {
                res.status(401).json({
                    success: 0,
                    message: "Forbidden!"
                });
            }
        } else {
            res.status(500).json({
                success: 0,
                message: "Incorrect URL!"
            });
        }
    }
}

module.exports = {
    signUp,
    signIn,
    changePassword,
    isAuthenticated,
    checkPermission
};