// JavaScript Document
var sIndexUrl='/asg/portal/h5/bookShelf/';
var sRecommende='/asg/portal/h5/recommended.do';

var appVue=new Vue({
	el:'#automatic_vue',
	data:{
		forJson:[],
		allSize:0,
		recommended:'',
		show:false
	},
	methods:{
		removeBook:function(sBookId,sIndex){
			$.get(sIndexUrl+'autosubDel.html?bookId='+sBookId,function(data){
				//console.log(jsonStr(data));
				appVue.forJson.$remove(appVue.forJson[sIndex]);
			});
		}
	}
});







$.get(sIndexUrl+'autosubList.html?page=1&size=50',function(data){
	//console.log(jsonStr(data));
	appVue.forJson=data['content'];
	appVue.allSize=data['size'];
	appVue.show=true;
	imgLoad();
});




$.get(sRecommende,function(data){
	if(data['status']==1){
		appVue.recommended=data['blockResources'];
	}
	
});








































