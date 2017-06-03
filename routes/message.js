var Message = require('../models/message');
var promise = require('promise'); 

exports.saveMessage = function (blog, hostid, content, type, user){
	return new Promise(function (resolve, reject){
		Message.findOne({authorid: blog.authorid}, function (err, messlist){
			if (!messlist){
				var msglist = {
					authorid: blog.authorid,
					messagelist: [{
						reuserid: user._id,
						reusername: user.name,
						reusericon: user.icon,
						blogid: blog._id,
						blogname: blog.title,
						hostid: hostid,
						content: content,
						actiontype: type,  //1表示喜欢, 2表示评论, 值为3表示回复
						status: 0, //0表示未查看, 1表示已查看
						date: getTimeNow()
					}]
				};
				var message = new Message(msglist);
				message.save(function (err, data){
					if (err){
						reject('error');
					}else{
						resolve('ok');
					}
				});
			}else{
				var msgitem = {
					reuserid: user._id,
					reusername: user.name,
					reusericon: user.icon,
					blogid: blog._id,
					blogname: blog.title,
					hostid: hostid,
					content: content,
					actiontype: type,
					status: 0,
					date: getTimeNow()
				};
				messlist.messagelist.push(msgitem);
				messlist.save();
				resolve('ok');
			}
		});
	});
};

exports.totalUnreadMess = function (authorid){
	return new Promise(function (resolve, reject){
		if (authorid){
			var count = 0;
			Message.findOne({authorid: authorid}, function (err, mess){
				if (mess){
					var messlist = mess.messagelist;
					for (var i = 0; i < messlist.length; i++){
						if (messlist[i].status == 0){
							count++;
						}
					}
				}
				resolve(count);
			});
		}
	});
};

exports.getAllMessage = function (req, res){
	var user = req.session.user || null;
	if (user){
		var authorid = user._id;
	}
	Message.findOne({authorid: authorid}, function (err, mess){
		if (mess){
			messlist = mess.messagelist;
			for (var i = 0; i < messlist.length; i++){
				messlist[i].status = 1;
			}
			Message.update({authorid: authorid}, {messagelist: messlist}, function (err, doc){
				if (doc.ok){
					res.render('message', {
						title: '小静博客——消息',
						user: user,
						totalmess: 0,
						messlist: messlist,
						error: ''
					});
				}
			});
		}else{
			res.render({
				title: '小静博客——消息',
				user: user,
				totalmess: 0,
				error: ''
			});
		}
	});
};



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
