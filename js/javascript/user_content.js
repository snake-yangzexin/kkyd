// JavaScript Document
var sKkydId=$.cookie("KKYD_INFO");

if(!sKkydId||sKkydId==null||sKkydId=='null'){
	winLocalHref("/");
}
var appVue=new Vue({
	el:'#user_info_vue',
	data:{
		sFirstBookName:'',
		nullUser:false,
		bindShow:false,
		miUser:true,
		butShow:false,
		forJson:[],
		show:false
	}
});

//最近阅读
var oGetLocalShelf=getLocalRecentlyRead();


if(oGetLocalShelf && oGetLocalShelf['content'].length>0){
	var sFirstBookName=oGetLocalShelf['content'][0]['bookName'];
	if(sFirstBookName.length>14){
		sFirstBookName=sFirstBookName.substring(0,10)+'...';
	}
	appVue.sFirstBookName=sFirstBookName;
}





var sMimsg = window.navigator.userAgent.toLowerCase();
if(sMimsg.match(/MicroMessenger/i) == 'micromessenger'){
	appVue.miUser=false;
}

if(sKkydId&&sKkydId.indexOf('yk_')!=-1){
	appVue.butShow=false;
}else if(sKkydId&&sKkydId.indexOf('yk_')==-1){
	appVue.butShow=true;
}

	
/*登录成功回调*/
var sLoginUserKye='/asg/portal/h5/login/get.do';
//console.log(sLoginUserKye);
$.get(sLoginUserKye,function(data){
	//console.log(jsonStr(data));
	imgLoad();
	if(data.status!=1){
		//winLocalHref("/");
		return false;
	}
	appVue.forJson=data['user'];
	if($.trim(appVue.forJson.uid) != '暂无'){
		appVue.nullUser=true;
	}
	
	appVue.show=true;
	setTimeout(fStyleClassify,100);
})

//m.kkyd.cn/asg/portal/h5/login/logout/'+sKkydId+'.do

$(function(){
	
	$(document).on('click','#login_user_id',function(){
		$.get('/asg/portal/h5/login/logout.do',function(data){
			if(data.status=='1'||data.status=='3'){
				
				var sVisitor=$.cookie('visitor');
				if(sVisitor.indexOf('=')!=-1){
					sVisitor=sVisitor.split('==')[0];
				}
				var sUserId=$.trim($.cookie('uid'));
				if(!sUserId || sUserId=='null'){
					var oUnlogin=getLocalRecentlyRead();
					if(oUnlogin){
						oUnlogin['synchronous']=true;
						oUnlogin=jsonStr(oUnlogin);
						window.localStorage.setItem('recentlyRead',oUnlogin);
					}
				}
				
				
				//判断游客登陆 分游客id
				//$.get('/asg/portal/h5/login/getVisitorId.do?visitorId='+sVisitor,function(data){
					winLocalHref("/");
				//})
				
			}
		})
	});
});



























