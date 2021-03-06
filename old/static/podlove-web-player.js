/*
 * ===========================================
 * Podlove Web Player v2.1.0
 * Licensed under The BSD 2-Clause License
 * http://opensource.org/licenses/BSD-2-Clause
 * ===========================================
 * Copyright (c) 2013, Gerrit van Aaken (https://github.com/gerritvanaaken/), Simon Waldherr (https://github.com/simonwaldherr/), Frank Hase (https://github.com/Kambfhase/), Eric Teubert (https://github.com/eteubert/) and others (https://github.com/podlove/podlove-web-player/contributors)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


/*jslint browser: true, plusplus: true, unparam: true, vars: true, white: true */
/*global window, jQuery */

/*!
 *
 * MediaElement.js
 * HTML5 <video> and <audio> shim and player
 * http://mediaelementjs.com/
 *
 * Creates a JavaScript object that mimics HTML5 MediaElement API
 * for browsers that don't understand HTML5 or can't play the provided codec
 * Can play MP4 (H.264), Ogg, WebM, FLV, WMV, WMA, ACC, and MP3
 *
 * Copyright 2010-2014, John Dyer (http://j.hn)
 * License: MIT
 *
 */
var mejs=mejs||{};mejs.version="2.23.3",mejs.meIndex=0,mejs.plugins={silverlight:[{version:[3,0],types:["video/mp4","video/m4v","video/mov","video/wmv","audio/wma","audio/m4a","audio/mp3","audio/wav","audio/mpeg"]}],flash:[{version:[9,0,124],types:["video/mp4","video/m4v","video/mov","video/flv","video/rtmp","video/x-flv","audio/flv","audio/x-flv","audio/mp3","audio/m4a","audio/mp4","audio/mpeg","video/dailymotion","video/x-dailymotion","application/x-mpegURL","audio/ogg"]}],youtube:[{version:null,types:["video/youtube","video/x-youtube","audio/youtube","audio/x-youtube"]}],vimeo:[{version:null,types:["video/vimeo","video/x-vimeo"]}]},mejs.Utility={encodeUrl:function(a){return encodeURIComponent(a)},escapeHTML:function(a){return a.toString().split("&").join("&amp;").split("<").join("&lt;").split('"').join("&quot;")},absolutizeUrl:function(a){var b=document.createElement("div");return b.innerHTML='<a href="'+this.escapeHTML(a)+'">x</a>',b.firstChild.href},getScriptPath:function(a){for(var b,c,d,e,f,g,h=0,i="",j="",k=document.getElementsByTagName("script"),l=k.length,m=a.length;l>h;h++){for(e=k[h].src,c=e.lastIndexOf("/"),c>-1?(g=e.substring(c+1),f=e.substring(0,c+1)):(g=e,f=""),b=0;m>b;b++)if(j=a[b],d=g.indexOf(j),d>-1){i=f;break}if(""!==i)break}return i},calculateTimeFormat:function(a,b,c){0>a&&(a=0),"undefined"==typeof c&&(c=25);var d=b.timeFormat,e=d[0],f=d[1]==d[0],g=f?2:1,h=":",i=Math.floor(a/3600)%24,j=Math.floor(a/60)%60,k=Math.floor(a%60),l=Math.floor((a%1*c).toFixed(3)),m=[[l,"f"],[k,"s"],[j,"m"],[i,"h"]];d.length<g&&(h=d[g]);for(var n=!1,o=0,p=m.length;p>o;o++)if(-1!==d.indexOf(m[o][1]))n=!0;else if(n){for(var q=!1,r=o;p>r;r++)if(m[r][0]>0){q=!0;break}if(!q)break;f||(d=e+d),d=m[o][1]+h+d,f&&(d=m[o][1]+d),e=m[o][1]}b.currentTimeFormat=d},twoDigitsString:function(a){return 10>a?"0"+a:String(a)},secondsToTimeCode:function(a,b){if(0>a&&(a=0),"object"!=typeof b){var c="m:ss";c=arguments[1]?"hh:mm:ss":c,c=arguments[2]?c+":ff":c,b={currentTimeFormat:c,framesPerSecond:arguments[3]||25}}var d=b.framesPerSecond;"undefined"==typeof d&&(d=25);var c=b.currentTimeFormat,e=Math.floor(a/3600)%24,f=Math.floor(a/60)%60,g=Math.floor(a%60),h=Math.floor((a%1*d).toFixed(3));lis=[[h,"f"],[g,"s"],[f,"m"],[e,"h"]];var j=c;for(i=0,len=lis.length;i<len;i++)j=j.replace(lis[i][1]+lis[i][1],this.twoDigitsString(lis[i][0])),j=j.replace(lis[i][1],lis[i][0]);return j},timeCodeToSeconds:function(a,b,c,d){"undefined"==typeof c?c=!1:"undefined"==typeof d&&(d=25);var e=a.split(":"),f=parseInt(e[0],10),g=parseInt(e[1],10),h=parseInt(e[2],10),i=0,j=0;return c&&(i=parseInt(e[3])/d),j=3600*f+60*g+h+i},convertSMPTEtoSeconds:function(a){if("string"!=typeof a)return!1;a=a.replace(",",".");var b=0,c=-1!=a.indexOf(".")?a.split(".")[1].length:0,d=1;a=a.split(":").reverse();for(var e=0;e<a.length;e++)d=1,e>0&&(d=Math.pow(60,e)),b+=Number(a[e])*d;return Number(b.toFixed(c))},removeSwf:function(a){var b=document.getElementById(a);b&&/object|embed/i.test(b.nodeName)&&(mejs.MediaFeatures.isIE?(b.style.display="none",function(){4==b.readyState?mejs.Utility.removeObjectInIE(a):setTimeout(arguments.callee,10)}()):b.parentNode.removeChild(b))},removeObjectInIE:function(a){var b=document.getElementById(a);if(b){for(var c in b)"function"==typeof b[c]&&(b[c]=null);b.parentNode.removeChild(b)}},determineScheme:function(a){return a&&-1!=a.indexOf("://")?a.substr(0,a.indexOf("://")+3):"//"},debounce:function(a,b,c){var d;return function(){var e=this,f=arguments,g=function(){d=null,c||a.apply(e,f)},h=c&&!d;clearTimeout(d),d=setTimeout(g,b),h&&a.apply(e,f)}},isNodeAfter:function(a,b){return!!(a&&b&&"function"==typeof a.compareDocumentPosition&&a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_PRECEDING)}},mejs.PluginDetector={hasPluginVersion:function(a,b){var c=this.plugins[a];return b[1]=b[1]||0,b[2]=b[2]||0,c[0]>b[0]||c[0]==b[0]&&c[1]>b[1]||c[0]==b[0]&&c[1]==b[1]&&c[2]>=b[2]?!0:!1},nav:window.navigator,ua:window.navigator.userAgent.toLowerCase(),plugins:[],addPlugin:function(a,b,c,d,e){this.plugins[a]=this.detectPlugin(b,c,d,e)},detectPlugin:function(a,b,c,d){var e,f,g,h=[0,0,0];if("undefined"!=typeof this.nav.plugins&&"object"==typeof this.nav.plugins[a]){if(e=this.nav.plugins[a].description,e&&("undefined"==typeof this.nav.mimeTypes||!this.nav.mimeTypes[b]||this.nav.mimeTypes[b].enabledPlugin))for(h=e.replace(a,"").replace(/^\s+/,"").replace(/\sr/gi,".").split("."),f=0;f<h.length;f++)h[f]=parseInt(h[f].match(/\d+/),10)}else if("undefined"!=typeof window.ActiveXObject)try{g=new ActiveXObject(c),g&&(h=d(g))}catch(i){}return h}},mejs.PluginDetector.addPlugin("flash","Shockwave Flash","application/x-shockwave-flash","ShockwaveFlash.ShockwaveFlash",function(a){var b=[],c=a.GetVariable("$version");return c&&(c=c.split(" ")[1].split(","),b=[parseInt(c[0],10),parseInt(c[1],10),parseInt(c[2],10)]),b}),mejs.PluginDetector.addPlugin("silverlight","Silverlight Plug-In","application/x-silverlight-2","AgControl.AgControl",function(a){var b=[0,0,0,0],c=function(a,b,c,d){for(;a.isVersionSupported(b[0]+"."+b[1]+"."+b[2]+"."+b[3]);)b[c]+=d;b[c]-=d};return c(a,b,0,1),c(a,b,1,1),c(a,b,2,1e4),c(a,b,2,1e3),c(a,b,2,100),c(a,b,2,10),c(a,b,2,1),c(a,b,3,1),b}),mejs.MediaFeatures={init:function(){var a,b,c=this,d=document,e=mejs.PluginDetector.nav,f=mejs.PluginDetector.ua.toLowerCase(),g=["source","track","audio","video"];c.isiPad=null!==f.match(/ipad/i),c.isiPhone=null!==f.match(/iphone/i),c.isiOS=c.isiPhone||c.isiPad,c.isAndroid=null!==f.match(/android/i),c.isBustedAndroid=null!==f.match(/android 2\.[12]/),c.isBustedNativeHTTPS="https:"===location.protocol&&(null!==f.match(/android [12]\./)||null!==f.match(/macintosh.* version.* safari/)),c.isIE=-1!=e.appName.toLowerCase().indexOf("microsoft")||null!==e.appName.toLowerCase().match(/trident/gi),c.isChrome=null!==f.match(/chrome/gi),c.isChromium=null!==f.match(/chromium/gi),c.isFirefox=null!==f.match(/firefox/gi),c.isWebkit=null!==f.match(/webkit/gi),c.isGecko=null!==f.match(/gecko/gi)&&!c.isWebkit&&!c.isIE,c.isOpera=null!==f.match(/opera/gi),c.hasTouch="ontouchstart"in window,c.svgAsImg=!!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image","1.1");for(a=0;a<g.length;a++)b=document.createElement(g[a]);c.supportsMediaTag="undefined"!=typeof b.canPlayType||c.isBustedAndroid;try{b.canPlayType("video/mp4")}catch(h){c.supportsMediaTag=!1}c.supportsPointerEvents=function(){var a,b=document.createElement("x"),c=document.documentElement,d=window.getComputedStyle;return"pointerEvents"in b.style?(b.style.pointerEvents="auto",b.style.pointerEvents="x",c.appendChild(b),a=d&&"auto"===d(b,"").pointerEvents,c.removeChild(b),!!a):!1}(),c.hasFirefoxPluginMovingProblem=!1,c.hasiOSFullScreen="undefined"!=typeof b.webkitEnterFullscreen,c.hasNativeFullscreen="undefined"!=typeof b.requestFullscreen,c.hasWebkitNativeFullScreen="undefined"!=typeof b.webkitRequestFullScreen,c.hasMozNativeFullScreen="undefined"!=typeof b.mozRequestFullScreen,c.hasMsNativeFullScreen="undefined"!=typeof b.msRequestFullscreen,c.hasTrueNativeFullScreen=c.hasWebkitNativeFullScreen||c.hasMozNativeFullScreen||c.hasMsNativeFullScreen,c.nativeFullScreenEnabled=c.hasTrueNativeFullScreen,c.hasMozNativeFullScreen?c.nativeFullScreenEnabled=document.mozFullScreenEnabled:c.hasMsNativeFullScreen&&(c.nativeFullScreenEnabled=document.msFullscreenEnabled),c.isChrome&&(c.hasiOSFullScreen=!1),c.hasTrueNativeFullScreen&&(c.fullScreenEventName="",c.hasWebkitNativeFullScreen?c.fullScreenEventName="webkitfullscreenchange":c.hasMozNativeFullScreen?c.fullScreenEventName="mozfullscreenchange":c.hasMsNativeFullScreen&&(c.fullScreenEventName="MSFullscreenChange"),c.isFullScreen=function(){return c.hasMozNativeFullScreen?d.mozFullScreen:c.hasWebkitNativeFullScreen?d.webkitIsFullScreen:c.hasMsNativeFullScreen?null!==d.msFullscreenElement:void 0},c.requestFullScreen=function(a){c.hasWebkitNativeFullScreen?a.webkitRequestFullScreen():c.hasMozNativeFullScreen?a.mozRequestFullScreen():c.hasMsNativeFullScreen&&a.msRequestFullscreen()},c.cancelFullScreen=function(){c.hasWebkitNativeFullScreen?document.webkitCancelFullScreen():c.hasMozNativeFullScreen?document.mozCancelFullScreen():c.hasMsNativeFullScreen&&document.msExitFullscreen()}),c.hasiOSFullScreen&&f.match(/mac os x 10_5/i)&&(c.hasNativeFullScreen=!1,c.hasiOSFullScreen=!1)}},mejs.MediaFeatures.init(),mejs.HtmlMediaElement={pluginType:"native",isFullScreen:!1,setCurrentTime:function(a){this.currentTime=a},setMuted:function(a){this.muted=a},setVolume:function(a){this.volume=a},stop:function(){this.pause()},setSrc:function(a){for(var b=this.getElementsByTagName("source");b.length>0;)this.removeChild(b[0]);if("string"==typeof a)this.src=a;else{var c,d;for(c=0;c<a.length;c++)if(d=a[c],this.canPlayType(d.type)){this.src=d.src;break}}},setVideoSize:function(a,b){this.width=a,this.height=b}},mejs.PluginMediaElement=function(a,b,c){this.id=a,this.pluginType=b,this.src=c,this.events={},this.attributes={}},mejs.PluginMediaElement.prototype={pluginElement:null,pluginType:"",isFullScreen:!1,playbackRate:-1,defaultPlaybackRate:-1,seekable:[],played:[],paused:!0,ended:!1,seeking:!1,duration:0,error:null,tagName:"",muted:!1,volume:1,currentTime:0,play:function(){null!=this.pluginApi&&("youtube"==this.pluginType||"vimeo"==this.pluginType?this.pluginApi.playVideo():this.pluginApi.playMedia(),this.paused=!1)},load:function(){null!=this.pluginApi&&("youtube"==this.pluginType||"vimeo"==this.pluginType||this.pluginApi.loadMedia(),this.paused=!1)},pause:function(){null!=this.pluginApi&&("youtube"==this.pluginType||"vimeo"==this.pluginType?1==this.pluginApi.getPlayerState()&&this.pluginApi.pauseVideo():this.pluginApi.pauseMedia(),this.paused=!0)},stop:function(){null!=this.pluginApi&&("youtube"==this.pluginType||"vimeo"==this.pluginType?this.pluginApi.stopVideo():this.pluginApi.stopMedia(),this.paused=!0)},canPlayType:function(a){var b,c,d,e=mejs.plugins[this.pluginType];for(b=0;b<e.length;b++)if(d=e[b],mejs.PluginDetector.hasPluginVersion(this.pluginType,d.version))for(c=0;c<d.types.length;c++)if(a==d.types[c])return"probably";return""},positionFullscreenButton:function(a,b,c){null!=this.pluginApi&&this.pluginApi.positionFullscreenButton&&this.pluginApi.positionFullscreenButton(Math.floor(a),Math.floor(b),c)},hideFullscreenButton:function(){null!=this.pluginApi&&this.pluginApi.hideFullscreenButton&&this.pluginApi.hideFullscreenButton()},setSrc:function(a){if("string"==typeof a)this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(a)),this.src=mejs.Utility.absolutizeUrl(a);else{var b,c;for(b=0;b<a.length;b++)if(c=a[b],this.canPlayType(c.type)){this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(c.src)),this.src=mejs.Utility.absolutizeUrl(c.src);break}}},setCurrentTime:function(a){null!=this.pluginApi&&("youtube"==this.pluginType||"vimeo"==this.pluginType?this.pluginApi.seekTo(a):this.pluginApi.setCurrentTime(a),this.currentTime=a)},setVolume:function(a){null!=this.pluginApi&&("youtube"==this.pluginType?this.pluginApi.setVolume(100*a):this.pluginApi.setVolume(a),this.volume=a)},setMuted:function(a){null!=this.pluginApi&&("youtube"==this.pluginType?(a?this.pluginApi.mute():this.pluginApi.unMute(),this.muted=a,this.dispatchEvent({type:"volumechange"})):this.pluginApi.setMuted(a),this.muted=a)},setVideoSize:function(a,b){this.pluginElement&&this.pluginElement.style&&(this.pluginElement.style.width=a+"px",this.pluginElement.style.height=b+"px"),null!=this.pluginApi&&this.pluginApi.setVideoSize&&this.pluginApi.setVideoSize(a,b)},setFullscreen:function(a){null!=this.pluginApi&&this.pluginApi.setFullscreen&&this.pluginApi.setFullscreen(a)},enterFullScreen:function(){null!=this.pluginApi&&this.pluginApi.setFullscreen&&this.setFullscreen(!0)},exitFullScreen:function(){null!=this.pluginApi&&this.pluginApi.setFullscreen&&this.setFullscreen(!1)},addEventListener:function(a,b,c){this.events[a]=this.events[a]||[],this.events[a].push(b)},removeEventListener:function(a,b){if(!a)return this.events={},!0;var c=this.events[a];if(!c)return!0;if(!b)return this.events[a]=[],!0;for(var d=0;d<c.length;d++)if(c[d]===b)return this.events[a].splice(d,1),!0;return!1},dispatchEvent:function(a){var b,c=this.events[a.type];if(c)for(b=0;b<c.length;b++)c[b].apply(this,[a])},hasAttribute:function(a){return a in this.attributes},removeAttribute:function(a){delete this.attributes[a]},getAttribute:function(a){return this.hasAttribute(a)?this.attributes[a]:null},setAttribute:function(a,b){this.attributes[a]=b},remove:function(){mejs.Utility.removeSwf(this.pluginElement.id)}},mejs.MediaElementDefaults={mode:"auto",plugins:["flash","silverlight","youtube","vimeo"],enablePluginDebug:!1,httpsBasicAuthSite:!1,type:"",pluginPath:mejs.Utility.getScriptPath(["mediaelement.js","mediaelement.min.js","mediaelement-and-player.js","mediaelement-and-player.min.js"]),flashName:"flashmediaelement.swf",flashStreamer:"",flashScriptAccess:"sameDomain",enablePluginSmoothing:!1,enablePseudoStreaming:!1,pseudoStreamingStartQueryParam:"start",silverlightName:"silverlightmediaelement.xap",defaultVideoWidth:480,defaultVideoHeight:270,pluginWidth:-1,pluginHeight:-1,pluginVars:[],timerRate:250,startVolume:.8,customError:"",success:function(){},error:function(){}},mejs.MediaElement=function(a,b){return mejs.HtmlMediaElementShim.create(a,b)},mejs.HtmlMediaElementShim={create:function(a,b){var c,d,e={},f="string"==typeof a?document.getElementById(a):a,g=f.tagName.toLowerCase(),h="audio"===g||"video"===g,i=h?f.getAttribute("src"):f.getAttribute("href"),j=f.getAttribute("poster"),k=f.getAttribute("autoplay"),l=f.getAttribute("preload"),m=f.getAttribute("controls");for(d in mejs.MediaElementDefaults)e[d]=mejs.MediaElementDefaults[d];for(d in b)e[d]=b[d];return i="undefined"==typeof i||null===i||""==i?null:i,j="undefined"==typeof j||null===j?"":j,l="undefined"==typeof l||null===l||"false"===l?"none":l,k=!("undefined"==typeof k||null===k||"false"===k),m=!("undefined"==typeof m||null===m||"false"===m),c=this.determinePlayback(f,e,mejs.MediaFeatures.supportsMediaTag,h,i),c.url=null!==c.url?mejs.Utility.absolutizeUrl(c.url):"",c.scheme=mejs.Utility.determineScheme(c.url),"native"==c.method?(mejs.MediaFeatures.isBustedAndroid&&(f.src=c.url,f.addEventListener("click",function(){f.play()},!1)),this.updateNative(c,e,k,l)):""!==c.method?this.createPlugin(c,e,j,k,l,m):(this.createErrorMessage(c,e,j),this)},determinePlayback:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=[],r={method:"",url:"",htmlMediaElement:a,isVideo:"audio"!==a.tagName.toLowerCase(),scheme:""};if("undefined"!=typeof b.type&&""!==b.type)if("string"==typeof b.type)q.push({type:b.type,url:e});else for(f=0;f<b.type.length;f++)q.push({type:b.type[f],url:e});else if(null!==e)k=this.formatType(e,a.getAttribute("type")),q.push({type:k,url:e});else for(f=0;f<a.childNodes.length;f++)j=a.childNodes[f],1==j.nodeType&&"source"==j.tagName.toLowerCase()&&(e=j.getAttribute("src"),k=this.formatType(e,j.getAttribute("type")),p=j.getAttribute("media"),(!p||!window.matchMedia||window.matchMedia&&window.matchMedia(p).matches)&&q.push({type:k,url:e}));if(!d&&q.length>0&&null!==q[0].url&&this.getTypeFromFile(q[0].url).indexOf("audio")>-1&&(r.isVideo=!1),r.isVideo&&mejs.MediaFeatures.isBustedAndroid&&(a.canPlayType=function(a){return null!==a.match(/video\/(mp4|m4v)/gi)?"maybe":""}),r.isVideo&&mejs.MediaFeatures.isChromium&&(a.canPlayType=function(a){return null!==a.match(/video\/(webm|ogv|ogg)/gi)?"maybe":""}),c&&("auto"===b.mode||"auto_plugin"===b.mode||"native"===b.mode)&&(!mejs.MediaFeatures.isBustedNativeHTTPS||b.httpsBasicAuthSite!==!0)){for(d||(o=document.createElement(r.isVideo?"video":"audio"),a.parentNode.insertBefore(o,a),a.style.display="none",r.htmlMediaElement=a=o),f=0;f<q.length;f++)if("video/m3u8"==q[f].type||""!==a.canPlayType(q[f].type).replace(/no/,"")||""!==a.canPlayType(q[f].type.replace(/mp3/,"mpeg")).replace(/no/,"")||""!==a.canPlayType(q[f].type.replace(/m4a/,"mp4")).replace(/no/,"")){r.method="native",r.url=q[f].url;break}if("native"===r.method&&(null!==r.url&&(a.src=r.url),"auto_plugin"!==b.mode))return r}if("auto"===b.mode||"auto_plugin"===b.mode||"shim"===b.mode)for(f=0;f<q.length;f++)for(k=q[f].type,g=0;g<b.plugins.length;g++)for(l=b.plugins[g],m=mejs.plugins[l],h=0;h<m.length;h++)if(n=m[h],null==n.version||mejs.PluginDetector.hasPluginVersion(l,n.version))for(i=0;i<n.types.length;i++)if(k.toLowerCase()==n.types[i].toLowerCase())return r.method=l,r.url=q[f].url,r;return"auto_plugin"===b.mode&&"native"===r.method?r:(""===r.method&&q.length>0&&(r.url=q[0].url),r)},formatType:function(a,b){return a&&!b?this.getTypeFromFile(a):b&&~b.indexOf(";")?b.substr(0,b.indexOf(";")):b},getTypeFromFile:function(a){a=a.split("?")[0];var b=a.substring(a.lastIndexOf(".")+1).toLowerCase(),c=/(mp4|m4v|ogg|ogv|m3u8|webm|webmv|flv|wmv|mpeg|mov)/gi.test(b)?"video/":"audio/";return this.getTypeFromExtension(b,c)},getTypeFromExtension:function(a,b){switch(b=b||"",a){case"mp4":case"m4v":case"m4a":case"f4v":case"f4a":return b+"mp4";case"flv":return b+"x-flv";case"webm":case"webma":case"webmv":return b+"webm";case"ogg":case"oga":case"ogv":return b+"ogg";case"m3u8":return"application/x-mpegurl";case"ts":return b+"mp2t";default:return b+a}},createErrorMessage:function(a,b,c){var d=a.htmlMediaElement,e=document.createElement("div"),f=b.customError;e.className="me-cannotplay";try{e.style.width=d.width+"px",e.style.height=d.height+"px"}catch(g){}f||(f='<a href="'+a.url+'">',""!==c&&(f+='<img src="'+c+'" width="100%" height="100%" alt="" />'),f+="<span>"+mejs.i18n.t("mejs.download-file")+"</span></a>"),e.innerHTML=f,d.parentNode.insertBefore(e,d),d.style.display="none",b.error(d)},createPlugin:function(a,b,c,d,e,f){var g,h,i,j=a.htmlMediaElement,k=1,l=1,m="me_"+a.method+"_"+mejs.meIndex++,n=new mejs.PluginMediaElement(m,a.method,a.url),o=document.createElement("div");n.tagName=j.tagName;for(var p=0;p<j.attributes.length;p++){var q=j.attributes[p];q.specified&&n.setAttribute(q.name,q.value)}for(h=j.parentNode;null!==h&&null!=h.tagName&&"body"!==h.tagName.toLowerCase()&&null!=h.parentNode&&null!=h.parentNode.tagName&&null!=h.parentNode.constructor&&"ShadowRoot"===h.parentNode.constructor.name;){if("p"===h.parentNode.tagName.toLowerCase()){h.parentNode.parentNode.insertBefore(h,h.parentNode);break}h=h.parentNode}if(a.isVideo?(k=b.pluginWidth>0?b.pluginWidth:b.videoWidth>0?b.videoWidth:null!==j.getAttribute("width")?j.getAttribute("width"):b.defaultVideoWidth,l=b.pluginHeight>0?b.pluginHeight:b.videoHeight>0?b.videoHeight:null!==j.getAttribute("height")?j.getAttribute("height"):b.defaultVideoHeight,k=mejs.Utility.encodeUrl(k),l=mejs.Utility.encodeUrl(l)):b.enablePluginDebug&&(k=320,l=240),n.success=b.success,o.className="me-plugin",o.id=m+"_container",a.isVideo?j.parentNode.insertBefore(o,j):document.body.insertBefore(o,document.body.childNodes[0]),"flash"===a.method||"silverlight"===a.method){var r="audio/mp4"===j.getAttribute("type"),s=j.getElementsByTagName("source");if(s&&!r)for(var p=0,t=s.length;t>p;p++)"audio/mp4"===s[p].getAttribute("type")&&(r=!0);i=["id="+m,"isvideo="+(a.isVideo||r?"true":"false"),"autoplay="+(d?"true":"false"),"preload="+e,"width="+k,"startvolume="+b.startVolume,"timerrate="+b.timerRate,"flashstreamer="+b.flashStreamer,"height="+l,"pseudostreamstart="+b.pseudoStreamingStartQueryParam],null!==a.url&&("flash"==a.method?i.push("file="+mejs.Utility.encodeUrl(a.url)):i.push("file="+a.url)),b.enablePluginDebug&&i.push("debug=true"),b.enablePluginSmoothing&&i.push("smoothing=true"),b.enablePseudoStreaming&&i.push("pseudostreaming=true"),f&&i.push("controls=true"),b.pluginVars&&(i=i.concat(b.pluginVars)),window[m+"_init"]=function(){switch(n.pluginType){case"flash":n.pluginElement=n.pluginApi=document.getElementById(m);break;case"silverlight":n.pluginElement=document.getElementById(n.id),n.pluginApi=n.pluginElement.Content.MediaElementJS}null!=n.pluginApi&&n.success&&n.success(n,j)},window[m+"_event"]=function(a,b){var c,d,e;c={type:a,target:n};for(d in b)n[d]=b[d],c[d]=b[d];e=b.bufferedTime||0,c.target.buffered=c.buffered={start:function(a){return 0},end:function(a){return e},length:1},n.dispatchEvent(c)}}switch(a.method){case"silverlight":o.innerHTML='<object data="data:application/x-silverlight-2," type="application/x-silverlight-2" id="'+m+'" name="'+m+'" width="'+k+'" height="'+l+'" class="mejs-shim"><param name="initParams" value="'+i.join(",")+'" /><param name="windowless" value="true" /><param name="background" value="black" /><param name="minRuntimeVersion" value="3.0.0.0" /><param name="autoUpgrade" value="true" /><param name="source" value="'+b.pluginPath+b.silverlightName+'" /></object>';break;case"flash":mejs.MediaFeatures.isIE?(g=document.createElement("div"),o.appendChild(g),g.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" id="'+m+'" width="'+k+'" height="'+l+'" class="mejs-shim"><param name="movie" value="'+b.pluginPath+b.flashName+"?"+(new Date).getTime()+'" /><param name="flashvars" value="'+i.join("&amp;")+'" /><param name="quality" value="high" /><param name="bgcolor" value="#000000" /><param name="wmode" value="transparent" /><param name="allowScriptAccess" value="'+b.flashScriptAccess+'" /><param name="allowFullScreen" value="true" /><param name="scale" value="default" /></object>'):o.innerHTML='<embed id="'+m+'" name="'+m+'" play="true" loop="false" quality="high" bgcolor="#000000" wmode="transparent" allowScriptAccess="'+b.flashScriptAccess+'" allowFullScreen="true" type="application/x-shockwave-flash" pluginspage="//www.macromedia.com/go/getflashplayer" src="'+b.pluginPath+b.flashName+'" flashvars="'+i.join("&")+'" width="'+k+'" height="'+l+'" scale="default"class="mejs-shim"></embed>';break;case"youtube":var u;if(-1!=a.url.lastIndexOf("youtu.be"))u=a.url.substr(a.url.lastIndexOf("/")+1),-1!=u.indexOf("?")&&(u=u.substr(0,u.indexOf("?")));else{var v=a.url.match(/[?&]v=([^&#]+)|&|#|$/);v&&(u=v[1])}youtubeSettings={container:o,containerId:o.id,pluginMediaElement:n,pluginId:m,videoId:u,height:l,width:k,scheme:a.scheme,variables:b.youtubeIframeVars},window.postMessage?mejs.YouTubeApi.enqueueIframe(youtubeSettings):mejs.PluginDetector.hasPluginVersion("flash",[10,0,0])&&mejs.YouTubeApi.createFlash(youtubeSettings,b);break;case"vimeo":var w=m+"_player";if(n.vimeoid=a.url.substr(a.url.lastIndexOf("/")+1),o.innerHTML='<iframe src="'+a.scheme+"player.vimeo.com/video/"+n.vimeoid+"?api=1&portrait=0&byline=0&title=0&player_id="+w+'" width="'+k+'" height="'+l+'" frameborder="0" class="mejs-shim" id="'+w+'" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>',"function"==typeof $f){var x=$f(o.childNodes[0]),y=-1;x.addEvent("ready",function(){function a(a,b,c,d){var e={type:c,target:b};"timeupdate"==c&&(b.currentTime=e.currentTime=d.seconds,b.duration=e.duration=d.duration),b.dispatchEvent(e)}x.playVideo=function(){x.api("play")},x.stopVideo=function(){x.api("unload")},x.pauseVideo=function(){x.api("pause")},x.seekTo=function(a){x.api("seekTo",a)},x.setVolume=function(a){x.api("setVolume",a)},x.setMuted=function(a){a?(x.lastVolume=x.api("getVolume"),x.api("setVolume",0)):(x.api("setVolume",x.lastVolume),delete x.lastVolume)},x.getPlayerState=function(){return y},x.addEvent("play",function(){y=1,a(x,n,"play"),a(x,n,"playing")}),x.addEvent("pause",function(){y=2,a(x,n,"pause")}),x.addEvent("finish",function(){y=0,a(x,n,"ended")}),x.addEvent("playProgress",function(b){a(x,n,"timeupdate",b)}),x.addEvent("seek",function(b){y=3,a(x,n,"seeked",b)}),x.addEvent("loadProgress",function(b){y=3,a(x,n,"progress",b)}),n.pluginElement=o,n.pluginApi=x,n.success(n,n.pluginElement)})}else console.warn("You need to include froogaloop for vimeo to work")}return j.style.display="none",j.removeAttribute("autoplay"),n},updateNative:function(a,b,c,d){var e,f=a.htmlMediaElement;for(e in mejs.HtmlMediaElement)f[e]=mejs.HtmlMediaElement[e];return b.success(f,f),f}},mejs.YouTubeApi={isIframeStarted:!1,isIframeLoaded:!1,loadIframeApi:function(a){if(!this.isIframeStarted){var b=document.createElement("script");b.src=a.scheme+"www.youtube.com/player_api";var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(b,c),this.isIframeStarted=!0}},iframeQueue:[],enqueueIframe:function(a){this.isLoaded?this.createIframe(a):(this.loadIframeApi(a),this.iframeQueue.push(a))},createIframe:function(a){var b=a.pluginMediaElement,c={controls:0,wmode:"transparent"},d=new YT.Player(a.containerId,{height:a.height,width:a.width,videoId:a.videoId,playerVars:mejs.$.extend({},c,a.variables),events:{onReady:function(c){d.setVideoSize=function(a,b){d.setSize(a,b)},a.pluginMediaElement.pluginApi=d,a.pluginMediaElement.pluginElement=document.getElementById(a.containerId),b.success(b,b.pluginElement),mejs.YouTubeApi.createEvent(d,b,"canplay"),setInterval(function(){mejs.YouTubeApi.createEvent(d,b,"timeupdate")},250),"undefined"!=typeof b.attributes.autoplay&&d.playVideo()},onStateChange:function(a){mejs.YouTubeApi.handleStateChange(a.data,d,b)}}})},createEvent:function(a,b,c){var d={type:c,target:b};if(a&&a.getDuration){b.currentTime=d.currentTime=a.getCurrentTime(),b.duration=d.duration=a.getDuration(),d.paused=b.paused,d.ended=b.ended,d.muted=a.isMuted(),d.volume=a.getVolume()/100,d.bytesTotal=a.getVideoBytesTotal(),d.bufferedBytes=a.getVideoBytesLoaded();var e=d.bufferedBytes/d.bytesTotal*d.duration;d.target.buffered=d.buffered={start:function(a){return 0},end:function(a){return e},length:1}}b.dispatchEvent(d)},iFrameReady:function(){for(this.isLoaded=!0,this.isIframeLoaded=!0;this.iframeQueue.length>0;){var a=this.iframeQueue.pop();this.createIframe(a)}},flashPlayers:{},createFlash:function(a){this.flashPlayers[a.pluginId]=a;var b,c=a.scheme+"www.youtube.com/apiplayer?enablejsapi=1&amp;playerapiid="+a.pluginId+"&amp;version=3&amp;autoplay=0&amp;controls=0&amp;modestbranding=1&loop=0";mejs.MediaFeatures.isIE?(b=document.createElement("div"),a.container.appendChild(b),b.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="'+a.scheme+'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" id="'+a.pluginId+'" width="'+a.width+'" height="'+a.height+'" class="mejs-shim"><param name="movie" value="'+c+'" /><param name="wmode" value="transparent" /><param name="allowScriptAccess" value="'+options.flashScriptAccess+'" /><param name="allowFullScreen" value="true" /></object>'):a.container.innerHTML='<object type="application/x-shockwave-flash" id="'+a.pluginId+'" data="'+c+'" width="'+a.width+'" height="'+a.height+'" style="visibility: visible; " class="mejs-shim"><param name="allowScriptAccess" value="'+options.flashScriptAccess+'"><param name="wmode" value="transparent"></object>'},flashReady:function(a){var b=this.flashPlayers[a],c=document.getElementById(a),d=b.pluginMediaElement;d.pluginApi=d.pluginElement=c,b.success(d,d.pluginElement),c.cueVideoById(b.videoId);var e=b.containerId+"_callback";window[e]=function(a){mejs.YouTubeApi.handleStateChange(a,c,d)},c.addEventListener("onStateChange",e),setInterval(function(){mejs.YouTubeApi.createEvent(c,d,"timeupdate")},250),mejs.YouTubeApi.createEvent(c,d,"canplay")},handleStateChange:function(a,b,c){switch(a){case-1:c.paused=!0,c.ended=!0,mejs.YouTubeApi.createEvent(b,c,"loadedmetadata");break;case 0:c.paused=!1,c.ended=!0,mejs.YouTubeApi.createEvent(b,c,"ended");break;case 1:c.paused=!1,c.ended=!1,mejs.YouTubeApi.createEvent(b,c,"play"),mejs.YouTubeApi.createEvent(b,c,"playing");break;case 2:c.paused=!0,c.ended=!1,mejs.YouTubeApi.createEvent(b,c,"pause");break;case 3:mejs.YouTubeApi.createEvent(b,c,"progress");break;case 5:}}},window.onYouTubePlayerAPIReady=function(){mejs.YouTubeApi.iFrameReady()},window.onYouTubePlayerReady=function(a){mejs.YouTubeApi.flashReady(a)},window.mejs=mejs,window.MediaElement=mejs.MediaElement,function(a,b,c,d){var e={"default":"en",locale:{language:c.i18n&&c.i18n.locale.language||"",strings:c.i18n&&c.i18n.locale.strings||{}},pluralForms:[function(){return arguments[1]},function(){var a=arguments;return 1===a[0]?a[1]:a[2]},function(){var a=arguments;return[0,1].indexOf(a[0])>-1?a[1]:a[2]},function(){var a=arguments;return a[0]%10===1&&a[0]%100!==11?a[1]:0!==a[0]?a[2]:a[3]},function(){var a=arguments;return 1===a[0]||11===a[0]?a[1]:2===a[0]||12===a[0]?a[2]:a[0]>2&&a[0]<20?a[3]:a[4]},function(){return 1===args[0]?args[1]:0===args[0]||args[0]%100>0&&args[0]%100<20?args[2]:args[3]},function(){var a=arguments;return a[0]%10===1&&a[0]%100!==11?a[1]:a[0]%10>=2&&(a[0]%100<10||a[0]%100>=20)?a[2]:[3]},function(){var a=arguments;return a[0]%10===1&&a[0]%100!==11?a[1]:a[0]%10>=2&&a[0]%10<=4&&(a[0]%100<10||a[0]%100>=20)?a[2]:a[3]},function(){var a=arguments;return 1===a[0]?a[1]:a[0]>=2&&a[0]<=4?a[2]:a[3]},function(){var a=arguments;return 1===a[0]?a[1]:a[0]%10>=2&&a[0]%10<=4&&(a[0]%100<10||a[0]%100>=20)?a[2]:a[3]},function(){var a=arguments;return a[0]%100===1?a[2]:a[0]%100===2?a[3]:a[0]%100===3||a[0]%100===4?a[4]:a[1]},function(){var a=arguments;return 1===a[0]?a[1]:2===a[0]?a[2]:a[0]>2&&a[0]<7?a[3]:a[0]>6&&a[0]<11?a[4]:a[5]},function(){var a=arguments;return 0===a[0]?a[1]:1===a[0]?a[2]:2===a[0]?a[3]:a[0]%100>=3&&a[0]%100<=10?a[4]:a[0]%100>=11?a[5]:a[6]},function(){var a=arguments;return 1===a[0]?a[1]:0===a[0]||a[0]%100>1&&a[0]%100<11?a[2]:a[0]%100>10&&a[0]%100<20?a[3]:a[4]},function(){var a=arguments;return a[0]%10===1?a[1]:a[0]%10===2?a[2]:a[3]},function(){var a=arguments;return 11!==a[0]&&a[0]%10===1?a[1]:a[2]},function(){var a=arguments;return 1===a[0]?a[1]:a[0]%10>=2&&a[0]%10<=4&&(a[0]%100<10||a[0]%100>=20)?a[2]:a[3]},function(){var a=arguments;return 1===a[0]?a[1]:2===a[0]?a[2]:8!==a[0]&&11!==a[0]?a[3]:a[4]},function(){var a=arguments;return 0===a[0]?a[1]:a[2]},function(){var a=arguments;return 1===a[0]?a[1]:2===a[0]?a[2]:3===a[0]?a[3]:a[4]},function(){var a=arguments;return 0===a[0]?a[1]:1===a[0]?a[2]:a[3]}],getLanguage:function(){var a=e.locale.language||e["default"];return/^(x\-)?[a-z]{2,}(\-\w{2,})?(\-\w{2,})?$/.exec(a)?a:e["default"]},t:function(a,b){if("string"==typeof a&&a.length){var c,d,f=e.getLanguage(),g=function(a,b,c){return"object"!=typeof a||"number"!=typeof b||"number"!=typeof c?a:"string"==typeof a?a:e.pluralForms[c].apply(null,[b].concat(a))},h=function(a){var b={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"};return a.replace(/[&<>"]/g,function(a){return b[a]})};return e.locale.strings&&e.locale.strings[f]&&(c=e.locale.strings[f][a],"number"==typeof b&&(d=e.locale.strings[f]["mejs.plural-form"],c=g.apply(null,[c,b,d]))),!c&&e.locale.strings&&e.locale.strings[e["default"]]&&(c=e.locale.strings[e["default"]][a],"number"==typeof b&&(d=e.locale.strings[e["default"]]["mejs.plural-form"],c=g.apply(null,[c,b,d]))),c=c||a,"number"==typeof b&&(c=c.replace("%1",b)),h(c)}return a}};"undefined"!=typeof mejsL10n&&(e.locale.language=mejsL10n.language),c.i18n=e}(document,window,mejs),function(a,b){"use strict";"undefined"!=typeof mejsL10n&&(a[mejsL10n.lang]=mejsL10n.strings)}(mejs.i18n.locale.strings),/*!
 * This is a i18n.locale language object.
 *
 * English; This can serve as a template for other languages to translate
 *
 * @author
 *   TBD
 *   Sascha Greuel (Twitter: @SoftCreatR)
 *
 * @see
 *   me-i18n.js
 *
 * @params
 *  - exports - CommonJS, window ..
 */
function(a){"use strict";void 0===a.en&&(a.en={"mejs.plural-form":1,"mejs.download-file":"Download File","mejs.fullscreen-off":"Turn off Fullscreen","mejs.fullscreen-on":"Go Fullscreen","mejs.download-video":"Download Video","mejs.fullscreen":"Fullscreen","mejs.time-jump-forward":["Jump forward 1 second","Jump forward %1 seconds"],"mejs.play":"Play","mejs.pause":"Pause","mejs.close":"Close","mejs.time-slider":"Time Slider","mejs.time-help-text":"Use Left/Right Arrow keys to advance one second, Up/Down arrows to advance ten seconds.","mejs.time-skip-back":["Skip back 1 second","Skip back %1 seconds"],"mejs.captions-subtitles":"Captions/Subtitles","mejs.none":"None","mejs.mute-toggle":"Mute Toggle","mejs.volume-help-text":"Use Up/Down Arrow keys to increase or decrease volume.","mejs.unmute":"Unmute","mejs.mute":"Mute","mejs.volume-slider":"Volume Slider","mejs.video-player":"Video Player","mejs.audio-player":"Audio Player","mejs.ad-skip":"Skip ad","mejs.ad-skip-info":["Skip in 1 second","Skip in %1 seconds"],"mejs.source-chooser":"Source Chooser"})}(mejs.i18n.locale.strings),/*!
 *
 * MediaElementPlayer
 * http://mediaelementjs.com/
 *
 * Creates a controller bar for HTML5 <video> add <audio> tags
 * using jQuery and MediaElement.js (HTML5 Flash/Silverlight wrapper)
 *
 * Copyright 2010-2013, John Dyer (http://j.hn/)
 * License: MIT
 *
 */
"undefined"!=typeof jQuery?mejs.$=jQuery:"undefined"!=typeof Zepto?(mejs.$=Zepto,Zepto.fn.outerWidth=function(a){var b=$(this).width();return a&&(b+=parseInt($(this).css("margin-right"),10),b+=parseInt($(this).css("margin-left"),10)),b}):"undefined"!=typeof ender&&(mejs.$=ender),function(a){mejs.MepDefaults={poster:"",showPosterWhenEnded:!1,defaultVideoWidth:480,defaultVideoHeight:270,videoWidth:-1,videoHeight:-1,defaultAudioWidth:400,defaultAudioHeight:30,defaultSeekBackwardInterval:function(a){return.05*a.duration},defaultSeekForwardInterval:function(a){return.05*a.duration},setDimensions:!0,audioWidth:-1,audioHeight:-1,startVolume:.8,loop:!1,autoRewind:!0,enableAutosize:!0,timeFormat:"",alwaysShowHours:!1,showTimecodeFrameCount:!1,framesPerSecond:25,autosizeProgress:!0,alwaysShowControls:!1,hideVideoControlsOnLoad:!1,clickToPlayPause:!0,controlsTimeoutDefault:1500,controlsTimeoutMouseEnter:2500,controlsTimeoutMouseLeave:1e3,iPadUseNativeControls:!1,iPhoneUseNativeControls:!1,AndroidUseNativeControls:!1,features:["playpause","current","progress","duration","tracks","volume","fullscreen"],isVideo:!0,stretching:"auto",enableKeyboard:!0,pauseOtherPlayers:!0,keyActions:[{keys:[32,179],action:function(a,b,c,d){mejs.MediaFeatures.isFirefox||(b.paused||b.ended?b.play():b.pause())}},{keys:[38],action:function(a,b,c,d){a.container.find(".mejs-volume-slider").css("display","block"),a.isVideo&&(a.showControls(),a.startControlsTimer());var e=Math.min(b.volume+.1,1);b.setVolume(e)}},{keys:[40],action:function(a,b,c,d){a.container.find(".mejs-volume-slider").css("display","block"),a.isVideo&&(a.showControls(),a.startControlsTimer());var e=Math.max(b.volume-.1,0);b.setVolume(e)}},{keys:[37,227],action:function(a,b,c,d){if(!isNaN(b.duration)&&b.duration>0){a.isVideo&&(a.showControls(),a.startControlsTimer());var e=Math.max(b.currentTime-a.options.defaultSeekBackwardInterval(b),0);b.setCurrentTime(e)}}},{keys:[39,228],action:function(a,b,c,d){if(!isNaN(b.duration)&&b.duration>0){a.isVideo&&(a.showControls(),a.startControlsTimer());var e=Math.min(b.currentTime+a.options.defaultSeekForwardInterval(b),b.duration);b.setCurrentTime(e)}}},{keys:[70],action:function(a,b,c,d){"undefined"!=typeof a.enterFullScreen&&(a.isFullScreen?a.exitFullScreen():a.enterFullScreen())}},{keys:[77],action:function(a,b,c,d){a.container.find(".mejs-volume-slider").css("display","block"),a.isVideo&&(a.showControls(),a.startControlsTimer()),a.media.muted?a.setMuted(!1):a.setMuted(!0)}}]},mejs.mepIndex=0,mejs.players={},mejs.MediaElementPlayer=function(b,c){if(!(this instanceof mejs.MediaElementPlayer))return new mejs.MediaElementPlayer(b,c);var d=this;return d.$media=d.$node=a(b),d.node=d.media=d.$media[0],d.node?"undefined"!=typeof d.node.player?d.node.player:("undefined"==typeof c&&(c=d.$node.data("mejsoptions")),d.options=a.extend({},mejs.MepDefaults,c),d.options.timeFormat||(d.options.timeFormat="mm:ss",d.options.alwaysShowHours&&(d.options.timeFormat="hh:mm:ss"),d.options.showTimecodeFrameCount&&(d.options.timeFormat+=":ff")),mejs.Utility.calculateTimeFormat(0,d.options,d.options.framesPerSecond||25),d.id="mep_"+mejs.mepIndex++,mejs.players[d.id]=d,d.init(),d):void 0},mejs.MediaElementPlayer.prototype={hasFocus:!1,controlsAreVisible:!0,init:function(){var b=this,c=mejs.MediaFeatures,d=a.extend(!0,{},b.options,{success:function(a,c){b.meReady(a,c)},error:function(a){b.handleError(a)}}),e=b.media.tagName.toLowerCase();if(b.isDynamic="audio"!==e&&"video"!==e,b.isDynamic?b.isVideo=b.options.isVideo:b.isVideo="audio"!==e&&b.options.isVideo,c.isiPad&&b.options.iPadUseNativeControls||c.isiPhone&&b.options.iPhoneUseNativeControls)b.$media.attr("controls","controls"),c.isiPad&&null!==b.media.getAttribute("autoplay")&&b.play();else if(c.isAndroid&&b.options.AndroidUseNativeControls);else if(b.isVideo||!b.isVideo&&b.options.features.length){b.$media.removeAttr("controls");var f=b.isVideo?mejs.i18n.t("mejs.video-player"):mejs.i18n.t("mejs.audio-player");a('<span class="mejs-offscreen">'+f+"</span>").insertBefore(b.$media),b.container=a('<div id="'+b.id+'" class="mejs-container '+(mejs.MediaFeatures.svgAsImg?"svg":"no-svg")+'" tabindex="0" role="application" aria-label="'+f+'"><div class="mejs-inner"><div class="mejs-mediaelement"></div><div class="mejs-layers"></div><div class="mejs-controls"></div><div class="mejs-clear"></div></div></div>').addClass(b.$media[0].className).insertBefore(b.$media).focus(function(a){if(!b.controlsAreVisible&&!b.hasFocus&&b.controlsEnabled&&(b.showControls(!0),!b.hasMsNativeFullScreen)){var c=".mejs-playpause-button > button";mejs.Utility.isNodeAfter(a.relatedTarget,b.container[0])&&(c=".mejs-controls .mejs-button:last-child > button");var d=b.container.find(c);d.focus()}}),b.options.features.length||b.container.css("background","transparent").find(".mejs-controls").hide(),b.isVideo&&"fill"===b.options.stretching&&!b.container.parent("mejs-fill-container").length&&(b.outerContainer=b.$media.parent(),b.container.wrap('<div class="mejs-fill-container"/>')),b.container.addClass((c.isAndroid?"mejs-android ":"")+(c.isiOS?"mejs-ios ":"")+(c.isiPad?"mejs-ipad ":"")+(c.isiPhone?"mejs-iphone ":"")+(b.isVideo?"mejs-video ":"mejs-audio ")),b.container.find(".mejs-mediaelement").append(b.$media),b.node.player=b,b.controls=b.container.find(".mejs-controls"),b.layers=b.container.find(".mejs-layers");var g=b.isVideo?"video":"audio",h=g.substring(0,1).toUpperCase()+g.substring(1);b.options[g+"Width"]>0||b.options[g+"Width"].toString().indexOf("%")>-1?b.width=b.options[g+"Width"]:""!==b.media.style.width&&null!==b.media.style.width?b.width=b.media.style.width:null!==b.media.getAttribute("width")?b.width=b.$media.attr("width"):b.width=b.options["default"+h+"Width"],b.options[g+"Height"]>0||b.options[g+"Height"].toString().indexOf("%")>-1?b.height=b.options[g+"Height"]:""!==b.media.style.height&&null!==b.media.style.height?b.height=b.media.style.height:null!==b.$media[0].getAttribute("height")?b.height=b.$media.attr("height"):b.height=b.options["default"+h+"Height"],b.setPlayerSize(b.width,b.height),d.pluginWidth=b.width,d.pluginHeight=b.height}else b.isVideo||b.options.features.length||b.$media.hide();mejs.MediaElement(b.$media[0],d),"undefined"!=typeof b.container&&b.options.features.length&&b.controlsAreVisible&&b.container.trigger("controlsshown")},showControls:function(a){var b=this;a="undefined"==typeof a||a,b.controlsAreVisible||(a?(b.controls.removeClass("mejs-offscreen").stop(!0,!0).fadeIn(200,function(){b.controlsAreVisible=!0,b.container.trigger("controlsshown")}),b.container.find(".mejs-control").removeClass("mejs-offscreen").stop(!0,!0).fadeIn(200,function(){b.controlsAreVisible=!0})):(b.controls.removeClass("mejs-offscreen").css("display","block"),b.container.find(".mejs-control").removeClass("mejs-offscreen").css("display","block"),b.controlsAreVisible=!0,b.container.trigger("controlsshown")),b.setControlsSize())},hideControls:function(b){var c=this;b="undefined"==typeof b||b,!c.controlsAreVisible||c.options.alwaysShowControls||c.keyboardAction||c.media.paused||c.media.ended||(b?(c.controls.stop(!0,!0).fadeOut(200,function(){a(this).addClass("mejs-offscreen").css("display","block"),c.controlsAreVisible=!1,c.container.trigger("controlshidden")}),c.container.find(".mejs-control").stop(!0,!0).fadeOut(200,function(){a(this).addClass("mejs-offscreen").css("display","block")})):(c.controls.addClass("mejs-offscreen").css("display","block"),c.container.find(".mejs-control").addClass("mejs-offscreen").css("display","block"),c.controlsAreVisible=!1,c.container.trigger("controlshidden")))},controlsTimer:null,startControlsTimer:function(a){var b=this;a="undefined"!=typeof a?a:b.options.controlsTimeoutDefault,b.killControlsTimer("start"),b.controlsTimer=setTimeout(function(){b.hideControls(),b.killControlsTimer("hide")},a)},killControlsTimer:function(a){var b=this;null!==b.controlsTimer&&(clearTimeout(b.controlsTimer),delete b.controlsTimer,b.controlsTimer=null)},controlsEnabled:!0,disableControls:function(){var a=this;a.killControlsTimer(),a.hideControls(!1),this.controlsEnabled=!1},enableControls:function(){var a=this;a.showControls(!1),a.controlsEnabled=!0},meReady:function(b,c){var d,e,f=this,g=mejs.MediaFeatures,h=c.getAttribute("autoplay"),i=!("undefined"==typeof h||null===h||"false"===h);if(!f.created){if(f.created=!0,f.media=b,f.domNode=c,!(g.isAndroid&&f.options.AndroidUseNativeControls||g.isiPad&&f.options.iPadUseNativeControls||g.isiPhone&&f.options.iPhoneUseNativeControls)){if(!f.isVideo&&!f.options.features.length)return i&&"native"==b.pluginType&&f.play(),void(f.options.success&&("string"==typeof f.options.success?window[f.options.success](f.media,f.domNode,f):f.options.success(f.media,f.domNode,f)));f.buildposter(f,f.controls,f.layers,f.media),f.buildkeyboard(f,f.controls,f.layers,f.media),f.buildoverlays(f,f.controls,f.layers,f.media),f.findTracks();for(d in f.options.features)if(e=f.options.features[d],f["build"+e])try{f["build"+e](f,f.controls,f.layers,f.media)}catch(j){}f.container.trigger("controlsready"),f.setPlayerSize(f.width,f.height),f.setControlsSize(),f.isVideo&&(mejs.MediaFeatures.hasTouch&&!f.options.alwaysShowControls?f.$media.bind("touchstart",function(){f.controlsAreVisible?f.hideControls(!1):f.controlsEnabled&&f.showControls(!1)}):(f.clickToPlayPauseCallback=function(){if(f.options.clickToPlayPause){f.media.paused?f.play():f.pause();var a=f.$media.closest(".mejs-container").find(".mejs-overlay-button"),b=a.attr("aria-pressed");a.attr("aria-pressed",!b)}},f.media.addEventListener("click",f.clickToPlayPauseCallback,!1),f.container.bind("mouseenter",function(){f.controlsEnabled&&(f.options.alwaysShowControls||(f.killControlsTimer("enter"),f.showControls(),f.startControlsTimer(f.options.controlsTimeoutMouseEnter)))}).bind("mousemove",function(){f.controlsEnabled&&(f.controlsAreVisible||f.showControls(),f.options.alwaysShowControls||f.startControlsTimer(f.options.controlsTimeoutMouseEnter))}).bind("mouseleave",function(){f.controlsEnabled&&(f.media.paused||f.options.alwaysShowControls||f.startControlsTimer(f.options.controlsTimeoutMouseLeave))})),f.options.hideVideoControlsOnLoad&&f.hideControls(!1),i&&!f.options.alwaysShowControls&&f.hideControls(),f.options.enableAutosize&&f.media.addEventListener("loadedmetadata",function(a){f.options.videoHeight<=0&&null===f.domNode.getAttribute("height")&&!isNaN(a.target.videoHeight)&&(f.setPlayerSize(a.target.videoWidth,a.target.videoHeight),f.setControlsSize(),f.media.setVideoSize(a.target.videoWidth,a.target.videoHeight))},!1)),f.media.addEventListener("play",function(){var a;for(a in mejs.players){var b=mejs.players[a];b.id==f.id||!f.options.pauseOtherPlayers||b.paused||b.ended||b.pause(),b.hasFocus=!1}f.hasFocus=!0},!1),f.media.addEventListener("ended",function(b){if(f.options.autoRewind)try{f.media.setCurrentTime(0),window.setTimeout(function(){a(f.container).find(".mejs-overlay-loading").parent().hide()},20)}catch(c){}"youtube"===f.media.pluginType?f.media.stop():f.media.pause(),f.setProgressRail&&f.setProgressRail(),f.setCurrentRail&&f.setCurrentRail(),f.options.loop?f.play():!f.options.alwaysShowControls&&f.controlsEnabled&&f.showControls()},!1),f.media.addEventListener("loadedmetadata",function(){mejs.Utility.calculateTimeFormat(f.duration,f.options,f.options.framesPerSecond||25),f.updateDuration&&f.updateDuration(),f.updateCurrent&&f.updateCurrent(),f.isFullScreen||(f.setPlayerSize(f.width,f.height),f.setControlsSize())},!1);var k=null;f.media.addEventListener("timeupdate",function(){k!==this.duration&&(k=this.duration,mejs.Utility.calculateTimeFormat(k,f.options,f.options.framesPerSecond||25),f.updateDuration&&f.updateDuration(),f.updateCurrent&&f.updateCurrent(),f.setControlsSize())},!1),f.container.focusout(function(b){if(b.relatedTarget){var c=a(b.relatedTarget);f.keyboardAction&&0===c.parents(".mejs-container").length&&(f.keyboardAction=!1,f.isVideo&&!f.options.alwaysShowControls&&f.hideControls(!0))}}),setTimeout(function(){f.setPlayerSize(f.width,f.height),f.setControlsSize()},50),f.globalBind("resize",function(){f.isFullScreen||mejs.MediaFeatures.hasTrueNativeFullScreen&&document.webkitIsFullScreen||f.setPlayerSize(f.width,f.height),f.setControlsSize()}),"youtube"==f.media.pluginType&&(g.isiOS||g.isAndroid)&&(f.container.find(".mejs-overlay-play").hide(),f.container.find(".mejs-poster").hide())}i&&"native"==b.pluginType&&f.play(),f.options.success&&("string"==typeof f.options.success?window[f.options.success](f.media,f.domNode,f):f.options.success(f.media,f.domNode,f))}},handleError:function(a){var b=this;b.controls&&b.controls.hide(),b.options.error&&b.options.error(a)},setPlayerSize:function(a,b){var c=this;if(!c.options.setDimensions)return!1;switch("undefined"!=typeof a&&(c.width=a),"undefined"!=typeof b&&(c.height=b),c.options.stretching){case"fill":c.isVideo?this.setFillMode():this.setDimensions(c.width,c.height);break;case"responsive":this.setResponsiveMode();break;case"none":this.setDimensions(c.width,c.height);break;default:this.hasFluidMode()===!0?this.setResponsiveMode():this.setDimensions(c.width,c.height)}},hasFluidMode:function(){var a=this;return a.height.toString().indexOf("%")>0||"none"!==a.$node.css("max-width")&&"t.width"!==a.$node.css("max-width")||a.$node[0].currentStyle&&"100%"===a.$node[0].currentStyle.maxWidth},setResponsiveMode:function(){var b=this,c=function(){return b.isVideo?b.media.videoWidth&&b.media.videoWidth>0?b.media.videoWidth:null!==b.media.getAttribute("width")?b.media.getAttribute("width"):b.options.defaultVideoWidth:b.options.defaultAudioWidth}(),d=function(){return b.isVideo?b.media.videoHeight&&b.media.videoHeight>0?b.media.videoHeight:null!==b.media.getAttribute("height")?b.media.getAttribute("height"):b.options.defaultVideoHeight:b.options.defaultAudioHeight}(),e=b.container.parent().closest(":visible").width(),f=b.container.parent().closest(":visible").height(),g=b.isVideo||!b.options.autosizeProgress?parseInt(e*d/c,10):d;(isNaN(g)||0!==f&&g>f&&f>d)&&(g=f),b.container.parent().length>0&&"body"===b.container.parent()[0].tagName.toLowerCase()&&(e=a(window).width(),g=a(window).height()),g&&e&&(b.container.width(e).height(g),b.$media.add(b.container.find(".mejs-shim")).width("100%").height("100%"),b.isVideo&&b.media.setVideoSize&&b.media.setVideoSize(e,g),b.layers.children(".mejs-layer").width("100%").height("100%"))},setFillMode:function(){var a=this,b=a.outerContainer;b.width()||b.height(a.$media.width()),b.height()||b.height(a.$media.height());var c=b.width(),d=b.height();a.setDimensions("100%","100%"),a.container.find(".mejs-poster img").css("display","block"),targetElement=a.container.find("object, embed, iframe, video");var e=a.height,f=a.width,g=c,h=e*c/f,i=f*d/e,j=d,k=!(i>c),l=k?Math.floor(g):Math.floor(i),m=k?Math.floor(h):Math.floor(j);k?(targetElement.height(m).width(c),a.media.setVideoSize&&a.media.setVideoSize(c,m)):(targetElement.height(d).width(l),a.media.setVideoSize&&a.media.setVideoSize(l,d)),targetElement.css({"margin-left":Math.floor((c-l)/2),"margin-top":0})},setDimensions:function(a,b){var c=this;c.container.width(a).height(b),c.layers.children(".mejs-layer").width(a).height(b)},setControlsSize:function(){var b=this,c=0,d=0,e=b.controls.find(".mejs-time-rail"),f=b.controls.find(".mejs-time-total"),g=e.siblings(),h=g.last(),i=null,j=b.options&&!b.options.autosizeProgress;if(b.container.is(":visible")&&e.length&&e.is(":visible")){j&&(d=parseInt(e.css("width"),10)),0!==d&&d||(g.each(function(){var b=a(this);"absolute"!=b.css("position")&&b.is(":visible")&&(c+=a(this).outerWidth(!0))}),d=b.controls.width()-c-(e.outerWidth(!0)-e.width()));do j||e.width(d),f.width(d-(f.outerWidth(!0)-f.width())),"absolute"!=h.css("position")&&(i=h.length?h.position():null,d--);while(null!==i&&i.top.toFixed(2)>0&&d>0);b.container.trigger("controlsresize")}},buildposter:function(b,c,d,e){var f=this,g=a('<div class="mejs-poster mejs-layer"></div>').appendTo(d),h=b.$media.attr("poster");""!==b.options.poster&&(h=b.options.poster),h?f.setPoster(h):g.hide(),e.addEventListener("play",function(){g.hide()},!1),b.options.showPosterWhenEnded&&b.options.autoRewind&&e.addEventListener("ended",function(){g.show()},!1)},setPoster:function(b){var c=this,d=c.container.find(".mejs-poster"),e=d.find("img");0===e.length&&(e=a('<img width="100%" height="100%" alt="" />').appendTo(d)),e.attr("src",b),d.css({"background-image":"url("+b+")"})},buildoverlays:function(b,c,d,e){var f=this;if(b.isVideo){var g=a('<div class="mejs-overlay mejs-layer"><div class="mejs-overlay-loading"><span></span></div></div>').hide().appendTo(d),h=a('<div class="mejs-overlay mejs-layer"><div class="mejs-overlay-error"></div></div>').hide().appendTo(d),i=a('<div class="mejs-overlay mejs-layer mejs-overlay-play"><div class="mejs-overlay-button" role="button" aria-label="'+mejs.i18n.t("mejs.play")+'" aria-pressed="false"></div></div>').appendTo(d).bind("click",function(){if(f.options.clickToPlayPause){e.paused&&e.play();var b=a(this).find(".mejs-overlay-button"),c=b.attr("aria-pressed");b.attr("aria-pressed",!!c)}});e.addEventListener("play",function(){i.hide(),g.hide(),c.find(".mejs-time-buffering").hide(),h.hide()},!1),e.addEventListener("playing",function(){i.hide(),g.hide(),c.find(".mejs-time-buffering").hide(),h.hide()},!1),e.addEventListener("seeking",function(){g.show(),c.find(".mejs-time-buffering").show()},!1),e.addEventListener("seeked",function(){g.hide(),c.find(".mejs-time-buffering").hide()},!1),e.addEventListener("pause",function(){mejs.MediaFeatures.isiPhone||i.show()},!1),e.addEventListener("waiting",function(){g.show(),c.find(".mejs-time-buffering").show()},!1),e.addEventListener("loadeddata",function(){g.show(),c.find(".mejs-time-buffering").show(),mejs.MediaFeatures.isAndroid&&(e.canplayTimeout=window.setTimeout(function(){if(document.createEvent){var a=document.createEvent("HTMLEvents");return a.initEvent("canplay",!0,!0),e.dispatchEvent(a)}},300))},!1),e.addEventListener("canplay",function(){g.hide(),c.find(".mejs-time-buffering").hide(),clearTimeout(e.canplayTimeout)},!1),e.addEventListener("error",function(a){f.handleError(a),g.hide(),i.hide(),h.show(),h.find(".mejs-overlay-error").html("Error loading this resource")},!1),e.addEventListener("keydown",function(a){f.onkeydown(b,e,a)},!1)}},buildkeyboard:function(b,c,d,e){var f=this;f.container.keydown(function(){f.keyboardAction=!0}),f.globalBind("keydown",function(c){return b.hasFocus=0!==a(c.target).closest(".mejs-container").length&&a(c.target).closest(".mejs-container").attr("id")===b.$media.closest(".mejs-container").attr("id"),f.onkeydown(b,e,c)}),f.globalBind("click",function(c){b.hasFocus=0!==a(c.target).closest(".mejs-container").length})},onkeydown:function(a,b,c){if(a.hasFocus&&a.options.enableKeyboard)for(var d=0,e=a.options.keyActions.length;e>d;d++)for(var f=a.options.keyActions[d],g=0,h=f.keys.length;h>g;g++)if(c.keyCode==f.keys[g])return"function"==typeof c.preventDefault&&c.preventDefault(),f.action(a,b,c.keyCode,c),!1;return!0},findTracks:function(){var b=this,c=b.$media.find("track");b.tracks=[],c.each(function(c,d){d=a(d),b.tracks.push({srclang:d.attr("srclang")?d.attr("srclang").toLowerCase():"",src:d.attr("src"),kind:d.attr("kind"),label:d.attr("label")||"",entries:[],isLoaded:!1})})},changeSkin:function(a){this.container[0].className="mejs-container "+a,this.setPlayerSize(this.width,this.height),this.setControlsSize()},play:function(){this.load(),this.media.play()},pause:function(){try{this.media.pause()}catch(a){}},load:function(){this.isLoaded||this.media.load(),this.isLoaded=!0},setMuted:function(a){this.media.setMuted(a)},setCurrentTime:function(a){this.media.setCurrentTime(a)},getCurrentTime:function(){return this.media.currentTime},setVolume:function(a){this.media.setVolume(a)},getVolume:function(){return this.media.volume},setSrc:function(a){var b=this;if("youtube"===b.media.pluginType){var c;if("string"!=typeof a){var d,e;for(d=0;d<a.length;d++)if(e=a[d],this.canPlayType(e.type)){a=e.src;break}}if(-1!==a.lastIndexOf("youtu.be"))c=a.substr(a.lastIndexOf("/")+1),-1!==c.indexOf("?")&&(c=c.substr(0,c.indexOf("?")));else{var f=a.match(/[?&]v=([^&#]+)|&|#|$/);f&&(c=f[1])}null!==b.media.getAttribute("autoplay")?b.media.pluginApi.loadVideoById(c):b.media.pluginApi.cueVideoById(c)}else b.media.setSrc(a)},remove:function(){var a,b,c=this;c.container.prev(".mejs-offscreen").remove();for(a in c.options.features)if(b=c.options.features[a],c["clean"+b])try{c["clean"+b](c)}catch(d){}c.isDynamic?c.$node.insertBefore(c.container):(c.$media.prop("controls",!0),c.$node.clone().insertBefore(c.container).show(),c.$node.remove()),"native"!==c.media.pluginType&&c.media.remove(),delete mejs.players[c.id],"object"==typeof c.container&&c.container.remove(),c.globalUnbind(),delete c.node.player},rebuildtracks:function(){var a=this;a.findTracks(),a.buildtracks(a,a.controls,a.layers,a.media)},resetSize:function(){var a=this;setTimeout(function(){a.setPlayerSize(a.width,a.height),a.setControlsSize()},50)}},function(){function b(b,d){var e={d:[],w:[]};return a.each((b||"").split(" "),function(a,b){var f=b+"."+d;0===f.indexOf(".")?(e.d.push(f),e.w.push(f)):e[c.test(b)?"w":"d"].push(f)}),e.d=e.d.join(" "),e.w=e.w.join(" "),e}var c=/^((after|before)print|(before)?unload|hashchange|message|o(ff|n)line|page(hide|show)|popstate|resize|storage)\b/;mejs.MediaElementPlayer.prototype.globalBind=function(c,d,e){var f=this,g=f.node?f.node.ownerDocument:document;c=b(c,f.id),c.d&&a(g).bind(c.d,d,e),c.w&&a(window).bind(c.w,d,e)},mejs.MediaElementPlayer.prototype.globalUnbind=function(c,d){var e=this,f=e.node?e.node.ownerDocument:document;c=b(c,e.id),c.d&&a(f).unbind(c.d,d),c.w&&a(window).unbind(c.w,d)}}(),"undefined"!=typeof a&&(a.fn.mediaelementplayer=function(b){return b===!1?this.each(function(){var b=a(this).data("mediaelementplayer");b&&b.remove(),a(this).removeData("mediaelementplayer")}):this.each(function(){a(this).data("mediaelementplayer",new mejs.MediaElementPlayer(this,b))}),this},a(document).ready(function(){a(".mejs-player").mediaelementplayer()})),window.MediaElementPlayer=mejs.MediaElementPlayer}(mejs.$),function(a){a.extend(mejs.MepDefaults,{playText:"",pauseText:""}),a.extend(MediaElementPlayer.prototype,{buildplaypause:function(b,c,d,e){function f(a){"play"===a?(k.removeClass("mejs-play").addClass("mejs-pause"),l.attr({title:j,"aria-label":j})):(k.removeClass("mejs-pause").addClass("mejs-play"),l.attr({title:i,"aria-label":i}))}var g=this,h=g.options,i=h.playText?h.playText:mejs.i18n.t("mejs.play"),j=h.pauseText?h.pauseText:mejs.i18n.t("mejs.pause"),k=a('<div class="mejs-button mejs-playpause-button mejs-play" ><button type="button" aria-controls="'+g.id+'" title="'+i+'" aria-label="'+j+'"></button></div>').appendTo(c).click(function(a){return a.preventDefault(),e.paused?e.play():e.pause(),!1}),l=k.find("button");f("pse"),e.addEventListener("play",function(){f("play")},!1),e.addEventListener("playing",function(){f("play")},!1),e.addEventListener("pause",function(){f("pse")},!1),e.addEventListener("paused",function(){f("pse")},!1)}})}(mejs.$),function(a){a.extend(mejs.MepDefaults,{stopText:"Stop"}),a.extend(MediaElementPlayer.prototype,{buildstop:function(b,c,d,e){var f=this;a('<div class="mejs-button mejs-stop-button mejs-stop"><button type="button" aria-controls="'+f.id+'" title="'+f.options.stopText+'" aria-label="'+f.options.stopText+'"></button></div>').appendTo(c).click(function(){e.paused||e.pause(),e.currentTime>0&&(e.setCurrentTime(0),e.pause(),c.find(".mejs-time-current").width("0px"),c.find(".mejs-time-handle").css("left","0px"),c.find(".mejs-time-float-current").html(mejs.Utility.secondsToTimeCode(0,b.options)),c.find(".mejs-currenttime").html(mejs.Utility.secondsToTimeCode(0,b.options)),d.find(".mejs-poster").show())})}})}(mejs.$),function(a){a.extend(mejs.MepDefaults,{enableProgressTooltip:!0,progressHelpText:""}),a.extend(MediaElementPlayer.prototype,{buildprogress:function(b,c,d,e){var f=this,g=!1,h=!1,i=0,j=!1,k=b.options.autoRewind,l=(f.options.progressHelpText?f.options.progressHelpText:mejs.i18n.t("mejs.time-help-text"),b.options.enableProgressTooltip?'<span class="mejs-time-float"><span class="mejs-time-float-current">00:00</span><span class="mejs-time-float-corner"></span></span>':"");a('<div class="mejs-time-rail"><span  class="mejs-time-total mejs-time-slider"><span class="mejs-time-buffering"></span><span class="mejs-time-loaded"></span><span class="mejs-time-current"></span><span class="mejs-time-handle"></span>'+l+"</span></div>").appendTo(c),c.find(".mejs-time-buffering").hide(),f.total=c.find(".mejs-time-total"),f.loaded=c.find(".mejs-time-loaded"),f.current=c.find(".mejs-time-current"),f.handle=c.find(".mejs-time-handle"),f.timefloat=c.find(".mejs-time-float"),f.timefloatcurrent=c.find(".mejs-time-float-current"),f.slider=c.find(".mejs-time-slider");var m=function(a){var c,d=f.total.offset(),h=f.total.width(),i=0,j=0,k=0;c=a.originalEvent&&a.originalEvent.changedTouches?a.originalEvent.changedTouches[0].pageX:a.changedTouches?a.changedTouches[0].pageX:a.pageX,e.duration&&(c<d.left?c=d.left:c>h+d.left&&(c=h+d.left),k=c-d.left,i=k/h,j=.02>=i?0:i*e.duration,g&&j!==e.currentTime&&e.setCurrentTime(j),mejs.MediaFeatures.hasTouch||(f.timefloat.css("left",k),f.timefloatcurrent.html(mejs.Utility.secondsToTimeCode(j,b.options)),f.timefloat.show()))},n=function(a){var c=e.currentTime,d=mejs.i18n.t("mejs.time-slider"),g=mejs.Utility.secondsToTimeCode(c,b.options),h=e.duration;f.slider.attr({"aria-label":d,"aria-valuemin":0,"aria-valuemax":h,"aria-valuenow":c,"aria-valuetext":g,role:"slider",tabindex:0})},o=function(){var a=new Date;a-i>=1e3&&e.play()};f.slider.bind("focus",function(a){b.options.autoRewind=!1}),f.slider.bind("blur",function(a){b.options.autoRewind=k}),f.slider.bind("keydown",function(a){new Date-i>=1e3&&(j=e.paused);var c=a.keyCode,d=e.duration,f=e.currentTime,g=b.options.defaultSeekForwardInterval(e),h=b.options.defaultSeekBackwardInterval(e);switch(c){case 37:case 40:f-=h;break;case 39:case 38:f+=g;break;case 36:f=0;break;case 35:f=d;break;case 32:case 13:return void(e.paused?e.play():e.pause());default:return}return f=0>f?0:f>=d?d:Math.floor(f),i=new Date,j||e.pause(),f<e.duration&&!j&&setTimeout(o,1100),e.setCurrentTime(f),a.preventDefault(),a.stopPropagation(),!1}),f.total.bind("mousedown touchstart",function(a){(1===a.which||0===a.which)&&(g=!0,m(a),f.globalBind("mousemove.dur touchmove.dur",function(a){m(a)}),f.globalBind("mouseup.dur touchend.dur",function(a){g=!1,"undefined"!=typeof f.timefloat&&f.timefloat.hide(),f.globalUnbind(".dur")}))}).bind("mouseenter",function(a){h=!0,f.globalBind("mousemove.dur",function(a){m(a)}),"undefined"==typeof f.timefloat||mejs.MediaFeatures.hasTouch||f.timefloat.show()}).bind("mouseleave",function(a){h=!1,g||(f.globalUnbind(".dur"),"undefined"!=typeof f.timefloat&&f.timefloat.hide())}),e.addEventListener("progress",function(a){b.setProgressRail(a),b.setCurrentRail(a)},!1),e.addEventListener("timeupdate",function(a){b.setProgressRail(a),b.setCurrentRail(a),n(a)},!1),f.container.on("controlsresize",function(a){b.setProgressRail(a),b.setCurrentRail(a)})},setProgressRail:function(a){var b=this,c=void 0!==a?a.target:b.media,d=null;c&&c.buffered&&c.buffered.length>0&&c.buffered.end&&c.duration?d=c.buffered.end(c.buffered.length-1)/c.duration:c&&void 0!==c.bytesTotal&&c.bytesTotal>0&&void 0!==c.bufferedBytes?d=c.bufferedBytes/c.bytesTotal:a&&a.lengthComputable&&0!==a.total&&(d=a.loaded/a.total),null!==d&&(d=Math.min(1,Math.max(0,d)),b.loaded&&b.total&&b.loaded.width(b.total.width()*d))},setCurrentRail:function(){var a=this;if(void 0!==a.media.currentTime&&a.media.duration&&a.total&&a.handle){var b=Math.round(a.total.width()*a.media.currentTime/a.media.duration),c=b-Math.round(a.handle.outerWidth(!0)/2);a.current.width(b),a.handle.css("left",c)}}})}(mejs.$),function(a){a.extend(mejs.MepDefaults,{duration:-1,timeAndDurationSeparator:"<span> | </span>"}),a.extend(MediaElementPlayer.prototype,{buildcurrent:function(b,c,d,e){var f=this;a('<div class="mejs-time" role="timer" aria-live="off"><span class="mejs-currenttime">'+mejs.Utility.secondsToTimeCode(0,b.options)+"</span></div>").appendTo(c),f.currenttime=f.controls.find(".mejs-currenttime"),e.addEventListener("timeupdate",function(){f.controlsAreVisible&&b.updateCurrent()},!1)},buildduration:function(b,c,d,e){var f=this;c.children().last().find(".mejs-currenttime").length>0?a(f.options.timeAndDurationSeparator+'<span class="mejs-duration">'+mejs.Utility.secondsToTimeCode(f.options.duration,f.options)+"</span>").appendTo(c.find(".mejs-time")):(c.find(".mejs-currenttime").parent().addClass("mejs-currenttime-container"),a('<div class="mejs-time mejs-duration-container"><span class="mejs-duration">'+mejs.Utility.secondsToTimeCode(f.options.duration,f.options)+"</span></div>").appendTo(c)),f.durationD=f.controls.find(".mejs-duration"),e.addEventListener("timeupdate",function(){f.controlsAreVisible&&b.updateDuration()},!1)},updateCurrent:function(){var a=this,b=a.media.currentTime;isNaN(b)&&(b=0),a.currenttime&&a.currenttime.html(mejs.Utility.secondsToTimeCode(b,a.options))},updateDuration:function(){var a=this,b=a.media.duration;a.options.duration>0&&(b=a.options.duration),isNaN(b)&&(b=0),a.container.toggleClass("mejs-long-video",b>3600),a.durationD&&b>0&&a.durationD.html(mejs.Utility.secondsToTimeCode(b,a.options))}})}(mejs.$),function(a){a.extend(mejs.MepDefaults,{muteText:mejs.i18n.t("mejs.mute-toggle"),allyVolumeControlText:mejs.i18n.t("mejs.volume-help-text"),hideVolumeOnTouchDevices:!0,audioVolume:"horizontal",videoVolume:"vertical"}),a.extend(MediaElementPlayer.prototype,{buildvolume:function(b,c,d,e){if(!mejs.MediaFeatures.isAndroid&&!mejs.MediaFeatures.isiOS||!this.options.hideVolumeOnTouchDevices){var f=this,g=f.isVideo?f.options.videoVolume:f.options.audioVolume,h="horizontal"==g?a('<div class="mejs-button mejs-volume-button mejs-mute"><button type="button" aria-controls="'+f.id+'" title="'+f.options.muteText+'" aria-label="'+f.options.muteText+'"></button></div><a href="javascript:void(0);" class="mejs-horizontal-volume-slider"><span class="mejs-offscreen">'+f.options.allyVolumeControlText+'</span><div class="mejs-horizontal-volume-total"></div><div class="mejs-horizontal-volume-current"></div><div class="mejs-horizontal-volume-handle"></div></a>').appendTo(c):a('<div class="mejs-button mejs-volume-button mejs-mute"><button type="button" aria-controls="'+f.id+'" title="'+f.options.muteText+'" aria-label="'+f.options.muteText+'"></button><a href="javascript:void(0);" class="mejs-volume-slider"><span class="mejs-offscreen">'+f.options.allyVolumeControlText+'</span><div class="mejs-volume-total"></div><div class="mejs-volume-current"></div><div class="mejs-volume-handle"></div></a></div>').appendTo(c),i=f.container.find(".mejs-volume-slider, .mejs-horizontal-volume-slider"),j=f.container.find(".mejs-volume-total, .mejs-horizontal-volume-total"),k=f.container.find(".mejs-volume-current, .mejs-horizontal-volume-current"),l=f.container.find(".mejs-volume-handle, .mejs-horizontal-volume-handle"),m=function(a,b){if(!i.is(":visible")&&"undefined"==typeof b)return i.show(),m(a,!0),void i.hide();a=Math.max(0,a),a=Math.min(a,1),0===a?(h.removeClass("mejs-mute").addClass("mejs-unmute"),h.children("button").attr("title",mejs.i18n.t("mejs.unmute")).attr("aria-label",mejs.i18n.t("mejs.unmute"))):(h.removeClass("mejs-unmute").addClass("mejs-mute"),h.children("button").attr("title",mejs.i18n.t("mejs.mute")).attr("aria-label",mejs.i18n.t("mejs.mute")));var c=j.position();if("vertical"==g){var d=j.height(),e=d-d*a;l.css("top",Math.round(c.top+e-l.height()/2)),k.height(d-e),k.css("top",c.top+e)}else{var f=j.width(),n=f*a;l.css("left",Math.round(c.left+n-l.width()/2)),k.width(Math.round(n))}},n=function(a){var b=null,c=j.offset();if("vertical"===g){var d=j.height(),f=a.pageY-c.top;if(b=(d-f)/d,0===c.top||0===c.left)return}else{var h=j.width(),i=a.pageX-c.left;b=i/h;
}b=Math.max(0,b),b=Math.min(b,1),m(b),0===b?e.setMuted(!0):e.setMuted(!1),e.setVolume(b)},o=!1,p=!1;h.hover(function(){i.show(),p=!0},function(){p=!1,o||"vertical"!=g||i.hide()});var q=function(a){var b=Math.floor(100*e.volume);i.attr({"aria-label":mejs.i18n.t("mejs.volume-slider"),"aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":b,"aria-valuetext":b+"%",role:"slider",tabindex:0})};i.bind("mouseover",function(){p=!0}).bind("mousedown",function(a){return n(a),f.globalBind("mousemove.vol",function(a){n(a)}),f.globalBind("mouseup.vol",function(){o=!1,f.globalUnbind(".vol"),p||"vertical"!=g||i.hide()}),o=!0,!1}).bind("keydown",function(a){var b=a.keyCode,c=e.volume;switch(b){case 38:c=Math.min(c+.1,1);break;case 40:c=Math.max(0,c-.1);break;default:return!0}return o=!1,m(c),e.setVolume(c),!1}),h.find("button").click(function(){e.setMuted(!e.muted)}),h.find("button").bind("focus",function(){i.show()}),e.addEventListener("volumechange",function(a){o||(e.muted?(m(0),h.removeClass("mejs-mute").addClass("mejs-unmute")):(m(e.volume),h.removeClass("mejs-unmute").addClass("mejs-mute"))),q(a)},!1),0===b.options.startVolume&&e.setMuted(!0),"native"===e.pluginType&&e.setVolume(b.options.startVolume),f.container.on("controlsresize",function(){e.muted?(m(0),h.removeClass("mejs-mute").addClass("mejs-unmute")):(m(e.volume),h.removeClass("mejs-unmute").addClass("mejs-mute"))})}}})}(mejs.$),function(a){a.extend(mejs.MepDefaults,{usePluginFullScreen:!0,newWindowCallback:function(){return""},fullscreenText:""}),a.extend(MediaElementPlayer.prototype,{isFullScreen:!1,isNativeFullScreen:!1,isInIframe:!1,fullscreenMode:"",buildfullscreen:function(b,c,d,e){if(b.isVideo){b.isInIframe=window.location!=window.parent.location,e.addEventListener("loadstart",function(){b.detectFullscreenMode()});var f=this,g=null,h=f.options.fullscreenText?f.options.fullscreenText:mejs.i18n.t("mejs.fullscreen"),i=a('<div class="mejs-button mejs-fullscreen-button"><button type="button" aria-controls="'+f.id+'" title="'+h+'" aria-label="'+h+'"></button></div>').appendTo(c).on("click",function(){var a=mejs.MediaFeatures.hasTrueNativeFullScreen&&mejs.MediaFeatures.isFullScreen()||b.isFullScreen;a?b.exitFullScreen():b.enterFullScreen()}).on("mouseover",function(){if("plugin-hover"==f.fullscreenMode){null!==g&&(clearTimeout(g),delete g);var a=i.offset(),c=b.container.offset();e.positionFullscreenButton(a.left-c.left,a.top-c.top,!0)}}).on("mouseout",function(){"plugin-hover"==f.fullscreenMode&&(null!==g&&(clearTimeout(g),delete g),g=setTimeout(function(){e.hideFullscreenButton()},1500))});if(b.fullscreenBtn=i,f.globalBind("keydown",function(a){27==a.keyCode&&(mejs.MediaFeatures.hasTrueNativeFullScreen&&mejs.MediaFeatures.isFullScreen()||f.isFullScreen)&&b.exitFullScreen()}),f.normalHeight=0,f.normalWidth=0,mejs.MediaFeatures.hasTrueNativeFullScreen){var j=function(a){b.isFullScreen&&(mejs.MediaFeatures.isFullScreen()?(b.isNativeFullScreen=!0,b.setControlsSize()):(b.isNativeFullScreen=!1,b.exitFullScreen()))};b.globalBind(mejs.MediaFeatures.fullScreenEventName,j)}}},detectFullscreenMode:function(){var a=this,b="",c=mejs.MediaFeatures;return c.hasTrueNativeFullScreen&&"native"===a.media.pluginType?b="native-native":c.hasTrueNativeFullScreen&&"native"!==a.media.pluginType&&!c.hasFirefoxPluginMovingProblem?b="plugin-native":a.usePluginFullScreen?mejs.MediaFeatures.supportsPointerEvents?(b="plugin-click",a.createPluginClickThrough()):b="plugin-hover":b="fullwindow",a.fullscreenMode=b,b},isPluginClickThroughCreated:!1,createPluginClickThrough:function(){var b=this;if(!b.isPluginClickThroughCreated){var c,d,e=!1,f=function(){if(e){for(var a in g)g[a].hide();b.fullscreenBtn.css("pointer-events",""),b.controls.css("pointer-events",""),b.media.removeEventListener("click",b.clickToPlayPauseCallback),e=!1}},g={},h=["top","left","right","bottom"],i=function(){var a=fullscreenBtn.offset().left-b.container.offset().left,d=fullscreenBtn.offset().top-b.container.offset().top,e=fullscreenBtn.outerWidth(!0),f=fullscreenBtn.outerHeight(!0),h=b.container.width(),i=b.container.height();for(c in g)g[c].css({position:"absolute",top:0,left:0});g.top.width(h).height(d),g.left.width(a).height(f).css({top:d}),g.right.width(h-a-e).height(f).css({top:d,left:a+e}),g.bottom.width(h).height(i-f-d).css({top:d+f})};for(b.globalBind("resize",function(){i()}),c=0,d=h.length;d>c;c++)g[h[c]]=a('<div class="mejs-fullscreen-hover" />').appendTo(b.container).mouseover(f).hide();fullscreenBtn.on("mouseover",function(){if(!b.isFullScreen){var a=fullscreenBtn.offset(),d=player.container.offset();media.positionFullscreenButton(a.left-d.left,a.top-d.top,!1),b.fullscreenBtn.css("pointer-events","none"),b.controls.css("pointer-events","none"),b.media.addEventListener("click",b.clickToPlayPauseCallback);for(c in g)g[c].show();i(),e=!0}}),media.addEventListener("fullscreenchange",function(a){b.isFullScreen=!b.isFullScreen,b.isFullScreen?b.media.removeEventListener("click",b.clickToPlayPauseCallback):b.media.addEventListener("click",b.clickToPlayPauseCallback),f()}),b.globalBind("mousemove",function(a){if(e){var c=fullscreenBtn.offset();(a.pageY<c.top||a.pageY>c.top+fullscreenBtn.outerHeight(!0)||a.pageX<c.left||a.pageX>c.left+fullscreenBtn.outerWidth(!0))&&(fullscreenBtn.css("pointer-events",""),b.controls.css("pointer-events",""),e=!1)}}),b.isPluginClickThroughCreated=!0}},cleanfullscreen:function(a){a.exitFullScreen()},containerSizeTimeout:null,enterFullScreen:function(){var b=this;return mejs.MediaFeatures.isiOS&&mejs.MediaFeatures.hasiOSFullScreen&&"function"==typeof b.media.webkitEnterFullscreen?void b.media.webkitEnterFullscreen():(a(document.documentElement).addClass("mejs-fullscreen"),b.normalHeight=b.container.height(),b.normalWidth=b.container.width(),"native-native"===b.fullscreenMode||"plugin-native"===b.fullscreenMode?(mejs.MediaFeatures.requestFullScreen(b.container[0]),b.isInIframe&&setTimeout(function c(){if(b.isNativeFullScreen){var d=.002,e=a(window).width(),f=screen.width,g=Math.abs(f-e),h=f*d;g>h?b.exitFullScreen():setTimeout(c,500)}},1e3)):"fullwindow"==b.fullscreeMode,b.container.addClass("mejs-container-fullscreen").width("100%").height("100%"),b.containerSizeTimeout=setTimeout(function(){b.container.css({width:"100%",height:"100%"}),b.setControlsSize()},500),"native"===b.media.pluginType?b.$media.width("100%").height("100%"):(b.container.find(".mejs-shim").width("100%").height("100%"),setTimeout(function(){var c=a(window),d=c.width(),e=c.height();b.media.setVideoSize(d,e)},500)),b.layers.children("div").width("100%").height("100%"),b.fullscreenBtn&&b.fullscreenBtn.removeClass("mejs-fullscreen").addClass("mejs-unfullscreen"),b.setControlsSize(),b.isFullScreen=!0,b.container.find(".mejs-captions-text").css("font-size",screen.width/b.width*1*100+"%"),b.container.find(".mejs-captions-position").css("bottom","45px"),void b.container.trigger("enteredfullscreen"))},exitFullScreen:function(){var b=this;clearTimeout(b.containerSizeTimeout),mejs.MediaFeatures.hasTrueNativeFullScreen&&(mejs.MediaFeatures.isFullScreen()||b.isFullScreen)&&mejs.MediaFeatures.cancelFullScreen(),a(document.documentElement).removeClass("mejs-fullscreen"),b.container.removeClass("mejs-container-fullscreen").width(b.normalWidth).height(b.normalHeight),"native"===b.media.pluginType?b.$media.width(b.normalWidth).height(b.normalHeight):(b.container.find(".mejs-shim").width(b.normalWidth).height(b.normalHeight),b.media.setVideoSize(b.normalWidth,b.normalHeight)),b.layers.children("div").width(b.normalWidth).height(b.normalHeight),b.fullscreenBtn.removeClass("mejs-unfullscreen").addClass("mejs-fullscreen"),b.setControlsSize(),b.isFullScreen=!1,b.container.find(".mejs-captions-text").css("font-size",""),b.container.find(".mejs-captions-position").css("bottom",""),b.container.trigger("exitedfullscreen")}})}(mejs.$),function(a){a.extend(mejs.MepDefaults,{speeds:["2.00","1.50","1.25","1.00","0.75"],defaultSpeed:"1.00",speedChar:"x"}),a.extend(MediaElementPlayer.prototype,{buildspeed:function(b,c,d,e){var f=this;if("native"==f.media.pluginType){for(var g=null,h=null,i=null,j=null,k=[],l=!1,m=0,n=f.options.speeds.length;n>m;m++){var o=f.options.speeds[m];"string"==typeof o?(k.push({name:o+f.options.speedChar,value:o}),o===f.options.defaultSpeed&&(l=!0)):(k.push(o),o.value===f.options.defaultSpeed&&(l=!0))}l||k.push({name:f.options.defaultSpeed+f.options.speedChar,value:f.options.defaultSpeed}),k.sort(function(a,b){return parseFloat(b.value)-parseFloat(a.value)});var p=function(a){for(m=0,n=k.length;n>m;m++)if(k[m].value===a)return k[m].name},q='<div class="mejs-button mejs-speed-button"><button type="button">'+p(f.options.defaultSpeed)+'</button><div class="mejs-speed-selector"><ul>';for(m=0,il=k.length;m<il;m++)j=f.id+"-speed-"+k[m].value,q+='<li><input type="radio" name="speed" value="'+k[m].value+'" id="'+j+'" '+(k[m].value===f.options.defaultSpeed?" checked":"")+' /><label for="'+j+'" '+(k[m].value===f.options.defaultSpeed?' class="mejs-speed-selected"':"")+">"+k[m].name+"</label></li>";q+="</ul></div></div>",g=a(q).appendTo(c),h=g.find(".mejs-speed-selector"),i=f.options.defaultSpeed,e.addEventListener("loadedmetadata",function(a){i&&(e.playbackRate=parseFloat(i))},!0),h.on("click",'input[type="radio"]',function(){var b=a(this).attr("value");i=b,e.playbackRate=parseFloat(b),g.find("button").html(p(b)),g.find(".mejs-speed-selected").removeClass("mejs-speed-selected"),g.find('input[type="radio"]:checked').next().addClass("mejs-speed-selected")}),g.one("mouseenter focusin",function(){h.height(g.find(".mejs-speed-selector ul").outerHeight(!0)+g.find(".mejs-speed-translations").outerHeight(!0)).css("top",-1*h.height()+"px")})}}})}(mejs.$),function(a){a.extend(mejs.MepDefaults,{startLanguage:"",tracksText:"",tracksAriaLive:!1,hideCaptionsButtonWhenEmpty:!0,toggleCaptionsButtonWhenOnlyOne:!1,slidesSelector:""}),a.extend(MediaElementPlayer.prototype,{hasChapters:!1,cleartracks:function(a,b,c,d){a&&(a.captions&&a.captions.remove(),a.chapters&&a.chapters.remove(),a.captionsText&&a.captionsText.remove(),a.captionsButton&&a.captionsButton.remove())},buildtracks:function(b,c,d,e){if(0!==b.tracks.length){var f,g,h=this,i=h.options.tracksAriaLive?'role="log" aria-live="assertive" aria-atomic="false"':"",j=h.options.tracksText?h.options.tracksText:mejs.i18n.t("mejs.captions-subtitles");if(h.domNode.textTracks)for(f=h.domNode.textTracks.length-1;f>=0;f--)h.domNode.textTracks[f].mode="hidden";h.cleartracks(b,c,d,e),b.chapters=a('<div class="mejs-chapters mejs-layer"></div>').prependTo(d).hide(),b.captions=a('<div class="mejs-captions-layer mejs-layer"><div class="mejs-captions-position mejs-captions-position-hover" '+i+'><span class="mejs-captions-text"></span></div></div>').prependTo(d).hide(),b.captionsText=b.captions.find(".mejs-captions-text"),b.captionsButton=a('<div class="mejs-button mejs-captions-button"><button type="button" aria-controls="'+h.id+'" title="'+j+'" aria-label="'+j+'"></button><div class="mejs-captions-selector"><ul><li><input type="radio" name="'+b.id+'_captions" id="'+b.id+'_captions_none" value="none" checked="checked" /><label for="'+b.id+'_captions_none">'+mejs.i18n.t("mejs.none")+"</label></li></ul></div></div>").appendTo(c);var k=0;for(f=0;f<b.tracks.length;f++)g=b.tracks[f].kind,("subtitles"===g||"captions"===g)&&k++;for(h.options.toggleCaptionsButtonWhenOnlyOne&&1==k?b.captionsButton.on("click",function(){null===b.selectedTrack?lang=b.tracks[0].srclang:lang="none",b.setTrack(lang)}):(b.captionsButton.on("mouseenter focusin",function(){a(this).find(".mejs-captions-selector").removeClass("mejs-offscreen")}).on("click","input[type=radio]",function(){lang=this.value,b.setTrack(lang)}),b.captionsButton.on("mouseleave focusout",function(){a(this).find(".mejs-captions-selector").addClass("mejs-offscreen")})),b.options.alwaysShowControls?b.container.find(".mejs-captions-position").addClass("mejs-captions-position-hover"):b.container.bind("controlsshown",function(){b.container.find(".mejs-captions-position").addClass("mejs-captions-position-hover")}).bind("controlshidden",function(){e.paused||b.container.find(".mejs-captions-position").removeClass("mejs-captions-position-hover")}),b.trackToLoad=-1,b.selectedTrack=null,b.isLoadingTrack=!1,f=0;f<b.tracks.length;f++)g=b.tracks[f].kind,("subtitles"===g||"captions"===g)&&b.addTrackButton(b.tracks[f].srclang,b.tracks[f].label);b.loadNextTrack(),e.addEventListener("timeupdate",function(){b.displayCaptions()},!1),""!==b.options.slidesSelector&&(b.slidesContainer=a(b.options.slidesSelector),e.addEventListener("timeupdate",function(){b.displaySlides()},!1)),e.addEventListener("loadedmetadata",function(){b.displayChapters()},!1),b.container.hover(function(){b.hasChapters&&(b.chapters.removeClass("mejs-offscreen"),b.chapters.fadeIn(200).height(b.chapters.find(".mejs-chapter").outerHeight()))},function(){b.hasChapters&&!e.paused&&b.chapters.fadeOut(200,function(){a(this).addClass("mejs-offscreen"),a(this).css("display","block")})}),h.container.on("controlsresize",function(){h.adjustLanguageBox()}),null!==b.node.getAttribute("autoplay")&&b.chapters.addClass("mejs-offscreen")}},setTrack:function(a){var b,c=this;if("none"==a)c.selectedTrack=null,c.captionsButton.removeClass("mejs-captions-enabled");else for(b=0;b<c.tracks.length;b++)if(c.tracks[b].srclang==a){null===c.selectedTrack&&c.captionsButton.addClass("mejs-captions-enabled"),c.selectedTrack=c.tracks[b],c.captions.attr("lang",c.selectedTrack.srclang),c.displayCaptions();break}},loadNextTrack:function(){var a=this;a.trackToLoad++,a.trackToLoad<a.tracks.length?(a.isLoadingTrack=!0,a.loadTrack(a.trackToLoad)):(a.isLoadingTrack=!1,a.checkForTracks())},loadTrack:function(b){var c=this,d=c.tracks[b],e=function(){d.isLoaded=!0,c.enableTrackButton(d.srclang,d.label),c.loadNextTrack()};a.ajax({url:d.src,dataType:"text",success:function(a){"string"==typeof a&&/<tt\s+xml/gi.exec(a)?d.entries=mejs.TrackFormatParser.dfxp.parse(a):d.entries=mejs.TrackFormatParser.webvtt.parse(a),e(),"chapters"==d.kind&&c.media.addEventListener("play",function(){c.media.duration>0&&c.displayChapters(d)},!1),"slides"==d.kind&&c.setupSlides(d)},error:function(){c.removeTrackButton(d.srclang),c.loadNextTrack()}})},enableTrackButton:function(b,c){var d=this;""===c&&(c=mejs.language.codes[b]||b),d.captionsButton.find("input[value="+b+"]").prop("disabled",!1).siblings("label").html(c),d.options.startLanguage==b&&a("#"+d.id+"_captions_"+b).prop("checked",!0).trigger("click"),d.adjustLanguageBox()},removeTrackButton:function(a){var b=this;b.captionsButton.find("input[value="+a+"]").closest("li").remove(),b.adjustLanguageBox()},addTrackButton:function(b,c){var d=this;""===c&&(c=mejs.language.codes[b]||b),d.captionsButton.find("ul").append(a('<li><input type="radio" name="'+d.id+'_captions" id="'+d.id+"_captions_"+b+'" value="'+b+'" disabled="disabled" /><label for="'+d.id+"_captions_"+b+'">'+c+" (loading)</label></li>")),d.adjustLanguageBox(),d.container.find(".mejs-captions-translations option[value="+b+"]").remove()},adjustLanguageBox:function(){var a=this;a.captionsButton.find(".mejs-captions-selector").height(a.captionsButton.find(".mejs-captions-selector ul").outerHeight(!0)+a.captionsButton.find(".mejs-captions-translations").outerHeight(!0))},checkForTracks:function(){var a=this,b=!1;if(a.options.hideCaptionsButtonWhenEmpty){for(var c=0;c<a.tracks.length;c++){var d=a.tracks[c].kind;if(("subtitles"===d||"captions"===d)&&a.tracks[c].isLoaded){b=!0;break}}b||(a.captionsButton.hide(),a.setControlsSize())}},displayCaptions:function(){if("undefined"!=typeof this.tracks){var a,b=this,c=b.selectedTrack;if(null!==c&&c.isLoaded){for(a=0;a<c.entries.times.length;a++)if(b.media.currentTime>=c.entries.times[a].start&&b.media.currentTime<=c.entries.times[a].stop)return b.captionsText.html(c.entries.text[a]).attr("class","mejs-captions-text "+(c.entries.times[a].identifier||"")),void b.captions.show().height(0);b.captions.hide()}else b.captions.hide()}},setupSlides:function(a){var b=this;b.slides=a,b.slides.entries.imgs=[b.slides.entries.text.length],b.showSlide(0)},showSlide:function(b){if("undefined"!=typeof this.tracks&&"undefined"!=typeof this.slidesContainer){var c=this,d=c.slides.entries.text[b],e=c.slides.entries.imgs[b];"undefined"==typeof e||"undefined"==typeof e.fadeIn?c.slides.entries.imgs[b]=e=a('<img src="'+d+'">').on("load",function(){e.appendTo(c.slidesContainer).hide().fadeIn().siblings(":visible").fadeOut()}):e.is(":visible")||e.is(":animated")||e.fadeIn().siblings(":visible").fadeOut()}},displaySlides:function(){if("undefined"!=typeof this.slides){var a,b=this,c=b.slides;for(a=0;a<c.entries.times.length;a++)if(b.media.currentTime>=c.entries.times[a].start&&b.media.currentTime<=c.entries.times[a].stop)return void b.showSlide(a)}},displayChapters:function(){var a,b=this;for(a=0;a<b.tracks.length;a++)if("chapters"==b.tracks[a].kind&&b.tracks[a].isLoaded){b.drawChapters(b.tracks[a]),b.hasChapters=!0;break}},drawChapters:function(b){var c,d,e=this,f=0,g=0;for(e.chapters.empty(),c=0;c<b.entries.times.length;c++)d=b.entries.times[c].stop-b.entries.times[c].start,f=Math.floor(d/e.media.duration*100),(f+g>100||c==b.entries.times.length-1&&100>f+g)&&(f=100-g),e.chapters.append(a('<div class="mejs-chapter" rel="'+b.entries.times[c].start+'" style="left: '+g.toString()+"%;width: "+f.toString()+'%;"><div class="mejs-chapter-block'+(c==b.entries.times.length-1?" mejs-chapter-block-last":"")+'"><span class="ch-title">'+b.entries.text[c]+'</span><span class="ch-time">'+mejs.Utility.secondsToTimeCode(b.entries.times[c].start,e.options)+"&ndash;"+mejs.Utility.secondsToTimeCode(b.entries.times[c].stop,e.options)+"</span></div></div>")),g+=f;e.chapters.find("div.mejs-chapter").click(function(){e.media.setCurrentTime(parseFloat(a(this).attr("rel"))),e.media.paused&&e.media.play()}),e.chapters.show()}}),mejs.language={codes:{af:"Afrikaans",sq:"Albanian",ar:"Arabic",be:"Belarusian",bg:"Bulgarian",ca:"Catalan",zh:"Chinese","zh-cn":"Chinese Simplified","zh-tw":"Chinese Traditional",hr:"Croatian",cs:"Czech",da:"Danish",nl:"Dutch",en:"English",et:"Estonian",fl:"Filipino",fi:"Finnish",fr:"French",gl:"Galician",de:"German",el:"Greek",ht:"Haitian Creole",iw:"Hebrew",hi:"Hindi",hu:"Hungarian",is:"Icelandic",id:"Indonesian",ga:"Irish",it:"Italian",ja:"Japanese",ko:"Korean",lv:"Latvian",lt:"Lithuanian",mk:"Macedonian",ms:"Malay",mt:"Maltese",no:"Norwegian",fa:"Persian",pl:"Polish",pt:"Portuguese",ro:"Romanian",ru:"Russian",sr:"Serbian",sk:"Slovak",sl:"Slovenian",es:"Spanish",sw:"Swahili",sv:"Swedish",tl:"Tagalog",th:"Thai",tr:"Turkish",uk:"Ukrainian",vi:"Vietnamese",cy:"Welsh",yi:"Yiddish"}},mejs.TrackFormatParser={webvtt:{pattern_timecode:/^((?:[0-9]{1,2}:)?[0-9]{2}:[0-9]{2}([,.][0-9]{1,3})?) --\> ((?:[0-9]{1,2}:)?[0-9]{2}:[0-9]{2}([,.][0-9]{3})?)(.*)$/,parse:function(b){for(var c,d,e,f=0,g=mejs.TrackFormatParser.split2(b,/\r?\n/),h={text:[],times:[]};f<g.length;f++){if(c=this.pattern_timecode.exec(g[f]),c&&f<g.length){for(f-1>=0&&""!==g[f-1]&&(e=g[f-1]),f++,d=g[f],f++;""!==g[f]&&f<g.length;)d=d+"\n"+g[f],f++;d=a.trim(d).replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi,"<a href='$1' target='_blank'>$1</a>"),h.text.push(d),h.times.push({identifier:e,start:0===mejs.Utility.convertSMPTEtoSeconds(c[1])?.2:mejs.Utility.convertSMPTEtoSeconds(c[1]),stop:mejs.Utility.convertSMPTEtoSeconds(c[3]),settings:c[5]})}e=""}return h}},dfxp:{parse:function(b){b=a(b).filter("tt");var c,d,e=0,f=b.children("div").eq(0),g=f.find("p"),h=b.find("#"+f.attr("style")),i={text:[],times:[]};if(h.length){var j=h.removeAttr("id").get(0).attributes;if(j.length)for(c={},e=0;e<j.length;e++)c[j[e].name.split(":")[1]]=j[e].value}for(e=0;e<g.length;e++){var k,l={start:null,stop:null,style:null};if(g.eq(e).attr("begin")&&(l.start=mejs.Utility.convertSMPTEtoSeconds(g.eq(e).attr("begin"))),!l.start&&g.eq(e-1).attr("end")&&(l.start=mejs.Utility.convertSMPTEtoSeconds(g.eq(e-1).attr("end"))),g.eq(e).attr("end")&&(l.stop=mejs.Utility.convertSMPTEtoSeconds(g.eq(e).attr("end"))),!l.stop&&g.eq(e+1).attr("begin")&&(l.stop=mejs.Utility.convertSMPTEtoSeconds(g.eq(e+1).attr("begin"))),c){k="";for(var m in c)k+=m+":"+c[m]+";"}k&&(l.style=k),0===l.start&&(l.start=.2),i.times.push(l),d=a.trim(g.eq(e).html()).replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi,"<a href='$1' target='_blank'>$1</a>"),i.text.push(d)}return i}},split2:function(a,b){return a.split(b)}},3!="x\n\ny".split(/\n/gi).length&&(mejs.TrackFormatParser.split2=function(a,b){var c,d=[],e="";for(c=0;c<a.length;c++)e+=a.substring(c,c+1),b.test(e)&&(d.push(e.replace(b,"")),e="");return d.push(e),d})}(mejs.$),function(a){a.extend(mejs.MepDefaults,{sourcechooserText:""}),a.extend(MediaElementPlayer.prototype,{buildsourcechooser:function(b,c,d,e){var f,g=this,h=g.options.sourcechooserText?g.options.sourcechooserText:mejs.i18n.t("mejs.source-chooser");b.sourcechooserButton=a('<div class="mejs-button mejs-sourcechooser-button"><button type="button" role="button" aria-haspopup="true" aria-owns="'+g.id+'" title="'+h+'" aria-label="'+h+'"></button><div class="mejs-sourcechooser-selector mejs-offscreen" role="menu" aria-expanded="false" aria-hidden="true"><ul></ul></div></div>').appendTo(c).hover(function(){clearTimeout(f),b.showSourcechooserSelector()},function(){a(this);f=setTimeout(function(){b.hideSourcechooserSelector()},500)}).on("keydown",function(c){var d=c.keyCode;switch(d){case 32:mejs.MediaFeatures.isFirefox||b.showSourcechooserSelector(),a(this).find(".mejs-sourcechooser-selector").find("input[type=radio]:checked").first().focus();break;case 13:b.showSourcechooserSelector(),a(this).find(".mejs-sourcechooser-selector").find("input[type=radio]:checked").first().focus();break;case 27:b.hideSourcechooserSelector(),a(this).find("button").focus();break;default:return!0}}).on("focusout",mejs.Utility.debounce(function(c){setTimeout(function(){var c=a(document.activeElement).closest(".mejs-sourcechooser-selector");c.length||b.hideSourcechooserSelector()},0)},100)).delegate("input[type=radio]","click",function(){a(this).attr("aria-selected",!0).attr("checked","checked"),a(this).closest(".mejs-sourcechooser-selector").find("input[type=radio]").not(this).attr("aria-selected","false").removeAttr("checked");var b=this.value;if(e.currentSrc!=b){var c=e.currentTime,d=e.paused;e.pause(),e.setSrc(b),e.addEventListener("loadedmetadata",function(a){e.currentTime=c},!0);var f=function(a){d||e.play(),e.removeEventListener("canplay",f,!0)};e.addEventListener("canplay",f,!0),e.load()}}).delegate("button","click",function(c){a(this).siblings(".mejs-sourcechooser-selector").hasClass("mejs-offscreen")?(b.showSourcechooserSelector(),a(this).siblings(".mejs-sourcechooser-selector").find("input[type=radio]:checked").first().focus()):b.hideSourcechooserSelector()});for(var i in this.node.children){var j=this.node.children[i];"SOURCE"!==j.nodeName||"probably"!=e.canPlayType(j.type)&&"maybe"!=e.canPlayType(j.type)||b.addSourceButton(j.src,j.title,j.type,e.src==j.src)}},addSourceButton:function(b,c,d,e){var f=this;(""===c||void 0==c)&&(c=b),d=d.split("/")[1],f.sourcechooserButton.find("ul").append(a('<li><input type="radio" name="'+f.id+'_sourcechooser" id="'+f.id+"_sourcechooser_"+c+d+'" role="menuitemradio" value="'+b+'" '+(e?'checked="checked"':"")+'aria-selected="'+e+'" /><label for="'+f.id+"_sourcechooser_"+c+d+'" aria-hidden="true">'+c+" ("+d+")</label></li>")),f.adjustSourcechooserBox()},adjustSourcechooserBox:function(){var a=this;a.sourcechooserButton.find(".mejs-sourcechooser-selector").height(a.sourcechooserButton.find(".mejs-sourcechooser-selector ul").outerHeight(!0))},hideSourcechooserSelector:function(){this.sourcechooserButton.find(".mejs-sourcechooser-selector").addClass("mejs-offscreen").attr("aria-expanded","false").attr("aria-hidden","true").find("input[type=radio]").attr("tabindex","-1")},showSourcechooserSelector:function(){this.sourcechooserButton.find(".mejs-sourcechooser-selector").removeClass("mejs-offscreen").attr("aria-expanded","true").attr("aria-hidden","false").find("input[type=radio]").attr("tabindex","0")}})}(mejs.$),function(a){a.extend(mejs.MepDefaults,{contextMenuItems:[{render:function(a){return"undefined"==typeof a.enterFullScreen?null:a.isFullScreen?mejs.i18n.t("mejs.fullscreen-off"):mejs.i18n.t("mejs.fullscreen-on")},click:function(a){a.isFullScreen?a.exitFullScreen():a.enterFullScreen()}},{render:function(a){return a.media.muted?mejs.i18n.t("mejs.unmute"):mejs.i18n.t("mejs.mute")},click:function(a){a.media.muted?a.setMuted(!1):a.setMuted(!0)}},{isSeparator:!0},{render:function(a){return mejs.i18n.t("mejs.download-video")},click:function(a){window.location.href=a.media.currentSrc}}]}),a.extend(MediaElementPlayer.prototype,{buildcontextmenu:function(b,c,d,e){b.contextMenu=a('<div class="mejs-contextmenu"></div>').appendTo(a("body")).hide(),b.container.bind("contextmenu",function(a){return b.isContextMenuEnabled?(a.preventDefault(),b.renderContextMenu(a.clientX-1,a.clientY-1),!1):void 0}),b.container.bind("click",function(){b.contextMenu.hide()}),b.contextMenu.bind("mouseleave",function(){b.startContextMenuTimer()})},cleancontextmenu:function(a){a.contextMenu.remove()},isContextMenuEnabled:!0,enableContextMenu:function(){this.isContextMenuEnabled=!0},disableContextMenu:function(){this.isContextMenuEnabled=!1},contextMenuTimeout:null,startContextMenuTimer:function(){var a=this;a.killContextMenuTimer(),a.contextMenuTimer=setTimeout(function(){a.hideContextMenu(),a.killContextMenuTimer()},750)},killContextMenuTimer:function(){var a=this.contextMenuTimer;null!=a&&(clearTimeout(a),delete a,a=null)},hideContextMenu:function(){this.contextMenu.hide()},renderContextMenu:function(b,c){for(var d=this,e="",f=d.options.contextMenuItems,g=0,h=f.length;h>g;g++)if(f[g].isSeparator)e+='<div class="mejs-contextmenu-separator"></div>';else{var i=f[g].render(d);null!=i&&(e+='<div class="mejs-contextmenu-item" data-itemindex="'+g+'" id="element-'+1e6*Math.random()+'">'+i+"</div>")}d.contextMenu.empty().append(a(e)).css({top:c,left:b}).show(),d.contextMenu.find(".mejs-contextmenu-item").each(function(){var b=a(this),c=parseInt(b.data("itemindex"),10),e=d.options.contextMenuItems[c];"undefined"!=typeof e.show&&e.show(b,d),b.click(function(){"undefined"!=typeof e.click&&e.click(d),d.contextMenu.hide()})}),setTimeout(function(){d.killControlsTimer("rev3")},100)}})}(mejs.$),function(a){a.extend(mejs.MepDefaults,{skipBackInterval:30,skipBackText:""}),a.extend(MediaElementPlayer.prototype,{buildskipback:function(b,c,d,e){var f=this,g=mejs.i18n.t("mejs.time-skip-back",f.options.skipBackInterval),h=f.options.skipBackText?f.options.skipBackText:g;a('<div class="mejs-button mejs-skip-back-button"><button type="button" aria-controls="'+f.id+'" title="'+h+'" aria-label="'+h+'">'+f.options.skipBackInterval+"</button></div>").appendTo(c).click(function(){e.setCurrentTime(Math.max(e.currentTime-f.options.skipBackInterval,0)),a(this).find("button").blur()})}})}(mejs.$),function(a){a.extend(mejs.MepDefaults,{postrollCloseText:""}),a.extend(MediaElementPlayer.prototype,{buildpostroll:function(b,c,d,e){var f=this,g=f.options.postrollCloseText?f.options.postrollCloseText:mejs.i18n.t("mejs.close"),h=f.container.find('link[rel="postroll"]').attr("href");"undefined"!=typeof h&&(b.postroll=a('<div class="mejs-postroll-layer mejs-layer"><a class="mejs-postroll-close" onclick="$(this).parent().hide();return false;">'+g+'</a><div class="mejs-postroll-layer-content"></div></div>').prependTo(d).hide(),f.media.addEventListener("ended",function(c){a.ajax({dataType:"html",url:h,success:function(a,b){d.find(".mejs-postroll-layer-content").html(a)}}),b.postroll.show()},!1))}})}(mejs.$),function(a){a.extend(mejs.MepDefaults,{markerColor:"#E9BC3D",markers:[],markerCallback:function(){}}),a.extend(MediaElementPlayer.prototype,{buildmarkers:function(a,b,c,d){var e=0,f=-1,g=-1,h=-1,i=-1;for(e=0;e<a.options.markers.length;++e)b.find(".mejs-time-total").append('<span class="mejs-time-marker"></span>');d.addEventListener("durationchange",function(c){a.setmarkers(b)}),d.addEventListener("timeupdate",function(b){for(f=Math.floor(d.currentTime),h>f?i>f&&(i=-1):h=f,e=0;e<a.options.markers.length;++e)g=Math.floor(a.options.markers[e]),f===g&&g!==i&&(a.options.markerCallback(d,d.currentTime),i=g)},!1)},setmarkers:function(b){var c,d=this,e=0;for(e=0;e<d.options.markers.length;++e)Math.floor(d.options.markers[e])<=d.media.duration&&Math.floor(d.options.markers[e])>=0&&(c=100*Math.floor(d.options.markers[e])/d.media.duration,a(b.find(".mejs-time-marker")[e]).css({width:"1px",left:c+"%",background:d.options.markerColor}))}})}(mejs.$);/*jslint browser: true, plusplus: true, unparam: true, indent: 2 */
/*global jQuery */
if (typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function () {
	"use strict";
	return this.replace(/^\s+|\s+$/g, '');
  };
}
(function ($) {
  'use strict';
  var startAtTime = false,
	stopAtTime = false,
	// Keep all Players on site
	players = [],
	// Timecode as described in http://podlove.org/deep-link/
	// and http://www.w3.org/TR/media-frags/#fragment-dimensions
	timecodeRegExp = /(?:(\d+):)?(\d+):(\d+)(\.\d+)?([,\-](?:(\d+):)?(\d+):(\d+)(\.\d+)?)?/,
	ignoreHashChange = false,
	// all used functions
	zeroFill,
	generateTimecode,
	parseTimecode,
	checkCurrentURL,
	validateURL,
	setFragmentURL,
	updateChapterMarks,
	checkTime,
	addressCurrentTime,
	generateChapterTable,
	addBehavior,
	handleCookies;

  /**
   * return number as string lefthand filled with zeros
   * @param number number
   * @param width number
   * @return string
   **/
  zeroFill = function (number, width) {
	var s = number.toString();
	while (s.length < width) {
	  s = "0" + s;
	}
	return s;
  };
  /**
   * accepts array with start and end time in seconds
   * returns timecode in deep-linking format
   * @param times array
   * @param forceHours bool (optional)
   * @return string
   **/
  $.generateTimecode = function (times, leadingZeros, forceHours) {
	function generatePart(time) {
	  var part,
		hours,
		minutes,
		seconds,
		milliseconds;

	  // prevent negative values from player
	  if (!time || time <= 0) {
		return (leadingZeros || !time) ? (forceHours ? '00:00:00' : '00:00') : '--';
	  }
	  hours = Math.floor(time / 60 / 60);
	  minutes = Math.floor(time / 60) % 60;
	  seconds = Math.floor(time % 60) % 60;
	  milliseconds = Math.floor(time % 1 * 1000);
	  if (leadingZeros) {
		// required (minutes : seconds)
		part = zeroFill(minutes, 2) + ':' + zeroFill(seconds, 2);
		hours = zeroFill(hours, 2);
		hours = hours === '00' && !forceHours ? '' : hours + ':';
	  } else {
		part = hours ? zeroFill(minutes, 2) : minutes.toString();
		part += ':' + zeroFill(seconds, 2);
		hours = hours ? hours + ':' : '';
	  }
	  milliseconds = milliseconds ? '.' + zeroFill(milliseconds, 3) : '';
	  return hours + part + milliseconds;
	}
	if (times[1] > 0 && times[1] < 9999999 && times[0] < times[1]) {
	  return generatePart(times[0]) + ',' + generatePart(times[1]);
	}
	return generatePart(times[0]);
  };
  generateTimecode = $.generateTimecode;
  /**
   * parses time code into seconds
   * @param string timecode
   * @return number
   **/
  parseTimecode = function (timecode) {
	var parts, startTime = 0,
	  endTime = 0;
	if (timecode) {
	  parts = timecode.match(timecodeRegExp);
	  if (parts && parts.length === 10) {
		// hours
		startTime += parts[1] ? parseInt(parts[1], 10) * 60 * 60 : 0;
		// minutes
		startTime += parseInt(parts[2], 10) * 60;
		// seconds
		startTime += parseInt(parts[3], 10);
		// milliseconds
		startTime += parts[4] ? parseFloat(parts[4]) : 0;
		// no negative time
		startTime = Math.max(startTime, 0);
		// if there only a startTime but no endTime
		if (parts[5] === undefined) {
		  return [startTime, false];
		}
		// hours
		endTime += parts[6] ? parseInt(parts[6], 10) * 60 * 60 : 0;
		// minutes
		endTime += parseInt(parts[7], 10) * 60;
		// seconds
		endTime += parseInt(parts[8], 10);
		// milliseconds
		endTime += parts[9] ? parseFloat(parts[9]) : 0;
		// no negative time
		endTime = Math.max(endTime, 0);
		return (endTime > startTime) ? [startTime, endTime] : [startTime, false];
	  }
	}
	return false;
  };
  checkCurrentURL = function () {
	var deepLink;
	deepLink = parseTimecode(window.location.href);
	if (deepLink !== false) {
	  startAtTime = deepLink[0];
	  stopAtTime = deepLink[1];
	}
  };
  validateURL = function (url) {
	var urlregex = /(^|\s)((https?:\/\/)?[\w\-]+(\.[\w\-]+)+\.?(:\d+)?(\/\S*)?)/gi;
	url = url.match(urlregex);
	return (url !== null) ? url[0] : url;
  };
  /**
   * add a string as hash in the adressbar
   * @param string fragment
   **/
  setFragmentURL = function (fragment) {
	window.location.hash = fragment;
  };
  /**
   * handle Cookies
   **/
  handleCookies = {
	getItem: function (sKey) {
	  if (!sKey || !this.hasItem(sKey)) {
		return null;
	  }
	  return window.unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + window.escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
	},
	setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
	  if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/.test(sKey)) {
		return;
	  }
	  var sExpires = "";

	  if (vEnd) {
		switch (typeof vEnd) {
		case "number":
		  sExpires = "; max-age=" + vEnd;
		  break;
		case "string":
		  sExpires = "; expires=" + vEnd;
		  break;
		case "object":
		  sExpires = "; expires=" + vEnd.toGMTString();
		  break;
		}
	  }
	  document.cookie = window.escape(sKey) + "=" + window.escape(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
	},
	removeItem: function (sKey) {
	  if (!sKey || !this.hasItem(sKey)) {
		return;
	  }
	  var oExpDate = new Date();
	  oExpDate.setDate(oExpDate.getDate() - 1);
	  document.cookie = window.escape(sKey) + "=; expires=" + oExpDate.toGMTString() + "; path=/";
	},
	hasItem: function (sKey) {
	  return (new RegExp("(?:^|;\\s*)" + window.escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
	}
  };
  /**
   * update the chapter list when the data is loaded
   * @param object player
   * @param object marks
   **/
  updateChapterMarks = function (player, marks) {
	var coverimg = marks.closest('.podlovewebplayer_wrapper').find('.coverimg');
	marks.each(function () {
	  var isBuffered, chapterimg = null,
		mark = $(this),
		startTime = mark.data('start'),
		endTime = mark.data('end'),
		isEnabled = mark.data('enabled'),
		isActive = player.currentTime > startTime - 0.3 && player.currentTime <= endTime;
	  // prevent timing errors
	  if (player.buffered.length > 0) {
		isBuffered = player.buffered.end(0) > startTime;
	  }
	  if (isActive) {
		chapterimg = validateURL(mark.data('img'));
		if ((chapterimg !== null) && (mark.hasClass('active'))) {
		  if ((coverimg.attr('src') !== chapterimg) && (chapterimg.length > 5)) {
			coverimg.attr('src', chapterimg);
		  }
		} else {
		  if (coverimg.attr('src') !== coverimg.data('img')) {
			coverimg.attr('src', coverimg.data('img'));
		  }
		}
		mark.addClass('active').siblings().removeClass('active');
	  }
	  if (!isEnabled && isBuffered) {
		$(mark).data('enabled', true).addClass('loaded').find('a[rel=player]').removeClass('disabled');
	  }
	});
  };
  checkTime = function (e) {
	if (players.length > 1) {
	  return;
	}
	var player = e.data.player;
	//Kinda hackish: Make sure that the timejump is at least 1 second (fix for OGG/Firefox)
	if (startAtTime !== false && (player.lastCheck === undefined || Math.abs(startAtTime - player.lastCheck) > 1)) {
	  player.setCurrentTime(startAtTime);
	  player.lastCheck = startAtTime;
	  startAtTime = false;
	}
	if (stopAtTime !== false && player.currentTime >= stopAtTime) {
	  player.pause();
	  stopAtTime = false;
	}
  };
  addressCurrentTime = function (e) {
	var fragment;
	if (players.length === 1) {
	  fragment = 't=' + generateTimecode([e.data.player.currentTime]);
	  setFragmentURL(fragment);
	}
  };
  /**
   * Given a list of chapters, this function creates the chapter table for the player.
   */
  generateChapterTable = function (params) {
	var div, table, tbody, tempchapters, maxchapterstart, line, tc, chaptitle, next, chapterImages, rowDummy, i, scroll = '';
	if (params.chapterHeight !== "") {
	  if (typeof parseInt(params.chapterHeight, 10) === 'number') {
		scroll = 'style="overflow-y: auto; max-height: ' + parseInt(params.chapterHeight, 10) + 'px;"';
	  }
	}
	div = $('<div class="podlovewebplayer_chapterbox showonplay" ' + scroll + '><table><caption>Podcast Chapters</caption><thead><tr><th scope="col" class="starttime">Chapter Start Time</th><th scope="col" class="chaptername">Chapter Title</th><th scope="col" class="timecode">Chapter Duration</th></tr></thead><tbody></tbody></table></div>');
	table = div.children('table');
	tbody = table.children('tbody');
	if ((params.chaptersVisible === 'true') || (params.chaptersVisible === true)) {
	  div.addClass('active');
	}
	table.addClass('podlovewebplayer_chapters');
	if (params.chapterlinks !== 'false') {
	  table.addClass('linked linked_' + params.chapterlinks);
	}
	//prepare row data
	tempchapters = params.chapters;
	maxchapterstart = 0;
	//first round: kill empty rows and build structured object
	if (typeof params.chapters === 'string') {
	  tempchapters = [];
	  $.each(params.chapters.split("\n"), function (i, chapter) {
		//exit early if this line contains nothing but whitespace
		if (!/\S/.test(chapter)) {
		  return;
		}
		//extract the timestamp
		line = $.trim(chapter);
		tc = parseTimecode(line.substring(0, line.indexOf(' ')));
		chaptitle = $.trim(line.substring(line.indexOf(' ')));
		tempchapters.push({
		  start: tc[0],
		  code: chaptitle
		});
	  });
	} else {
	  // assume array of objects
	  $.each(tempchapters, function (key, value) {
		value.code = value.title;
		if (typeof value.start === 'string') {
		  value.start = parseTimecode(value.start)[0];
		}
	  });
	}
	// order is not guaranteed: http://podlove.org/simple-chapters/
	tempchapters = tempchapters.sort(function (a, b) {
	  return a.start - b.start;
	});
	//second round: collect more information
	maxchapterstart = Math.max.apply(Math,
	  $.map(tempchapters, function (value, i) {
		next = tempchapters[i + 1];
		// we use `this.end` to quickly calculate the duration in the next round
		if (next) {
		  value.end = next.start;
		}
		// we need this data for proper formatting
		return value.start;
	  }));
	//this is a "template" for each chapter row
	chapterImages = false;
	for (i = 0; i < tempchapters.length; i++) {
	  if ((tempchapters[i].image !== "") && (tempchapters[i].image !== undefined)) {
		chapterImages = true;
	  }
	}
	if (chapterImages) {
	  rowDummy = $('<tr class="chaptertr" data-start="" data-end="" data-img=""><td class="starttime"><span></span></td><td class="chapterimage"></td><td class="chaptername"></td><td class="timecode">\n<span></span>\n</td>\n</tr>');
	} else {
	  rowDummy = $('<tr class="chaptertr" data-start="" data-end="" data-img=""><td class="starttime"><span></span></td><td class="chaptername"></td><td class="timecode">\n<span></span>\n</td>\n</tr>');
	}
	//third round: build actual dom table
	$.each(tempchapters, function (i) {
	  var finalchapter = !tempchapters[i + 1],
		duration = Math.round(this.end - this.start),
		forceHours,
		row = rowDummy.clone();
	  //make sure the duration for all chapters are equally formatted
	  if (!finalchapter) {
		this.duration = generateTimecode([duration], false);
	  } else {
		if (params.duration === 0) {
		  this.end = 9999999999;
		  this.duration = '…';
		} else {
		  this.end = params.duration;
		  this.duration = generateTimecode([Math.round(this.end - this.start)], false);
		}
	  }
	  if (i % 2) {
		row.addClass('oddchapter');
	  }
	  //deeplink, start and end
	  row.attr({
		'data-start': this.start,
		'data-end': this.end,
		'data-img': (this.image !== undefined) ? this.image : ''
	  });
	  //if there is a chapter that starts after an hour, force '00:' on all previous chapters
	  forceHours = (maxchapterstart >= 3600);
	  //insert the chapter data
	  row.find('.starttime > span').text(generateTimecode([Math.round(this.start)], true, forceHours));
	  if (this.href !== undefined) {
		if (this.href !== "") {
		  row.find('.chaptername').html('<span>' + this.code + '</span>' + ' <a href="' + this.href + '"></a>');
		} else {
		  row.find('.chaptername').html('<span>' + this.code + '</span>');
		}
	  } else {
		row.find('.chaptername').html('<span>' + this.code + '</span>');
	  }
	  row.find('.timecode > span').html('<span>' + this.duration + '</span>');
	  if (chapterImages) {
		if (this.image !== undefined) {
		  if (this.image !== "") {
			row.find('.chapterimage').html('<img src="' + this.image + '"/>');
		  }
		}
	  }
	  row.appendTo(tbody);
	});
	return div;
  };
  /**
   * add chapter behavior and deeplinking: skip to referenced
   * time position & write current time into address
   * @param player object
   */
  addBehavior = function (player, params, wrapper) {
	var jqPlayer = $(player),
	  layoutedPlayer = jqPlayer,
	  canplay = false,
	  metainfo,
	  summary,
	  podlovewebplayer_timecontrol,
	  podlovewebplayer_sharebuttons,
	  podlovewebplayer_downloadbuttons,
	  chapterdiv,
	  list,
	  marks;
	// expose the player interface
	wrapper.data('podlovewebplayer', {
	  player: jqPlayer
	});
	// This might be a fix to some Firefox AAC issues.
	jqPlayer.on('error', function () {
	  if ($(this).attr('src')) {
		$(this).removeAttr('src');
	  } else if ($(this).children('source').length) {
		$(this).children('source').first().remove();
	  }
	});
	/**
	 * The `player` is an interface. It provides the play and pause functionality. The
	 * `layoutedPlayer` on the other hand is a DOM element. In native mode, these two
	 * are one and the same object. In Flash though the interface is a plain JS object.
	 */
	if (players.length === 1) {
	  // check if deeplink is set
	  checkCurrentURL();
	}
	// get things straight for flash fallback
	if (player.pluginType === 'flash') {
	  layoutedPlayer = $('#mep_' + player.id.substring(9));
	}
	// cache some jQ objects
	metainfo = wrapper.find('.podlovewebplayer_meta');
	summary = wrapper.find('.summary');
	podlovewebplayer_timecontrol = wrapper.find('.podlovewebplayer_timecontrol');
	podlovewebplayer_sharebuttons = wrapper.find('.podlovewebplayer_sharebuttons');
	podlovewebplayer_downloadbuttons = wrapper.find('.podlovewebplayer_downloadbuttons');
	chapterdiv = wrapper.find('.podlovewebplayer_chapterbox');
	list = wrapper.find('table');
	marks = list.find('tr');
	// fix height of summary for better toggability
	summary.each(function () {
	  $(this).data('height', $(this).height() + 10);
	  if (!$(this).hasClass('active')) {
		$(this).height('0px');
	  } else {
		$(this).height($(this).find('div.summarydiv').height() + 10 + 'px');
	  }
	});
	chapterdiv.each(function () {
	  $(this).data('height', $(this).find('.podlovewebplayer_chapters').height());
	  if (!$(this).hasClass('active')) {
		$(this).height('0px');
	  } else {
		$(this).height($(this).find('.podlovewebplayer_chapters').height() + 'px');
	  }
	});
	if (metainfo.length === 1) {
	  metainfo.find('a.infowindow').click(function () {
		summary.toggleClass('active');
		if (summary.hasClass('active')) {
		  summary.height(summary.find('div.summarydiv').height() + 10 + 60 + 'px');
		} else {
		  summary.css('height', '0px');
		}
		return false;
	  });
	  metainfo.find('a.showcontrols').on('click', function () {
		podlovewebplayer_timecontrol.toggleClass('active');
		if (podlovewebplayer_sharebuttons !== undefined) {
		  if (podlovewebplayer_sharebuttons.hasClass('active')) {
			podlovewebplayer_sharebuttons.removeClass('active');
		  } else if (podlovewebplayer_downloadbuttons.hasClass('active')) {
			podlovewebplayer_downloadbuttons.removeClass('active');
		  }
		}
		return false;
	  });
	  metainfo.find('a.showsharebuttons').on('click', function () {
		podlovewebplayer_sharebuttons.toggleClass('active');
		if (podlovewebplayer_timecontrol.hasClass('active')) {
		  podlovewebplayer_timecontrol.removeClass('active');
		} else if (podlovewebplayer_downloadbuttons.hasClass('active')) {
		  podlovewebplayer_downloadbuttons.removeClass('active');
		}
		return false;
	  });
	  metainfo.find('a.showdownloadbuttons').on('click', function () {
		podlovewebplayer_downloadbuttons.toggleClass('active');
		if (podlovewebplayer_timecontrol.hasClass('active')) {
		  podlovewebplayer_timecontrol.removeClass('active');
		} else if (podlovewebplayer_sharebuttons.hasClass('active')) {
		  podlovewebplayer_sharebuttons.removeClass('active');
		}
		return false;
	  });
	  metainfo.find('.bigplay').on('click', function () {
		if ($(this).hasClass('bigplay')) {
		  var playButton = $(this).parent().find('.bigplay');
		  if ((typeof player.currentTime === 'number') && (player.currentTime > 0)) {
			if (player.paused) {
			  playButton.addClass('playing');
			  player.play();
			} else {
			  playButton.removeClass('playing');
			  player.pause();
			}
		  } else {
			if (!playButton.hasClass('playing')) {
			  playButton.addClass('playing');
			  $(this).parent().parent().find('.mejs-time-buffering').show();
			}
			// flash fallback needs additional pause
			if (player.pluginType === 'flash') {
			  player.pause();
			}
			player.play();
		  }
		}
		return false;
	  });
	  wrapper.find('.chaptertoggle').unbind('click').click(function () {
		wrapper.find('.podlovewebplayer_chapterbox').toggleClass('active');
		if (wrapper.find('.podlovewebplayer_chapterbox').hasClass('active')) {
		  wrapper.find('.podlovewebplayer_chapterbox').height(parseInt(wrapper.find('.podlovewebplayer_chapterbox').data('height'), 10) + 2 + 'px');
		} else {
		  wrapper.find('.podlovewebplayer_chapterbox').height('0px');
		}
		return false;
	  });
	  wrapper.find('.prevbutton').click(function () {
		if ((typeof player.currentTime === 'number') && (player.currentTime > 0)) {
		  if (player.currentTime > chapterdiv.find('.active').data('start') + 10) {
			player.setCurrentTime(chapterdiv.find('.active').data('start'));
		  } else {
			player.setCurrentTime(chapterdiv.find('.active').prev().data('start'));
		  }
		} else {
		  player.play();
		}
		return false;
	  });
	  wrapper.find('.nextbutton').click(function () {
		if ((typeof player.currentTime === 'number') && (player.currentTime > 0)) {
		  player.setCurrentTime(chapterdiv.find('.active').next().data('start'));
		} else {
		  player.play();
		}
		return false;
	  });
	  wrapper.find('.rewindbutton').click(function () {
		if ((typeof player.currentTime === 'number') && (player.currentTime > 0)) {
		  player.setCurrentTime(player.currentTime - 30);
		} else {
		  player.play();
		}
		return false;
	  });
	  wrapper.find('.forwardbutton').click(function () {
		if ((typeof player.currentTime === 'number') && (player.currentTime > 0)) {
		  player.setCurrentTime(player.currentTime + 30);
		} else {
		  player.play();
		}
		return false;
	  });
	  wrapper.find('.currentbutton').click(function () {
		var timepos = (params.sharewholeepisode === true) ? '' : '%23t%3D' + generateTimecode([player.currentTime]);
		window.prompt('This URL directly points to this episode on the current time', $(this).closest('.podlovewebplayer_wrapper').find('.episodetitle a').attr('href') + timepos);
		return false;
	  });
	  wrapper.find('.tweetbutton').click(function () {
		var timepos = (params.sharewholeepisode === true) ? '' : '%23t%3D' + generateTimecode([player.currentTime]);
		window.open('https://twitter.com/share?text=' + encodeURIComponent($(this).closest('.podlovewebplayer_wrapper').find('.episodetitle a').text()) + '&url=' + encodeURIComponent($(this).closest('.podlovewebplayer_wrapper').find('.episodetitle a').attr('href')) + timepos, 'tweet it', 'width=550,height=420,resizable=yes');
		return false;
	  });
	  wrapper.find('.fbsharebutton').click(function () {
		var timepos = (params.sharewholeepisode === true) ? '' : '%23t%3D' + generateTimecode([player.currentTime]);
		window.open('http://www.facebook.com/share.php?t=' + encodeURIComponent($(this).closest('.podlovewebplayer_wrapper').find('.episodetitle a').text()) + '&u=' + encodeURIComponent($(this).closest('.podlovewebplayer_wrapper').find('.episodetitle a').attr('href')) + timepos, 'share it', 'width=550,height=340,resizable=yes');
		return false;
	  });
	  wrapper.find('.gplusbutton').click(function () {
		var timepos = (params.sharewholeepisode === true) ? '' : '%23t%3D' + generateTimecode([player.currentTime]);
		window.open('https://plus.google.com/share?title=' + encodeURIComponent($(this).closest('.podlovewebplayer_wrapper').find('.episodetitle a').text()) + '&url=' + encodeURIComponent($(this).closest('.podlovewebplayer_wrapper').find('.episodetitle a').attr('href')) + timepos, 'plus it', 'width=550,height=420,resizable=yes');
		return false;
	  });
	  wrapper.find('.adnbutton').click(function () {
		var timepos = (params.sharewholeepisode === true) ? '' : '%23t%3D' + generateTimecode([player.currentTime]);
		window.open('https://alpha.app.net/intent/post?text=' + encodeURIComponent($(this).closest('.podlovewebplayer_wrapper').find('.episodetitle a').text()) + '%20' + encodeURIComponent($(this).closest('.podlovewebplayer_wrapper').find('.episodetitle a').attr('href')) + timepos, 'plus it', 'width=550,height=420,resizable=yes');
		return false;
	  });
	  wrapper.find('.mailbutton').click(function () {
		var timepos = (params.sharewholeepisode === true) ? '' : '%23t%3D' + generateTimecode([player.currentTime]);
		window.location = 'mailto:?subject=' + encodeURIComponent($(this).closest('.podlovewebplayer_wrapper').find('.episodetitle a').text()) + '&body=' + encodeURIComponent($(this).closest('.podlovewebplayer_wrapper').find('.episodetitle a').text()) + '%20%3C' + encodeURIComponent($(this).closest('.podlovewebplayer_wrapper').find('.episodetitle a').attr('href')) + timepos + '%3E';
		return false;
	  });
	  wrapper.find('.fileselect').change(function () {
		var dlurl, dlname;
		$(this).parent().find(".fileselect option:selected").each(function () {
		  dlurl = $(this).data('dlurl');
		});
		$(this).parent().find(".downloadbutton").each(function () {
		  dlname = dlurl.split('/');
		  dlname = dlname[dlname.length - 1];
		  $(this).attr('href', dlurl);
		  $(this).attr('download', dlname);
		});
		return false;
	  });
	  wrapper.find('.openfilebutton').click(function () {
		$(this).parent().find(".fileselect option:selected").each(function () {
		  window.open($(this).data('url'), 'Podlove Popup', 'width=550,height=420,resizable=yes');
		});
		return false;
	  });
	  wrapper.find('.fileinfobutton').click(function () {
		$(this).parent().find(".fileselect option:selected").each(function () {
		  window.prompt('file URL:', $(this).val());
		});
		return false;
	  });
	}
	// chapters list
	list
	  .show()
	  .delegate('.chaptertr', 'click', function (e) {
		if ($(this).closest('table').hasClass('linked_all') || $(this).closest('tr').hasClass('loaded')) {
		  e.preventDefault();
		  var mark = $(this).closest('tr'),
			startTime = mark.data('start');
		  //endTime = mark.data('end');
		  // If there is only one player also set deepLink
		  if (players.length === 1) {
			// setFragmentURL('t=' + generateTimecode([startTime, endTime]));
			setFragmentURL('t=' + generateTimecode([startTime]));
		  } else {
			if (canplay) {
			  // Basic Chapter Mark function (without deeplinking)
			  player.setCurrentTime(startTime);
			} else {
			  jqPlayer.one('canplay', function () {
				player.setCurrentTime(startTime);
			  });
			}
		  }
		  // flash fallback needs additional pause
		  if (player.pluginType === 'flash') {
			player.pause();
		  }
		  player.play();
		}
		return false;
	  });
	list
	  .show()
	  .delegate('.chaptertr a', 'click', function (e) {
		if ($(this).closest('table').hasClass('linked_all') || $(this).closest('td').hasClass('loaded')) {
		  e.preventDefault();
		  window.open($(this)[0].href, '_blank');
		}
		return false;
	  });
	// wait for the player or you'll get DOM EXCEPTIONS
	// And just listen once because of a special behaviour in firefox
	// --> https://bugzilla.mozilla.org/show_bug.cgi?id=664842
	jqPlayer.one('canplay', function () {
	  canplay = true;
	  // add duration of final chapter
	  if (player.duration) {
		marks.find('.timecode code').eq(-1).each(function () {
		  var start, end;
		  start = Math.floor($(this).closest('tr').data('start'));
		  end = Math.floor(player.duration);
		  $(this).text(generateTimecode([end - start]));
		});
	  }
	  // add Deeplink Behavior if there is only one player on the site
	  if (players.length === 1) {
		jqPlayer.bind('play timeupdate', {
		  player: player
		}, checkTime)
		  .bind('pause', {
			player: player
		  }, addressCurrentTime);
		// disabled 'cause it overrides chapter clicks
		// bind seeked to addressCurrentTime
		checkCurrentURL();
		// handle browser history navigation
		jQuery(window).bind('onhashchange hashchange onpopstate', function (e) {
		  if (!ignoreHashChange) {
			checkCurrentURL();
		  }
		  ignoreHashChange = false;
		});
	  }
	});
	// always update Chaptermarks though
	jqPlayer
	  .on('timeupdate', function () {
		updateChapterMarks(player, marks);
	  })
	  // update play/pause status
	  .on('play playing', function () {
		if (!player.persistingTimer) {
		  player.persistingTimer = window.setInterval(function () {
			if (players.length === 1) {
			  ignoreHashChange = true;
			  window.location.replace('#t=' + generateTimecode([player.currentTime, false]));
			}
			handleCookies.setItem('podloveWebPlayerTime-' + params.permalink, player.currentTime, new Date(2020, 1, 1));
		  }, 5000);
		}
		list.find('.paused').removeClass('paused');
		if (metainfo.length === 1) {
		  metainfo.find('.bigplay').addClass('playing');
		}
	  })
	  .on('pause', function () {
		window.clearInterval(player.persistingTimer);
		player.persistingTimer = null;
		if (metainfo.length === 1) {
		  metainfo.find('.bigplay').removeClass('playing');
		}
	  });
  };
  $.fn.podlovewebplayer = function (options) {
	// MEJS options default values
	var mejsoptions = {
	  defaultVideoWidth: 480,
	  defaultVideoHeight: 270,
	  videoWidth: -1,
	  videoHeight: -1,
	  audioWidth: -1,
	  audioHeight: 30,
	  startVolume: 0.8,
	  loop: false,
	  enableAutosize: true,
	  features: ['playpause', 'current', 'progress', 'duration', 'tracks', 'volume', 'fullscreen'],
	  alwaysShowControls: false,
	  iPadUseNativeControls: false,
	  iPhoneUseNativeControls: false,
	  AndroidUseNativeControls: false,
	  alwaysShowHours: false,
	  showTimecodeFrameCount: false,
	  framesPerSecond: 25,
	  enableKeyboard: true,
	  pauseOtherPlayers: true,
	  duration: false,
	  plugins: ['flash', 'silverlight'],
	  pluginPath: './static/',
	  flashName: 'flashmediaelement.swf',
	  silverlightName: 'silverlightmediaelement.xap'
	},
	  // Additional parameters default values
	  params = $.extend({}, {
		chapterlinks: 'all',
		width: '100%',
		duration: false,
		chaptersVisible: false,
		timecontrolsVisible: false,
		sharebuttonsVisible: false,
		downloadbuttonsVisible: false,
		summaryVisible: false,
		hidetimebutton: false,
		hidedownloadbutton: false,
		hidesharebutton: false,
		sharewholeepisode: false,
		sources: []
	  }, options);
	// turn each player in the current set into a Podlove Web Player
	return this.each(function (index, player) {
	  var richplayer = false,
		haschapters = false,
		hiddenTab = false,
		i = 0,
		secArray,
		orig,
		deepLink,
		wrapper,
		summaryActive,
		timecontrolsActive,
		sharebuttonsActive,
		downloadbuttonsActive,
		size,
		name,
		downloadname,
		selectform,
		storageKey;
	  //fine tuning params
	  if (params.width.toLowerCase() === 'auto') {
		params.width = '100%';
	  } else {
		params.width = params.width.replace('px', '');
	  }
	  //audio params
	  if (player.tagName === 'AUDIO') {
		if (params.audioWidth !== undefined) {
		  params.width = params.audioWidth;
		}
		mejsoptions.audioWidth = params.width;
		//kill fullscreen button
		$.each(mejsoptions.features, function (i) {
		  if (this === 'fullscreen') {
			mejsoptions.features.splice(i, 1);
		  }
		});
		//video params
	  } else if (player.tagName === 'VIDEO') {
		if (params.height !== undefined) {
		  mejsoptions.videoWidth = params.width;
		  mejsoptions.videoHeight = params.height;
		}
		if ($(player).attr('width') !== undefined) {
		  params.width = $(player).attr('width');
		}
	  }
	  //duration can be given in seconds or in NPT format
	  if (params.duration && params.duration !== parseInt(params.duration, 10)) {
		secArray = parseTimecode(params.duration);
		params.duration = secArray[0];
	  }
	  //Overwrite MEJS default values with actual data
	  $.each(mejsoptions, function (key) {
		if (params[key] !== undefined) {
		  mejsoptions[key] = params[key];
		}
	  });
	  //wrapper and init stuff
	  if (params.width.toString().trim() === parseInt(params.width, 10).toString().trim()) {
		params.width = params.width.toString().trim() + 'px';
	  }
	  orig = player;
	  player = $(player).clone().wrap('<div class="podlovewebplayer_wrapper" style="width: ' + params.width + '"></div>')[0];
	  wrapper = $(player).parent();
	  players.push(player);
	  //add params from html fallback area and remove them from the DOM-tree
	  $(player).find('[data-pwp]').each(function () {
		params[$(this).data('pwp')] = $(this).html();
		$(this).remove();
	  });
	  //add params from audio and video elements
	  $(player).find('source').each(function () {
		if (params.sources !== undefined) {
		  params.sources.push($(this).attr('src'));
		} else {
		  params.sources[0] = $(this).attr('src');
		}
	  });
	  //build rich player with meta data
	  if (params.chapters !== undefined || params.title !== undefined || params.subtitle !== undefined || params.summary !== undefined || params.poster !== undefined || $(player).attr('poster') !== undefined) {
		//set status variable
		richplayer = true;
		wrapper.addClass('podlovewebplayer_' + player.tagName.toLowerCase());
		if (player.tagName === "AUDIO") {
		  //kill play/pause button from miniplayer
		  $.each(mejsoptions.features, function (i) {
			if (this === 'playpause') {
			  mejsoptions.features.splice(i, 1);
			}
		  });
		  wrapper.prepend('<div class="podlovewebplayer_meta"></div>');
		  wrapper.find('.podlovewebplayer_meta').prepend('<a class="bigplay" title="Play Episode" href="#"></a>');
		  if (params.poster !== undefined) {
			wrapper.find('.podlovewebplayer_meta').append('<div class="coverart"><img class="coverimg" src="' + params.poster + '" data-img="' + params.poster + '" alt=""></div>');
		  }
		  if ($(player).attr('poster') !== undefined) {
			wrapper.find('.podlovewebplayer_meta').append('<div class="coverart"><img src="' + $(player).attr('poster') + '" alt=""></div>');
		  }
		}
		if (player.tagName === "VIDEO") {
		  wrapper.prepend('<div class="podlovewebplayer_top"></div>');
		  wrapper.append('<div class="podlovewebplayer_meta"></div>');
		}
		if (params.title !== undefined) {
		  if (params.permalink !== undefined) {
			wrapper.find('.podlovewebplayer_meta').append('<h3 class="episodetitle"><a href="' + params.permalink + '">' + params.title + '</a></h3>');
		  } else {
			wrapper.find('.podlovewebplayer_meta').append('<h3 class="episodetitle">' + params.title + '</h3>');
		  }
		}
		if (params.subtitle !== undefined) {
		  wrapper.find('.podlovewebplayer_meta').append('<div class="subtitle">' + params.subtitle + '</div>');
		} else {
		  if (params.title !== undefined) {
			if ((params.title.length < 42) && (params.poster === undefined)) {
			  wrapper.addClass('podlovewebplayer_smallplayer');
			}
		  }
		  wrapper.find('.podlovewebplayer_meta').append('<div class="subtitle"></div>');
		}
		//always render toggler buttons wrapper
		wrapper.find('.podlovewebplayer_meta').append('<div class="togglers"></div>');
		wrapper.on('playerresize', function () {
		  wrapper.find('.podlovewebplayer_chapterbox').data('height', wrapper.find('.podlovewebplayer_chapters').height());
		  if (wrapper.find('.podlovewebplayer_chapterbox').hasClass('active')) {
			wrapper.find('.podlovewebplayer_chapterbox').height(parseInt(wrapper.find('.podlovewebplayer_chapterbox').data('height'), 10) + 2 + 'px');
		  }
		  wrapper.find('.summary').data('height', wrapper.find('.summarydiv').height());
		  if (wrapper.find('.summary').hasClass('active')) {
			wrapper.find('.summary').height(wrapper.find('.summarydiv').height() + 'px');
		  }
		});
		if (params.summary !== undefined) {
		  summaryActive = "";
		  if (params.summaryVisible === true) {
			summaryActive = " active";
		  }
		  wrapper.find('.togglers').append('<a href="#" class="infowindow infobuttons pwp-icon-info-circle" title="More information about this"></a>');
		  wrapper.find('.podlovewebplayer_meta').after('<div class="summary' + summaryActive + '"><div class="summarydiv">' + params.summary + '</div></div>');
		}
		if (params.chapters !== undefined) {
		  if (((params.chapters.length > 10) && (typeof params.chapters === 'string')) || ((params.chapters.length > 0) && (typeof params.chapters === 'object'))) {
			wrapper.find('.togglers').append('<a href="#" class="chaptertoggle infobuttons pwp-icon-list-bullet" title="Show/hide chapters"></a>');
		  }
		} else {
		  if ($(this).parent()[0].getElementsByClassName('mp4chaps').length > 0) {
			params.chapters = $(this).parent()[0].getElementsByClassName('mp4chaps')[0].innerHTML.trim();
			haschapters = true;
			if (((params.chapters.length > 10) && (typeof params.chapters === 'string')) || ((params.chapters.length > 0) && (typeof params.chapters === 'object'))) {
			  wrapper.find('.togglers').append('<a href="#" class="chaptertoggle infobuttons pwp-icon-list-bullet" title="Show/hide chapters"></a>');
			}
		  }
		}
		if (params.hidetimebutton !== true) {
		  wrapper.find('.togglers').append('<a href="#" class="showcontrols infobuttons pwp-icon-clock" title="Show/hide time navigation controls"></a>');
		}
	  }
	  timecontrolsActive = "";
	  if (params.timecontrolsVisible === true) {
		timecontrolsActive = " active";
	  }
	  sharebuttonsActive = "";
	  if (params.sharebuttonsVisible === true) {
		sharebuttonsActive = " active";
	  }
	  downloadbuttonsActive = "";
	  if (params.downloadbuttonsVisible === true) {
		downloadbuttonsActive = " active";
	  }
	  wrapper.append('<div class="podlovewebplayer_timecontrol podlovewebplayer_controlbox' + timecontrolsActive + '"></div>');
	  if (params.chapters !== undefined) {
		wrapper.find('.podlovewebplayer_timecontrol').append('<a href="#" class="prevbutton infobuttons pwp-icon-to-start" title="Jump backward to previous chapter"></a><a href="#" class="nextbutton infobuttons pwp-icon-to-end" title="next chapter"></a>');
		wrapper.find('.controlbox').append('<a href="#" class="prevbutton infobuttons pwp-icon-step-backward" title="previous chapter"></a><a href="#" class="nextbutton infobuttons pwp-icon-to-end" title="Jump to next chapter"></a>');
	  }
	  wrapper.find('.podlovewebplayer_timecontrol').append('<a href="#" class="rewindbutton infobuttons pwp-icon-fast-bw" title="Rewind 30 seconds"></a>');
	  wrapper.find('.podlovewebplayer_timecontrol').append('<a href="#" class="forwardbutton infobuttons pwp-icon-fast-fw" title="Fast forward 30 seconds"></a>');

	  if ((wrapper.closest('.podlovewebplayer_wrapper').find('.episodetitle a').attr('href') !== undefined) && (params.hidesharebutton !== true)) {
		wrapper.append('<div class="podlovewebplayer_sharebuttons podlovewebplayer_controlbox' + sharebuttonsActive + '"></div>');
		wrapper.find('.togglers').append('<a href="#" class="showsharebuttons infobuttons pwp-icon-export" title="Show/hide sharing controls"></a>');
		wrapper.find('.podlovewebplayer_sharebuttons').append('<a href="#" class="currentbutton infobuttons pwp-icon-link" title="Get URL for this"></a>');
		wrapper.find('.podlovewebplayer_sharebuttons').append('<a href="#" target="_blank" class="tweetbutton infobuttons pwp-icon-twitter" title="Share this on Twitter"></a>');
		wrapper.find('.podlovewebplayer_sharebuttons').append('<a href="#" target="_blank" class="fbsharebutton infobuttons pwp-icon-facebook" title="Share this on Facebook"></a>');
		wrapper.find('.podlovewebplayer_sharebuttons').append('<a href="#" target="_blank" class="gplusbutton infobuttons pwp-icon-gplus" title="Share this on Google+"></a>');
		wrapper.find('.podlovewebplayer_sharebuttons').append('<a href="#" target="_blank" class="adnbutton infobuttons pwp-icon-appnet" title="Share this on App.net"></a>');
		wrapper.find('.podlovewebplayer_sharebuttons').append('<a href="#" target="_blank" class="mailbutton infobuttons pwp-icon-mail" title="Share this via e-mail"></a>');
	  }
	  if (((params.downloads !== undefined) || (params.sources !== undefined)) && (params.hidedownloadbutton !== true)) {
		selectform = '<select name="downloads" class="fileselect" size="1" onchange="this.value=this.options[this.selectedIndex].value;">';
		wrapper.append('<div class="podlovewebplayer_downloadbuttons podlovewebplayer_controlbox' + downloadbuttonsActive + '"></div>');
		wrapper.find('.togglers').append('<a href="#" class="showdownloadbuttons infobuttons pwp-icon-download" title="Show/hide download bar"></a>');
		if (params.downloads !== undefined) {
		  for (i = 0; i < params.downloads.length; i += 1) {
			size = (parseInt(params.downloads[i].size, 10) < 1048704) ? Math.round(parseInt(params.downloads[i].size, 10) / 100) / 10 + 'kB' : Math.round(parseInt(params.downloads[i].size, 10) / 1000 / 100) / 10 + 'MB';
			selectform += '<option value="' + params.downloads[i].url + '" data-url="' + params.downloads[i].url + '" data-dlurl="' + params.downloads[i].dlurl + '">' + params.downloads[i].name + ' (' + size + ')</option>';
		  }
		} else {
		  for (i = 0; i < params.sources.length; i += 1) {
			name = params.sources[i].split('.');
			name = name[name.length - 1];
			selectform += '<option value="' + params.sources[i] + '" data-url="' + params.sources[i] + '" data-dlurl="' + params.sources[i] + '">' + name + '</option>';
		  }
		}
		selectform += '</select>';
		wrapper.find('.podlovewebplayer_downloadbuttons').append(selectform);
		if (params.downloads !== undefined && params.downloads.length > 0) {
		  downloadname = params.downloads[0].url.split('/');
		  downloadname = downloadname[downloadname.length - 1];
		  wrapper.find('.podlovewebplayer_downloadbuttons').append('<a href="' + params.downloads[0].url + '" download="' + downloadname + '" class="downloadbutton infobuttons pwp-icon-download" title="Download"></a> ');
		}
		wrapper.find('.podlovewebplayer_downloadbuttons').append('<a href="#" class="openfilebutton infobuttons pwp-icon-link-ext" title="Open"></a> ');
		wrapper.find('.podlovewebplayer_downloadbuttons').append('<a href="#" class="fileinfobutton infobuttons pwp-icon-info-circle" title="Info"></a> ');
	  }
	  //build chapter table
	  if (params.chapters !== undefined) {
		if (((params.chapters.length > 10) && (typeof params.chapters === 'string')) || ((params.chapters.length > 1) && (typeof params.chapters === 'object'))) {
		  haschapters = true;
		  generateChapterTable(params).appendTo(wrapper);
		}
	  }
	  if (richplayer || haschapters) {
		wrapper.append('<div class="podlovewebplayer_tableend"></div>');
	  }
	  // parse deeplink
	  deepLink = parseTimecode(window.location.href);
	  if (deepLink !== false && players.length === 1) {
		if (document.hidden !== undefined) {
		  hiddenTab = document.hidden;
		} else if (document.mozHidden !== undefined) {
		  hiddenTab = document.mozHidden;
		} else if (document.msHidden !== undefined) {
		  hiddenTab = document.msHidden;
		} else if (document.webkitHidden !== undefined) {
		  hiddenTab = document.webkitHidden;
		}
		if (hiddenTab === true) {
		  $(player).attr({
			preload: 'auto'
		  });
		} else {
		  $(player).attr({
			preload: 'auto',
			autoplay: 'autoplay'
		  });
		}
		startAtTime = deepLink[0];
		stopAtTime = deepLink[1];
	  } else if (params && params.permalink) {
		storageKey = 'podloveWebPlayerTime-' + params.permalink;
		if (handleCookies.getItem(storageKey)) {
		  $(player).one('canplay', function () {
			this.currentTime = handleCookies.getItem(storageKey);
		  });
		}
	  }
	  $(player).on('ended', function () {
		handleCookies.setItem('podloveWebPlayerTime-' + params.permalink, '', new Date(2000, 1, 1));
	  });
	  // init MEJS to player
	  mejsoptions.success = function (player) {
		addBehavior(player, params, wrapper);
		if (deepLink !== false && players.length === 1) {
		  $('html, body').delay(150).animate({
			scrollTop: $('.podlovewebplayer_wrapper:first').offset().top - 25
		  });
		}
	  };
	  $(orig).replaceWith(wrapper);
	  $(player).mediaelementplayer(mejsoptions);
	});
  };
}(jQuery));
