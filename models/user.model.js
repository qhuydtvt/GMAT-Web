const generateHash = require('../helpers/hash').generateHash
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    hashPassword: { type: String, required: true },
    role: { type: String, required: true, default: 'student' },
    email: { type: String }
}, {
    timestamps: true
});

UserSchema.statics.upsert = function(data, done) {
  const newUser = this({
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    hashPassword: generateHash(data.password),
    role: data.role,
    email: data.email
  });
  newUser.save((err, addedUser) => {
    done(err, addedUser);
  });
}

module.exports = mongoose.model("User", UserSchema);