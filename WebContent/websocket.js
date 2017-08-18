var path='';
var timeinterval = null;
var socket = null;
var ctx = null;
var height = '';
var width = '';

$().ready(function(){
	var host = window.location.host;
	path = "ws://"+host+"/Websocket/xiaoming";
});


function openWebSocket () {
	socket = new WebSocket(path);
	socket.onmessage = onMessage;
	
	socket.onerror = function(event){
		console.log("##出错了："+event.data)
	};
	socket.onclose = function(event)
     { 
        console.log("连接已关闭..."); 
     };
}

function getPictureData(frame) {
	var picture=frame.images;
	for (var j =0; j < picture.length; j++) {
		var imgData = picture[j].base64Image;
		var img_X = picture[j].x;
		var img_Y = picture[j].y;
		var image  = new Image();
		image.src = imgData ;
		var loadImg=function(image,img_X,img_Y){
			image.onload=function(){
				ctx.drawImage(image, img_X, img_Y);
			}
		};
		loadImg(image,img_X,img_Y);
	}
}

var isBasic = false;
var frames = [];
var frameRequest = {
		"framesInvokeNumber":2,
		"requestMonitorIdentify":0,
		"sectionIdentify":0,
		"startFrameIdentify":0,
		"framesCount":60
};
var basicRequest = {
		"basicInvokeNumber":5,
		"referenceNumber":"test"
}
var p=frameRequest.requestMonitorIdentify;

function onMessage (event) {
	var url = event.data;
	var json = JSON.parse(url);
	console.log(json);
	
	if(!isBasic){
		if(frameRequest.requestMonitorIdentify == -1){
			height = Math.max(json.monitors[0].height,json.monitors[1].height);
			width = json.monitors[0].width + json.monitors[1].width;
		}else{
			height = json.monitors[frameRequest.requestMonitorIdentify].height;
			width = json.monitors[frameRequest.requestMonitorIdentify].width;
		}
		 var imgcanvas = document.getElementById("imgCanva");
		 imgcanvas.setAttribute("width", width);
		 imgcanvas.setAttribute("height", height);
		 var ScreenHeight = document.documentElement.clientHeight - 350;
		 var ScreenWidth = document.body.offsetWidth - 150;
		 var scale1 = ScreenHeight / 1080;
		 var scale2 = ScreenWidth / 1920;
		 var scale = Math.min(scale1, scale2);
		 imgcanvas.style.width = width * scale + "px";
		 imgcanvas.style.height = height * scale + "px";
		 ctx = imgcanvas.getContext("2d");	
		 socket.send(JSON.stringify(frameRequest));
		 isBasic = true;
		return;
	}
	if(p!=frameRequest.requestMonitorIdentify){
		if(frameRequest.requestMonitorIdentify == -1){
			height=Math.max(json.frames[0].images[0].height,json.frames[0].images[1].height);
			var x=0;
			for(var i=0;i<json.frames[0].images.length;i++){
				x+=json.frames[0].images[i].width;
			}
			width=x;
		}else{
			height=json.frames[0].images[0].height;
			width=json.frames[0].images[0].width;
		}
		 var imgcanvas = document.getElementById("imgCanva");
		 imgcanvas.setAttribute("width", width);
		 imgcanvas.setAttribute("height", height);
		 var ScreenHeight = document.documentElement.clientHeight - 350;
		 var ScreenWidth = document.body.offsetWidth - 150;
		 var scale1 = ScreenHeight / 1080;
		 var scale2 = ScreenWidth / 1920;
		 var scale = Math.min(scale1, scale2);
		 imgcanvas.style.width = width * scale + "px";
		 imgcanvas.style.height = height * scale + "px";
		 ctx = imgcanvas.getContext("2d");	
		 p=frameRequest.requestMonitorIdentify;
	}
	var frameindex=0;
	frames=json.frames;
	console.log("图片帧数："+frames.length);
	timeinterval=setInterval(
		function(){
			getPictureData(frames[frameindex]); 
				frameindex++;
				if(frameindex>=frames.length){
					clearInterval(timeinterval);
				}
		},1000);
}

function start() {
	var button=document.getElementById("button0");	
	if(button.innerHTML=="开始"){	
		openWebSocket();
		button.innerHTML="停止";
		this.waitForConnection(function () {  
			var b ;
			if (typeof callback !== 'undefined') {  
		          callback();  
		    }  
			if (height!='' && width!='') {
				b=JSON.stringify(frameRequest);
				console.log("发送frame消息："+b);
				socket.send(b);
			} else {
				b=JSON.stringify(basicRequest);
				console.log("发送basic消息："+b);
				socket.send(b);
			}
	       
	    },60);
		
	}else{
		closeClient();
		button.innerHTML="开始";
	}

	
}

function waitForConnection(callback, interval) {  
    if (socket.readyState === 1) {  
        callback();  
    } else {  
        var that = this;  
        setTimeout(function () {  
            that.waitForConnection(callback, interval);  
        }, interval);  
    }  
};  

function closeClient () {
	 clearInterval(timeinterval);
	 socket.close();
	 socket=null;
	
}

window.onbeforeunload = function () {
//	closeClient();
	
}

function select(){
    var objS = document.getElementById("select");
    var selectedvalue = objS.options[objS.selectedIndex].value;
    frameRequest.requestMonitorIdentify = parseInt(selectedvalue);
}