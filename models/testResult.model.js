const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserChoiceSchema = new Schema({
  choice: {type: Number, default: -1},
  time: {type: Number, default: 0}
});

const AnswersSchema = new Schema({
    question: { type: Schema.Types.ObjectId, ref: 'Question' },
    choice: { type: Number, default: null },
    time: { type: Number, default: 0 },
    userChoices: [ UserChoiceSchema ]
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