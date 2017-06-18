function getRequest(){
	var request = null;
	if (XMLHttpRequest){
		request = new XMLHttpRequest();
	}else{
		request = new ActiveXObject("Microsoft.XMLHTTP");
	}
	return request;
}

function likeit(blogid){
	var req = getRequest();
	var url = '/updateLike?blogid=' + blogid;
    req.open('get', url, true);
    req.onreadystatechange = function (){
        if (req.readyState == 4){
           if (req.responseText == 'ok'){
           		var likeid = document.getElementById('like');
           		likeid.innerText = parseInt(likeid.innerText) + 1 + '';
           }else{
           		console.log(req.responseText + '出错了！');
           }
        }
    };
    req.send();
}

function submitReview(blogid){
	var reviewContent = document.getElementById('reviewdialog').value;
	console.log(reviewContent);
	var req = getRequest();
	var url = '/submitReview';
    req.open('post', url, true);
    req.setRequestHeader("Content-Type",
				"application/x-www-form-urlencoded");
    req.onreadystatechange = function (){
        if (req.readyState == 4){
           if (req.responseText == 'ok'){
           		location.reload();
           		console.log('ok');
           }else{
           		console.log(req.responseText + '出错了！');
           }
        }
    };
    req.send('blogid=' + blogid + '&reviewContent=' + reviewContent);
}

var hostname = '', hostid = '';

function showReplyDialog(host_name, id, host_id){
	var replydialog = document.querySelector(".dialog" + id);
	replydialog.style.display = 'block';
	var dialog = document.getElementById(id);
	hostname = host_name;
	hostid = host_id;
	dialog.value = '@' + hostname + '：';
}

function reply(blogid, id, reviewhostid){
	var input = document.getElementById(id);
	var content = input.value.split('：');
	content.shift();
	content.join('：');
	input.value = '';
	var req = getRequest();
	var url = '/submitReply';
	req.open('post', url, true);
	req.setRequestHeader("Content-Type",
				"application/x-www-form-urlencoded");
	req.onreadystatechange = function (){
		if (req.readyState == 4){
			if (req.responseText == 'ok'){
				location.reload();
			}else{
				console.log('error');
			}
		}
	}
	req.send('blogid=' + blogid + '&reviewhostid=' + reviewhostid
	 + '&userid=' + hostid + '&username=' + hostname + '&content=' + content.toString());

}