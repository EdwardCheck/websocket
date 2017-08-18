var path = '';
var timeinterval = null;
var socket = null;
var ctx = null;
var height = '';
var width = '';
var timeIntervalDuration = 0;

var isBasic = false;//是否为basic请求
var frames = [];//存放请求的cis的所有数据
var frameRequest = {
	"framesInvokeNumber" : 2,
	"requestMonitorIdentify" : 0,
	"sectionIdentify" : 0,
	"startFrameIdentify" : 0,
	"framesCount" : 60
};
var basicRequest = {
	"basicInvokeNumber" : 5,
	"referenceNumber" : "test"
}

var p = frameRequest.requestMonitorIdentify;//screen id
var frameindex = 0;
var videoTime = 0;
var videoDuration = 0;//视频总时长
var FirstbeginningMilliseconds = 0;//视频起始时间
var LastendingMilliseconds = 0;//最终视频结束时间
var LastIndex = 0;//最终显示视频的最大帧
var isBig = false; //视频时长是否大于音频时长
var durationarr = [];

$().ready(function() {
	var host = window.location.host;
	path = "ws://" + host + "/Websocket/xiaoming";

	$("#dropBox").mouseover(function() {
		$("#screenDrop").show();
	})

	$("#dropBox").mouseout(function() {
		$("#screenDrop").hide();
	})
	
	openWebSocket();
	if (frames.length == 0) {
		waitForConnection(function() {
			var b;
			if (typeof callback !== 'undefined') {
				callback();
			}
			if (height != '' && width != '') {
				b = JSON.stringify(frameRequest);
				console.log("send frame msg：" + b);
				socket.send(b);
			} else {
				b = JSON.stringify(basicRequest);
				console.log("send basic msg：" + b);
				socket.send(b);
			}
		}, 50);
	}
});

function openWebSocket() {
	socket = new WebSocket(path);
	socket.onmessage = onMessage;

	socket.onerror = function(event) {
		console.log("##connect error：" + event.data)
	};
	socket.onclose = function(event) {
		console.log("connection closed...");
	};
}

function getPictureData(frame) {
	var picture = frame.images;
	for (var j = 0; j < picture.length; j++) {
		var imgData = picture[j].base64Image;
		var img_X = picture[j].x;
		var img_Y = picture[j].y;
		var image = new Image();
		image.src = imgData;
		var loadImg = function(image, img_X, img_Y) {
			image.onload = function() {
				ctx.drawImage(image, img_X, img_Y);
			}
		};
		loadImg(image, img_X, img_Y);
	}
}

function getPictureDataPull(frame) {
	var picture = frame.images;
	for (var j = 0; j < picture.length; j++) {
		var imgData = picture[j].base64Image;
		var img_X = picture[j].x;
		var img_Y = picture[j].y;
		var image = new Image();
		image.src = imgData;
		var loadImg = function(image, img_X, img_Y) {
			image.onload = function() {
				ctx.drawImage(image, img_X, img_Y);
			}
		};
		loadImg(image, img_X, img_Y);
	}
}

function onMessage(event) {
	var url = event.data;
	var json = JSON.parse(url);
	console.log(json);

	if (!isBasic) {
		if (frameRequest.requestMonitorIdentify == -1) {
			height = Math.max(json.monitors[0].height, json.monitors[1].height);
			width = json.monitors[0].width + json.monitors[1].width;
		} else {
			height = json.monitors[frameRequest.requestMonitorIdentify].height;
			width = json.monitors[frameRequest.requestMonitorIdentify].width;
		}
		$("#imgCanvas2").attr({
			"width" : width,
			"height" : height
		});
		var scale1 = $("#videoBox").height() / height;
		var scale2 = $("#videoBox").width() / width;
		var scale = Math.min(scale1, scale2);
		$("#imgCanvas2").css({
			"width" : width * scale + "px",
			"height" : height * scale + "px"
		});
		ctx = $("#imgCanvas2").get(0).getContext("2d");
		frameRequest.framesCount = json.sections[0].frameCount;
		vedioTime = vedioDuration = json.totalDurationMilliseconds;
		
		isBig = vedioDuration > wavesurfer.getDuration()*1000;
		if (isBig) {
			vedioDuration = parseInt(wavesurfer.getDuration());
		}
		console.log(vedioDuration);
		socket.send(JSON.stringify(frameRequest));
		isBasic = true;
		return;
	}
	if (p != frameRequest.requestMonitorIdentify) {
		if (frameRequest.requestMonitorIdentify == -1) {
			height = Math.max(json.frames[0].images[0].height,
					json.frames[0].images[1].height);
			var x = 0;
			for (var i = 0; i < json.frames[0].images.length; i++) {
				x += json.frames[0].images[i].width;
			}
			width = x;
		} else {
			height = json.frames[0].images[0].height;
			width = json.frames[0].images[0].width;
		}
		$("#imgCanvas2").attr({
			"width" : width,
			"height" : height
		});
		var scale1 = $("#videoBox").height() / height;
		var scale2 = $("#videoBox").width() / width;
		var scale = Math.min(scale1, scale2);
		$("#imgCanvas2").css({
			"width" : width * scale + "px",
			"height" : height * scale + "px"
		});
		ctx = $("#imgCanvas2").get(0).getContext("2d");
		p = frameRequest.requestMonitorIdentify;
	}

	frames = json.frames;
	getPictureData(frames[0]);
	console.log("frames ：" + frames.length);
	if(isBig){
		console.log("***vedioTime more than audioTime***");
		FirstbeginningMilliseconds = frames[0].beginningMilliseconds;
		LastendingMilliseconds = parseInt(FirstbeginningMilliseconds + vedioDuration * 1000);
		console.log(FirstbeginningMilliseconds+";"+LastendingMilliseconds);
		LastIndex = getindex(frames,LastendingMilliseconds);
	} else {
		FirstbeginningMilliseconds = frames[0].beginningMilliseconds;
		LastendingMilliseconds = frames[frames.length-1].endingMilliseconds;
		LastIndex = frames.length - 1;
	}
	for(var i=0;i<=LastIndex;i++){
		var a = frames[i].beginningMilliseconds - frames[0].beginningMilliseconds;
		durationarr.push(a);
	}
	console.log(LastIndex);
	
}

var fullFrameindex = [];
//当视频时长大于音频时长,以音频时长为准;获取最后一帧的位置
function getindex(arr,value){
	for(var i in arr){
		if(arr[i].endingMilliseconds >= value && arr[i].beginningMilliseconds < value){
			return i;
		}
	}
	return -1;
}

var position = 0;
function newtimer() {
	newtimeinterval = setInterval(function() {
			if((wavesurfer.getCurrentTime().toFixed(3) * 1000 >= durationarr[position])){
					getPictureData(frames[position]);
					position++;
			}
			if(position > LastIndex){
				clearInterval(newtimeinterval);
				console.log("*****clear  newtimeinterval*****");
			}
	}, 50);
}

function start() {
	newtimer();
}
		
function waitForConnection(callback, interval) {
	if (socket.readyState === 1 && parseInt(wavesurfer.getDuration()) != 0) {
		callback();
	} else {
		var that = this;
		setTimeout(function() {
			that.waitForConnection(callback, interval);
		}, interval);
	}
};

function closeClient() {
	clearInterval(timeinterval);
	
}

//选择录屏显示器
function select(index, label) {
	frameRequest.requestMonitorIdentify = index;
	$("#screenLabel").html(label);
	$("#screenDrop").hide();
}

//页面离开或者浏览器关闭的时候给予提示 防止用户误操作 离开当前页面未保存数据可能丢失  
window.onbeforeunload = function(event) {  
    return beforunload(event);  
};  

function beforunload(event) {  
    event = event ? event : (window.event ? window.event : null);  
    console.log(socket ==null);
    if (socket !=null) {
    	frames = [];
   	 	socket.close();
   	 	socket = null;
    } else {  
    	frames = [];
    }  
}  
  
/*** 
 * 获取当前浏览器类型 
 */  
function myBrowser() {  
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
    var isOpera = userAgent.indexOf("Opera") > -1;  
    if (isOpera) { //判断是否Opera浏览器  
        return "Opera"  
    };  
    if (userAgent.indexOf("Firefox") > -1) { //判断是否Firefox浏览器  
        return "FF";  
    };  
    if (userAgent.indexOf("Chrome") > -1){  
        return "Chrome";  
    };  
    if (userAgent.indexOf("Safari") > -1) { //判断是否Safari浏览器  
        return "Safari";  
    };  
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) { //判断是否IE浏览器  
        return "IE";  
    };  
}  