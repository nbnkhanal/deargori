var async = require('async');
var School = require('../models/school');

module.exports = (app) => {
    
    app.get('/review/:id', (req, res) => {
        var messg = req.flash('success');
        School.findOne({'_id':req.params.id}, (err, data) => {
            res.render('school/review', {title: 'School Review', user:req.user, data:data, msg: messg, hasMsg: messg.length>0});
        });
    });
    
    app.post('/review/:id', (req, res) => {
        async.waterfall([
            function(callback){
                School.findOne({'_id':req.params.id}, (err, result) => {
                    callback(err, result);
                });
            },
            
            function(result, callback){
                School.update({
                    '_id': req.params.id
                },
                {
                    $push: {schoolRating: {
                        schoolName: req.body.sender,
                        userFullname: req.user.fullname,
                        userRole: req.user.role,
                        schoolyImage: req.user.school.image,
                        userRating: req.body.clickedValue,
                        userReview: req.body.review
                    }, 
                        ratingNumber: req.body.clickedValue       
                    },
                    $inc: {ratingSum: req.body.clickedValue}
                }, (err) => {
                    req.flash('success', 'Your review has been added.');
                    res.redirect('/review/'+req.params.id)
                })
            }
        ])
    });
}








































