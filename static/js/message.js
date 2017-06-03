function getRequest(){
	var request = null;
	if (XMLHttpRequest){
		request = new XMLHttpRequest();
	}else{
		request = new ActiveXObject("Microsoft.XMLHTTP");
	}
	return request;
}
var replydialog;
function showReplyDialog(host_name, id, host_id){
	replydialog = document.querySelector(".dialog" + id);
	replydialog.style.display = 'block';
	var dialog = document.getElementById(id);
	console.log(dialog);
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

	console.log('blogid=' + blogid + '&reviewhostid=' + reviewhostid
	 + '&userid=' + hostid + '&username=' + hostname + '&content=' + content.toString());
	req.send('blogid=' + blogid + '&reviewhostid=' + reviewhostid
	 + '&userid=' + hostid + '&username=' + hostname + '&content=' + content.toString());

}