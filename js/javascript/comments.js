// JavaScript Document
var cTime=null;
var nTotalNum=50;
var sBookId=getWinUrl('bookId');
var getUrl='/asg/portal/h5/commentList.html?totalNum='+nTotalNum+'&bookId='+sBookId;

var vueApp=new Vue({
	el:'#comments_vue',
	data:{
		show:false,
		listSwitch:false,
		pageIndex:1,
		commentSize:[],
		forJson:[]
	}
});

$.get(getUrl,function(data){
	//console.log(data);
	data=jsonStr(data);
	vueApp.show=true;
	vueApp.listSwitch=true;
	vueApp.pageIndex=2;
	vueApp.commentSize=data['commentSize'];
	vueApp.forJson=data['commentList'];
	
	if(data['commentSize']<=nTotalNum){
		clearTimeout(cTime);
		vueApp.listSwitch=false;
		$('.loading_box').html('<div class="loading_over"><strong>已经是全部评论了！</strong></div>');
	}
	
});

$(window).scroll(function(){
	var nScrollTop=$(window).scrollTop();
	var nWinH=$(window).height();
	var nBodyH=$('body').height()-20;
	////console.log(nScrollTop+'==='+nWinH+'==='+nBodyH);
	////console.log('==='+ nScrollTop + '----' +(nBodyH-nWinH) + '===' + (vueApp.listSwitch) + '===' + (nScrollTop>nBodyH-nWinH&&vueApp.listSwitch)+'===');
	if(nScrollTop>nBodyH-nWinH&&vueApp.listSwitch){
		clearTimeout(cTime);
		vueApp.listSwitch=false;
		cTime=setTimeout(function(){
			vueApp.listSwitch=true;
		},1000);
		$.get(getUrl+'&index='+vueApp.pageIndex,function(data){
			vueApp.pageIndex++;
			//console.log(data);
			data=jsonStr(data);
			if(data['commentList'].length>0){
				for(var i=0; i<data['commentList'].length; i++){
					vueApp.forJson.push(data['commentList'][i]);
				}
			}else{
				clearTimeout(cTime);
				vueApp.listSwitch=false;
				$('.loading_box').html('<div class="loading_over"><strong>已经是全部评论了！</strong></div>');
			}
			
		})
	}
});































