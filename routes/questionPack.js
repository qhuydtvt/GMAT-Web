const express = require('express');
const router = express.Router();

const QuestionPack = require('../models/questionPack.model');

router.get('/', (req, res)=>{
    QuestionPack.aggregate([
        {
            '$lookup': {
                "from": "questions",
                "localField": "questions",
                "foreignField": "_id",
                "as": "questions"
            }
        }, 
        {
            '$project': {
                "_id": 1,
                "questions._id": 1,
                "questions.type": 1,
                "name": 1,
                "header": 1,
            }
        },
        {
            '$unwind': '$questions'
        },
        {
            '$group': {
                '_id': {
                   "_id": '$_id',
                   "name": '$name',
                   "header": '$header',
                },
                'types': { '$addToSet': '$questions.type' },
                'questions': { '$addToSet': '$questions._id' }
            }
        },
        {
            '$project': {
                '_id': '$_id._id',
                'name': '$_id.name',
                'header': '$_id.header',
                'questions': 1,
                'types': 1,
            }
        }
    ]).exec((err, questionPacks) => {
        if (err) res.status(500).json({ success: 0, message: 'Could not get list question pack!', errMsg: err })
        else res.json({ success: 1, message: 'Success!', questionPacks: questionPacks });
    });
});

router.get('/:id', (req, res)=>{
    if(req.params.id) {
        let id = req.params.id;
        QuestionPack.findById(id).populate('questions', `stimulus stem type difficulty details rightChoice`).exec((err, questionPackFound) => {
            if(err) res.status(500).json({ success: 0, message: 'Could not get question pack', errMsg: err })
            else if(!questionPackFound) res.status(400).json({ success: 0, message: 'Question pack not exist!' })
            else res.json({ success: 1, message: 'Success!', questionPack: questionPackFound });
        });
    } else {
        res.status(400).json({ success: 0, message: 'You must provide question pack id!' });
    }
});

router.post('/', (req, res)=>{
    let newQuestionPack = req.body;
    QuestionPack.create(newQuestionPack, (err, questionPackCreated)=>{
        if(err) res.status(500).json({ success: 0, message: 'Could not create question pack!', errMsg: err })
        else if(questionPackCreated) res.status(201).json({ success: 1, message: 'Create success!', questionPack: questionPackCreated });
    });
});

router.put('/:id', (req, res)=>{
    if(req.params.id) {
        let id = req.params.id;
        let body = req.body;
        QuestionPack.findById(id, (err, questionPackFound) => {
            if(err) res.status(500).json({ success: 0, message: 'Could not get question pack!', errMsg: err })
            else if(!questionPackFound) res.status(400).json({ success: 0, message: 'Question pack not exist!' })
            else {
                for(key in body) {
                    switch(key) {
                        case '_id':
                            break;
                        default:
                            if(questionPackFound[key]) questionPackFound[key] = body[key];
                            break;
                    }
                }
                questionPackFound.save((err, questionPackUpdated)=>{
                    if(err) res.status(500).json({ success: 0, message: 'Could not update question pack!', errMsg: err })
                    else res.json({ success: 1, message: 'Update success!', questionPack: questionPackUpdated });
                });
            }
        });
    } else {
        res.status(400).json({ success: 0, message: 'You must provide question pack id!' });
    }
});

router.delete('/:id', (req, res)=>{
    if(req.params.id) {
        let id = req.params.id;
        QuestionPack.findById(id, (err, questionPackFound) => {
            if(err) res.status(500).json({ success: 0, message: 'Could not get question pack!', errMsg: err })
            else if(!questionPackFound) res.status(400).json({ success: 0, message: 'Question pack not exist!' })
            else {
                questionPackFound.remove({ _id: id }, (err)=>{
                    if(err) res.status(500).json({ success: 0, message: 'Could not remove question pack!', errMsg: err })
                    else res.json({ success: 1, message: 'Remove success!' });
                });
            }
        });
    } else {
        res.status(400).json({ success: 0, message: 'You must provide question pack id!' });
    }
});

module.exports = router;