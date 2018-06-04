const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let QuestionPackSchema = new Schema({
    name: { type: String},
    header: {type: String},
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }]
}, {
    timestamps: true
});

module.exports = mongoose.model("QuestionPack", QuestionPackSchema);