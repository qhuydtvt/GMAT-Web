const { hash, getUnicodeText } = require('../helpers');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    searchName: String,
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
    searchName: getUnicodeText(`${data.lastName} ${data.firstName}`),
    hashPassword: hash.generateHash(data.password),
    role: data.role,
    email: data.email
  });
  newUser.save((err, addedUser) => {
    done(err, addedUser);
  });
}

UserSchema.index({searchName: "text"});

module.exports = mongoose.model("User", UserSchema);