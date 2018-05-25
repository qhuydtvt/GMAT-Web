const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Classroom = require('../models/classroom.model');

router.get('/', (req, res)=>{
    Classroom.find({}, (err, classrooms)=>{
            if(err) res.status(500).json({ success: 0, message: 'Could not get list classroom!', errMsg: err })
            else res.json({ success: 1, message: 'Success!', classrooms: classrooms });
        });
});

router.get('/:id', (req, res)=>{
    if(req.params.id) {
        let id = req.params.id;
        Classroom
            .aggregate([
                {
                    '$match': {"_id": mongoose.Types.ObjectId(id)}
                },
                {
                    '$lookup': {
                        'from': 'students', 
                        'localField': 'students', 
                        'foreignField': '_id', 
                        'as': 'students'
                    }
                },
                {
                    '$unwind': '$students'
                },
                {
                    '$lookup': {
                        'from': 'users', 
                        'localField': 'students.info', 
                        'foreignField': '_id', 
                        'as': 'students.info'
                    }
                },
                {
                    '$unwind': '$students.info'
                },
                {
                    '$lookup': {
                        'from': 'questionpacks', 
                        'localField': 'questionPacks', 
                        'foreignField': '_id', 
                        'as': 'questionPacks'
                    }
                },
                {
                    '$group': {
                        '_id': {
                            '_id': '$_id',
                            'questionPacks': '$questionPacks',
                            'name': '$name',
                            'createdAt': '$createdAt',
                            'updatedAt': '$updatedAt',
                        },
                        'students': {'$push': '$students'}
                    }
                },
                {
                    '$project': {
                        '_id': '$_id._id',
                        'questionPacks': '$_id.questionPacks',
                        'name': '$_id.name',
                        'createdAt': '$_id.createdAt',
                        'updatedAt': '$_id.updatedAt',
                        'students': 1
                    }
                }
            ]).exec((err, classroomFound) => {
                if(err) res.status(500).json({ success: 0, message: 'Could not get classroom', errMsg: err })
                else if(!classroomFound) res.status(400).json({ success: 0, message: 'Classroom not exist!' })
                else res.json({ success: 1, message: 'Success!', classroom: classroomFound[0] });
            });
    } else {
        res.status(400).json({ success: 0, message: 'You must provide classroom id!' });
    }
});

router.post('/', (req, res)=>{
    let newClassroom = req.body;
    Classroom.create(newClassroom, (err, classroomCreated)=>{
        if(err) res.status(500).json({ success: 0, message: 'Could not create classroom', errMsg: err })
        else if(classroomCreated) res.status(201).json({ success: 1, message: 'Create success!', classroom: classroomCreated });
    });
});

router.put('/:id', (req, res)=>{
    if(req.params.id) {
        let id = req.params.id;
        let body = req.body;
        Classroom.findById(id, (err, classroomFound) => {
            if(err) res.status(500).json({ success: 0, message: 'Could not get classroom', errMsg: err })
            else if(!classroomFound) res.status(400).json({ success: 0, message: 'Classroom not exist!' })
            else {
                for(key in body) {
                    switch(key) {
                        case '_id':
                            break;
                        default:
                            if(classroomFound[key]) classroomFound[key] = body[key];
                            break;
                    }
                }
                classroomFound.save((err, classroomUpdated)=>{
                    if(err) res.status(500).json({ success: 0, message: 'Could not update classroom', errMsg: err })
                    else res.json({ success: 1, message: 'Update success!' });
                });
            }
        });
    } else {
        res.status(400).json({ success: 0, message: 'You must provide classroom id!' });
    }
});

router.delete('/:id', (req, res)=>{
    if(req.params.id) {
        let id = req.params.id;
        Classroom.findById(id, (err, classroomFound) => {
            if(err) res.status(500).json({ success: 0, message: 'Could not get classroom', errMsg: err })
            else if(!classroomFound) res.status(400).json({ success: 0, message: 'Classroom not exist!' })
            else {
                Classroom.remove({ _id: id }, (err)=>{
                    if(err) res.status(500).json({ success: 0, message: 'Could not remove classroom', errMsg: err })
                    else res.json({ success: 1, message: 'Remove success!' });
                });
            }
        });
    } else {
        res.status(400).json({ success: 0, message: 'You must provide classroom id!' });
    }
});

module.exports = router;