var Schema = require('mongoose').Schema;
/*
*关注表，里面使每个用户的关注者和被关注者
*/

var noticeSchema = new Schema({ 
	userid: String,  //用户Id
	noticelist: [{  //用户的关注者和被关注者信息
		noticerid: String,
		noticername: String,
		noticericon: String,
		noticetype: Number  //0表示fance, 1表示noticer
	}],
	noticersum: Number, //关注总数
	fancesum: Number, //粉丝总数
	likesum: Number  //喜欢总数
});