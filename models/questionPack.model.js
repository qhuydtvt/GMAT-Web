const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let QuestionPackSchema = new Schema({
    name: { type: String, required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    unlock: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model("QuestionPack", QuestionPackSchema);