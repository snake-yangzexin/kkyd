// JavaScript Document sub_chapter_vue

if(oChannelCode[sChannelCodeCookie]&&(!$.cookie('KKYD_INFO')||$.cookie('KKYD_INFO')==''||$.cookie('KKYD_INFO').indexOf('yk_')>-1)){
	winLocalHref('/login/login.html');
}

var appVue=new Vue({
	el:'#top_up_vue',
	data:{
		webError:false,
		firstCharge:true,
		topUpBanner:false,
		nullUser:false,
		butShow:false,
		forJson:[],
		dengpao:false,
		oQudao:false,
		show:false
	}
});

var s_channel_code=$.cookie('channelCode');
if(s_channel_code!='K900001'&&s_channel_code!='K900002'){
	appVue.topUpBanner=true;
}
if(s_channel_code&&s_channel_code.indexOf('H')>-1){
	appVue.webError=true;
}

var ua = window.navigator.userAgent.toLowerCase();
var sIsWeixin='';

if(ua.match(/MicroMessenger/i) == 'micromessenger'){
	sIsWeixin='&isWeixin=1';
	var qudao=$.trim($.cookie('channelCode'));
	if(qudao!='K900001'&&qudao!='K900002'){
		appVue.oQudao=true;
	}
}


var sIndexUrl='/asg/portal/h5/pay/methodList.do?deviceId='+$.cookie('KKYD_INFO')+sIsWeixin;
if(!$.cookie('KKYD_INFO')&&$.cookie('KKYD_INFO')==''){
	sIndexUrl='/asg/portal/h5/pay/methodList.do?deviceId=0'+sIsWeixin;
}


var sKkydId=$.cookie("KKYD_INFO");

if(sKkydId&&sKkydId.indexOf('yk_')!=-1){
	appVue.butShow=false;
}else if(sKkydId&&sKkydId.indexOf('yk_')==-1){
	appVue.butShow=true;
}

if(document.referrer.indexOf('cn/subscribe_chapter.html')>-1){
	appVue.dengpao=true;
}



$.get(sIndexUrl,function(data){
	//console.log(jsonStr(data));
	if(data.status==1){
		winLocalHref('/login/login.html');
	}
	
	appVue.forJson=data;
	appVue.show=true;
	var sFirstCharge=$.cookie('firstCharge');
	
	
	if($.cookie('KKYD_INFO')&&$.cookie('KKYD_INFO').length>6&&$.cookie('KKYD_INFO').indexOf('yk')>-1){
		/*登录成功回调*/
		var sLoginUserKye='/asg/portal/h5/login/get.do';
		//console.log(sLoginUserKye);
		$.get(sLoginUserKye,function(data){
			if(sFirstCharge&&sFirstCharge=='top_up'){
				$.cookie("firstCharge", null, { expires: -1 , path: '/'});
			}
			//alert(data.user.uid);
			if(data.status!=1){
				//winLocalHref("/login/login.html");
				return false;
			}
			if($.trim(data.user.uid)=='暂无'){
				appVue.nullUser=false;
				return false;
			}
			appVue.nullUser=true;
		})
	}else{
		appVue.nullUser=false;
		$.get('/asg/portal/h5/login/get.do',function(data){
			//console.log(data);
			if(sFirstCharge&&sFirstCharge=='top_up'){
				$.cookie("firstCharge", null, { expires: -1 , path: '/'});
				appVue.firstCharge=data['firstAward'];
			}
		});
	}

});








$(function(){
	//http://target-ip1:port1/asg/portal/h5/charge.html?channelCode=K1001004& userId=24241&bookId=10013471&chapterId=10013504&afterNum=1
	
	$(document).on('click','.top_pu_ul_all a',function(){
		var oThis=$(this);
		var oBut=oThis.parents('ul').siblings('a');
		var sVal=oThis.find('strong').text();
		var sPayId=oThis.attr('payId');
		var sPayType=oThis.attr('payType');
		oThis.addClass('hover').parent().siblings('li').find('a').removeClass('hover');
		oBut.text('立即充值：'+sVal);
		oBut.attr('payId',sPayId);
		oBut.attr('payType',sPayType);
	}).on('click','.top_pu_but_all',function(){
		var oThis=$(this);
		var sPayId=oThis.attr('payId');
		var sPayType=oThis.attr('payType');
		var sDeviceId=$.cookie('KKYD_INFO');
		postTongji('&type='+sPayType+'&payId='+sPayId);
		$.get('/asg/portal/h5/pay.do?deviceId='+sDeviceId+'&id='+sPayId,function(data){
			//console.log(jsonStr(data));
			postTongji('&type='+sPayType+'&payId='+sPayId+'&status='+data['status']);
			winLocalHref(data['payurl']);
		});
	}).on('click','.top_pu_but_form',function(){
		var oThis=$(this);
		var sPayId=oThis.attr('payId');
		var sPayType=oThis.attr('payType');
		var sDeviceId=$.cookie('KKYD_INFO');
		postTongji('&type='+sPayType+'&payId='+sPayId);
		$.get('/asg/portal/h5/pay.do?deviceId='+sDeviceId+'&id='+sPayId,function(data){
			//console.log(jsonStr(data));+'&status='+data['status']
			postTongji('&type='+sPayType+'&payId='+sPayId+'&status='+data['status']);
			if(data['status']=='2'){
				if(data['weixin']==0){
					winLocalHref(data['payurl']);
					return false;
				}
				var oForData=data['data'];
				for(var oForm in oForData){
					$('#now_form_box').append($('<input type="hidden" name="'+oForm+'" value="'+oForData[oForm]+'" />'));
				}
				$('#now_form_box').submit();
			}
		});
	});
	
	$('.top_pu_ul_2 a').click(function(){
		var oThis=$(this);
		oThis.toggleClass('hover').parent().siblings('li').find('a').removeClass('hover');
	});
	
});












































