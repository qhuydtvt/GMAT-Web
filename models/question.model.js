const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let QuestionSchema = new Schema({
    stimulus: { type: String },
    type: { type: String, default: '' },
    details: [
        {
            stem: { type: String, default: '' },
            choices: {
                type: [
                    { type: String, default: '' },
                    { type: String, default: '' },
                    { type: String, default: '' },
                    { type: String, default: '' },
                    { type: String, default: '' }
                ],
                validate: [validArrayLength, "{PATH}'s length must be 5"]
            },
            rightChoice: { type: Number, default: 0 },
            difficulty: { type: Number, default: 0 },
            explanation: { type: String, default: '' },
            highlightStimulus: { type: String, default: null }
        }
    ]
}, {
    timestamps: true
});

function validArrayLength(val) {
    return val.length == 5;
}

module.exports = mongoose.model("Question", QuestionSchema);