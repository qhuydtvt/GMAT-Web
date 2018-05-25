const express = require('express');
const router = express.Router();

const Student = require('../models/student.model');
const User = require('../models/user.model');

router.get('/', (req, res) => {
  Student
  .find({ isDisabled: false })
  .populate('info')
  .exec((err, students) => {
      if(err) res.status(500).json({ success: 0, message: 'Could not get list students!', errMsg: err })
      else res.json({ success: 1, message: 'Success!', students });
  });
})

router.post('/', (req, res) => {
  var student = req.body;
  student.role = "student";
  student.password = student.username;
  User.upsert(student, (err, addedUser) => {
    if(err || !addedUser) {
      res.status(500).json({ success: 0, message: "Could not add user linked to this student", errMsg: err});
    } else {
      Student.upsert({user: addedUser}, (err, addedStudent) => {
        if(err || !addedStudent) {
          res.status(500).json({ success: 0, message: "Could not add student", errMsg: err});
        } else {
          res.json({ success: 1, message: "Added student successfully", addedStudent });
        }
      });
    }
  });
})

router.get('/:id', (req, res) => {
  const id = req.params.id;
  Student.findOne({_id: id}, (err, foundStudent) => {
    if(err || !foundStudent) {
      res.status(500).json({ success: 0, message: "Could not find user" });
    } else {
      res.json({ success: 1, message: "Found user", foundStudent });
    }
  });
})

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  Student.findByIdAndUpdate(id, { isDisabled: true }, (err, studentBefore) => {
    if(err) {
      res.status(500).json({ success: 0, message: "Could not delete user", errMsg: err })
    } else {
      res.json({ success: 1, message : "Removed user successfully", studentBefore });
    }
  });
})

module.exports = router;