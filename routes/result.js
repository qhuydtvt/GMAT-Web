const express = require('express');
const router = express.Router();

const Result = require('../models/testResult.model');

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
          .populate('questionPack', 'name')
          .populate('answers.question', 'difficulty details type rightChoice explanation stem stimulus')
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
    let newResult = {
        ...req.body,
        student: req.user.id
    };
    Result.create(newResult, (err, resultCreated)=>{
        if(err) res.status(500).json({ success: 0, message: 'Could not create result!', errMsg: err })
        else if(resultCreated) res.status(201).json({ success: 1, message: 'Create success!', result: resultCreated });
    });
});

router.put('/:id', (req, res)=>{
    if(req.params.id) {
        let id = req.params.id;
        let body = req.body;
        Result.findById(id, (err, resultFound) => {
            if(err) res.status(500).json({ success: 0, message: 'Could not get result!', errMsg: err })
            else if(!resultFound) res.status(400).json({ success: 0, message: 'Result not exist!' })
            else {
                for(key in body) {
                    switch(key) {
                        case '_id':
                            break;
                        default:
                            if(resultFound[key]) resultFound[key] = body[key];
                            break;
                    }
                }
                resultFound.save((err, resultUpdated)=>{
                    if(err) res.status(500).json({ success: 0, message: 'Could not update result!', errMsg: err })
                    else res.json({ success: 1, message: 'Update success!', result: resultUpdated });
                });
            }
        });
    } else {
        res.status(400).json({ success: 0, message: 'You must provide result id!' });
    }
});

router.delete('/:id', (req, res)=>{
    if(req.params.id) {
        let id = req.params.id;
        Result.findById(id, (err, resultFound) => {
            if(err) res.status(500).json({ success: 0, message: 'Could not get result!', errMsg: err })
            else if(!resultFound) res.status(400).json({ success: 0, message: 'Eesult not exist!' })
            else {
                resultFound.remove({ _id: id }, (err)=>{
                    if(err) res.status(500).json({ success: 0, message: 'Could not remove result!', errMsg: err })
                    else res.json({ success: 1, message: 'Remove success!' });
                });
            }
        });
    } else {
        res.status(400).json({ success: 0, message: 'You must provide result id!' });
    }
});

module.exports = router;