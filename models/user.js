var mongoose = require('mongoose');
var User = require('../schemas/user');

module.exports = mongoose.model('User', User);