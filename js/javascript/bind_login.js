// JavaScript Document
$(function(){
	
	//qq/weibo/weixin/weixinInner
	var sStatus=getWinUrl('status');
	/*
	if(sStatus==0&&sStatus!=''){
		postTongji('&type=绑定失败');
		$('.bind_alert_box').show();
	}
	*/
	switch (sStatus){
		case 'qq' : 
			postTongji('&type=qqBindError');
			$('.bind_alert_box').show();
			break; 
		case 'weibo' : 
			postTongji('&type=weiboBindError');
			$('.bind_alert_box').show();
			break; 
		case 'weixin' : 
			postTongji('&type=weixinBindError');
			$('.bind_alert_box').show();
			break; 
		case 'weixinInner' : 
			postTongji('&type=weixinInnerBindError');
			$('.bind_alert_box').show();
			break; 
			
		//default : break; 
	} 
	
	
	
	var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        $('#wxapp').show().siblings('a').hide();
    }else{
        $('#wxapp').hide();
	}
	
	
	
	
	
	

});







































