const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let QuestionSchema = new Schema({
    stimulus: { type: String },
    stem: { type: String },
    type: { type: String, default: '' },
    difficulty: { type: Number, default: 0 },
    explanation: { type: String },
    choices: {
        type: [
            { type: String, default: '' },
            { type: String, default: '' },
            { type: String, default: '' },
            { type: String, default: '' },
            { type: String, default: '' }
        ],
        validate: [arrayLimit, '{PATH} exceeds the limit of 5']
    },
    rightChoice: { type: Number, default: 0 }
}, {
    timestamps: true
});

function arrayLimit(val) {
    return val.length <= 5;
}

module.exports = mongoose.model("Question", QuestionSchema);