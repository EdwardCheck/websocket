var audio;
var wavesurfer;
var dragStatus = false;
var volumnDragStatus = false;
var lrcTime;
var isPlaying = false;
var waveOriginW = 0;
var isHasVideo = true; // 是否有录屏
var lrcUpdateTime;
var speed = 1.0;

$().ready(function () {
    // window load
    $(window).load(function(){
        waveOriginW = $("#waveContainer").width();
        var  className = isHasVideo ? "flex-box clearfix" : "flex-box no-video clearfix";
        $("#flexBox").attr('class', className);
        var host = "http://" + window.location.host;
        loadAudio(host + "/Websocket/resource/mp3/hj.mp3", 2);
        getLyric(host + "/Websocket/resource/mp3/hj.lrc");
    })

    $(window).resize(function(){
        var waveCurrentW = $("#waveContainer").width();
        wavesurfer.zoom(waveCurrentW / waveOriginW);
    })
   
  // wavesurfer speed
    $(".speed").click(function(){
        switch(speed){
			case 1.0:
				speed=1.5;
				break;
			case 1.5:
				speed=2.0;
				break;
			case 2.0:
				speed=1.0;
				break;
		}
		wavesurfer.setPlaybackRate(speed);
		$(this).html('×'+speed);
    });

    // audio play
    $(".play").click(function(){
    	console.log(wavesurfer.getDuration());
    	if (isHasVideo) {
             start();
        }
        wavesurfer.play();
        $(".play").hide();
        $(".pause").show();
        isScroll = false;
        isPlaying = true;
        lrcUpdateTime = setInterval(updateLyric, 1000);
        // play();
       
    });

    // audio pause
    $(".pause").click(function() {
        wavesurfer.pause();
        $(".pause").hide();
        $(".play").show();
        isPlaying = false;
        clearInterval(lrcUpdateTime);
        // pause();
        if (isHasVideo) {
            closeClient();
        }
    });

    // audioProgressBar click
    $("#audioProgressBar").click(function(){
        if (event.target.id != "audio-btn") {
            var ratio = (event.offsetX / $("#audioProgressBar").width()).toFixed(2);
            var changeTime = parseInt(wavesurfer.getDuration()*ratio);
            wavesurfer.skip(changeTime - wavesurfer.getCurrentTime());
            updateAudioProgress();
        }
    });

    // audio-btn click
    var pressposition = 0;
    $("#audio-btn").mousedown(function(){
        dragStatus = true;
        pressposition = position;
    });
 
    // window move
    $(window).mousemove(function(){
        if (dragStatus) {
            var aActiveW = event.clientX - $("#forFix").position().left;
            if (aActiveW >=0 && aActiveW <= $("#audioProgressBar").width()) {
                $("#audioActive").width(aActiveW);
                var ratio = ($("#audioActive").width() / $("#audioProgressBar").width()).toFixed(2);
                var changeTime = parseInt(wavesurfer.getDuration()*ratio);
                var timeStr = formatSeconds(changeTime) + " / " + formatSeconds(wavesurfer.getDuration());
                updateAudioTime(timeStr);
            }
        }
        if (volumnDragStatus) {
            var vActiveW = event.clientX - $("#volumnActive").position().left;
            if (vActiveW >=0 && vActiveW <= $("#volumnProgressBar").width()) {
                $("#volumnActive").width(vActiveW);
                var volumn = ($("#volumnActive").width() / $("#volumnProgressBar").width()).toFixed(1);
                wavesurfer.setVolume(volumn);
            }
        }
    })
    var changeindex = 0;
    // window up
    $(window).mouseup(function(){
        if (dragStatus) {
            dragStatus = false;
            var ratio = ($("#audioActive").width() / $("#audioProgressBar").width()).toFixed(2);
            var changeTime = parseInt(wavesurfer.getDuration()*ratio);
            wavesurfer.skip(changeTime - wavesurfer.getCurrentTime());
            console.log(frameindex);
            
            if(vedioTime < wavesurfer.getDuration() * 1000){
            	if(changeTime * 1000 >= vedioTime){
            		changeindex = LastIndex;
            		for (var i=0;i<=LastIndex;i++){
                		getPictureDataPull(frames[i]);
                	}
            		 position = changeindex;
            	} else {
            		var r = (wavesurfer.getDuration() * ratio * 1000 / vedioTime).toFixed(2);
            		console.log(r);
            		changeindex = parseInt(LastIndex * r);
            		for (var i=0;i<=changeindex;i++){
                 		getPictureDataPull(frames[i]);
                 	}
            		 position = changeindex;
            		 if(typeof newtimeinterval != 'undefined'){
            			 clearInterval(newtimeinterval);
            		 }
            		 newtimer();
            	}	
            } else {
            	 changeindex = parseInt(LastIndex * ratio);
                 console.log("changeindex::"+changeindex);
            	 if (changeindex > pressposition) {
                 	for (var i=position;i<=changeindex;i++){
                 		getPictureDataPull(frames[i]);
                 	}
                 } else {
                 	for (var i=0;i<=changeindex;i++){
                 		getPictureDataPull(frames[i]);
                 	}
                 }
                 position = changeindex;
            }
        }
        volumnDragStatus = false;
    })

    // volumn-btn click
    $("#volumn-btn").mousedown(function(){
        volumnDragStatus = true;
    });

    $("#scrollText").bind('scrollstart', function(){
        startScroll();
    });

    $("#scrollText").bind('scrollstop', function(e){
        stopScroll();
    });

    // tag-btn click
    $("#tagBtn").click(function(){
        addTagRegion(30, 60);
    });
});

// load audio
function loadAudio(audioUrl, channelNum){
    // audio = $("#audio")[0];
    // audio.src = audioUrl;
    var splitChannels = (channelNum == 1) ? false : true;
    var height = (channelNum == 1) ? 80 : 40;
    wavesurfer = WaveSurfer.create({
        container: '#waveContainer',
        waveColor: '#d6e0ff',
        otherWaveColor: '#ffc2bd',
        progressColor: '#9daee6',
        otherProgressColor: '#ec8080',
        cursorColor: '#fdd9d7',
        cursorWidth: 0,
        splitChannels: splitChannels,
        height: height,
        hideScrollbar: true,
        interact: false
    });
    wavesurfer.load(audioUrl);
    wavesurfer.on('ready', onAudioLoaded);
    wavesurfer.on('audioprocess', onAudioProcess);
    wavesurfer.on('finish', onAudioFinish);
}

// audio is loaded
function onAudioLoaded() {
    // initLabelForm(0, 50, "#82DD37", "前奏");
    // initLabelForm(50, 130, "#3195E1", "曲中");
    $(".timing").html("00:00 / " + formatSeconds(wavesurfer.getDuration()));
    
    // add Time Line
    var timeline = Object.create(WaveSurfer.Timeline);
    timeline.init({
      wavesurfer: wavesurfer,
      container: '#waveform-timeline'
    });
    
    //show Tag-List Region
    var li = document.getElementById('tag-list-ul').getElementsByTagName('li').length;
    console.log("Tag-List length:"+li);
    if (li > 0) {
    	
    }
}


// audio is playing
function onAudioProcess() {
    if (!dragStatus) {
        var timeStr = formatSeconds(wavesurfer.getCurrentTime()) + " / " + formatSeconds(wavesurfer.getDuration());
        updateAudioTime(timeStr);
        updateAudioProgress();
    }
}

function listenTimer(){
//	listenInterval = setInterval(function() {
//		if((wavesurfer.getCurrentTime()-wavecurrentTime).toFixed(3) * 1000 > )
//	}, 20);
}

// audio is finished
function onAudioFinish() {
	//return audio
    wavesurfer.skipBackward(wavesurfer.getDuration());
    updateAudioProgress();
    $(".pause").hide();
    $(".play").show();
    isPlaying = false;
    
  //return vedio
    clearInterval(newtimeinterval);
//	clearInterval(timeinterval);
	ctx = $("#imgCanvas2").get(0).getContext("2d");
	frameindex = 0;
	position = 0;
	getPictureData(frames[0]);
}

// update audio progress
function updateAudioProgress(){
    var ratio = (wavesurfer.getCurrentTime() / wavesurfer.getDuration()).toFixed(4);
    $("#audioActive").width($("#audioProgressBar").width() * ratio);
// console.log("=======raido=" + ratio
// +"======width="+$("#audioProgressBar").width() * ratio);
}

// update audio time
function updateAudioTime(value){
    $(".timing").html(value);
}

function addTagRegion(start, end) {
    if (wavesurfer.regions != undefined) return;
    wavesurfer.addRegion({
        id: 'tagForm',
        start: start,
        end: end,
        drag: true,
        color: 'rgba(207, 239, 209, 0.5)',
    });
    // updateTagPosition(start, end);
}


// time format
function formatSeconds(value) {
    var hour = Math.floor(value/60/60);
    var minute = Math.floor(value/60%60);
    var second = Math.floor(value%60);
    if(hour<10){
        hour = "0" + hour;
    }
    if(minute<10){
        minute = "0" + minute;
    }
    if(second<10){
        second = "0" + second;
    }
    var result = "";
    if(hour > 0) {
        result = hour +":"+minute+":"+second;
    } else {
        result = minute+":"+second;
    }

    return result;
}

