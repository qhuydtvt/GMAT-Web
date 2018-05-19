const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswersSchema = new Schema({
    question: { type: Schema.Types.ObjectId, ref: 'Question' },
    choice: { type: Number, default: null },
    time: { type: Number, default: 0 }
}, {
    _id: false 
});

const TestResultSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User' },
    questionPack: { type: Schema.Types.ObjectId, ref: 'QuestionPack' },
    answers: [ AnswersSchema ]
}, {
    timestamps: true
});

module.exports = mongoose.model("TestResult", TestResultSchema);