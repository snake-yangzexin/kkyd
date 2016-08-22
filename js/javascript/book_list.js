// JavaScript Document
var oBookList={
	bookId:getWinUrl('bookId'),
	sChapterId:getWinUrl('chapterId')
}







var sIndexUrl='/asg/portal/h5/chapterList.html?';
var appVue;

var appVue=new Vue({
	el:'#book_list_vue',
	data:{
		valInde:'1',
		forJson:'',
		totalChapters:'',
		pageLen:['1'],
		nowPageNum:1,
		show:false
	},
	methods:{

		pageTurning:function(e){
			var nIndex=e.target.value;
			$.get(sIndexUrl+'&totalNum=100&index='+nIndex+'&bookId='+oBookList.bookId,function(data){
				////console.log(data);
				data=jsonStr(data);
				appVue.forJson=data['chapterList'];
			});
		}
	}
});

$.get(sIndexUrl+'totalNum=100&bookId='+oBookList.bookId+'&chapterId='+oBookList.sChapterId,function(data){
	////console.log(data);
	ajax_data=jsonStr(data);
	var nTotalChapters=Math.ceil(ajax_data['totalChapters']/100);
	var arr=[];
	for(var i=0; i<nTotalChapters; i++){
		arr[i]=i+1+'';
	}
	//alert(JSON.stringify(arr));
	appVue.forJson=ajax_data['chapterList'];
	appVue.totalChapters=ajax_data['totalChapters'];
	appVue.pageLen=arr;
	appVue.show=true;
	appVue.valInde=ajax_data.index;
});



















$(function(){
	
	$(document).on('click','#directory_list_ul a',function(){
		var oThis=$(this);
		var sChapter=$(this).attr('aChapter');
		var sUrl=$(this).attr('aHref');
		$.get('/asg/portal/h5/reader.html?reaction=3&bookId='+oBookList.bookId+'&chapterId='+sChapter,function(data){
			////console.log(data);
			data=jsonStr(data);
			if(data['status']=='1'){
				var oBookInfo={
					loginUrl:winLocalHref(),
					bookId:oBookList.bookId,
					chapterId:sChapter,
					reaction:3
				}
				oBookInfo=jsonStr(oBookInfo);
				$.cookie('book_info',oBookInfo, { expires: nTimeMs });
				if(oChannelCode[sChannelCodeCookie]){
					winLocalHref('/login/login.html');
				}else{
					winLocalHref('/subscribe_chapter.html?bookId='+oBookList.bookId+'&reaction='+3+'&chapterId='+sChapter);
				}
			}else if(data['status']=='4'){
				$.cookie('book_info',null);
				winLocalHref(sUrl);
			}else if(data['status']=='0'){
				var oBookInfo=$.cookie('book_info');
				if(!oBookInfo||oBookInfo=='null'){
					oBookInfo={
						loginUrl:winLocalHref(),
						bookId:oBookList.bookId,
						chapterId:sChapter,
						reaction:3
					}
					oBookInfo=jsonStr(oBookInfo);
				}else{
					oBookInfo=jsonStr(oBookInfo);
					oBookInfo['chapterId']=appVue.forJson.chapterId;
					oBookInfo=jsonStr(oBookInfo);
				}
				$.cookie('book_info',oBookInfo, { expires: nTimeMs });
				winLocalHref('/subscribe_chapter.html?bookId='+oBookList.bookId+'&reaction='+3+'&chapterId='+sChapter);
			}
			
		});
	})/*.on('change','.directory_select select',function(){
		var oThis=$(this);
		var sVal=oThis.val();
		listCount(sVal);
	});

	
	//urlDirectory(100);
	*/
	
})
function listCount(sVal){
	
	var sHtml='';
	if(typeof sVal=='string'&&sVal.indexOf('-')>0){
		sVal=sVal.split('-');
		for(var i=parseInt(sVal[0]);i<=parseInt(sVal[1]);i++){
			sHtml+='<li>\
					<a href="book.html">\
						<strong>第<span>'+i+'</span>章</strong>\
						<h3>盗墓笔记</h3>\
					</a>\
				</li>';
		}
		$('#directory_list_ul').html(sHtml);
	}
}

function urlDirectory(nBase){
	var url=winLocalHref(),ntwo,nPage,nPages;
	if(!nBase){
		nBase=100;
	}
	if(url&&url.indexOf('chapterNum')>0){
		url=parseInt(url.split('=')[1]);
		nPages=parseInt(url/nBase);
		ntwo=url-nPages*nBase;
		nPage=nPages;
		if(typeof nPage=='number'){
			$('.directory_select option:eq('+nPage+')').get(0).selected=true;
			listCount($('.directory_select option:eq('+nPage+')').val());
		}else{
			listCount(nPage);
		}
		var nScrollTop=$('.directory_list_ul li:eq('+(ntwo-3)+')').offset().top;
		$('html,body').animate({'scrollTop':nScrollTop},100);
	}else{
		listCount($('.directory_select select').val());
	}
}

