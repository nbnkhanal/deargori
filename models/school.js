var mongoose = require('mongoose');

var schoolSchema = mongoose.Schema({
    name: {type: String},
    address: {type: String},
    city: {type: String},
    country: {type: String},
    // sector: {type: String},
    website: {type: String},
    image: {type: String, default: 'defaultPic.png'},
    students: [{
        studentId: {type: String, default: ''},
        studentFullname: {type: String, default: ''},
        studentRole: {type: String, default: ''}
    }],
    
    schoolRating: [{
        schoolName: {type: String, default: ''},
        userFullname: {type: String, default: ''},
        userRole: {type: String, default: ''},
        schoolImage: {type: String, default: ''},
        userRating: {type: Number, default: 0},
        userReview: {type: String, default: ''}
    }],
    
    ratingNumber: [Number],
    ratingSum: {type: Number, default: 0}
});

module.exports = mongoose.model('School', schoolSchema);