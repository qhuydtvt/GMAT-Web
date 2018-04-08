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
            messaage: "You must provide masterPassword"
        });
    }
    else if (!hash.compareHash(masterPassword, settings.masterPasswordHash)) {
        res.status(401).json({
            success: 0,
            messaage: "Master password is invalid"
        });
    }
    else {
        if (!body.username) {
            res.status(400).json({
                success: 0,
                messaage: "You must provide username"
            });
        } else if (!body.password) {
            res.status(400).json({
                success: 0,
                messaage: "You must provide password"
            });
        } else {
            let newUser = {
                username: body.username,
                hashPassword: hash.generateHash(body.password)
            }
            UserModel.create(newUser, (err, createdUser)=>{
                if (err) {
                    res.status(500).json({
                        success: 0,
                        messaage: "Could not create user",
                        error: err
                    });
                } else {
                    let token = jwt.sign({
                        _id: createdUser._id,
                        username: createdUser.username
                    },
                    settings.superSecret, { expiresIn: '7d' });
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
            messaage: "You must provide username"
        });
    } else if (!body.password) {
        res.status(400).json({
            success: 0,
            messaage: "You must provide password"
        });
    } else {
        UserModel.findOne({ username: body.username }, (err, foundUser)=> {
            if (err) {
                res.status(500).json({
                    success: 0,
                    messaage: "Could not find user",
                    error: err
                });
            }
            else if (!foundUser) {
                res.status(401).json({
                    success: 0,
                    messaage: "No such user"
                });
            } 
            else {
                const hashPassword = foundUser.hashPassword;
                if (!hash.compareHash(body.password, hashPassword)) {
                    res.status(401).json({
                        success: 0,
                        messaage: "Wrong password"
                    });
                } else {
                    const token = jwt.sign({
                        _id: foundUser._id,
                        username: foundUser.username
                    },
                    settings.superSecret, { expiresIn: '7d' });

                    res.json({
                        success: 1,
                        message: "Logged in succesfully",
                        token
                    });
                }
            }
        });   
    }
};

module.exports = {
    signUp,
    signIn
};