const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestResultSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'Student' },
    questionPack: { type: Schema.Types.ObjectId, ref: 'QuestionPack' },
    answers: [{
        question: { type: Schema.Types.ObjectId, ref: 'Question' },
        answer: { type: Number, default: null }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model("TestResult", TestResultSchema);