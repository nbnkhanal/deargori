//formidable is for to upload pic
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var async = require('async');

var School = require('../models/school');
var User = require('../models/user');

var {arrayAverage} = require('../myFunctions');


module.exports = (app) => {
    
    app.get('/school/create', (req, res) => {
        var success = req.flash('success');
        res.render('school/school', {title: 'School Registration', user: req.user, success:success, noErrors: success.length > 0});
    });
    
    app.post('/school/create', (req, res) => {
        
        var newSchool = new School();
        newSchool.name = req.body.name;
        newSchool.address = req.body.address;
        newSchool.city = req.body.city;
        newSchool.country = req.body.country;
        newSchool.sector = req.body.sector;
        newSchool.website = req.body.website;
        newSchool.image = req.body.upload;
        
        newSchool.save((err) => {
            if(err){
                console.log(err);
            }
            
            console.log(newSchool);
            
            req.flash('success', 'School data has been added.');
            res.redirect('/School/create');
        })
    });
    
    app.post('/upload', (req, res) => {
        var form = new formidable.IncomingForm();
        
        form.uploadDir = path.join(__dirname, '../public/uploads');
        
        form.on('file', (field, file) => {
           fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
               if(err){
                   throw err
               }
               
               console.log('File has been renamed');
           }); 
        });
        
        form.on('error', (err) => {
            console.log('An error occured', err);
        });
        
        //ALWAYS END THE SESSION
        form.on('end', () => {
            console.log('File upload was successful');
        });
        
        form.parse(req);
        
    });
    
    app.get('/schools', (req, res) => {
        School.find({}, (err, result) => {
            res.render('school/schools', {title: 'All Schools || DearGori', user: req.user, data: result});
        });
    });
    
    //school detail page methods
    app.get('/school-profile/:id', (req, res) => {
        School.findOne({'_id':req.params.id}, (err, data) => {
            var avg = arrayAverage(data.ratingNumber);
            
            res.render('school/school-profile', {title: 'School Name', user:req.user, id: req.params.id, data:data, average: avg});
        });
    });
    
    app.get('/school/register-student/:id', (req, res) => {
        School.findOne({'_id':req.params.id}, (err, data) => {
            res.render('school/register-student', {title: 'Register Student', user:req.user, data: data});
        });
    });
    
    app.post('/school/register-student/:id', (req, res, next) => {
        async.parallel([
            function(callback){
                School.update({
                   '_id': req.params.id,
                   'students.studentId': {$ne: req.user._id}
               },
               {
                    $push: {students: {studentId: req.user._id, studentFullname:req.user.fullname, studentRole:req.body.role}}
               }, (err, count) => {
                   if(err){
                       return next(err);
                   }
                   callback(err, count);
               });
            },
            
            function(callback){
                async.waterfall([
                    function(callback){
                        School.findOne({'_id': req.params.id}, (err, data) => {
                            callback(err, data);
                        })
                    },
                    
                    function(data, callback){
                        User.findOne({'_id': req.user._id}, (err, result) => {
                            result.role = req.body.role;
                            result.school.name = data.name;
                            result.school.image = data.image;
                            
                            result.save((err) => {
                                res.redirect('/home');
                            });
                        })
                    }
                ]);
            }
        ]);
    });
    
    app.get('/:name/students', (req, res) => {
        School.findOne({'name':req.params.name}, (err, data) => {
            res.render('school/students', {title: 'School Students', user: req.user, data: data});
        });
    });
    
    app.get('/schools/leaderboard', (req, res) => {
        School.find({}, (err, result) => {
            res.render('school/leaderboard', {title: 'Schools Leadebaord || DearGori', user: req.user, data: result});
        }).sort({'ratingSum': -1});
    });
    
    app.get('/school/search', (req, res) => {
        res.render('school/search', {title: 'Find School', user:req.user});
    });
    
    app.post('/school/search', (req, res) => {
        var name = req.body.search;
        var regex = new RegExp(name, 'i');
        
        School.find({'$or': [{'name':regex}]}, (err, data) => {
            if(err){
                console.log(err);
            }
            
            res.redirect('/school-profile/'+data[0]._id);
        });
    });
    
}

















