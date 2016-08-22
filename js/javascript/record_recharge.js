// JavaScript Document

var sIndexUrl='/asg/portal/h5/pay/orderList.html?state=1';
var sRecommende='/asg/portal/h5/recommended.do';
var appVue=new Vue({
	el:'#record_recharge_vue',
	data:{
		show:false,
		recommended:'',
		isInBookShelf:[],
	}
});

$.get(sIndexUrl,function(data){
	//console.log(jsonStr(data));
	appVue.isInBookShelf=data['orderList'];
	appVue.show=true;
	imgLoad();
	
});



$.get(sRecommende,function(data){
	if(data['status']==1){
		appVue.recommended=data['blockResources'];
		imgLoad();
	}
	
});
