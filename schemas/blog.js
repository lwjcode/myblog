var Schema = require('mongoose').Schema;

var blogSchema = new Schema({
  title: String,  //文章标题
  authorid: String,  //发表文章的作者Id
  content: String, //文章内容
  date: String, //发布日期
  tag: String, //文章标签
  like_num: Number,  //喜欢数量
  review_num: Number, //评论数量
  look_num: Number //浏览次数
});

module.exports = blogSchema;
