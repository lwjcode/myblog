var mongoose = require('mongoose');
var Review = require('../schemas/review');

module.exports = mongoose.model('Review', Review);