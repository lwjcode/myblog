var User = require('../models/user');
var message = require('./message');
var Blog = require('../models/blog');

exports.getUsermess = function (req, res) {

  var user = req.session.user || null;

  User.findOne({ _id: user._id }, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      message.totalUnreadMess(user._id).then(function (total) {
        res.render('usermess', {
          title: '小静博客——个人中心',
          user: user,
          totalmess: total
        });
      });
    }
  });
};

exports.getBlogByUser = function (req, res) {
  var user = req.session.user || null;

  Blog.find({ authorid: user._id }, function (err, bloglist) {
    if (bloglist) {
      message.totalUnreadMess(user._id).then(function (total) {
        res.render('myblog', {
          title: '小静博客——我的文章',
          totalmess: total,
          user: user,
          bloglist: bloglist
        });
      });
    } else {
      message.totalUnreadMess(user._id).then(function (total) {
        res.render('myblog', {
          title: '小静博客——我的文章',
          totalmess: total,
          user: user,
          bloglist: null
        });
      });
    }
  });
};

exports.updateUsermess = function (req, res) {
  var username = req.body.username ? req.body.username : req.session.user.name;
  var usersex = req.body.usersex ? req.body.usersex : req.session.user.sex;
  var usertel = req.body.usertel ? req.body.usertel : req.session.user.tel;
  var useremail = req.body.useremail ? req.body.useremail : req.session.user.email;

  User.update({ _id: req.session.user._id },
    {
      name: username,
      sex: usersex,
      tel: usertel,
      email: useremail
    }, function (err, doc) {
      if (doc.ok) {
        res.redirect('/usercenter');
      } else {
        console.log(err);
      }
    });
};

