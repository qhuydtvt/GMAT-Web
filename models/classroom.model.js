const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassroomSchema = new Schema({
    name: { type: String, required: true, unique: true },
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    questionPacks: [{ type: Schema.Types.ObjectId, ref: 'QuestionPack' }],
    // lectures: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true
});

module.exports = mongoose.model("Classroom", ClassroomSchema);