const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    info: { type: Schema.Types.ObjectId, ref: 'User' },
    classroom: [{ type: Schema.Types.ObjectId, ref: 'Classroom' }],
    histories: [{ type: Schema.Types.ObjectId, ref: 'TestResult' }]
}, {
    timestamps: true
});

module.exports = mongoose.model("Student", StudentSchema);