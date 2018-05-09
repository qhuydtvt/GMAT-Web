const express = require('express');
const _ = require('lodash');
const router = express.Router();

const Result = require('../models/testResult.model');
const QuestionPack = require('../models/questionPack.model');

router.get('/', (req, res)=>{
    Result.find({}, (err, results)=>{
        if(err) res.status(500).json({ success: 0, message: 'Could not get list result!', errMsg: err })
        else res.json({ success: 1, message: 'Success!', results: results });
    })
});

router.get('/:id', (req, res)=>{
    if(req.params.id) {
        let id = req.params.id;
        Result
            .findById(id)
            .populate('student')
            .populate({
                path: 'questionPack',
                populate: {
                    path: 'questions'
                }
            })
            .populate({path: 'answers.question'})
            .exec((err, resultFound) => {
                if(err) res.status(500).json({ success: 0, message: 'Could not get result', errMsg: err })
                else if(!resultFound) res.status(400).json({ success: 0, message: 'Result not exist!' })
                else res.json({ success: 1, message: 'Success!', result: resultFound });
            });
    } else {
        res.status(400).json({ success: 0, message: 'You must provide result id!' });
    }
});

router.post('/', (req, res)=>{
    let dataPost = req.body;
    QuestionPack.findById(dataPost.questionPackId).populate('questions').exec((err, questionPackFound) => {
        if(err) res.status(500).json({ success: 0, message: 'Could not get question pack', errMsg: err })
        else if(!questionPackFound) res.status(400).json({ success: 0, message: 'Question pack not exist!' })
        else {
            let answers = questionPackFound.questions.map(question => {
                let questionId = question._id;
                let answer = _.mapKeys(dataPost.answers, "_id")[questionId];
                
                return {
                    question: questionId,
                    choice: answer ? answer.choice : null,
                    time: answer ? answer.time : null,
                    isCorrect: answer && answer.choice ? answer.choice == question.rightChoice : false
                }
            });

            let newResult = {
                student: dataPost.studentId,
                questionPack: dataPost.questionPackId,
                answers: answers,
                totalTime: dataPost.totalTime
            }

            Result.create(newResult, (err, resultCreated)=>{
                if(err) res.status(500).json({ success: 0, message: 'Could not create result', errMsg: err })
                else if(resultCreated) res.status(201).json({ success: 1, message: 'Success!', result: resultCreated });
            });
        }
    });
});

module.exports = router;