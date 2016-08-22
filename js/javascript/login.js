// JavaScript Document

if(oChannelCode[sChannelCodeCookie]){
	$('.login_li_but_other').remove();
}

var appVue=new Vue({
	el:'#login_from_box',
	data:{
		forJson:{
			rememberMe:false,
			username:"",
			loginNull:true,
			bodyDisplay:false,
			password:""
		}
	}
	
});

if($.cookie('book_info')&&$.cookie('book_info')!='null'){
	appVue.forJson.loginNull=false;
}

appVue.forJson.bodyDisplay=true;



$(function(){
	
	$(document).on('click','.login_li_but_other',function(){
		var sVisitor=$.cookie('visitor');
		if(sVisitor.indexOf('=')!=-1){
			sVisitor=sVisitor.split('==')[0];
		}
		$.get('/asg/portal/h5/login/getVisitorId.do?visitorId='+sVisitor,function(data){
			if(data['status']==1){
				postTongji('&type=YKloginOk');
				winLocalHref("/user_center.html");
			}else{
				postTongji('&type=YKloginNulluserid');
				winLocalHref("/");
			}
		})
	});
	
	
	
	//记住密码
	$('.login_checkbox').click(function(){
		$('.login_checked_box').toggleClass('checked');
		appVue.forJson.rememberMe=$('.login_checked_box').hasClass('checked') ? true : false;
		//console.log(appVue.forJson.rememberMe);
	});
	
	//登录弹出
	$('.lgoin_but_color_6').click(function(){
		$('.login_from_box').toggleClass('login_from_show');
	});
	
	
	$('.login_but').click(function(){
		//console.log(appVue.forJson.rememberMe);
		var oJson={
			rememberMe:appVue.forJson.rememberMe,
			username:appVue.forJson.username,
			password:appVue.forJson.password
		}
		$.post('/asg/portal/h5/login/kkyd.do',oJson,function(data){
			//console.log(data);
			postTongji('&type=login&status='+data['status']);
			if(data.status=="4"){
				appVue.forJson={
					rememberMe:false,
					username:"",
					password:""
				}
				//winLocalHref("/user_center.html");
			}else{
				//console.log(data.msg);
			}
		});
	})
	
	
	
	
	
	
	
	
	
});












































