const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    hashPassword: { type: String, required: true },
    role: { type: String, required: true, default: 'student' }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", UserSchema);