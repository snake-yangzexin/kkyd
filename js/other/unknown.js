
try{﻿(function(win){
	window.prtl={
		type:'https:'==window.location.protocol?'https':'http',
		prefix:'https:'==window.location.protocol?'https://':'http://'
	};
})(window);
}catch(e){throw new Error(e+" ./httpsSupport.js");}

try{//触发打开呼起浮层
//_sinaCallEvent.trigger('sina_open_native',config);
/**
**若要对外调用，可设置参数如下：
  var config = {
    "iosInstallUrl":""+window.prtl.prefix+"interface.sina.cn/wap_api/ls/jump_client.d.html?k=82",
    "androidInstallUrl":""+window.prtl.prefix+"interface.sina.cn/wap_api/ls/jump_client.d.html?k=82",
    "iosNativeUrl":"sinanews://news.sina.cn",
    "androidNativeUrl":"sinanews://news.sina.cn",
    "openByWeixin":""+window.prtl.prefix+"a.app.qq.com/o/simple.jsp?pkgname=com.sina.news",
    "setOpenTrackUrl":"",
    "setDownloadTrackUrl":""
  }
  备注：参数不全时，字段可为空或者省略此参数
  _sinaCallEvent.trigger('sina_open_native',config);
**/
(function( win, doc){
  var _urlDefault = '';
    win.getFromUrl = false;
  /**
  * 事件的绑定和触发
  **/
  win._callEventCom = {};
  win._callReadyEvent = {};
  win._sinaCallEvent = {
    on : function( ev, callback){
      var hasProperty = win._callEventCom.hasOwnProperty(ev),
        isReadyInner = win._callReadyEvent.hasOwnProperty(ev);
      if( !hasProperty ){
        win._callEventCom[ev] = callback;
      }
      if(isReadyInner){
        _sinaCallEvent.trigger( ev, win._callReadyEvent[ev]);
        delete win._callReadyEvent[ev];
      }
    },
    trigger : function( ev, params){
      var hasProperty = win._callEventCom.hasOwnProperty(ev);
      if(hasProperty){
        win._callEventCom[ev](params);
      }
      else{
        win._callReadyEvent[ev] = params;
      }
    }
  };
    win.sendSudaLog = function(sudaName){
      var obj = {
                'name' : sudaName,
                'type' : '',
                'title' : '',
                'index' : '',
                'href' : ''};
        if( typeof(win.suds_count) == 'function' || win.suds_count)
        {
            win.suds_count && win.suds_count( obj );
        }
    }
    /**
    *公用模块
    *包含获取UA／客户端判断
    **/
    win.Utils = {
      _UA : navigator.userAgent.toLowerCase(),
      UAIdentify : {
        weibo : 'weibo',
        qq : 'qq',
        uc : 'ucbrowser/',
        weixin : "micromessenger",
        chrome : 'chrome',
        sinanews :'sinanews',
        aliPay : 'alipayclient',
        ios9 : 'iphone os 9_'
      },
      getWeiboVersion : function(){
        var ua = this._UA,
          _all = this.UAIdentify,
          _version = ua.split('__'+_all.weibo+'__'),
          _vstr = _version.length>1 ?_version[1]:'0.0.0';
        return this.getVersion(_vstr);
      },
      getVersion : function(str){
          var arr = str.split('.'),
              version = 0;
          version = parseFloat(arr[0]+'.'+parseInt(arr[1]));      
          return version;
      },
      isInclude : function(allStr,str){
        return allStr.indexOf(str)>-1;
      },
      isUC : function(){
        var _all = this.UAIdentify,
          _isUC = this.isInclude(this._UA,_all.uc);
        if(_isUC){
          return true;
        }else{
          return false;
        } 
      },
      isSinaNews : function(){
        var _all = this.UAIdentify,
          _isSinaNews = this.isInclude(this._UA,_all.sinanews);
        if(_isSinaNews){
          return true;
        }else{
          return false;
        } 
      }, 
      isWeibo : function(){
        var _all = this.UAIdentify,
            _isWeibo = this.isInclude(this._UA,_all.weibo);
          if( _isWeibo ){
              return true;
          }
          return false;
      },
      isQQ : function(){
        var _all = this.UAIdentify,
            _isQQ = this.isInclude(this._UA,_all.qq);
          if( _isQQ ){
              return true;
          }
          return false;
      },
    isWeixin : function(){
      var _all = this.UAIdentify,
            _isWeixin = this.isInclude(this._UA,_all.weixin);
        if(_isWeixin)  {
            return true;
        } else {
            return false;
        }
    },
    isChrome : function(){
      var _all = this.UAIdentify,
            _isChrome = this.isInclude(this._UA,_all.chrome);
        if(_isChrome) {
            return true;
        } else {
            return false;
        }
    },
    isAliPay : function(){
      var _all = this.UAIdentify,
        _isAliPay = this.isInclude(this._UA,_all.aliPay);
      if(_isAliPay){
        return true;
      }else{
        return false;
      }
    },
    isIOS9 : function(){
      var _all = this.UAIdentify,
            _isIos9 = this.isInclude(this._UA,_all.ios9);
      //var ua = this._UA;
        if(_isIos9) {
            return true;
        } else {
            return false;
        }
    },
    /**
     * [_UA 检测平台]
     * @return string [ios|android| ]
     */
    _system: function() {
      var ua = this._UA;
      // var div = document.createElement('div');
      // div.innerHTML = ua;
      // document.body.insertBefore(div,document.body.firstChild);
      
      //var android = ua.match(/Android/i);
      //if (ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      if (ua.match(/iphone|ipod/ig)){
        return 'ios';
      } else {
        return 'android';
      }
    },
    getFullNumber: function(pos){
      !!!pos && (pos = 1);
      var _len = pos.toString().length,
        _pos = '';
      if( _len<3 ){
        pos = ('000'+pos).substr(-3,3);
      }
      return pos;
    }
  }
    /**
  * 呼起模块，不再内部做业务处理，只做呼起相关逻辑处理
    **/
  var RedirectToNative = {
    openTimer : null,
     /**
     * iosNativeUrl: string 必选 ios app上自定义的url scheme） 如 taobao://home(淘宝首页) etao://item?nid=xxx（一淘商品详情页）
     * androidNativeUrl: string 必选 android app自定义的url scheme
     * iosInstallUrl: string 必选 ios app store里的安装地址
     * androidInstallUrl: string 必选 android app的apk地址
     * package: string 可选 默认com.taobao.taobao android的包名，如淘宝为com.taobao.taobao，etao为com.taobao.etao
     * iosOpenTime: int 可选默认800ms， 启动ios客户端所需时间，一般ios平台整体性能不错，打开速度较快
     * androidOpenTime: int 可选默认2000ms，启动android客户端所需时间，android系统性能参差不齐所需启动时间也不齐，和android客户端本身启动时间也有关，比如3.0版本启动一淘客户端就平均比淘宝客户端要慢200ms
     */
    init: function(_config) {
      var self    = this,
        isWeixin  = Utils.isWeixin(),
        isChrome  = Utils.isChrome(),
        isIOS9    = Utils.isIOS9(),
        isQQ      = !isWeixin && Utils.isQQ(),
        isWeibo   = Utils.isWeibo(),
        config    = _config || {},
        isHttp    = true;
      self.platform = Utils._system();
      self.openByWeixin = config.openByWeixin || _urlDefault;
      isQQ = !!(isQQ && self.openByWeixin) || _urlDefault;
      self.isNotScheme = !!config.isNotScheme;
      self._position = Utils.getFullNumber(config.position);
      self.position = (!!config.calluptype && (config.calluptype||'')+self._position) || '001';
      Track.sendClickTrack(self.position);
      // pc下什么都不处理,pc访问下可能href可以链接去其他地址
      if(!self.platform) return;
      if (self.platform == 'ios') {
        self.installUrl = config.iosInstallUrl || _urlDefault;
        self.nativeUrl = config.iosNativeUrl || _urlDefault;
        var isDownloadUrl = self.installUrl.match(/(\S*)(d\.php\?k\=)(\S*)/);
        self.openTime = config.iosOpenTime || 800;
        if(isWeibo && self.installUrl && isDownloadUrl){          
          self.installUrl += "&sinainternalbrowser=external";
        }
      } else {
        self.installUrl = config.androidInstallUrl || _urlDefault;
        self.nativeUrl = config.androidNativeUrl || _urlDefault;
        self.openTime = config.androidOpenTime || 3000;
      }
      //qq，直接跳转应用宝
      if( isQQ && !!self.openByWeixin && !self.isNotScheme){
        win.location.href = self.openByWeixin;
        return;
      }
      //微信条件下，且微信链接不为空，则显示浮层，否则跳过
      if( isWeixin && !self.isNotScheme){
        showWeiXinTips();
        return;
      }
      isHttp = self.nativeUrl.indexOf(''+window.prtl.prefix+'')>-1;
      //只有android下的chrome要用intent协议唤起native
      if (self.platform != 'ios' && isChrome && !isWeibo && !isHttp) {
        self.nativeUrl = self._hackChrome();
      }
      //alert(self.nativeUrl );
      self._gotoNative();
    },   
    /**
     * _hackChrome 只有android下的chrome要用intent协议唤起native
     * https://developers.google.com/chrome/mobile/docs/intents
     * @return {[type]} 
     */
    _hackChrome: function() {
      var self = this;
      var startTime = Date.now();
      if(self.nativeUrl == _urlDefault || !self.nativeUrl){
        return _urlDefault;
      }
      var paramUrlarr = self.nativeUrl.split('://'),
        scheme = paramUrlarr[0],
        schemeUrl = paramUrlarr[1];
        var oImg = new Image();
            oImg.src = self.schemejc;
        return 'intent://' + schemeUrl + '#Intent;scheme=' + scheme + ';end';
      // win.location = 'intent://' + schemeUrl + '#Intent;scheme=' + scheme + ';end';
    },
    /**
     * [_gotoNative 跳转至native，native超时打不开就去下载]
     * @return 
     */
    _gotoNative: function() {
      var self  = this,
        isIOS9  = Utils.isIOS9(),
        isWeibo = Utils.isWeibo(),
        isUC   = Utils.isUC(),
        isAliPay = Utils.isAliPay(),
        tag   = 'iframe',
        openTime = isIOS9?self.openTime:self.openTime;
      var startTime = Date.now(),
        doc = document,
        body = doc.body,
        newNode = doc.createElement(tag);
        newNode.id = 'J_redirectNativeFrame';
      
      //若不需要呼起，则直接跳转链接
      if(self.isNotScheme && !!self.nativeUrl){
        win.location.href = self.nativeUrl;
        return;
      }
      //若为IOS9，下载地址不为空，且需要呼起，直接跳转呼起地址
      // else if(isIOS9 && !!self.nativeUrl && !self.isNotScheme && !isWeibo ){
      //   win.location.href = self.nativeUrl;
      //   return;
      // }
      //若为IOS9，下载地址不为空，且需要呼起，直接跳转下载地址
      else if(isIOS9 && !!self.installUrl && !self.isNotScheme && !isWeibo && !isUC){
        //win.location.href = self.installUrl;
        self._gotoDownload(startTime);
        return;
      }
      else{
        newNode.style.display = 'none';     
        if(!!self.nativeUrl){
          newNode.src = self.nativeUrl;
        }
        //运行在head中
        if(!body) {
          setTimeout(function(){
            body.appendChild(newNode);
          }, 0);
        } else {
          body.appendChild(newNode);
        }
      }
      if(self.openTimer){
        clearTimeout(self.openTimer);
      }
      self.openTimer = setTimeout(function() {
        doc.body.removeChild(newNode);
        self._gotoDownload(startTime);
        /**
         * 测试时间设置小于800ms时，在android下的UC浏览器会打开native app时并下载apk，
         * 测试android+UC下打开native的时间最好大于800ms;
         */
      }, openTime);
    },
    /**
     * [_gotoInstall 去下载]
     * @param  {[type]} startTime [开始时间]
     * @return 
     */
    _gotoDownload: function(startTime) {
      var self = this;
      var endTime = Date.now(),
        platform = Utils._system(),
        isWeibo   = Utils.isWeibo(),
        isAndroid = platform == 'android' && (endTime - startTime < self.openTime + 500),
        isIOS = platform == 'ios';
      //清除锁
      _sinaCallEvent && _sinaCallEvent.trigger('sina_clear_lock');
      if ((isAndroid || isIOS) && !!self.installUrl) {
        Track.sendDownloadTrack(self.position);
        if(win.newsAppActivity && win.newsAppActivity.trigger && isAndroid && isWeibo){
          win.newsAppActivity.trigger('callupDownload', []);
        }
        win.location.href = self.installUrl;
        return;
      }
    }
  };
  /*
  *[Track] 点击情况统计
  *包含点击统计，下载统计
  */
  var Track = {
    click : ''+window.prtl.prefix+'open.api.sina.cn/count/appview',
    download : '',
    trackUrl : {},
    setClickTrackUrl : function (url){
      this.trackUrl.click = url;
    },
    setDownloadTrackUrl : function (url){
      this.trackUrl.download = url;
    },
    goTrack : function(url){
      var B = document.getElementsByTagName("head")[0],
        C = document.createElement("script"),
        _url = url,
        isMark = Utils.isInclude('?');
      if(!_url){
        return false;
      }
      if( isMark ){
        _url += '&';
      }else{
        _url += '?';
      }
      C.src=_url+'t='+(new Date()).getTime();
      C.onload = function(){
        C.onload = null;
        C.parentNode.removeChild(C);
      };
      B.appendChild(C);
    },
    sendClickTrack : function (position){
      this.goTrack(this.trackUrl.click);
      window._sinaCallEvent.trigger('sina_suda_action','click_'+position);
    },
    sendDownloadTrack : function (position){
      this.goTrack(this.trackUrl.download);
      window._sinaCallEvent.trigger('sina_suda_action','callfail_'+position);
      window._sinaCallEvent.trigger('sina_callfail');
    }
  }
  
  /**
  *插入微信提示浮层
  **/
  var  wxShareIco= 'j_callupTips_bg',
    hideWeixinTimer = null,
    systems = {ios:'ios',android:'android'},
    _callupTips = win.callupTips || {
            android : ''+window.prtl.prefix+''+(window.prtl.type=='http'?'n.sinaimg.cn':'ns.sinaimg.cn')+'/dae7ff0c/20151013/popup_android.png',
            ios     : ''+window.prtl.prefix+''+(window.prtl.type=='http'?'n.sinaimg.cn':'ns.sinaimg.cn')+'/dae7ff0c/20151013/popup_ios.png'
        };
  function showWeiXinTips(){
    var _$wxBox = doc.querySelector('.'+wxShareIco),
      section = doc.createElement('section');
    if(!_$wxBox)
    {
      var arr = new Array(),
        src = ""+window.prtl.prefix+"u1.sinaimg.cn/upload/2014/12/19/102181.png",
        width = 100,
        mySystem = Utils._system();
      if( _callupTips ){
        if( mySystem == systems.android ) src = _callupTips.android;
        if( mySystem == systems.ios ) src = _callupTips.ios;
        width = '100%';
      }
      arr.push('<a class="j_share_wx" href="javascript:;">');
      arr.push('<span></span>');
      arr.push('</a>');
      arr.push('<a class="goback" href="javascript:;">');
      arr.push('</a>');
      arr.push('<div class="share_bg '+wxShareIco+'" style="position:fixed;display:block;left:0;top:0;width:100%;height:100%;z-index:1009; background:rgba(0,0,0,.6);-webkit-animation:opacityIn 1s .2s ease both;">');
      arr.push('<p class="share_icon" style="clear:both; padding:10px; text-align:right;height:100%;background-position: right top; -webkit-animation:rotateUp 1s .8s ease both;z-index:9999;"><img src="'+src+'" alt="" width="'+width+'" /></p>');
      arr.push('</div>');
      section.innerHTML = arr.join('');
      doc.body.appendChild(section);
      _$wxBox = doc.querySelector('.'+wxShareIco);
      _$wxBox.onclick = function(){
        if(_$wxBox.style.display =="block"){
          _$wxBox.style.display = "none";
         _sinaCallEvent && _sinaCallEvent.trigger('sina_clear_lock');
        }
      };
    }
    else{
      _$wxBox = doc.querySelector('.'+wxShareIco);
      _$wxBox.style.display = "block";
    }
  }
  var addStatisticsK = {
    keyListOrder : ['media','domain','channel','type','position','timeStamp','url'],
    getURLParamter : function(){
      var search = document.location.search,
        isCUDomain = search.indexOf('cu_domain')>-1,
        isCUType = search.indexOf('cu_type')>-1,
        isCUPos = search.indexOf('cu_pos')>-1;
      function GetQueryString(name) {  
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
        var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
        var context = "";  
        if (r != null)  
             context = r[2];  
        reg = null;  
        r = null;  
        return context == null || context == "" || context == "undefined" ? "" : context;  
      }
      if(isCUPos){
        return {
          domain : GetQueryString('cu_domain'),
          type : GetQueryString('cu_type'),
          channel : GetQueryString('cu_channel') || GetQueryString('cu_domain'),
          pos : GetQueryString('cu_pos')
        };
      }
      return false;
    },
    //获取URL中用于统计的信息
    fromUrlInfo : function(){
      var _domain = document.domain,
        _docUrl = window.location.href,
        _fromInfo = {
          media : 'sinawap',
          domain : _domain.split('.')[0],
          channel : 'news',
          type  : 'index',
          position : '0000',
          timeStamp : (new Date()).getTime(),
          url : _docUrl
        };
      try{
        _fromInfo.url = encodeURIComponent(_docUrl);
      }catch(e){
        console.log('k value not encodeURIComponent');  
      }
      if(typeof(__docConfig) != 'undefined'){
        _fromInfo.domain  = __docConfig.__tj_sch || _fromInfo.domain;
        _fromInfo.channel = __docConfig.__tj_ch || _fromInfo.domain;
        _fromInfo.type    = 'article';
      }
      return _fromInfo;
    },
    getNativeUrl : function(nativeUrl){
      var self = this,
        schemeHead = 'sinanews://',
        isSinanews = nativeUrl.indexOf(schemeHead)>-1,
        noParamK = !nativeUrl.match(/(sinanews:\/\/)(\S*)(k\=)(\S*)/),
        hasParam = nativeUrl.length > schemeHead.length,
        _keyListOrder = self.keyListOrder,
        _fromInfo = self.fromUrlInfo(),
        _keyArr = [],
        joinMark = '',
        _paramterFromUrl = self.getURLParamter();
      //从当前url中获取k字段
      if(!window.getFromUrl && _paramterFromUrl){
        _fromInfo.domain  = _paramterFromUrl.domain || _fromInfo.domain;
        _fromInfo.channel   = _paramterFromUrl.channel || _fromInfo.channel;
        _fromInfo.type    = _paramterFromUrl.type || _fromInfo.type;
        _fromInfo.position  = _paramterFromUrl.pos || _fromInfo.position;       
        window.getFromUrl = true;
      }
      //若呼起链接中缺少k字段，则从url众获取，并添加
      if(isSinanews && noParamK ){
        for(var o in _keyListOrder){
          var _name = _keyListOrder[o];
          _keyArr.push(_fromInfo[_name]);
        }
        if(hasParam){
          joinMark = '::';
        }
        nativeUrl += joinMark +'k='+ _keyArr.join('*');
      }
      return nativeUrl;
    },
    init :function(config){
      var self = this,
        _config = config || {};
      if(_config.iosNativeUrl === _config.androidNativeUrl ){
        _config.iosNativeUrl = _config.androidNativeUrl = self.getNativeUrl(_config.iosNativeUrl);
      }
      else{
        _config.iosNativeUrl = self.getNativeUrl(_config.iosNativeUrl);
        _config.androidNativeUrl = self.getNativeUrl(_config.androidNativeUrl);       
      }
      return _config;
    },
  }
  win.sinaOpenNative = function(config){
    var _config = config || {};
    RedirectToNative.init(_config);
    //统计信息统计
    (_config.setOpenTrackUrl != 'undefined') && Track.setClickTrackUrl(_config.setOpenTrackUrl);
    (_config.setDownloadTrackUrl != 'undefined')&& Track.setDownloadTrackUrl(_config.setDownloadTrackUrl);
  };
  function init(){
    
    //绑定触发事件
    //showWeiXinTips();
    _sinaCallEvent.on('sina_direct_open',sinaOpenNative);   
    _sinaCallEvent.on('sina_suda_action',sendSudaLog);  
  }
  init();
})(window, document);
}catch(e){throw new Error(e+" ./CallNativeCom_2.js");}

try{//触发打开呼起浮层
//_sinaCallEvent.trigger('sina_open_native',config);
/**
var _SACONFIG = {
		// domain : 'news',
		// type : 'index',
		position: '1000'
	};
主要用于处理新闻客户端添加的k参数
1/监听j_call_native点击事件，需要根据情况判断呼起规则，点击呼起客户端(k参数取自dom结构参数)
2/所有的新闻客户端k参数选取
备注：
优先级：
监听Dom点击时：dom参数>_SACONFIG>docConfig>Url
push : _SACONFIG>docConfig>Url
其他: url>_SACONFIG>docConfig
**/
(function( win, doc){
	var _urlDefault = '',
		_sudaName = 'sinanews',
		_saConfig = (typeof(_SACONFIG) !== 'undefined' && _SACONFIG) || {},
		clickInternal = 3*1000,
		loading = 0;
    win.getFromUrl = false;
    /**
	*自动添加点击事件，并获取k参数
    **/
    var getClickTargetInfo = {
		domClass : 'j_call_native',
		dataName : {docid:null,callupid:null,globalswitch:'0',media:'sinawap',app:null,domain:null,
					channel:null,type:null,calluptype:'',position:null,url:null,downloadk:null,
					golink:'',clicksuda:'',weiboSlience:''},
		getDomInfo : function(dom){
	        var _className = dom.className,
	            domInfo = {},
	            domData = dom.dataset;
	        //data-params='{"id": "-news-event-live","livetype":"","type":"","vid": ""}' 
	        domInfo.isCallNative = _className.indexOf(this.domClass)>-1;
	        if(domInfo.isCallNative){
	        	// data-paramsid="2016qglh0302" data-paramslivetype="event" data-paramstype="" data-paramsvid="174964"
	        	//大事件直播参数
	        	domInfo.paramsid	= domData['paramsid'] || '';
	        	domInfo.paramslivetype = domData['paramslivetype'] || '';
	        	domInfo.paramstype 	= domData['paramstype'] || ''; //'',share,discuss
	        	domInfo.paramsvid 	= domData['paramsvid'] || '';
	        	domInfo.paramsmatchid = domData['paramsmatchid'] || '';
	        	domInfo.docid 		= domData['docid'];//将废弃
	        	domInfo.callupid 	= domData['callupid'];
	        	domInfo.globalSwitch = domData['globalswitch'] || '0';
				domInfo.media 		= domData['media'] || 'sinawap';
		        domInfo.app 		= domData['app'];
		        domInfo.domain 		= domData['domain'];
		        domInfo.channel 	= domData['channel'];
		        domInfo.type 		= domData['type'];
	        	domInfo.calluptype 	= domData['calluptype'] ||'';
		        domInfo.position 	= getPos(domData['position']); 
		        domInfo.url 		= domData['url']; 
		        domInfo.downloadk 	= domData['downloadk'];//将废弃
		        domInfo.kid 		= domData['kid'];
		        domInfo.golink 		= domData['golink'] || '',
		        domInfo.clickSuda 	= domData['clicksuda'] ||''; 
		        domInfo.weiboSlience = domData['weiboSlience'] ||''; 
		        domInfo.locked		= !!parseInt(domData['locked']) || false;
		        //domInfo.position 	= domInfo.calluptype+domInfo._position;
	        }
	        function getPos(pos){
	        	!!!pos && (pos = 1);
	        	var _len = pos.toString().length,
	        		_pos = '';
	        	if( _len<3 ){
	        		pos = ('000'+pos).substr(-3,3);
	        	}
	        	return pos;
	        }
	        return domInfo;
	    },
	    findDom : function(dom){
	        var maxDeep = 10,
	            domInfo = {};
	        
	        for(var o=0;o<maxDeep;o++){
	            domInfo.info = this.getDomInfo(dom);
	            if(domInfo.info.isCallNative){
	            	domInfo.dom = dom;
	                break;        
	            }else{
	                dom = dom.parentElement;
	            }
	        }
	        return domInfo;
	    },
	    findTargetInfo : function(dom){
	    	var domInfo = this.findDom(dom);
	        return (domInfo && domInfo.info) || null;
	    },
	    bindEventForApp : function(obj, ev, fn){
	        if(!document.addEventListener){
	            obj.attachEvent(ev,fn);
	        }
	        else{
	            obj.addEventListener(ev,fn,true);
	        }
	    },
	    stopDefault : function(e){
			e = e || window.event;
			if(e.preventDefault) {
				e.preventDefault();
				//e.stopPropagation();
			}else{
				e.returnValue = false;
				//e.cancelBubble = true;
			}
		},
		addLock : function(dom){
	       	// var domInfo = this.findDom(dom);	        
	        // domInfo && domInfo.dom && domInfo.dom.setAttribute('data-locked','1');
	        window.callLocked = true;
	        setTimeout(function(){
        		_sinaCallEvent && _sinaCallEvent.trigger('sina_clear_lock');
	        },clickInternal);
		},
	    bindTarget : function($obj){
	    	var self = this;
	        this.bindEventForApp($obj,'click',function(e){
	            var dom         = e.target,
	                targetInfo  = self.findTargetInfo(dom),
	                now 		= (new Date()).getTime(),
	                isLock 		= window.callLocked || false;
	            //if(targetInfo.isCallNative && (now - loading) > clickInternal){ 
	            if(targetInfo.isCallNative && !isLock){ 
	                loading = now;
	                self.addLock(dom);
	            	self.open_or_download_app(targetInfo);         	
	            }           
	            self.stopDefault(e);
	        
	        });
	    },
	    getParamsStr : function(params){
	    	var allStr = '{';
	    	for(var o in params){
	    		allStr +='\"'+o+'\":\"'+params[o]+'\"\,';
	    	}
	    	allStr = allStr.slice(0,-1);
	    	return allStr+'}';
	    },
	    open_or_download_app : function (config) {
			var data		= {},cid,kid,
				_config 	= config || _saConfig,
				jumpConfig 	= {},
				golink 		= '',
				isDomDocId 	= typeof(config)!= 'undefined' && ((config.callupid != undefined && config.callupid.length>0)||(config.docid != undefined && config.docid.length>0)),
				isConfigDoc = typeof(__docConfig)!= 'undefined' && ((__docConfig.__callupId != undefined && __docConfig.__callupId.length>0)||(__docConfig.__docId != undefined && __docConfig.__docId.length>0)),
				isH5Url 	= typeof(config)!= 'undefined' && _config.url != undefined && _config.url.length>0,
				isDownloadK = typeof(config)!= 'undefined' && config.downloadk!= undefined && config.downloadk,
				isGolink 	= typeof(config)!= 'undefined' && config.golink != undefined && config.golink.length>0,
				isEvent 	= typeof(config)!= 'undefined' && config.paramsid ,
				isKid		= typeof(config)!= 'undefined' && config.kid!= undefined && config.kid;
		
				var url_str = "",_newsid = "";
				if(isEvent){
					var params = {
						"id"	: config.paramsid,
						"livetype":config.paramslivetype,
						"type"	:config.paramstype,
						"vid"	: config.paramsvid,
						"matchid" : config.paramsmatchid
					}
					url_str = "sinanews://params="+this.getParamsStr(params);
				}
				if(isH5Url && !isEvent){
					url_str = "sinanews://url="+_config.url;
				}
				if(isDomDocId || (!!parseInt(config.globalSwitch) && isConfigDoc)){
					_newsid = config.callupid || config.docid+'-comos-news-cms';
					if(_newsid.indexOf('-')<=0 ){
						_newsid = __docConfig.__callupId || __docConfig.__docId+'-comos-news-cms';
					}
					url_str = "sinanews://newsid="+_newsid;
				}
				
				if(!url_str){
					url_str = "sinanews://sina.cn";
				}
				data = {
					iosNativeUrl: url_str,
					androidNativeUrl: url_str,
					weixn : ''+window.prtl.prefix+'a.app.qq.com/o/simple.jsp?pkgname=com.sina.news'
				};
				
				cid =  '82';
			//若存在golink则会跳转链接
			if(isGolink)
			{
				golink = config.golink;
				data.weixn = config.golink;
			}else{
				//此种情况，不需要通过跳转应用宝打开客户端
				//data.weixn = '';
				//需要统计下载渠道，需要dom中设置参数data-downloadk
				isDownloadK && (golink = ''+window.prtl.prefix+'interface.sina.cn/wap_api/ls/jump_client.d.html?k='+config.downloadk);
					//golink = ""+window.prtl.prefix+"sina.cn/j/d.php?k="+cid;
				isKid && (golink = ''+window.prtl.prefix+'so.sina.cn/palmnews/?id=' + config.kid);
				//若既无downloadK，也无golink，则呼起不成功，不做处理		
			}
			
			jumpConfig = {
				iosInstallUrl		: golink,
				androidInstallUrl	: golink,
				iosNativeUrl		: data.iosNativeUrl,
				androidNativeUrl	: data.androidNativeUrl,
				openByWeixin 		: data.weixn,
				isType 				: 'DOM',
				paramsK 			: _config,
				calluptype 			: config.calluptype,
				position 			: config.position,
				weiboSlience 		: config.weiboSlience
			};
			window._sinaCallEvent.trigger('sina_open_native',jumpConfig);
			//window._sinaCallEvent.trigger('sina_suda_action','click_'+config.position);
		},
	    init : function(){
			var nativeAppBox = doc.body.querySelectorAll('.'+this.domClass),
				o = 0,self = this;
			while(nativeAppBox && o<nativeAppBox.length){
				var _items = nativeAppBox.item(o),
					_status = _items.getAttribute('bind-target'),
					href = _items.getAttribute('href'),
					pos = _items.getAttribute('position');
				if( !_status){
					//替换a中href属性，放置其在IOS9.2自动跳转而不呼起客户端，并将值放置到data-golink中
					if(href){
						href.indexOf('javascript:void(0)')<0 && (_items.setAttribute('data-golink',href));
						_items.setAttribute('href','javascript:void(0);');	
						!pos && (_items.setAttribute('position','1'));
					}
					self.bindTarget(_items);
					_items.setAttribute('bind-target','binded');			
				}
				o++;	
			}
		}
	}
	window.clearAllLocked = function(){
		// var lockDom = document.querySelectorAll('[data-locked]');
		// for(var o=0,len=lockDom.length;o<len;o++){
		// 	lockDom[o].setAttribute('data-locked','0');
		// }
	    window.callLocked = false;
	}
	window.bindTarget = function(){
		getClickTargetInfo.init();
	}
	/*
	新闻客户端呼起，添加k统计信息
	*/
	var addStatisticsK = {
		config : {},
		//weiboSlience : ''+window.prtl.prefix+'interface.sina.cn/wap_api/ls/jump_client.d.html?k=178&cu_pos=0&cu_domain=news&cu_type=article',
		weiboSlience : 'sinaweibo://install?url=sinaweibo%3A%2F%2Fsilence%3Fsilence_package_name%3Dcom.sina.news%26silence_version_code%3D493116%26silence_md5%3Ddcb2920d013c8e92a0610d6936b6ccc8%26slience_appid%3D84475&action=sinaweibo%3A%2F%2Fsilence%3Fsilence_package_name%3Dcom.sina.news%26silence_version_code%3D493116%26silence_md5%3Ddcb2920d013c8e92a0610d6936b6ccc8%26slience_appid%3D84475&packagename=com.sina.news&silence_package_name=com.sina.news&silence_version_code=4931116&silence_md5=dcb2920d013c8e92a0610d6936b6ccc8&slience_appid=84475',
		TYPE : {dom:'DOM',push:'PUSH',other:'OTHER'},
		keyListOrder : ['media','domain','channel','type','position','timeStamp','url'],
		//获取url中的统计参数
		getURLParams : function(){
			var search = document.location.search,
				isCUDomain = search.indexOf('cu_domain')>-1,
				isCUType = search.indexOf('cu_type')>-1,
				isCUPos = search.indexOf('cu_pos')>-1;
			function GetQueryString(name) {  
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
				var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
				var context = "";
				if (r != null)
				     context = r[2]; 
				reg = null;
				r = null;
				return context == null || context == "" || context == "undefined" ? "" : context;  
			}
			if(isCUPos){
				return {
					domain : GetQueryString('cu_domain'),
					type : GetQueryString('cu_type'),
					channel : GetQueryString('cu_channel') || GetQueryString('cu_domain'),
					position : GetQueryString('cu_pos')
				};
			}			
			return false;
		},
		//获取SACOFIG／docConfig／默认值
		getAutoParams : function(){
			var _saConfig = typeof(_SACONFIG) != 'undefined' && _SACONFIG || '',
				_fromUrlParams = this.getURLParams(),  //参数取自url,
				_kInfo = {
					media 	: _saConfig && _saConfig.media || 'sinawap',
					domain 	: _saConfig && _saConfig.domain || document.domain.split('.')[0],
					channel : _saConfig && _saConfig.channel || 'news',
					type 	: _saConfig && _saConfig.type || 'index',
					position 	: _saConfig && _saConfig.position || '0000',
					timeStamp 	: (new Date()).getTime(),
					url 		: _saConfig && _saConfig.url || window.location.href
				};
			if(typeof(__docConfig) != 'undefined'){
				_kInfo.domain 	= __docConfig.__tj_sch || _kInfo.domain;
				_kInfo.channel	= __docConfig.__tj_ch || _kInfo.domain;
				_kInfo.type 	= __docConfig.__tj_type || 'article';
			}
			//从当前url中获取k字段
			if(!window.getFromUrl && _fromUrlParams ){
				_kInfo.domain 		= _fromUrlParams.domain || _kInfo.domain;
				_kInfo.channel 		= _fromUrlParams.channel || _kInfo.channel;
				_kInfo.type 		= _fromUrlParams.type || _kInfo.type;
				_kInfo.position 	= _fromUrlParams.position || _kInfo.pos;				
				window.getFromUrl 	= true;
			}
			return _kInfo;
		},
		//判断类型，并获取相应的k参数
		getKInfo : function(){
			var _params = this.config,
				_config = this.config,
				isType = _config.isType,
				_fAuto = this.getAutoParams(),//参数取自页面配置
				_fConfig = typeof(_config.paramsK)!=='undefined' && _config.paramsK || '';
			// switch(isType){
			// 	//若为DOM或其他类型，则统计参数从来源活着，若无，则
			// 	case this.TYPE.dom:
			// 	case this.TYPE.other:
					//_params = _fConfig || _fAuto;
					//不全的参数从auto参数中获取
					_params['media'] = (_fConfig && _fConfig.media) || _fAuto.media;
					_params['domain'] = (_fConfig && _fConfig.domain) || _fAuto.domain;
					_params['channel'] = (_fConfig && _fConfig.channel) || _fAuto.channel;
					_params['type'] = (_fConfig && _fConfig.type) || _fAuto.type;
					_params['position'] = (_fConfig && _fConfig.position) || _fAuto.position;
					_params['timeStamp'] = (new Date()).getTime();
					_params['url'] = (_fConfig && _fConfig.url) || _fAuto.url;
					// _params = {						
					// 	media 	: (_fConfig && _fConfig.media) || _fAuto.media,
					// 	domain 	: (_fConfig && _fConfig.domain) || _fAuto.domain,
					// 	channel : (_fConfig && _fConfig.channel) || _fAuto.channel,
					// 	type 	: (_fConfig && _fConfig.type) || _fAuto.type,
					// 	position 	: (_fConfig && _fConfig.position) || _fAuto.position,
					// 	timeStamp 	: (new Date()).getTime(),
					// 	url 		: (_fConfig && _fConfig.url) || _fAuto.url
					// };
			// 		break;
			// 	default:
			// 		_params = _fAuto;
			// 		break;
			// }
			return _params;
		},
		//将k统计参数添加到schemeUrl中
		getNativeUrl : function(_nativeUrl){
			var self = this,
				schemeHead = 'sinanews://',
				nativeUrl = _nativeUrl || '',
				isSinanews = nativeUrl.indexOf(schemeHead)>-1,
				noParamK = !nativeUrl.match(/(sinanews:\/\/)(\S*)(k\=)(\S*)/),
				hasParam = nativeUrl.length > schemeHead.length,
				_keyListOrder = self.keyListOrder,
				_keyInfo = self.getKInfo(),
				_keyArr = [],joinMark = '';
			//若呼起链接中缺少k字段，则从url众获取，并添加
			if(isSinanews && noParamK ){
				var _tmp = '';
				for(var o in _keyListOrder){
					var _name = _keyListOrder[o];
					_tmp = _keyInfo[_name];
					if(_name == 'url'){
						_tmp = encodeURIComponent(_keyInfo[_name]);
					}
					if(_name == 'position'){
						_tmp = (_keyInfo.calluptype||'') + _keyInfo.position;
					}
					_keyArr.push(_tmp);
				}
				if(hasParam){
					joinMark = '::';
				}
				nativeUrl += joinMark +'k='+ _keyArr.join('*');
			}
			return nativeUrl;
		},
		getInstallUrl : function(_installUrl){
			var _config = this.getAutoParams(),
				installUrl = _installUrl || '';
			if(!installUrl){
				return installUrl;
			}
			if(installUrl.indexOf('?')<=-1){
				installUrl += '?';
			}
			if(installUrl.indexOf('cu_pos=')<=-1){
				installUrl += '&cu_pos=' + _config.position + '&cu_domain='+_config.domain+'&cu_type='+_config.type;
			}		
		
			return installUrl;
		},
		getAndroidInstallUrl : function(_installUrl,weiboUrl){
			var self 		= this,
				_slienceUrl = weiboUrl || self.weiboSlience,
				isWeibo 	= Utils.isWeibo(),
				weiboVersion = Utils.getWeiboVersion(),
				isAndroid 	= Utils._system() == 'android';
			if(isWeibo && isAndroid && weiboVersion>=6){
				return _slienceUrl;
			}else{
				return self.getInstallUrl(_installUrl);
			}
		},
		toAddNewsStaticParams : function(){
			var _config = this.config || {},
				isPush = typeof(_config.isPush) !== 'undefined' && _config.isPush,
				installUrl = _config.installUrl || _config.installUrl || '',
				nextDownApp = installUrl.match(/(\S*)(d\.php\?k\=)(\S*)/),
				self = this;
			//为唤起客户端添加统计参数，新闻针对新闻客户端
			if(_config.iosNativeUrl === _config.androidNativeUrl ){
				_config.iosNativeUrl = _config.androidNativeUrl = self.getNativeUrl(_config.iosNativeUrl);
			}
			else{
				_config.iosNativeUrl = self.getNativeUrl(_config.iosNativeUrl);
				_config.androidNativeUrl = self.getNativeUrl(_config.androidNativeUrl);				
			}
			//若为push，则在需要跳转的链接后添加统计参数（新闻客户端）
			//if(_config.isType == this.TYPE.push ){
				// if(_config.iosInstallUrl === _config.androidInstallUrl ){
				// 	_config.iosInstallUrl = _config.androidInstallUrl = self.getInstallUrl(_config.iosInstallUrl);
				// }
				// else{
				// 	_config.iosInstallUrl = self.getInstallUrl(_config.iosInstallUrl);
				// 	_config.androidInstallUrl = self.getInstallUrl(_config.androidInstallUrl);			
				// }
			//}
			_config.iosInstallUrl 		= self.getInstallUrl(_config.iosInstallUrl);
			_config.androidInstallUrl 	= self.getAndroidInstallUrl(_config.androidInstallUrl,_config.weiboSlience);
			return _config;
		},
		init :function(config){
			var _config = config || {},
				schemeHead = 'sinanews://',
				nativeUrl = _config.androidNativeUrl || _config.iosNativeUrl || '',
				isSinanews = nativeUrl.indexOf(schemeHead)>-1;
			this.config = _config;
			if(isSinanews){
				_config = this.toAddNewsStaticParams(_config);
			}
			return _config;
		},
	}
	win.goOpenNative = function(config){
		var _config = addStatisticsK.init(config) || {};
		_sinaCallEvent.trigger('sina_direct_open',_config);
	};
	function init(){
		//绑定监听事件
		//getClickTargetInfo.init();
		_sinaCallEvent.on('sina_bind_target',bindTarget);
		_sinaCallEvent.trigger('sina_bind_target');
		_sinaCallEvent.on('sina_clear_lock',clearAllLocked);
		//绑定触发事件
		_sinaCallEvent.on('sina_open_native',goOpenNative);	
	}
	init();
})(window, document);
}catch(e){throw new Error(e+" ./OpenApp.js");}

try{/**
//插入push
//window._sinaCallEvent.trigger('sina_build_native');
//清除push
//window._sinaCallEvent.trigger('ina_clear_native');
//open之后，如果下次获取的为相同的新闻，则不显示
**/
(function( win, doc){
	var isTimeOver = false,
		keyListOrder = ['media','domain','channel','type','position','timeStamp','url'];
	var Push = {
		id : '_'+(new Date()).getTime(),
		isGetPushInfo : false,
		isPushOpen : false,
		pushInfo : {},
		pushUrl : {
			http : ''+window.prtl.prefix+'so.sina.cn/push.d.json?jsoncallback=updateInfo',
			https : 'https://so.sina.cn/push.d.json?jsoncallback=updateInfo'
		},
		isEmpty : function(objBox){
			var i  = 0,
				_obj = objBox || {};
			for(var o in _obj){
				i++;
			}
			if(i>0){
				return false;
			}
			else{
				return true;
			}
		},
		createElement : function(tag,attributes,content){
			var newNode = doc.createElement(tag),
				_attr = attributes;
			if(!this.isEmpty(_attr)){
				for(var o in _attr){
					newNode.setAttribute( o, _attr[o]);
				}
			}
			if(content){
				newNode.innerHTML = content;
			}
			return newNode;
		},
		ajaxJsonp : function(url){
			var head = doc.getElementsByTagName('body')[0],
				script = doc.createElement('script');
			script.src = url;
			script.className = "j_addscript";
			script.charset = "utf-8";
			head.appendChild(script);
			return false;
		},
		insertPush : function(info){
			var section = this.createElement('section'),
				self = this,
				closeBtn = null,
				openBtn = null,
				_t = runTemplate.tinyTemplateParser(Template.Push.Bottom,{info:info});
			section.innerHTML = _t;
			//section.setAttribute('style','position:fixed;bottom:50px;width:100%;height:50px;z-index:999;background-color:rgba(0,0,0,0.7)');
			doc.body.appendChild(section);
			closeBtn = section.querySelector('.close'),
			openBtn = section.querySelector('.open');
			if(closeBtn){
			 	closeBtn.onclick = function(){
					self.closePush();
					sendSudaLog('sinanews_close');
				}
			}
			if(openBtn){
				openBtn.onclick = function(){
					self.openApp();
					sendSudaLog('sinanews_open');
					self.closePush();
					sendSudaLog('sinanews_close');
					self.set_disable_record();
				}
			}
		},
		changePushShow : function(isShow){
			var section = doc.querySelector('#'+this.id),
				scale = isShow ? 1 : -1;
			if(section){
				if(scale>0){
					section.style['display'] = 'block';
				}else{
					setTimeout(function(){
						section.style['display'] = 'none';
					},600);
				}
				//section.style['transform'] = 'translate3d('+scale*100+'%,0,0)';
				section.style['-webkit-transform'] = 'translate3d('+scale*100+'%,0,0)';
				
			}
		},
		openPush : function(){	
			if(this.isGetPushInfo && !this.isPushOpen && isTimeOver && this.isAbleDisplay ){
				this.changePushShow(true);	
				this.isPushOpen = true;		
			}
		},
		uid:'push_open',
		isAbleDisplay : true,
		enable_disp : function (){
			var self = this;
			try{
				var PCRecord = null;
				if(!!localStorage.sina_push){
					PCRecord = JSON.parse(localStorage.sina_push);
				}
				if(PCRecord && PCRecord[self.uid]){
					if(PCRecord[self.uid] == self.pushInfo.artid){
						return false;
					}
					delete PCRecord[self.uid];
				}
				
				localStorage.sina_push = JSON.stringify(PCRecord);
			}catch(err){
				console.log(err);
			}
			return true;
		},
		set_disable_record :function(){
			var self = this;
			try{
				var PCRecord = localStorage.sina_push;
				if(PCRecord == 'null'){
					PCRecord = '{}';
				}
				PCRecord = JSON.parse(PCRecord);
				PCRecord[self.uid] = self.pushInfo.artid;
				localStorage.sina_push = JSON.stringify(PCRecord);
			}catch(err){
				console.log(err);
			}
		},
		closePush : function(_isNotShow){
			this.isAbleDisplay = !_isNotShow;
			if(this.isPushOpen ){
				this.changePushShow(false);
				this.isPushOpen = false;				
			}
		},		
		openApp : function(){
			var jumpConfig = {},
				_pushInfo = this.pushInfo,
				_newsid = _pushInfo.artid || '',
				nativeUrl = 'sinanews://',
				nextLinkParams = '',
				installUrl = _pushInfo.url;
			if(_newsid){
				nativeUrl += 'newsid='+_newsid;
			}
			if(_pushInfo.__isNotScheme){
				nativeUrl = installUrl;
			}
			jumpConfig = {
				iosInstallUrl		: installUrl,
				androidInstallUrl	: installUrl,
				iosNativeUrl		: nativeUrl,
				androidNativeUrl	: nativeUrl,
				openByWeixin 		: '',
				isNotScheme			: _pushInfo.__isNotScheme,
				isType 				: 'PUSH'
			};
		
			win._sinaCallEvent.trigger('sina_open_native',jumpConfig);
		},
		setPushInfo : function(info){
			var self = this;
			try{
				info.id = this.id;
				self.isGetPushInfo = true;
				self.pushInfo = info;
				self.insertPush(info);
				self.isAbleDisplay = self.enable_disp();
			}catch(e){
				console.log(e);
			}
		},
		startPush : function(info){	
			var self = this,
				_waitTime = typeof(info.waitTime)!=='undefined'&& parseInt(info.waitTime) || 15;	
			this.setPushInfo(info);
			setTimeout(function(){
				isTimeOver = true;
				self.openPush();
			},_waitTime*1000);
		},
		init : function(info){
			this.setPushInfo(info);
		}
	};
	function sendSudaLog(sudaName){
		var obj = {
			'name' : sudaName,
			'type' : '',
			'title' : '',
			'index' : '',
			'href' : ''};
		if( typeof(win.suds_count) == 'function' || win.suds_count)
		{
			win.suds_count && win.suds_count( obj );
		}
	}
	//win.updateInfo = Push.setPushInfo.bind(Push);
	win.openPush = Push.startPush.bind(Push);
	win.closePush = Push.closePush.bind(Push);
	function init(){			
		win._sinaCallEvent.on('sina_open_push',openPush);
		win._sinaCallEvent.on('sina_close_push',closePush);
	}
	init();
})(window, document);
}catch(e){throw new Error(e+" ./Push.js");}

try{(function(w,d){
  var _id = '_'+(new Date()).getTime();
  function setStyle(node, str){
    var styleMaps, styleCache;
    styleCache = node.style;
    if(typeof(str) === 'string' && str !== ''){
      styleMaps = str.split(';');
      styleMaps.forEach(function(item){
        var tmp;
        if(item !== ''){
          tmp = item.split(':');
          if(styleCache.hasOwnProperty(tmp[0])){
            styleCache[tmp[0]]=tmp[1];
          }
        }
      });
    }
  }
  function addDom(pos){
    try{
      var section   = d.createElement('section'),
        open    = null, close = null, _t = '',
        allfs     = getAllPlatformStatus(),
        isBlog    = allfs.isBlog,
        _sudaName   = allfs.name,
        data    = getResources(pos),
        info    = {};
      info = data;
      info.id = _id;
      if(pos === floatPosition.top){
        _t = Template.Banner.Top;
        d.body.insertBefore(section, d.body.firstChild);
      }else{
        _t = Template.Banner.Bottom;
        d.body.appendChild(section);
      }
      section.innerHTML = runTemplate.tinyTemplateParser(_t,{info:info});
      close = section.querySelector('.close'),
      open = section.querySelector('.open');
      
      if(close){
        close.onclick = function(){
          if(!isBlog){
            set_disable_record(pageUid);      
          }
          if(section.parentNode){
            section.parentNode.removeChild(section);
            window._sinaCallEvent.trigger('sina_suda_action',_sudaName+'_close');
          } 
        };
      } 
      if(open){
        open.onclick = function(){
          var now = (new Date()).getTime();
          if((now - loading) > clickInternal){
            loading = now;
            open_or_download_app();
          }
        };
      } 
    }catch(e){
      console.log(e);
    }
  }
  function getResources(pos){
    var data    = {},
      allfs     = getAllPlatformStatus(),
      isFinance   = allfs.isFinance,
      isNews    = allfs.isNews,
      isSports  = allfs.isSports,
      isBlog    = allfs.isBlog;
    if(isFinance){
      // 财经
      data = {
        logo  : ''+window.prtl.prefix+'www.sinaimg.cn/cj/2015/0824/U10832P31DT20150824180645.png',
        title   : '新浪财经',
        content : '新浪财经客户端，让赚钱更轻松',
        background : ''+window.prtl.prefix+'www.sinaimg.cn/cj/2015/0824/U10832P31DT20150824180612.jpg',
        color   : '#fdaf38'
      };
    }
    else if(isSports){
      // 体育
      data = {
        logo  : ''+window.prtl.prefix+''+(window.prtl.type=='http'?'n.sinaimg.cn':'ns.sinaimg.cn')+'/dae7ff0c/20151010/sport_logo.png',
        title   : '新浪体育',
        content : '赛事直播 体坛资讯 尽在新浪体育',
        background : ''+window.prtl.prefix+''+(window.prtl.type=='http'?'n.sinaimg.cn':'ns.sinaimg.cn')+'/dae7ff0c/20151010/bg_1.jpg'
      };
      if( pos == floatPosition.top ){
        data.color = '#b23636';
      }
      else{
        data.color = '#f84c4b';
      }
    }
    else if(isBlog){
      // 博客
      data = {
        logo  : ''+window.prtl.prefix+''+(window.prtl.type=='http'?'n.sinaimg.cn':'ns.sinaimg.cn')+'/dae7ff0c/20151021/blog.png',
        title   : '新浪博客',
        content : '博客全新版本，手机同步写博文',
        background : ''+window.prtl.prefix+''+(window.prtl.type=='http'?'n.sinaimg.cn':'ns.sinaimg.cn')+'/dae7ff0c/20151010/bg_1.jpg'
      };
      data.color = '#E87B55';
      
    }
    else{
      // 新闻
      data = {
        logo  : ''+window.prtl.prefix+''+(window.prtl.type=='http'?'n.sinaimg.cn':'ns.sinaimg.cn')+'/dae7ff0c/20151010/logo.jpg',
        title   : '新浪新闻',
        content : '安装新浪新闻，随时知晓天下事',
        background : ''+window.prtl.prefix+''+(window.prtl.type=='http'?'n.sinaimg.cn':'ns.sinaimg.cn')+'/dae7ff0c/20151010/bg_1.jpg'
      };
      if( pos == floatPosition.top ){
        data.color = '#b23636';
      }
      else{
        data.color = '#f84c4b';
      }
    }
    return data;
  }
  function today(){
    var dateObj = new Date();
    return dateObj.toDateString();
  }
  function enable_disp(uid){
    try{
      var PCRecord = null;
      PCRecord = JSON.parse(localStorage.sina_pro_cover);
      if(PCRecord && PCRecord[uid]){
        if(PCRecord[uid] == today()){
          return false;
        }
        delete PCRecord[uid];
      }
      
      localStorage.sina_pro_cover = JSON.stringify(PCRecord);
    }catch(err){
      //console.log(err);
    }
    return true;
  }
  function set_disable_record(uid){
    try{
      var PCRecord = localStorage.sina_pro_cover;
      PCRecord = JSON.parse(PCRecord);
      if(Object.prototype.toString.call(PCRecord) != '[object Object]'){
        PCRecord = {};
      }
      PCRecord[uid] = today();
      localStorage.sina_pro_cover = JSON.stringify(PCRecord);
    }catch(err){
      //console.log(err);
    }
  }
  function isArticle(){
    if(window.location.href.indexOf('.d.html')!=-1){
      return true;
    }
    else{
      return false;
    }
  }
  function isHrefInclude(str){
    var href = window.location.href,
      _allUrl = str.split('|');
    for(var i=0,len=_allUrl.length;i<len;i++){
      if(href.indexOf(_allUrl[i])>-1){
        return true;
      }
    }
    return false;
  }
  function getSpecialAppType(){
    return (typeof(_saConfig.app) != 'undefined') && _saConfig.app || '';
  }
  function getAllPlatformStatus(config){
    var specialType = getSpecialAppType(),
      _config   = config || {},
      isFinance   = _config.app == testPlatform.finance,
      isNews    = _config.app == testPlatform.news,
      isSports  = _config.app == testPlatform.sports,
      isBlog    = _config.app == testPlatform.blog,
      isTop     = _config.app == testPlatform.top;
    if( !isFinance && !isNews && !isSports && !isBlog ){
      isTop     = isHrefInclude(allPlatfrom.top)    || specialType == testPlatform.top,
      isFinance   = isHrefInclude(allPlatfrom.finance)  || specialType == testPlatform.finance,
      isNews    = isHrefInclude(allPlatfrom.news)   || specialType == testPlatform.news,
      isSports  = isHrefInclude(allPlatfrom.sports)   || specialType == testPlatform.sports || (isTop && isHrefInclude('/'+testPlatform.sports)) ,
      isBlog    = isHrefInclude(allPlatfrom.blog)   || specialType == testPlatform.blog;
    }
    return {
      name    : (isFinance && testPlatform.finance)||(isNews && testPlatform.news)||(isSports && testPlatform.sports)||(isBlog && testPlatform.blog),
      isFinance   : isFinance,
      isNews    : isNews,
      isSports  : isSports,
      isBlog    : isBlog
    }
  }
  function open_or_download_app(config) {
    var data    = {},cid,kid,
      allfs     = getAllPlatformStatus(config),
      isFinance   = allfs.isFinance,
      isNews    = allfs.isNews,
      isSports  = allfs.isSports,
      isBlog    = allfs.isBlog,
      _config   = config || _saConfig,
      _sudaName   = allfs.name,
      jumpConfig  = {}, golink = '',
      isDoc     = typeof(__docConfig)!= 'undefined' && ((__docConfig.__callupId!=undefined && __docConfig.__callupId.length>0) || (__docConfig.__docId!=undefined && __docConfig.__docId.length>0));
    
    if(isFinance) {
      
      data = {
        iosNativeUrl  : 'sinafinance://com.sina.stock.url.identifier?parameter=',
        androidNativeUrl: 'sinafinance://type=1&',
        weixn       : ''+window.prtl.prefix+'a.app.qq.com/o/simple.jsp?pkgname=cn.com.sina.finance'
      };
      if(isArticle()){
        cid =  '144';
      }
      else{
        cid =  '145';
      }
    }
    else if(isSports){
      var isQudao   = isHrefInclude('from=qudao'),
        _isArticle  = isArticle() && !isQudao,
        hash    = (typeof(__docConfig) != 'undefined' && __docConfig.__sportsShortURL) || '';
      if(_isArticle){
        data = {
          iosNativeUrl  : 'sinasports://type=2&hash='+hash,
          androidNativeUrl: 'sinasports://type=2&hash='+hash
        };
      }else{
        data = {
          iosNativeUrl: 'sinasports://newsid=',
          androidNativeUrl: 'sinasports://newsid='
        };
      }
      if(isArticle()){
        cid =  '51';
      }
      else{
        cid =  '233';
      }
      data.weixn = ''+window.prtl.prefix+'a.app.qq.com/o/simple.jsp?pkgname=cn.com.sina.sports';
    }
    else if(isBlog){
      var jumptype = typeof(scope) != 'undefined' && 'udetail' || 'app',
        articleid = '',
        bloguid = typeof(scope) != 'undefined' && scope.bloguid || '',
        nativeUrl = 'sinablog://blog.sina.com.cn?from=sinacn&jumptype='+jumptype+'&articleid='+articleid+'&bloguid='+bloguid;
      data = {
        iosNativeUrl: nativeUrl,
        androidNativeUrl: nativeUrl,
        weixn : ''+window.prtl.prefix+'a.app.qq.com/o/simple.jsp?pkgname=com.sina.sinablog'
      };
      cid = '236';
    }
    else{     
      var url_str = "",_newsid = "",docid = "";
      if(isDoc){
        //_newsid = __docConfig.__callupId+'-comos-news-cms';
        _newsid = __docConfig.__callupId || __docConfig.__docId+'-comos-news-cms';
        url_str = "newsid="+_newsid;
      }
      data = {
        iosNativeUrl: 'sinanews://'+url_str,
        androidNativeUrl: 'sinanews://'+url_str,
        weixn : ''+window.prtl.prefix+'a.app.qq.com/o/simple.jsp?pkgname=com.sina.news'
      };
      
      cid =  '82';
      
      kid  = '145';
      golink = ''+window.prtl.prefix+'so.sina.cn/palmnews/?id=' + kid;
      
    }
    golink = golink || ''+window.prtl.prefix+'interface.sina.cn/wap_api/ls/jump_client.d.html?k='+cid;
    
    jumpConfig = {
      iosInstallUrl   : golink,
      androidInstallUrl : golink,
      iosNativeUrl    : data.iosNativeUrl,
      androidNativeUrl  : data.androidNativeUrl,
      openByWeixin    : data.weixn
    };
    
    window._sinaCallEvent.trigger('sina_open_native',jumpConfig);
    window._sinaCallEvent.trigger('sina_suda_action',_sudaName+'_open');
  } 
  //获取pageUid
  function getPageUid(){
    var curUrl    = window.location.href,
      isQudao   = isHrefInclude('from=qudao'),
      _isArticle  = isArticle() && !isQudao,
      isMark    = isHrefInclude('?'),
      _pageUid  = isMark && curUrl.match(/(http\:\/\/=?)(\S*)(?=\?)/)[2] ||
              !isMark && curUrl.match(/(http\:\/\/=?)(\S*)/)[2];
    if(_isArticle && typeof(__docConfig)!='undefined' && __docConfig && __docConfig.__docId){
      _pageUid = __docConfig.__docId;
    }else if(isQudao){
      _pageUid = curUrl.replace(''+window.prtl.prefix+'','');
    }
    return _pageUid;
  }
  function getPermitURL(){
    var curUrl = location.href,
      isPermitURL = true;
    for(var o in forbidURL){
      isPermitURL = curUrl.indexOf(forbidURL[o]) == -1;
      if(!isPermitURL){
        return false;
      }
    }
    return isPermitURL;
  }
  //获取浮层是否又被插入权限,需要从localstorage判断和全局进行判断
  function getPermitPage(){
    var isPermitURL = getPermitURL(),
        isNewsApp = Utils.isSinaNews(),  
        isForbiden = typeof(_FORBIDEN_APP_FLOAT) != 'undefined' && _FORBIDEN_APP_FLOAT ,
      _pageUid = getPageUid(),
      isDisplayPromote = enable_disp(_pageUid);
    pageUid = _pageUid;
    return !isForbiden && isDisplayPromote && isPermitURL && !isNewsApp;
  }
  function getPureUrl(){
    var curUrl = location.href,
      isMark = isHrefInclude('?'),
      pureUrl = isMark && curUrl.match(/(=?)(\S*)(?=\?)/)[2] ||
            !isMark && curUrl.match(/(=?)(\S*)/)[2];
    return pureUrl;
  }
  //初始化
  function initDom(){
    var curUrl = location.href,
      hasComment = typeof(__docConfig) != "undefined" || typeof(CMNT) != "undefined" || document.querySelector('.foot_comment'),
      isDisplayPermit = getPermitPage();
    _saConfig.url = _saConfig.docUrl || getPureUrl();
    try{
      if(isDisplayPermit){
        if(hasComment){
          _saConfig.position = POSITION.TOP;
          addDom(floatPosition.top);
        }
        else{
          _saConfig.position = POSITION.BOTTOM;
          addDom(floatPosition.bottom);
        }
      }
    }catch(e){
      console.log(e);
    }
  }
  
  window.clearFloat = function(){
    //var _float = document.querySelector('[promote_float]');
    var _float = document.querySelector('#'+_id);
    
    if(_float){
      _float.parentNode.removeChild(_float);
    }
  }
  function init(){
    try{      
      _sinaCallEvent.on('sina_clear_native',clearFloat);  
      _sinaCallEvent.on('sina_build_native',initDom);
    }catch(e){
      console.log(e);
    }
  }
  var allPlatfrom = { finance : 'finance.sina.cn',  news : 'news.sina.cn',
            sports  : 'sports.sina.cn',   blog : 'blog.sina.cn',
            top   : 'top.sina.cn'},
  floatPosition   = { top:'top',bottom:'bottom'},
  testPlatform  = { finance : 'finance', news : 'news', sports : 'sports',  blog : 'blog', top : 'top'},
  keyListOrder  = ['media','domain','channel','type','position','timeStamp','url'],
  forbidURL   = ['wm=3206'],
  pageUid     = null,
  loading     = 0,
  clickInternal   = 10000,
  POSITION    = {TOP:'0',BOTTOM:'1',OTHER:'2'},
  _saConfig     = (typeof(_SACONFIG) != 'undefined' && _SACONFIG) || {};
  init();
})(window, document);
//触发插入呼起浮层事件
//_sinaCallEvent.trigger('sina_build_native');
//触发清除呼起浮层事件
//_sinaCallEvent.trigger('sina_clear_native');
//触发呼起事件
//_sinaCallEvent.trigger('sina_open_native',config);
//触发发送log事件，请将sudaName写到第二个参数中
//_sinaCallEvent.trigger('sina_suda_action',sudaName);
}catch(e){throw new Error(e+" ./FloatCom.js");}

try{var Template = {
	Push : {
		Bottom : '<aside id="<% info.id %>" style="position:fixed;font-size:12px;left:-101%;right:-101%;width:101%;bottom:0;z-index:300; -webkit-transition: -webkit-transform .5s ease;transition:transform .5s ease;"><div style="clear: both;position: relative;background: rgba(0,0,0,.6);padding: 7px 10px;color: #fff;-webkit-animation: fadeIn 1s .2s ease both;line-height: 18px;"><div style="position: absolute;right: 10px;top: 50%;transform: translateY(-50%);-webkit-transform: translateY(-50%);z-index: 400;cursor: pointer;" class="close"><img src="'+window.prtl.prefix+''+(window.prtl.type=='http'?'n.sinaimg.cn':'ns.sinaimg.cn')+'/default/dae7ff0c/20151201/close_in.svg" width="20"></div><div style="overflow: hidden;background: url('+window.prtl.prefix+''+(window.prtl.type=='http'?'n.sinaimg.cn':'ns.sinaimg.cn')+'/default/dae7ff0c/20151201/push_msg.svg) no-repeat left center;background-size: 25px;padding: 0 0 0 35px;height: 36px;margin-right:32px;" class="open"><h4 style="font-size: 14px;font-weight: normal;height: 36px;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;overflow: hidden;-webkit-box-pack: center;"><% info.title %></h4></div></div></aside>',
	},
	Banner : {
		Bottom : '<div id="<% info.id %>" style="position: fixed; bottom: 0px; left: 0px; right: 0px; z-index: 999; width: 100%; -webkit-user-select: none; background-color: rgba(0, 0, 0, 0.4);"><aside style="position: relative; padding: 0px 5px 0px 62px; height: 50px; text-decoration: none; color: rgb(255, 255, 255);"><img src="<% info.logo %>" style="position: absolute; top: 7px; left: 20px; width: 36px; border-radius: 5px;"><p style="margin: 0px; font-size: 16px; line-height: 16px; padding: 6px 0px 0px;"><% info.title %></p><p style="margin: 0px; font-size: 10px; line-height: 10px; opacity: 0.6; padding: 7px 0px 0px;"><% info.content %></p><a href="javascript:void(0)" style="right: 51px; position: absolute; top: 11px; width: 55px; height: 28px; color: rgb(255, 255, 255); font-weight: bold; font-size: 15px; line-height: 28px; text-align: center; background-color: <% info.color %>" class="open">打开</a></aside><div style="position: absolute; right: 0px; top: 0px; height: 50px; width: 45px; z-index: 10;" class="close"><i style="position:absolute; left:20px; top:15px; width:2px; height:17px; background-color:#fff; display:inline-block;-webkit-transform: rotate(-45deg);"></i><i style="position:absolute;left:20px;top:15px;width:2px;height:17px;background-color:#fff;display:inline-block;-webkit-transform: rotate(45deg);"></i></div></div>',
		Top : '<section id="<% info.id %>" style="padding: 5px 0px; width: 100%; background-image: url(<% info.background %>);"><aside style="position: relative; padding: 0px 5px 0px 62px; height: 50px; text-decoration: none; color: rgb(255, 255, 255);"><img src="<% info.logo %>" style="position: absolute; top: 7px; left: 20px; width: 36px; border-radius: 5px;"><p style="margin: 0px; font-size: 16px; line-height: 16px; padding: 6px 0px 0px;"><% info.title %></p><p style="margin: 0px; font-size: 10px; line-height: 10px; opacity: 0.6; padding: 7px 0px 0px;"><% info.content %></p><a href="javascript:void(0)" style="right: 12px; position: absolute; top: 11px; width: 55px; height: 28px; color: rgb(255, 255, 255); font-weight: bold; font-size: 15px; line-height: 28px; text-align: center; background-color: <% info.color %>" class="open">打开</a></aside></section>'
	},
	RedBag : '<section id="<% info.id %>"><aside style="position: fixed;right: 10px;bottom: 142px;z-index: 300;"><img src="'+window.prtl.prefix+''+(window.prtl.type=='http'?'n.sinaimg.cn':'ns.sinaimg.cn')+'/default/dae7ff0c/20151231/red_enter_1.png" alt="" style="vertical-align: top;width: 60px;" class="show" data-sudaclick="<% info.sudaShow %>"/></aside><div class="layer" style="position: fixed;display:none;left: 0;right: 0;top: 0;bottom: 0;z-index: 9999;"><div class="redbg" style="position: fixed;top: 0;right: 0;bottom: 0;left: 0;background: rgba(0,0,0,.7);z-index: 200;"></div> <div style="position: fixed; z-index: 400; left: 50%; top: 45%;transform: translateY(-50%) translateX(-50%);-webkit-transform: translateY(-50%) translateX(-50%);"><div style="position: relative;"> <img src="'+window.prtl.prefix+''+(window.prtl.type=='http'?'mjs.sinaimg.cn':'mjss.sinaimg.cn')+'/wap/online/public/images/redBag/bag_tips.png" alt="" style="width: 268px;vertical-align: top;"/> <a href="javascript:void(0);" title="关闭" class="close"  data-sudaclick="<% info.sudaClose %>"style="position: absolute; z-index: 300; right: 0px; top: 50px; background: #f94734; color: #fff; font-style: 24px; display: inline-block; width: 28px; height: 28px; text-align: center; line-height: 28px; border-radius: 50%; font-family: Arial;">X</a> <a href="<% info.nextlink %>" title="马上抢" class="open"  data-sudaclick="<% info.sudaOpen %>"style="position: absolute; left: 40px; right: 40px; z-index: 500; bottom: 50px; height: 34px; line-height: 34px; text-indent: 999em; overflow: hidden;">马上抢</a> </div> </div> </div></section>',
	AddToHome : {
		ucbooktips:'<section class="remindmd_ios_info" style=" bottom: 200px; right:0px;z-index:15 ;   position: fixed;    display: block;    background: #439df9;    border-radius: 5px;    padding: 8px 0;">        <p class="info" style="    padding: 0 15px;    font-size: 12px;    line-height: 18px;    color: #fff;    text-align: justify;">点击"手机桌面"</p>        <span class="mark_icon" style="    width: 25px;    height: 10px;    position: absolute;    bottom: -10px;    left: 50%;    margin-left: -14px;    background: url('+window.prtl.prefix+''+(window.prtl.type=='http'?'mjs.sinaimg.cn':'mjss.sinaimg.cn')+'/wap/online/public/NPH/v1/images/ios_info_icon.png) no-repeat 0 0;    background-size: 25px 10px;"></span>    </section>',
		uc:'<section style="left:50%;margin-left:-82px;position: fixed; z-index:15 ;   bottom: 0;    margin-left: -82px;    width: 164px;    height: 80px;    border-radius: 5px;    background-color: #439df9;">        <p class="info" style="padding: 0 15px;    font-size: 12px;    line-height: 18px;    color: #fff;    position: absolute;text-align: justify;    padding-top: 10px;">点击"确定"，添加手机新浪网快捷方式到手机主屏</p>        <a href="javascript:;" style="    margin: 47px auto 0;    font-size: 10px;    text-align: center;    display: block;    width: 66px;    top: 6px;height: 18px;    line-height: 18px;    border-radius: 8px;    position: relative;color: #439df9;    background-color: #fff;" class="add">确定</a>        <a href="javascript:;" style="    position: absolute;    top: -6px;    right: -6px;    display: block;    text-align: center;    font-size: 14px;    width: 14px;    height: 14px;    line-height: 14px;    border: 1px solid #439df9;    color: #439df9;    background: #fff;    border-radius: 50%;" class="close">×</a>        </section>',
		uc_ios:'<section style="left:50%;margin-left:-82px;position: fixed; z-index:15 ;   bottom: 0;    margin-left: -82px;    width: 164px;    height: 80px;    border-radius: 5px;    background-color: #439df9;">        <p class="info" style="padding: 0 21px;    font-size: 12px;    line-height: 18px;    color: #fff;    position: absolute;text-align: justify;    padding-top: 10px;">点击"确定"，添加手机新浪网快捷方式到书签</p>        <a href="javascript:;" style="    margin: 45px auto 0;    font-size: 10px;    text-align: center;    display: block;    width: 66px;    height: 18px;    position: relative;top: 10px;line-height: 18px;    border-radius: 8px;    color: #439df9;    background-color: #fff;" class="add">确定</a>        <a href="javascript:;" style="    position: absolute;    top: -6px;    right: -6px;    display: block;    text-align: center;    font-size: 14px;    width: 14px;    height: 14px;    line-height: 14px;    border: 1px solid #439df9;    color: #439df9;    background: #fff;    border-radius: 50%;" class="close">×</a>        </section>',
		chrome:'<section style="position: fixed; right:21px;top: 0;   width: 127px;   height: 68px;   background: url('+window.prtl.prefix+''+(window.prtl.type=='http'?'mjs.sinaimg.cn':'mjss.sinaimg.cn')+'/wap/online/public/NPH/v1/images/ios_remind_bg2.png) no-repeat 0 0;   background-size: 127px 68px;   z-index: 15;" class="">  <a href="javascript:;" style="  width: 14px;   height: 14px;   text-align: center;   font-size: 14px;   line-height: 14px;   color: #fff;   position: absolute;   bottom: 4px;   right: 4px;" class="close">×</a>   </section>',
		//uc:'<section style="left: 14px;right: 14px;bottom:10px;height: 64px;z-index: 300;position: fixed;font-size:12px;"><aside class="show" style="position: absolute;z-index: 400;right: -14px; bottom: 0; -webkit-animation: bounce 4s 1.2s infinite;animation: bounce 4s 1.2s infinite;cursor: pointer;width:40px;height:32px;"><img src="'+window.prtl.prefix+''+(window.prtl.type=='http'?'n.sinaimg.cn':'ns.sinaimg.cn')+'/2332b226/20151112/sina_1.svg" alt="" width="40" style="vertical-align: middle;border: 0;"></aside><aside class="hide j_addtohome_info" style="position: absolute;z-index: 300;right: 0;left: 0;border-radius: 5px;padding: 14px;background: rgba(0,144,247,.9);color: #fff;-webkit-animation: fadeIn 1s .2s ease both;"><section style="clear: both;overflow: hidden;"><div style="float: left;width: 36px;margin-right: 7px;"><img src="'+window.prtl.prefix+''+(window.prtl.type=='http'?'n.sinaimg.cn':'ns.sinaimg.cn')+'/2332b226/20151111/m_sina.svg" alt="" style="width: 36px;"></div><div style=" overflow: hidden;position: relative;height: 36px;padding-right: 80px;"><div class="add" style="position: absolute;right: 26px;width: 48px;height: 28px;line-height: 28px;text-align: center;top: 50%;transform: translateY(-50%);-webkit-transform: translateY(-50%);z-index: 400;background: #fff;color: #0a94f7;border-radius: 4px;">添加</div><h4 style="font-size: 12px;font-weight: normal;display: -webkit-box; -webkit-line-clamp: 2;-webkit-box-orient: vertical;overflow: hidden;">喜欢我吗？点击添加按钮就可以到桌面来看我啦!</h4></div><div class="close" style="position: absolute;right: -11px;top: -10px;z-index: 400;"><img src="'+window.prtl.prefix+'n.sinaimg.cn/2332b226/20151112/close_1.svg" alt="" width="24" style="vertical-align: middle;border: 0;"></div></section></aside></section>',
		safari:'<section class="addtohome-safari"  style="left:50%;z-index:15 ;margin-left:-82px;position: fixed;bottom: 0;width: 164px;height: 78px;background: url('+window.prtl.prefix+''+(window.prtl.type=='http'?'mjs.sinaimg.cn':'mjss.sinaimg.cn')+'/wap/online/public/NPH/v1/images/ios_remind_bg.png) no-repeat 0 0; background-size: 163px 77px;"><a href="javascript:;" class="close" style="    font-size: 14px;line-height: 14px;color: #fff;position: absolute;top: 6px;right: 6px;">×</a></section>'
		//safari:'<section class="m_sina_push m_addhome"><aside class="m_add_home"><section class="m_sina_push_card j_addtohome_info"><div class="m_sina_push_pic"><img src="'+window.prtl.prefix+''+(window.prtl.type=='http'?'n.sinaimg.cn':'ns.sinaimg.cn')+'/2332b226/20151111/m_sina.svg" alt=""></div> <div class="m_sina_push_info to_home"><h4>喜欢我吗？<br>点击<img src="'+window.prtl.prefix+''+(window.prtl.type=='http'?'n.sinaimg.cn':'ns.sinaimg.cn')+'/2332b226/20151112/share_1.svg" alt="" width="18">就可以到桌面来看我啦!</h4></div><em class="m_sina_arrow"></em><div class="m_sina_push_close j_addtohome_closebtn"><img src="'+window.prtl.prefix+'n.sinaimg.cn/2332b226/20151112/close_1.svg" alt="" width="24"></div></section></aside></section>'
	}
};
}catch(e){throw new Error(e+" ./Template.js");}

try{/**
 * @新科技频道-手机新浪网
 * @requires 
 * @author tingling 'Template.js'
 * @date 2015-12-14
 */
(function( win, doc){
	var RunTemplate = {	
		getType : function(obj){
			var tmp = typeof(obj);
			return tmp === 'object' ? 
			(Object.prototype.toString.call(obj).match(/\[object (.*)\]/) ? RegExp.$1.toLowerCase() : 'other') :
			tmp;
		},
		tinyTemplateParser : function(template, data){
			var getType = this.getType;
			return getType(template) === 'string' ? template.replace(/<%\s?([\[\]\.A-Za-z0-9_]+)\s?%>/g,function(total, match){
				var tarVal = data, missing = false;
				if(match && tarVal){
					match.split('.').forEach(function(key){
						var matchers;
						if(key && !missing){
							matchers = key.match(/(\w+)(\[(\d)+\])?/);
							if(matchers){
								if(tarVal[matchers[1]]){
									tarVal = tarVal[matchers[1]];
									if(matchers[2] && matchers[3]){
										if(tarVal[matchers[3]]){
											tarVal = tarVal[matchers[3]];
										}else{
											missing = true;
										}
									}
								}else{
									missing = true;
								}
							}
						}
					});
				}
				return missing || tarVal === data ? '' : getType(tarVal) !== 'string' ? JSON.stringify(tarVal) : tarVal;
			}) : '';
		}
	}
	window.runTemplate = RunTemplate;
})(window, document);
}catch(e){throw new Error(e+" ./Render.js");}

try{/**
 * @新科技频道-手机新浪网
 * @requires "sina", "zepto.js"
 * @author yuanfeng
 * @date 2015-06-12
 */
(function(win,doc){
 	var util = {
 		debug: true,
 		version: '0.0.1',
 		setCookie: function(key, value, expire, path, domain, extra){
   			var appendArr = [];
   			appendArr.push(key + "=" + escape(value));
   			if(expire){
   				var date = new Date();
   				date.setTime(Date.now() + expire * 3600000);
   				appendArr.push("expires=" + date.toGMTString());
   			}
   			path && appendArr.push("path=" + path);
   			domain && appendArr.push("domain=" + domain);
   			extra && appendArr.push(extra);
   			doc.cookie = appendArr.join(";");
   		},
   		getCookie: function(key){
   			if(!key){
   				console.log('missing key, get cookie abort!');
   				return '';
   			}
   			key = key.replace(/([\.\[\]\$])/g, "\\$1");
   			var mathReg = new RegExp(key + '=([^;]*)?;', 'i');
   			var cookieCache = doc.cookie + ';';
   			return cookieCache.match(mathReg) ? RegExp.$1 : '';
   		},
   		deleteCookie: function(key){
   			doc.cookie = m + "=;expires=Fri, 31 Dec 1999 23:59:59 GMT;";
   		},
 		log: function(msg, level){
	        msg = (typeof(msg) === 'string' ? msg : JSON.stringify(msg)) +' in ' + (this._name || 'default');
	        if(level === 'err'){
	            if(this._debug){
	                debugger;
	                return console.error(msg);
	            }
	            throw new Error(msg);
	        }
	        if(['debug', 'log'].indexOf(level) !== -1 && !this._debug){
	            return;
	        }
	        (level in console && typeof(console[level])==='function')? console[level](msg) : console.log('['+level+']'+msg);
	    },
	    // extend: function(){
	    // }
	    parseQs: function(url){
	    	var ret = {};
	    	if(url){
	    		var urlArr = url.split('?');
	    		urlArr[1] && urlArr[1].split('&').forEach(function(item){
	    			var keyValue = item && item.split('=');
	    			if(keyValue && keyValue.length === 2){
	    				ret[keyValue[0]] = keyValue[1];
	    			}
	    		})
	    	}
	    	return ret;
	    },
	    get curHost(){
	    	if(!this._host){
	    		var tmp;
	    		this._host = win.location.hostname || (tmp=win.location.match(/https?:\/\/([a-zA-Z\.]+)\/?/)) && tmp[1];
	    	}
	    	return this._host;
	    },
	    set curHost(val){
	    	return;
	    },
	    get UA(){
	    	this._ua = this._ua || win.navigator.userAgent;
	    	return this._ua;
	    },
	    set UA(val){
	    	return null;
	    },
	    get platformBrowserInfo(){
	    	!this._UAIDS && (this.platformBrowserInfo=null);
	    	
	    	if(!this._plaformInfo){
	    		var UAIDS = this._UAIDS, regKeys = [], matches=[], ret={};
		        Object.keys(UAIDS).forEach(function(_type){
		            regKeys = regKeys.concat(Object.keys(UAIDS[_type]).map(function(item){
		                return UAIDS[_type][item];
		            }));
		        });
		        matches = this.UA.toLowerCase().match(new RegExp('('+regKeys.join('|')+')+','g'));
		        if(matches.length > 0){
		            ret = {};
		            Object.keys(UAIDS).forEach(function(_type){
		                var item = UAIDS[_type],matcher='other',key=null;
		                for(key in item){
		                    if(item.hasOwnProperty(key) && matches.indexOf(item[key]) !== -1){
		                        matcher = key;
		                        break;
		                    }
		                }
		                ret[_type] = matcher;
		            });		            
		        }
		        //spec
		        if(ret.platform !== 'other'){
		            ret.system = 'ios';
		        }
		        //判断ios下的chrome
		        if(ret.system=='ios'){
		        	if(new RegExp("crios").test(this.UA.toLocaleLowerCase())==true){
		        		ret.browser="chrome";
		        	}
		        }
		        this._plaformInfo = ret;
	    	}
	    	return this._plaformInfo;
	    },
	    set platformBrowserInfo(val){
	    	this._UAIDS = {
		        browser:{
		            firefox: 'firefox',
		            ie: 'msie',
		            qq: 'mqqbrowser',
		            uc: 'ucbrowser',
		            chrome: 'chrome',
		            baidu: 'baidu',
		        },
		        client:{
		            weibo: 'weibo',
		            weixin: 'micromessenger',
		            qq: 'qq'
		        },
		        platform: {
		            iphone: 'iphone',
		            ipod: 'ipod',
		            ipad: 'ipad'
		        },
		        system:{
		            ios: 'ios',
		            android: 'android',
		        },
		    }
		    return null;
	    }
 	};
 	var WorkFlower = function(cnf){
 		this.init(cnf)
 	};
 	WorkFlower.prototype = {
 		constructor: WorkFlower,
 		init: function(cnf){
 			if(cnf){
 				this.name = cnf.name;
 			}
 		},
 		pushTask: function(func){
 			if(typeof(func) === 'string'){
 				var taskMap = this.taskMap;
 				taskMap.hasOwnProperty(func) && (this.queue = taskMap[func]);
 			}else{
 				func && (this.queue = func);
 			}
 		},
 		run: function(){
 			!this.flag&&this.then({});
		},
		then: function(params){
			next = this.queue;
			if(next){
				this.flag = true;
				return next(this.then.bind(this), params);
			}
			this.flag = false;
		},
		addTask: function(func, taskName, isAsync){
			taskName = taskName || 'WFTask'+this.length;
			this.taskMap = [taskName, function(then, params){
				return isAsync ? func(then, params) : then(func(params));
			}];
			this.length ++;
			return taskName;
		},
		get stats(){
			!this._stat && (this._stat = {}); 
			return this._stat;
		},
		set stats(val){
			this._stat = this._stat || {
				curTask: null,
				isBreak: false,
				gotoTask: null,
			};
		},
		get length(){
			return this._len || 0;
		},
		set length(val){
			return typeof(val) === 'number' && (this._len = val);
		},
		get taskMap(){
			return this._taskMap || {};
		},
		set taskMap(val){
			this._taskMap = this._taskMap || {};
			if(val && val.length == 2){
				if(this._taskMap.hasOwnProperty(val[0])){
					throw new Error('duplicate defined task!');
					return;
				}
				this._taskMap[val[0]] = val[1];
			}
		},
 		get queue(){
			return this._queue.shift();
		},
		set queue(val){
			(this._queue = this._queue || []).push(val);
		}
 	};
 	var _id = '_'+(new Date()).getTime() + 'ath',
 		_isLock = false;
 	Date.prototype.Format = function (fmt) { //author: meizz 
	    var o = {
	        "M+": this.getMonth() + 1, //月份 
	        "d+": this.getDate()
	    };
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
	    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    return fmt;
	}     
 	var checkDateRule = {
 		allowWeek:[0,1,2,3,4,5,6,7], 
 		setMark:function(){
			util.setCookie('sinaWapAddToHome_SetTime', new Date().Format('yyyy-MM-dd'), 720, '/', '.sina.cn');
 		},
 		//返回是否需要显示
 		checkRule:function(){
 			var curWeek = parseInt((new Date()).getDay());
 			var today = new Date().Format('yyyy-MM-dd');
			var lastFlag = util.getCookie('sinaWapAddToHome_SetTime') || '0';
			return (this.allowWeek.indexOf(curWeek)>-1)&&lastFlag!=today;
 		}
	}	
 	function checkRequre(params){
 		if(!_isLock){
 			//通过url判断是否是通过桌面主屏进入的
 			var localurl = location.href.toLocaleLowerCase();
 			if(localurl.indexOf('wm=desktop')>0||localurl.indexOf('wm=qbmi')>0||localurl.indexOf('wm=qbma')>0||localurl.indexOf('wm=ubmi')>0||localurl.indexOf('wm=ubma')>0){
 				_isLock = false;
				return null;
 			}
	 		_isLock = true;
	 		var platform = util.platformBrowserInfo;
	 		var addRecord;
			try{
				addRecord = JSON.parse(win.localStorage['sinaWapAddToHome']);
			}catch(err){
				addRecord = {};
			}
			var isAdd = util.getCookie('sinaWapAddToHome') || '0';
			//var curHost = util.curHost;
			addRecord.isAdd = util.getCookie('sinaWapAddToHome') === '1' || addRecord.isAdd || false;
			addRecord.lastOpen = addRecord.lastOpen || {};
			var qs = util.parseQs(win.location.href);
			//若已添加到主屏，且不为活动，则直接return null
			if(addRecord.isAdd && !params.hasOwnProperty('isActivity')){
	 			_isLock = false;
				return null;
			}
	 		if(((qs['sou'] === 'weibo'||checkDateRule.checkRule() ) && platform.browser === 'uc') || 
 				(params.hasOwnProperty('isActivity') && params['isActivity'] == 1 ) ){
 				var ua = util.UA;
				var ucVerExclude = ['9\.0','9\.1','9\.2','9\.3','9\.4','9\.5','9\.6','9\.7','9\.8'];
				//version 10.9.0.103
				var ucver = parseFloat(ua.toLowerCase().match(/ucbrowser\/([\d\.]+)\b/) && RegExp.$1);
				//var ucver = ua.toLowerCase().match(/ucbrowser\/([\d\.]+)\b/) && RegExp.$1;
				if(ucver && (new RegExp(ucVerExclude.join('|'))).test(ucver) === false){
 					_isLock = false;
					return {'ch': 'uc',system:platform.system, record: addRecord};
				}
 			}
	 		else if((qs['sou'] === 'weibo' ||checkDateRule.checkRule()) && platform.browser === 'qq'){
	 			_isLock = false;
	 			return {ch:'qq',system:platform.system, record: addRecord};
	 		}
	 		else if((qs['sou'] === 'weibo' ||checkDateRule.checkRule() ) && platform.browser === 'qq'){
	 			_isLock = false;
	 			return {ch:'qq',system:platform.system , record: addRecord};
	 		}
	 		else if((qs['sou'] === 'weibo' ||checkDateRule.checkRule() ) && platform.browser === 'chrome'){
	 			_isLock = false;
	 			//判断是否有广告。。//判断逻辑。找到对应的容器。因为这时的广告已经进入dom
	 			//判断是否为空
	 			 var sax_banner=document.querySelector("[sax-type=banner]");
	 			 var sax_fullScreen=document.querySelector("[sax-type=fullScreen]");
	 			if(sax_banner&&sax_banner.children.length>0){
	 				_isLock = false;
	 				return null;
	 			}
	 			if(sax_fullScreen&&sax_fullScreen.children.length>0){
	 				_isLock = false;
	 				return null;
	 			}
	 			return {ch:'chrome',system:platform.system , record: addRecord};
	 		}
	 		else if((qs['sou'] === 'weibo' ||checkDateRule.checkRule()) && 
	 			platform.system === 'ios' && platform.browser === 'other' && platform.client === 'other' ){
	 			_isLock = false;
	 			return {ch:'safari',system:platform.system, record: addRecord};
	 		}
	 		_isLock = false;
	 		return null;
 		}
 	}
 	function otherRequst(url) {
 		var div = document.createElement('div');
		div.style.display= 'none';
		document.body.appendChild(div);
		div.innerHTML = '<iframe src="'+url+'" style="" />';
 	}
 	function addAction(params){
		function put(l,p,t){
			var div = document.createElement('div');
			div.style.display= 'none';
			document.body.appendChild(div);
			div.innerHTML = '<img src="ext:appshortcut:'+l+'|'+p+'|'+t+'|" style="display:none;" />';
		}
		function getIcon(){
			var result = [],
				links = document.querySelectorAll('link'),
				imgUrl = ''+window.prtl.prefix+''+(window.prtl.type=='http'?'mjs.sinaimg.cn':'mjss.sinaimg.cn')+'/wap/online/public/images/addToHome/sina_114x114_v1.png';
            [].forEach.call(links, function( item, index) {
                if(item.getAttribute('sizes')=='114x114' || item.getAttribute('sizes')=='57x57'){
                	return item.getAttribute('href') || imgUrl;
                }
            });
            return imgUrl;
		}
		var addRecord;
		try{
			addRecord = JSON.parse(win.localStorage['sinaWapAddToHome']);
		}catch(err){
			addRecord = {};
		}
		
		var isAdd = util.getCookie('sinaWapAddToHome') || '0',
			imgUrl = getIcon();
		addRecord.isAdd = util.getCookie('sinaWapAddToHome') === '1' || addRecord.isAdd || false;
		
		
		if(!addRecord.isAdd){
			addRecord.isAdd = true;
			if(params.ch=='uc'){
				try{
					var oldurl = location.href,markStr ="";
					if(params.system=='ios'){
						markStr="ubmi";
						window.history.replaceState({}, "", oldurl.indexOf("?")>0?(oldurl+=("&wm="+markStr)):(oldurl+=("?wm="+markStr)));
						location.href="ext:add_favorite";
						setTimeout(function(){
							window.history.replaceState({}, "",oldurl);
						},3000)
					}
					else{
						if(location.href.toLocaleLowerCase().indexOf(".sina.cn")>=0){
							markStr="ubma";
							window.history.replaceState({}, "", oldurl.indexOf("?")>0?(oldurl+=("&wm="+markStr)):(oldurl+=("?wm="+markStr)));
							otherRequst("ext:add_favorite");
							setTimeout(function(){
								window.history.replaceState({}, "",oldurl);
							},3000)
						}
					}
				}
				catch(e){
				}
				if(params.system=='android'){
					otherRequst('ext:appshortcut:'+''+window.prtl.prefix+'so.sina.cn/channel/jump.d.go?k=1'+'|'+imgUrl+'|'+'手机新浪网'+'|');
				}
				checkDateRule.setMark();
			}
			else if(params.ch=="qq"){
				var oldurl = location.href,markStr ="";
				if(params.system=='ios'){
					markStr="qbmi";
				}
				else{
					markStr="qbma";
				}
				window.history.replaceState({}, "", oldurl.indexOf("?")>0?(oldurl+=("&wm="+markStr)):(oldurl+=("?wm="+markStr)));
				otherRequst(""+window.prtl.prefix+"so.sina.cn/browser/js.d.api?from=qq&act=bookmark_add");
				setTimeout(function(){
					window.history.replaceState({}, "",oldurl);
				},3000);
				checkDateRule.setMark();
			}
			else{}
			util.setCookie('sinaWapAddToHome', '1', 720, '/', '.sina.cn');
			localStorage['sinaWapAddToHome'] = JSON.stringify(addRecord);		
		}
	}
 	function initAddToHome (done, params){
 		function addUcDom(){
            var section = document.createElement('section'),
            	_t = runTemplate.tinyTemplateParser(Template.AddToHome.uc,{info:{}});
            section.id = _id;
            section.innerHTML = _t;
            doc.body.appendChild(section);
            return section;
 		}
		function addUcDom_ios(){
            var section = document.createElement('section'),
            	_t = runTemplate.tinyTemplateParser(Template.AddToHome.uc_ios,{info:{}});
            section.id = _id;
            section.innerHTML = _t;
            doc.body.appendChild(section);
            return section;
 		}
 		function addChromeDom(){
            var section = document.createElement('section'),
            	_t = runTemplate.tinyTemplateParser(Template.AddToHome.chrome,{info:{}});
            //section.id = 'j_addtohome_box';
            section.id = _id;
            //section.setAttribute('style','position: absolute;left:0;right:0;opacity:1;bottom: 0;width: 100%;min-height: 64px;z-index:999;-webkit-animation: fadeIn 1s .2s ease both ;animation: fadeIn 1s .2s ease both ;');
            section.innerHTML = _t;
            doc.body.appendChild(section);
            // setTimeout(function(){
            // 	section.style.opacity = 1;
            // },1000);
            //alert(JSON.stringify(section.style));
            return section;
 		}
 		function addUcTipsDom(){
            var section = document.createElement('section'),
            	_t =Template.AddToHome.ucbooktips;
            //section.id = 'j_addtohome_box';
            section.id = _id;
            //section.setAttribute('style','position: absolute;left:0;right:0;opacity:1;bottom: 0;width: 100%;min-height: 64px;z-index:999;-webkit-animation: fadeIn 1s .2s ease both ;animation: fadeIn 1s .2s ease both ;');
            section.innerHTML = _t;
            section.style.opacity=0;
            //document.body.insertBefore(section,document.body.children[0])
            doc.body.appendChild(section);
            // setTimeout(function(){
            // 	section.style.opacity = 1;
            // },1000);
            //alert(JSON.stringify(section.style));
            return section;
 		}
 		function addSafariDom(){
            var section = document.createElement('section'),
            	_t = runTemplate.tinyTemplateParser(Template.AddToHome.safari,{info:{}});
            //section.id = 'j_addtohome_box';
            section.id = _id;
            section.innerHTML = _t;
            doc.body.appendChild(section);
            return section;
 		}
 		if((params && params.ch === 'uc')||(params && params.ch === 'qq')){
 			var addRecord = params.record;
 			var wrapRoot =null;
 			if(params.system=="ios"){
 				wrapRoot=addUcDom_ios();
 			}
 			else{
 				wrapRoot  = addUcDom();
 			}
 			checkDateRule.setMark();
 			//var infoElem = doc.getElementsByClassName('j_addtohome_info')[0];
 			var closeCount = 0;
 			var showTimer = null;
 			wrapRoot.addEventListener('click',function(e){
 				var target = e.target;
 				var tarClass = target.className || target.parentNode.className;
 				switch(tarClass.match(/(show|close|add)/i)&&RegExp.$1){
 					case 'add':
 						// addRecord.isAdd = true;
 						// util.setCookie('sinaWapAddToHome', '1', 720, '/', '.sina.cn');
 						// localStorage['sinaWapAddToHome'] = JSON.stringify(addRecord);
 						try{
							addAction(params); 
 						}
 						catch(e){
 						}
 						if(params.system=="android"&&params.ch === 'uc'&&location.href.toLocaleLowerCase().indexOf(".sina.cn")>=0){
 							var uctips  = addUcTipsDom();
							uctips.style.transition="opacity 0.2s 0.6s";
							uctips.style.opacity=1;
							setTimeout(function(){
								uctips.children[0].style.transition="opacity 0.5s 1s";
								uctips.children[0].style.opacity=0;
							},3000);
 						}
 						wrapRoot.style.display="none";
 						//这里进行计数操作，今天不要再显示
 						checkDateRule.setFlag();
 						//wrapRoot.className = wrapRoot.className + ' hide';
 						done && done();
 					break;
 					case 'close':
 						wrapRoot.style.display="none";
 						//这里进行计数操作，今天不要再显示
 						checkDateRule.setMark();
 					break;
 					case 'show':
 						// infoElem.className = infoElem.className.replace('hide','');
 						// showTimer = setTimeout(function(){
 						// 	infoElem.className = infoElem.className + ' hide';
 						// 	closeCount ++;
 						// 	if(closeCount>=2){
	 					// 		wrapRoot.className = wrapRoot.className + ' hide';
	 					// 		done && done();
	 					// 	}
 						// },15000)
 					break;
 				}
 				
 			});
 			showTimer = setTimeout(function(){
 				wrapRoot.style.display="none";
 				// infoElem.className = infoElem.className + ' hide';
 				// wrapRoot.className = wrapRoot.className + ' hide';
 				done();
 			}, 10000);
 		}else if(params && params.ch === 'safari'){
 			var record = params.record;
 			var wrapRoot = addSafariDom();
 			//var infoElem = doc.getElementsByClassName('j_addtohome_info')[0];
 			var showTimer = null;
 			checkDateRule.setMark();
 			wrapRoot.addEventListener('click',function(e){
 				var target = e.target;
 				var tarClass = target.className || target.parentNode.className;
 				switch(tarClass.match(/(add|close|show)/i)&&RegExp.$1){
 					case 'close':
 						wrapRoot.style.display="none";
 						checkDateRule.setMark();
 						//util.setCookie('sinaWapAddToHome', '1', 168, '/', '.sina.cn');
 						done();
 					break;
 					default:
 					break;
 				}
 			});
 			showTimer = setTimeout(function(){
 				wrapRoot.style.display="none";
 				// infoElem.className = infoElem.className + ' hide';
 				// wrapRoot.className = wrapRoot.className + ' hide';
 				done();
 			}, 10000);
 		}
 		else if(params && params.ch === 'chrome'){
 			var record = params.record;
 			var wrapRoot = addChromeDom();
 			//var infoElem = doc.getElementsByClassName('j_addtohome_info')[0];
 			var showTimer = null;
 			checkDateRule.setMark();
 			wrapRoot.addEventListener('click',function(e){
 				var target = e.target;
 				var tarClass = target.className || target.parentNode.className;
 				switch(tarClass.match(/(add|close|show)/i)&&RegExp.$1){
 					case 'close':
 						wrapRoot.style.display="none";
 						checkDateRule.setMark();
 						//util.setCookie('sinaWapAddToHome', '1', 168, '/', '.sina.cn');
 						done();
 					break;
 					default:
 					break;
 				}
 			});
 			showTimer = setTimeout(function(){
 				wrapRoot.style.display="none";
 				// infoElem.className = infoElem.className + ' hide';
 				// wrapRoot.className = wrapRoot.className + ' hide';
 				done();
 			}, 10000);
 		}
 		else{
 			done();
 		}
 	}
 	function addBanner(params){
 		//_sinaCallEvent && _sinaCallEvent.trigger('sina_build_native');
 		_sinaCallEvent && _sinaCallEvent.trigger('sina_init_show');
	
 	}
 	win.checkRequre = checkRequre;
	win.addToHomeAction = addAction;
 	var addToDesktop = new WorkFlower({name:'addToDesktop'});
 	addToDesktop.addTask(checkRequre, 'checkRequire');
 	addToDesktop.addTask(initAddToHome, 'initAddToHome', true);
	addToDesktop.addTask(addBanner, 'addFloat');	
	addToDesktop.pushTask('checkRequire');
	addToDesktop.pushTask('initAddToHome');
	addToDesktop.pushTask('addFloat');
	win.addToHomeRun = addToDesktop.run.bind(addToDesktop);
	
	win._sinaCallEvent.on('sina_run_addToHome',addToHomeRun);
 }(window, document));
}catch(e){throw new Error(e+" ./addToHome.js");}

try{/**
 * @author tingling
 * @fileoverview 
 * @date 20151217
 */
(function(win, doc) {
	function sendSudaLog(sudaName){
		var obj = {
			'name' : sudaName,
			'type' : '',
			'title' : '',
			'index' : '',
			'href' : ''};
		if( typeof(win.suds_count) == 'function' || win.suds_count)
		{
			win.suds_count && win.suds_count( obj );
		}
	}
	var redBag = {
		id : '_'+(new Date()).getTime() + 'rb',
		STATUS : {show:1,close:2},
		isEmpty : function(objBox){
			var i  = 0,
				_obj = objBox || {};
			for(var o in _obj){
				i++;
			}
			if(i>0){
				return false;
			}
			else{
				return true;
			}
		},
		createElement : function(tag,attributes,content){
			var newNode = doc.createElement(tag),
				_attr = attributes;
			if(!this.isEmpty(_attr)){
				for(var o in _attr){
					newNode.setAttribute( o, _attr[o]);
				}
			}
			if(content){
				newNode.innerHTML = content;
			}
			return newNode;
		},
		changeShow : function(status){
			var STATUS = this.STATUS,
				$zone = doc.querySelector('#'+this.id),
				$layer = $zone.querySelector('.layer'),
				$body = doc.body;
			switch(status){
				case STATUS.show:
					$body.style.overflow = 'hidden';
					$layer.style.display = 'block';
					break;
				default:
					$body.style.overflow = 'auto';
					$layer.style.display = 'none';
					break;
			}
		},
		bindEvent : function(ele,CB){
			var self = this;
			if(ele){
				if(ele instanceof Array){
					for(var o in ele){
						//ele[o].onclick = function(){CB && CB();}
						arguments.callee(ele[o],CB);
					}
				}
				else{
					ele.onclick = function(){CB && CB();}
				}
				
			}
		},
		insertRedBag : function(info){
			var self 	= this,
				section = self.createElement('section'),
				close 	= null,open=null,showBtn=null,redbg=null,
				_t 		= runTemplate.tinyTemplateParser(Template.RedBag,{info:info}),
				_bEvent = self.bindEvent,
				_STAUTS = self.STATUS;
			section.innerHTML = _t;
			doc.body.appendChild(section);
			close 	= section.querySelector('.close');
			open 	= section.querySelector('.open');
			showBtn = section.querySelector('.show');
			redbg 	= section.querySelector('.redbg');
			_bEvent([close,redbg],function(){
				self.changeShow(self.STATUS.close);
			});
			_bEvent(open,function(){
				win.addToHomeAction();
				self.changeShow(self.STATUS.close);
			});
			_bEvent(showBtn,function(){
				self.changeShow(self.STATUS.show);
			});
		},
		// getActivityPermitShow : function(){
		// 	//get permit right
		// 	var getPermit = win.checkRequre({isActivity:1}),
		// 		isPermit = getPermit && getPermit['ch'] == 'uc',
		// 		isActive = __pushConfig && __pushConfig.__showType == 'active';
		// 	return isPermit;
		// },
		init : function(){
			try{				
				var isPermitShow = win.getActivityPermitShow(),
					info = {id:this.id,nextlink:"#",sudaShow:'redBag_show',sudaOpen:'redBag_open',sudaClose:'redBag_close'};
				//获取是否有权插入活动
				if(isPermitShow){				
					info.nextlink = (__pushConfig && __pushConfig.__activelink) || ''+window.prtl.prefix+'sina.cn';
					this.insertRedBag(info);
				}
				//否则，继续run
				else{
				}
				_sinaCallEvent && _sinaCallEvent.trigger('sina_init_show');
			}catch(e){
				alert(e);
			}
		}
	}
	win.runActivity = function(){
		if(typeof(__pushConfig)!='undefined'){
			__pushConfig.__isAllNotShow = true;
		}else{
			__pushConfig = false;
		}
		redBag.init();
	}
	win._sinaCallEvent.on('sina_init_activity',runActivity);
})(window, document);
}catch(e){throw new Error(e+" ./redBag.js");}

try{/**
 * @新科技频道-手机新浪网
 * @requires "sina", "zepto.js"
 * @author tingling
 * @date 2015-12-14
 */
(function( win, doc){
	var pageType = {home:'home',index:'index',index:'index_2',article:'article',qudao:'qudao',share:'share'},
		contentType = {news:'news',sports:'sports',finance:'finance',top:'top',video:'video'},
		allPushType = {activity:'activity',addToHome:'addToHome',push:'push',banner:'banner'},
		allowPush = [contentType.news,contentType.video,],
		_unde = 'undefined',
		_saConfig = typeof(_SACONFIG) !== _unde && _SACONFIG || {},
		_pushConfig = {},
		_config = {},
		_localurl = document.location.href,
		pushTarget = {
			news : {
				http : ''+window.prtl.prefix+'so.sina.cn/push.d.json?jsoncallback=updateInfo',
				https : 'https://so.sina.cn/push.d.json?jsoncallback=updateInfo'
			},
		},
		status = {
			home	: typeof(_saConfig.domain) == 'home',
			index 	: typeof(scope) !== _unde && typeof(scope.channel_id) !== _unde,
			index_2 : typeof(scope) !== _unde && typeof(scope.channel_id) == _unde,
			article	: typeof(__docConfig) !== _unde && typeof(__docConfig.__docId) !== _unde,
			qudao 	: _localurl.match(/(\S*)(&from=qudao)(\S*)/),
			share 	: _localurl.match(/(\S*)(share.d.html)(\S*)(&from=qudao)(\S*)/),
			top		: _localurl.match(/(\S*)(:\/\/top.sina.cn)(\S*)/),
			news 	: _localurl.match(/(\S*)(:\/\/news.sina.cn)(\S*) /),
			sports	: _localurl.match(/(\S*)(:\/\/sports.sina.cn)(\S*)/),
			finance	: _localurl.match(/(\S*)(:\/\/finance.sina.cn)(\S*)/),
			blog	: _localurl.match(/(\S*)(:\/\/blog.sina.cn)(\S*)/),
			t_news	: _localurl.match(/(\S*)(:\/\/top.sina.cn\/news)(\S*)/),
			t_sports: _localurl.match(/(\S*)(:\/\/top.sina.cn\/sports)(\S*)/),
			t_finance: _localurl.match(/(\S*)(:\/\/top.sina.cn\/finance)(\S*)/),
			t_blog	: _localurl.match(/(\S*)(:\/\/top.sina.cn\/blog)(\S*)/)
		},
		_APP = contentType.news,
		_isForbidShow = isForbid();
	function initConfig(){
		//判断是否为特殊类型，从而判断是否强制转换展示类型
		var _cType 	= {};
		_pushConfig = (typeof(__pushConfig) !== _unde && __pushConfig) || {};
		_config 	= {
			__showType  	: '',
			__isAllNotShow  : typeof(_pushConfig.__isAllNotShow) !== _unde && !!_pushConfig.__isAllNotShow,
			__isNotScheme	: typeof(_pushConfig.__isNotScheme) !== _unde && !!_pushConfig.__isNotScheme,
			__isActivity	: typeof(_pushConfig.__isActivity) !== _unde || !!_pushConfig.__isActivity || _pushConfig.__showType == allPushType.activity,
			//当无push的配置时，默认是不显示push的
			__isAddToHome 	: typeof(_pushConfig.__isAddToHome) !== _unde || !!_pushConfig.__isAddToHome || _pushConfig.__showType == allPushType.addToHome,
			__isPush 		: typeof(_pushConfig.__isPush) !== _unde && !!_pushConfig.__isPush || _pushConfig.__showType == allPushType.push,
			//当无banner的配置时，默认显示banner
			__isBanner 		: typeof(_pushConfig.__isBanner) == _unde || !!_pushConfig.__isBanner|| _pushConfig.__showType == allPushType.banner,
			__waitTime 		: typeof(_pushConfig.__pushWaitTime) !== _unde && parseInt(_pushConfig.__pushWaitTime) || 5
		};
		_cType 	= getPushType();
		_config.__showType = (typeof(_pushConfig.__showType) !== _unde && _pushConfig.__showType) ||(_cType.isForce && _cType.type) || allPushType.banner;
	}
	function getPushType(){
		var _temp = {},
			_apt = allPushType;
		_APP = getContentType();
		_temp.isForce = false;
		_temp.channel = _APP;
		
		//判断为新闻频道首页时，则去获取push数据，并显示
		if( _config.__isPush && allowPush.indexOf(_APP)>-1){
			_temp.type = _apt.push;
			_temp.isForce = true;
		}else{
			if(!status.share){
				_temp.type = _apt.banner;
			}else if(allowPush.indexOf(_APP)<=-1){
				_temp.isForce = true;
			}
		}
		return _temp;
	}
	function isForbid(){
		var _ua = navigator.userAgent.toLowerCase(),
			_ios9Str = 'iphone os 9_',
	        _isIos9 = _ua.indexOf(_ios9Str)>-1;
		
	    if(_isIos9) {
	        return true;
	    } else {
	        return false;
	    }
	}
	function ajaxJsonp(url){
		var head = doc.getElementsByTagName('body')[0],
			script = doc.createElement('script');
		script.src = url;
		script.className = "j_addscript";
		script.charset = "utf-8";
		head.appendChild(script);
		return false;
	}
	function isObjectEmpty(objBox){
		var i  = 0,
			_obj = objBox || {};
		if(objBox instanceof Object){
			for(var o in _obj){i++;}
		}
		if(i>0){ return false;}
		else{return true;}
	}
	function getPageType(){
		var _pageType = '';
		if(status.home) 	_pageType = pageType.home;
		if(status.index) 	_pageType = pageType.index;
		if(status.index_2)	_pageType = pageType.index_2;
		if(status.article) 	_pageType = pageType.article;	
		if(status.qudao) 	_pageType = pageType.qudao;
		if(status.share) 	_pageType = pageType.share;
		return _pageType;
	}
	function getContentType(){
		var _cType = '';
		if(status.sports || status.t_sports){
			_cType = contentType.sports;
		}else if(status.finance || status.t_finance){
			_cType = contentType.finance;
		}else if(status.blog ||	status.t_blog){
			_cType = contentType.blog;
		}else{
			_cType = contentType.news;
		}
		if(typeof(_saConfig.app) == 'news'){
			_cType = contentType.news;
		}
		return _cType;
	}
	function getPushInfo( _app, info){
		var _TYPE = contentType,
			rdata = {};
		switch(_app){
			case _TYPE.news:
				try{
					if(info && info.message == 'success'){
						var _data = JSON.parse(info.data),
							_detail = _data && _data.data;
						if(typeof(_detail.title)!='undefined' && typeof(_detail.artid)!='undefined' && typeof(_detail.url)!='undefined'){
							rdata.title =  _detail.title;
							rdata.artid =  _detail.artid;	
							rdata.url 	=  _detail.url;	
							rdata.waitTime = _config.__waitTime;					
						}
					}else{
						console.log(info.message);
					}
				}catch(e){
					console.log(e);
				}
				break;
			case _TYPE.finance:
			case _TYPE.sports:
			case _TYPE.blog:
			default:
				break;
		}
		return rdata;
	}
	window.updateInfo = function(re){
		var pushData = getPushInfo(_APP,re),
			_isReEmpty = isObjectEmpty(re),
			_isPushEmpty = isObjectEmpty(pushData);
		if(!_isReEmpty && !_isPushEmpty){
			pushData.__isNotScheme = _config.__isNotScheme;
			showPush(pushData);
		}else{
			showBanner();
		}
	}
	//显示push
	function showPush(data){
		if(!_config.__isAllNotShow){
			_config.__isBanner && (_config.__showType = allPushType.banner);
			if(_config.__isPush){
				win._sinaCallEvent.trigger('sina_open_push',data);
			}else{			
				_initShow();
			}
		}
	}
	//显示banner
	function showBanner(){
		if(_config.__isBanner && !_config.__isAllNotShow ){
			win._sinaCallEvent.trigger('sina_build_native');
		}
	}
	function showAddToHome(){
		if(_config.__isAddToHome){
			_config.__isBanner && (_config.__showType = allPushType.banner);
			_config.__isPush && (_config.__showType = allPushType.push);
			win._sinaCallEvent.trigger('sina_run_addToHome');
		}else{
			_initShow();
		}
	}
	function showActivity(){
		var isPermitAddToHome = getActivityPermitShow();
		_config.__isBanner && (_config.__showType = allPushType.banner);
		_config.__isPush && (_config.__showType = allPushType.push);
		if(_config.__isActivity){
			!isPermitAddToHome && _config.__isAddToHome && (_config.__showType = allPushType.addToHome);
			win._sinaCallEvent.trigger('sina_init_activity',runActivity);
		}else{
			_config.__isAddToHome && (_config.__showType = allPushType.addToHome);
			_initShow();
		}
	}
	function getActivityPermitShow (){
		//get permit right
		var getPermit = win.checkRequre({isActivity:1}),
			isPermit = getPermit && getPermit['ch'] == 'uc',
			isActive = __pushConfig && __pushConfig.__showType == 'active';
		
		return isPermit;
	};
	window.getActivityPermitShow = getActivityPermitShow;
	//获取push权限，并去获取push数据
	function _initShow(){
		var pushType = _config.__showType,
			_apt = allPushType;
		switch(pushType){
			case _apt.activity:
				showActivity();
				break;
			case _apt.addToHome:
				showAddToHome();
				break;
			case _apt.push:
			 	var newsApi = pushTarget.news,
			 		_url = location.protocol === 'https:' ? newsApi.https : newsApi.http;
				ajaxJsonp(_url);
				break;
			case _apt.banner:
				showBanner();
				break;
			default:
				break;
		}
		
	}
	window.initShow = function(){
		_initShow();
	};
	//清除push及banner，保证不会再出现
	window.clearAllShow = function(){
		win._sinaCallEvent.trigger('sina_close_push',true);
		win._sinaCallEvent.trigger('sina_clear_native');
	}
	//重置push，保证push可以开启
	window.resetPush = function(){
		win._sinaCallEvent.trigger('sina_close_push',false);	
	}
	window.initPushConfig = function(){
		initConfig();
	}
	function init(){
		win._sinaCallEvent.on('sina_init_config',initPushConfig);
		win._sinaCallEvent.trigger('sina_init_config');
		
		win._sinaCallEvent.on('sina_init_show',initShow);
		win._sinaCallEvent.on('sina_clear_all_show',clearAllShow);
		win._sinaCallEvent.on('sina_reset_push_show',resetPush);
		setTimeout(function(){
			//if(!_config.__isAllNotShow){
				win._sinaCallEvent.trigger('sina_init_show');
			//}			
		},300);
		//initShow();
	}
	setTimeout(function(){
		init();
	},300);
})(window, document);
}catch(e){throw new Error(e+" ./switchProxy.js");}
