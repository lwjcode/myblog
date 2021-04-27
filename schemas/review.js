var Schema = require('mongoose').Schema;

/*
*将根据每条博客创建一个评论集合，
*然后将每条博客按不同的楼层数放在数组中，
*不同的楼层数下针对楼主又有不同的评论，
*将针对楼主的评论又放在同一数组中
*/

var reviewSchema = new Schema({
  blogid: String,  //文章id
  reviewlist: [{
    hostid: String, //某层楼主id
    hostname: String,  //楼主name
    hosticon: String, //楼主icon
    hostcontent: String, //楼主评论内容
    date: String, //评论日期
    //针对楼主的评论
    reviewitem: [{
      userid: String, //评论者id
      username: String, //评论者name
      reuserid: String, //回复者id
      reusername: String, //回复者name
      content: String, //评论内容
      date: String //评论日期
    }]
  }]
});

module.exports = reviewSchema;
