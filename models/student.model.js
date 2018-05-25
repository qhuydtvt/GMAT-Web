const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  info: { type: Schema.Types.ObjectId, ref: 'User' },
  histories: [{ type: Schema.Types.ObjectId, ref: 'TestResult' }],
  isDisabled: { type: Schema.Types.Boolean, default: false }
}, {
  timestamps: true
});

StudentSchema.statics.upsert = function(data, done) {
  var student = this({
    info: data.user
  });
  student.save((err, addedStudent) => {
    done(err, addedStudent);
  });
}

module.exports = mongoose.model("Student", StudentSchema);