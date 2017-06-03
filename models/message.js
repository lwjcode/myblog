var mongoose = require('mongoose');
var Message = require('../schemas/message');

module.exports = mongoose.model('Message', Message);