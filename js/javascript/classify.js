// JavaScript Document

var sIndexUrl='/asg/portal/h5/sort.html';
var appVue=new Vue({
	el:'#classify_vue',
	data:{
		show:false,
		forJson:[]
	}
});
	

$.get(sIndexUrl,function(data){
	//console.log(data);
	var data=jsonStr(data);
	appVue.forJson=data['bookTypeObject'];
	appVue.show=true;
	imgLoad();
	
});









































