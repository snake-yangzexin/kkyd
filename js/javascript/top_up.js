// JavaScript Document sub_chapter_vue








var sBookId=getWinUrl('bookId');
var sChapterId=getWinUrl('chapterId');
var sIndexUrl='/asg/portal/h5/reader.html?';
var oBookInfo=$.cookie('book_info');

var sSubUage = window.navigator.userAgent.toLowerCase();
var sLocationHref=encodeURI(window.location.href);

if(!sBookId){
	oBookInfo=jsonStr(oBookInfo);
	sBookId=oBookInfo['bookId'];
	sChapterId=oBookInfo['chapterId'];
}
var appVue=new Vue({
	el:'#sub_chapter_vue',
	data:{
		subscribeLoginShow:false,
		nullUser:false,
		butShow:false,
		userObj:[],
		forJson:'',
		yigoumai:false,
		show:false
	},
	methods:{
		//after_login_url
		subscribeLogin:function(){
			$.cookie("after_login_url", sLocationHref, { expires: 0.006 , path: '/'});
			if(sSubUage.match(/MicroMessenger/i) == 'micromessenger'){
				postTongji('&type=subscribe_weixin_login');
				winLocalHref('/asg/portal/h5/login/weixinInner.do');
			}else{
				postTongji('&type=subscribe_wap_login');
				winLocalHref('/login/login.html');
			}
		},
		subscribeBind:function(){
			$.cookie("after_login_url", sLocationHref, { expires: 0.006 , path: '/'});
			if(sSubUage.match(/MicroMessenger/i) == 'micromessenger'){	
				postTongji('&type=subscribe_weixin_bing');	
				winLocalHref('/asg/portal/h5/login/weixinInner.do?action=bind');
			}else{
				postTongji('&type=subscribe_wap_bing');
				winLocalHref('/login/bind_login.html');
			}
		}
	}
});


var sKkydInfoId=$.cookie('KKYD_INFO');
var sSubUid=$.cookie('uid');
if(!sKkydInfoId||sKkydInfoId.indexOf('yk_')>-1){	
	$.cookie("after_login_url", sLocationHref, { expires: 0.006 , path: '/'});
	appVue.subscribeLoginShow=true;
}else{
	appVue.subscribeLoginShow=false;
}




if(sKkydInfoId&&sKkydInfoId!='null'){	
	var sKkydId=sKkydInfoId;
	
	if(sKkydId&&sKkydId.indexOf('yk_')!=-1){
		appVue.butShow=false;
	}else if(sKkydId&&sKkydId.indexOf('yk_')==-1){
		appVue.butShow=true;
	}
	/*登录成功回调*/
	var sLoginUserKye='/asg/portal/h5/login/get.do';
	//console.log(sLoginUserKye);
	$.get(sLoginUserKye,function(data){
		if(data.status!=1){
			return false;
		}
		appVue.userObj=data['user'];
		
		//console.log(appVue.forJson);
	})
}else{
	appVue.nullUser=true;
}





$.get(sIndexUrl+'bookId='+sBookId+'&reaction='+3+'&chapterId='+sChapterId,function(data){
	//console.log(data);
	data=jsonStr(data);
	if(data.status==0){
		appVue.forJson=data;
		appVue.show=true;
	}else if(data.status==1){
		var oBookInfo=$.cookie('book_info');
		appVue.nullUser=true;
		if(oBookInfo&&oBookInfo!='null'){
			oBookInfo=jsonStr(oBookInfo);
			oBookInfo.loginUrl=winLocalHref();
			oBookInfo['chapterId']=sChapterId;
			oBookInfo=jsonStr(oBookInfo);
			$.cookie('book_info',oBookInfo, { expires: nTimeMs });
		}
		appVue.forJson=data;
		appVue.yigoumai=false;
		appVue.show=true;
	}else if(data.status==4){
		$.cookie('book_info',null);
		appVue.forJson=data;
		winLocalHref('/book.html?bookId='+appVue.forJson.bookId+'&chapterId='+appVue.forJson.chapterId);
		//console.log(appVue.forJson.amount);
		//sIndexUrl+'bookId='+appVue.forJson.bookId+'&reaction='+3+'&chapterId='+num
		//winLocalHref("/book.html?bookId="+data.bookId+'&chapterId='+data.preChapterId);
	}

});








$(function(){
	//http://target-ip1:port1/asg/portal/h5/charge.html?channelCode=K1001004& userId=24241&bookId=10013471&chapterId=10013504&afterNum=1
	
	$(document).on('click','.confirm_but',function(){
		var oThis=$(this);
		var sUrl=oThis.attr('sUrl');
		$.get(sUrl,function(data){
			//console.log(data);
			data=jsonStr(data);
			postTongji('&type=subscribe_but&status='+data['status']);
			if(data.status==4){
				var oBookInfo=$.cookie('book_info');
				if(oBookInfo&&oBookInfo!='null'){
					oBookInfo=jsonStr(oBookInfo);
					oBookInfo.loginUrl=winLocalHref();
					oBookInfo['chapterId']=appVue.forJson.chapterId;
					oBookInfo=jsonStr(oBookInfo);
					$.cookie('book_info',oBookInfo, { expires: nTimeMs });
				}
				//sIndexUrl+'bookId='+appVue.forJson.bookId+'&reaction='+3+'&chapterId='+num
				winLocalHref("/book.html?bookId="+sBookId+'&chapterId='+sChapterId);
			}else if(data.status == 1){
				$.cookie('book_info',null);
				winLocalHref("/book.html?bookId="+sBookId+'&chapterId='+sChapterId);
			}
			
		});
	});
	
	
	
});
















































