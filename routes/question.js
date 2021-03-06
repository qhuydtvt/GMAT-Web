const express = require('express');
const router = express.Router();

const Question = require('../models/question.model');
const QuestionPack = require('../models/questionPack.model');

router.get('/', (req, res)=>{
    const searchTerms = req.query.searchTerms ? req.query.searchTerms : "";
    Question.find({
        '$or': [{
                    'stimulus': {
                        $regex: new RegExp(searchTerms, "i")
                    }
                },
                {
                    'details.stem': {
                        $regex: new RegExp(searchTerms, "i")
                    } 
                }
        ]
        
    }, (err, questions) => {
        if (err) res.status(500).json({ success: 0, message: 'Could not get list question!', errMsg: err });
        else res.json({ success: 1, message: 'Success!', questions: questions });
    })
});

router.get('/:id', (req, res)=>{
    if(req.params.id) {
        let id = req.params.id;
        Question.findById(id, (err, questionFound) => {
            if(err) res.status(500).json({ success: 0, message: 'Could not get question', errMsg: err })
            else if(!questionFound) res.status(400).json({ success: 0, message: 'Question not exist!' })
            else res.json({ success: 1, message: 'Success!', question: questionFound });
        });
    } else {
        res.status(400).json({ success: 0, message: 'You must provide question id!' });
    }
});

router.post('/', (req, res)=>{
    let newQuestion = req.body;
    Question.create(newQuestion, (err, questionCreated)=>{
        if(err) res.status(500).json({ success: 0, message: 'Could not create question', errMsg: err })
        else if(questionCreated) res.status(201).json({ success: 1, message: 'Create success!', question: questionCreated });
    });
});

router.post('/checkstems', async (req, res)=>{
    let questions = req.body.questions;
    let details = [];
    try {
        for(let i = 0; i < questions.length; i++) {
            let questionFound = await Question.findOne({ 'details.stem' : questions[i].stem, type: questions[i].type });
            if(questionFound) details[i] = ('Question already exist!')
            else {
                details[i] = (null)
            };
            if(details.length == questions.length) {
                return res.send({ success: 1, details });
            }
        }
    } catch (error) {
        console.log("Error: ", error);
    }
});

router.put('/:id', (req, res)=>{
    if(req.params.id) {
        let id = req.params.id;
        let body = req.body;

        Question.findById(id, (err, questionFound) => {
            if(err) res.status(500).json({ success: 0, message: 'Could not get question', errMsg: err })
            else if(!questionFound) res.status(400).json({ success: 0, message: 'Question not exist!' })
            else {
                for(key in body) {
                    switch(key) {
                        case '_id':
                          break;
                        default:
                          questionFound[key] = body[key];
                          break;
                    }
                }
                questionFound.save((err, questionUpdated)=>{
                    if(err) res.status(500).json({ success: 0, message: 'Could not update question', errMsg: err })
                    else res.json({ success: 1, message: 'Update success!', question: questionUpdated });
                });
            }
        });
    } else {
        res.status(400).json({ success: 0, message: 'You must provide question id!' });
    }
});

router.delete('/:id', (req, res)=>{
    if(req.params.id) {
        let questionId = req.params.id;
        Question.findById(questionId, (err, questionFound) => {
            if(err) res.status(500).json({ success: 0, message: 'Could not get question', errMsg: err })
            else if(!questionFound) res.status(400).json({ success: 0, message: 'Question not exist!' })
            else {
                QuestionPack.update({ questions: questionId }, { $pullAll: { questions: [ questionId ] }}, (err, numAffected) => {
                    if(err) res.status(500).json({ success: 0, message: 'Could not remove question from question pack', errMsg: err })
                    else {
                        Question.remove({ _id: questionId }, (err)=>{
                            if(err) res.status(500).json({ success: 0, message: 'Could not remove question', errMsg: err })
                            else res.json({ success: 1, message: 'Remove success!' });
                        });
                    }
                });
            }
        });
    } else {
        res.status(400).json({ success: 0, message: 'You must provide question id!' });
    }
});

module.exports = router;