// JavaScript Document

var appVue=new Vue({
	el:'#top_up_success',
	data:{
		nullUser:false,
		butShow:false,
		userObj:[],
		forJson:'',
		yigoumai:false,
		nTime:3,
		nClearNTime:null,
		show:false
	}
});


if($.cookie("KKYD_INFO")&&$.cookie("KKYD_INFO")!='null'){	
	var sKkydId=$.cookie("KKYD_INFO");
	
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
			appVue.show=true;
			return false;
		}
		appVue.userObj=data['user'];
		
		//console.log(appVue.forJson);
	})
}else{
	appVue.nullUser=true;
}



$.get('/asg/portal/h5/pay/lastAmount.do',function(data){
	//alert(data['state']);
	//alert(jsonStr(data['order']))
	if(data['state']==1){
		appVue.forJson=data['order'];
	}else{
		winLocalHref("/top_up.html");
	}
	appVue.show=true;
	appVue.$nextTick(function(){
		appVue.nClearNTime=setTimeout(FClearNTime,1000);
	});
})

function FClearNTime(){
	clearTimeout(appVue.nClearNTime);
	if(appVue.nTime>0){
		appVue.nTime--;
		appVue.nClearNTime=setTimeout(FClearNTime,1000);
	}else{
		winLocalHref("/asg/portal/h5/login/weixinInner.do?action=bind");
	}
}














