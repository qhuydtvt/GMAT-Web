const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswersSchema = new Schema({
    question: { type: Schema.Types.ObjectId, ref: 'Question' },
    choice: { type: Number, default: null },
    time: { type: Number, default: 0 },
    isCorrect: { type: Boolean, default: null }
}, {
    _id: false 
});

const TestResultSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User' },
    questionPack: { type: Schema.Types.ObjectId, ref: 'QuestionPack' },
    answers: [ AnswersSchema ],
    totalTime: { type: Number, default: 0 }
}, {
    timestamps: true
});

module.exports = mongoose.model("TestResult", TestResultSchema);