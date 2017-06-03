var Blog = require('../models/blog');
var User = require('../models/user');
var Review = require('../models/review');
var message = require('./message');
var promise = require('promise');

exports.submitReview = function (req, res){
	var blogid = req.body.blogid;
	var hostid = req.session.user._id;
	var hostname = req.session.user.name;
	var hosticon = req.session.user.icon;
	var hostcontent = req.body.reviewContent;
	Review.findOne({blogid: blogid}, function (err, blogreview){
		
		//如果关于这条博客没有评论，则新增一条
		if (!blogreview){
			var reviewItem = {
				blogid: blogid,  //文章id
				reviewlist: [{
					hostid: hostid, //某层楼主id
					hostname: hostname, //某层楼主name
					hosticon: hosticon, //某层楼主icon
					hostcontent: hostcontent, //楼主评论内容
					date: getTimeNow(),
					//针对楼主的评论
					reviewitem:[]
				}]
			};
			//保存评论，并更新评论数量
			var reviewhostid;
			saveReview(reviewItem).then(function (msg){
				reviewhostid = msg.reviewlist[0]._id;  //获得楼主id
				return updateReview_num(blogid);
			}).then(function (blog){
				return message.saveMessage(blog, reviewhostid, hostcontent, 2, req.session.user)	
			}).then(function (ok){
				res.send('ok');
			}).catch(function (){
				res.send('error');
			});
			
		}else{ //如果关于这条博客有评论，则更新评论内容

			var reviewlist = blogreview.reviewlist;
			var item = {
				hostid: hostid,
				hostname: hostname,
				hosticon: hosticon, 
				hostcontent: hostcontent, 
				date: getTimeNow(),
				reviewitem:[]
			};
			reviewlist.push(item);

			//更新评论列表
			var reviewhostid;
			updateReviewList(blogid, reviewlist).then(function (msg){
				reviewhostid = msg;
				return updateReview_num(blogid);
			}).then(function (blog){
				return message.saveMessage(blog, reviewhostid, hostcontent, 2, req.session.user)
			}).then(function (ok){
				res.send('ok');
			}).catch(function (){
				res.send('error');
			});
		}
	});
};


exports.submitReply = function (req, res){
	var blogid = req.body.blogid;
	var reviewhostid = req.body.reviewhostid;
	var olduserid = req.body.userid;
	var oldusername = req.body.username;
	var curuserid = req.session.user._id;
	var curusername = req.session.user.name;
	var content = req.body.content;
	Review.findOne({blogid: blogid}, function (err, blogreview){
		if (!err){

			var item = {
				userid: olduserid,
				username: oldusername,
				reuserid: curuserid,
				reusername: curusername,
				content: content,
				date: getTimeNow()
			};

			updateReviewItem(blogid, item, reviewhostid).then(function (msg){
				console.log(msg);
				return updateReview_num(blogid);
			}).then(function (blog){
				return message.saveMessage(blog, reviewhostid, content, 3, req.session.user)	
			}).then(function (ok){
				res.send('ok');
			}).catch(function (){
				res.send('error');
			});
		}
	});
}

function saveReview(reviewItem){
	return new Promise(function (resolve, reject){
		var review = new Review(reviewItem);
		review.save(function (err, data){
			if (err){
				reject('error');
			}else{
				resolve(data);
			}
		});
	});
}

function updateReview_num(blogid){
	return new Promise(function (resolve, reject){
		Blog.findOne({_id: blogid}, function (err, blog){
			Blog.update({_id: blogid}, {review_num: blog.review_num + 1}, function (err, doc){
				if (err){
					reject('error');
				}else{
					resolve(blog);
				}
			});
		});
	});
}

function updateReviewList(blogid, reviewlist){
	return new Promise(function (resolve, reject){
		Review.update({blogid: blogid}, {reviewlist: reviewlist}, function (err, doc){
			if (err){
				reject('error');
			}else{
				resolve('ok');
			}
		});
	}).then(function (msg){
		return getLastReviewHostId(blogid);
	}).catch(function (err){
		console.log(err);
	});
}

function getLastReviewHostId(blogid){
	return new Promise(function (resolve, reject){
		Review.findOne({blogid: blogid}, function (err, reviews){
			if (err){
				reject('error');
			}else{
				var len = reviews.reviewlist.length;
				resolve(reviews.reviewlist[len - 1]._id);
			}
		});

	});
}

function updateReviewItem(blogid, item, reviewhostid){
	return new Promise(function (resolve, reject){
		Review.findOne({blogid: blogid}, function (err, doc){
			if (err){
				reject('error');
			}else{
				for (var i = 0; i < doc.reviewlist.length; i++){
					if (doc.reviewlist[i]._id == reviewhostid){
						doc.reviewlist[i].reviewitem.push(item);
						doc.save(doc.reviewlist[i]._id);
						resolve('ok');
						break;
					}
				}
			}
		});
	});
}


//获得本地时间
function getTimeNow()
{
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
	if (hour >= 0 && hour <= 9)
		hour = "0" + hour;
	if (minute >= 0 && minute <= 9)
		minute = "0" + minute;
	if (second >= 0 && second <= 9)
		second = "0" + second;
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + hour + seperator2 + minute
            + seperator2 + second;
    return currentdate;
}
