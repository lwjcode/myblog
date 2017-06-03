var mongoose = require('mongoose');
var Blog = require('../schemas/blog');

module.exports = mongoose.model('Blog', Blog);