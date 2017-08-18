/**
 * Created by hiram on 2017/2/6.
 */
var position = 20;//指针
var readerPosition = 0;
var theDeflatedPosition = 0;
var framesIndex = 0;//每个帧的下标
var maxFramesIndex = 0;
var _isLoadAll = false;
var arrayBuffer = null;
var arrayBuffer2 = null;
var dataView = null;
var date = null;
var startTime = null;
var totalSize = null;
var map = {};
var data = null;
var readFramesTimer = null;//读帧头的timmer;
var frames = new Array();//放所有信息的数组
var picUrl = new Array();//放所有图片信息
var index = 0;//放帧头的数组的下标
var date1 = null;//系统当前的时间
var date2 = null;
var date3 = null;//暂停的时间点
var isPause = false;
var allPauseTime = 0;
var isAllSmalPicLoaded = true;
var playTimer = null;
var imgCanvas2 = null;
var ctx2 = null;
var isFirstPlay = true;

function loadFile(){
    var url = 'http://localhost:63342/player/hj.cis';
    //var url = "http://www.xiaoming.com:8080/test/hj.cis";
    var xhr = new XMLHttpRequest();
   /* xhr.open('GET','http://www.xiaoming.com:8080/test/hj.cis',true);
    xhr.setRequestHeader('Access-Control-Allow-Origin',"http://www.xiaoming.com:8080/test/hj.cis");*/
    /*xhr.withCredentials = true;
    xhr.onreadystatechange = handleStateChange;*/

   /* xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");*/

    xhr.open('GET', url, true);
    xhr.responseType = "arraybuffer";
    xhr.send("aa");
    xhr.onprogress = function(e){
        $("#progress").attr('max',event.total);
        $("#progress").attr('value',event.loaded);
    }

    xhr.onload = function () {

        if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
            arrayBuffer = xhr.response;

            totalSize = arrayBuffer.byteLength;
            dataView = new DataView(arrayBuffer);
            startTime = dataView.getUint32(28,true);
            arrayBuffer = null;
            maxFramesIndex = readHeader();
            _isLoadAll = true;

        }
    }
    xhr.onerror = function(){
        throw "the net is...,please check the net.";
    }

}


function readHeader(){
    //var color = dataView.getUint32(0,true);
    var totalMillisecond = dataView.getUint32(4,true);
    var totalFrameNumber = dataView.getUint32(8,true);
    var totalWidth = dataView.getUint32(12,true);
    var totalHeight = dataView.getUint32(16,true);
    $("#videoContain").css("height",totalHeight +'px') ;
    $("#videoContain").css("width",totalWidth+'px') ;
    document.getElementById("imgCanvas").width = totalWidth;
    document.getElementById("imgCanvas").height = totalHeight;
    imgCanvas2 = document.getElementById("imgCanvas2");
    ctx2 = imgCanvas2.getContext("2d");
    imgCanvas2.addEventListener('mousewheel', doMouseWheel,false);
    var scale1 = (document.documentElement.clientWidth-20)/totalWidth;
    var scale2 = (document.documentElement.clientHeight-30)/totalHeight;
    var scale = Math.min(scale1,scale2);
    //imgCanvas2.style.width = totalWidth*2/3+"px";
    //imgCanvas2.style.height = totalHeight*2/3+"px";
   // alert(document.documentElement.clientWidth);
    imgCanvas2.style.width = totalWidth * scale + "px";
    imgCanvas2.style.height = totalHeight * scale + "px";
    imgCanvas2.setAttribute("width",totalWidth);
    imgCanvas2.setAttribute("height",totalHeight);
    $("#totalTime").html("0"+Math.floor(totalMillisecond/1024/60)+":0"+Math.floor(totalMillisecond/1024%60));
    return totalFrameNumber;
}

//读帧头--------------------------------------------------------------------------------------------
var timer2 = null;
var timer1 = setTimeout(function(){
    if(dataView != null){
        timer2 = setInterval(readEachFrames,100);
    }
},300);

var i = 0;
var picsTimer = null;
function readEachFrames(){
    if(!isAllSmalPicLoaded){
        return ;
    }
    isAllSmalPicLoaded = false ;
    if(position >= totalSize){
        clearInterval(timer2);
        return;
    }
    var frameDataSize = dataView.getUint32(position,true);
    var pictureNum = dataView.getInt32(position+4,true);
    var frameTime = dataView.getUint32(position+8,true);
    var deflatedSize = dataView.getUint32(position+12,true);
    var inflatedSize = dataView.getUint32(position+16,true);
    readerPosition = position + 20;//放到压缩数据之前
    theDeflatedPosition = position + 20;//放到压缩数据之前
    position += (20 + deflatedSize);
    var inflatedBuffer = getInflateData(inflatedSize,deflatedSize,pictureNum);
    if(pictureNum == 0){
        var array = [];
        array.push(inflatedBuffer);
        var blob=new Blob(array,{type:'image/png'});
        var reader = new FileReader();
        reader.onload = function(e) {
            var url = e.target.result;
            var image = new Image();
            image.src = url;
            image.onload = function(){
                picUrl[framesIndex] = image;
                isAllSmalPicLoaded = true ;
                framesIndex++;
            }

        }
        reader.readAsDataURL(blob);
    }else if(pictureNum < 0){

        isAllSmalPicLoaded = true ;
        picUrl[framesIndex] = null;
        framesIndex++;
    }else{
        var smallPicUrls = new Array();
        var pos=0;
        var i = 0;
        var isSmallPicLoaded = true;
        picsTimer = setInterval(function(){
            if(!isSmallPicLoaded){
                return;
            }
            isSmallPicLoaded = false;
            var picturesDataView = new DataView(inflatedBuffer);
            var smallPictureSize = picturesDataView.getUint32(pos,true);
            var _layerX = picturesDataView.getInt32(pos+4,true);
            var _layerY = picturesDataView.getInt32(pos+8,true);
            smallPicUrls[i*3] = _layerX;
            smallPicUrls[i*3+1] = _layerY;
            var _img = inflatedBuffer.slice(pos+20,pos+20+smallPictureSize);
            var _array = [];
            _array.push(_img);
            var blob=new Blob(_array,{type:'image/png'});
            var reader = new FileReader();
            reader.onload = function(e) {
               var url= e.target.result;
                var image = new Image();
                image.src=url;
                image.onload = function(){
                    smallPicUrls[i*3+2] = image;
                    pos = pos+20+smallPictureSize;
                    i++;
                    isSmallPicLoaded = true;
                    if(i == pictureNum){
                        isAllSmalPicLoaded = true ;
                        picUrl[framesIndex] = smallPicUrls;
                        framesIndex++; console.log("here");

                        i=0;
                        pos = 0;
                        clearInterval(picsTimer);
                    }
                }
            }
            reader.readAsDataURL(blob);
        },1);
/*      var smallPicUrls = new Array();
        var picturesDataView = new DataView(inflatedBuffer);
        var pos=20;
        for(var i=0;i<pictureNum;i++){
            console.log(i);
            var smallPictureSize = picturesDataView.getUint32(pos-20,true);
            var _layerX = picturesDataView.getInt32(pos+4-20,true);
            var _layerY = picturesDataView.getInt32(pos+8-20,true);
            smallPicUrls[i*3] = _layerX;
            smallPicUrls[i*3+1] = _layerY;
            console.log(_layerX+","+_layerY);
            var _rightX = picturesDataView.getInt32(pos+12-20,true);
            var _rightY = picturesDataView.getInt32(pos+16-20,true);
            //console.log(_layerX+","+_layerY+","+picturesDataView.getInt32(pos-20,true)+","+pos);
            var _img = inflatedBuffer.slice(pos,20+smallPictureSize);
            pos = pos+smallPictureSize+20;
            var _array = [];
            _array.push(_img);
            var blob=new Blob(_array,{type:'image/png'});
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = function(e) {
                var  url = e.target.result;
                smallPicUrls[i*3+2] = url;
                if(i==pictureNum){
                    picUrl[framesIndex] = smallPicUrls;
                    console.log("last framesIndex is"+framesIndex+","+pictureNum);
                }
            }
        }*/
    }
    frames[index] = frameDataSize;
    frames[++index] = pictureNum;
    frames[++index] = frameTime - startTime;
    frames[++index] = deflatedSize;
    frames[++index] = inflatedSize;
    frames[++index] = inflatedBuffer;
    index++;
}

/*
*解压拿到解压的数据
*/
//创建一个reader
    function DeflatedReader(deflateBlobLength){
        this.readByte=function(){
            if(readerPosition-theDeflatedPosition<deflateBlobLength-6){
                var b = dataView.getUint8(readerPosition+2);
                readerPosition++;
                return b;
            }
        }
}
function getInflateData(inflateLength,deflateBlobLength){
    if(inflateLength<=0||deflateBlobLength<=0){
        return new ArrayBuffer(0);
    }
    var i=0;//计数器
    var reader = new DeflatedReader(deflateBlobLength);
    var inflator = new Inflator(reader);
    var byte = new ArrayBuffer(inflateLength);
    var dataview = new DataView(byte);
    var aaa;
        while(true){
            aaa=inflator.readByte();
            if(aaa<=-1){
                break;
            }else{
                dataview.setUint8(i,aaa);
                i++;
            }
        }
    return byte;
}
var index2 = 0;
var imgNumIndex = 0;//图片数量的下标
var isAllPicShowed = true;
var imgScale = 1,//图片比例
    minScale = 1;//最小的比例
//var isSmallPicShowed = true;
function showPicture(){
     console.log(imgScale);
    //alert(allPauseTime);
     date2 = new Date().getTime()-date1-allPauseTime;
     if(date2<=frames[imgNumIndex+1]){
         console.log("**************************************************"+isAllPicShowed);
     return;
     }
    if(!isAllPicShowed){
        return;
    }
    isAllPicShowed = false;
    //isSmallPicShowed = false;
    var canvas = document.getElementById("imgCanvas");
    var ctx = canvas.getContext("2d");
    imgNumIndex = index2 * 6 +1;

    if(frames[imgNumIndex] == 0){
        var image = picUrl[index2];
        ctx2.drawImage(image,0,0);
        //ctx2.drawImage(image,0,0,image.width * imgScale,image.height * imgScale);
        //var imgUrl = imgCanvas2.toDataURL("image/png");
        isAllPicShowed = true;
            index2++;
       // }
    }else if(frames[imgNumIndex] < 0){
        isAllPicShowed = true;
        //isSmallPicShowed = true;
        index2++;
    }else{

        //var isSmallPicShowed = true;
        var urls = picUrl[index2];

        for(var i=0;i< frames[imgNumIndex];i++){
            ctx2.drawImage(urls[i*3+2],urls[i*3],urls[i*3+1]);
        }
        isAllPicShowed = true;
        index2++;

    }
    if(index2>=maxFramesIndex){
        clearInterval(playTimer);
    }
}
function pause(){
    date3 = new Date().getTime();
    isPause = true;
    clearInterval(playTimer);
    if(index2>=maxFramesIndex){
        clearInterval(playTimer);
    }
}
function jixuPlay(){
    playTimer = setInterval(showPicture,100);
}
//显示多张图片的方法
function showPictures(imgNum,imgBuffer){
    var picturesDataView = new DataView(imgBuffer);
    var pos=20;
    var canvas = document.getElementById("imgCanvas");
    var ctx = canvas.getContext("2d");
    for(var i=0;i<imgNum;i++){
        var smallPictureSize = picturesDataView.getUint32(pos-20,true);
        var _layerX = picturesDataView.getInt32(pos+4-20,true);
        var _layerY = picturesDataView.getInt32(pos+8-20,true);
        var _rightX = picturesDataView.getInt32(pos+12-20,true);
        var _rightY = picturesDataView.getInt32(pos+16-20,true);
        console.log(_layerX+","+_layerY+","+picturesDataView.getInt32(pos-20,true)+","+pos);
        var _img = imgBuffer.slice(pos,20+smallPictureSize);
        pos = pos+smallPictureSize+20;
        var _array = [];
        _array.push(_img);
        var blob=new Blob(_array,{type:'image/png'});
        var reader = new FileReader();
        reader.onload = function(e) {
          // document.getElementById("img").src = e.target.result;
            var image = new Image();
            image.src = e.target.result;
            console.log("aaa");
            ctx.drawImage(image,_layerX,_layerY);
        }
        reader.readAsDataURL(blob);
    }
}

function play(){
    if(isFirstPlay){
        date1 = new Date().getTime();
        isFirstPlay = false;
    }
    date = new Date().getTime();
    if(isPause){
        allPauseTime =(date-date3)+allPauseTime;
        isPause = false ;
    }
    //console.log(frames[12]+","+frames[13]+","+frames[14]+","+frames[15]+","+frames[16]+","+frames[17]);
    playTimer = setInterval(showPicture,100);

    //console.log(picUrl[0]);
}
//-----------------------------------------------------------------------------------------------------------------------------

function doMouseWheel(event){

        //var pos = windowToCanvas(canvas, event.clientX, event.clientY);
        event.wheelDelta = event.wheelDelta ? event.wheelDelta: (event.deltaY*(-40));
        if(event.wheelDelta > 0) {
            imgScale += 0.2;

        } else {
            var tempScale = imgScale - 0.2;
            if(tempScale >= minScale) {
                imgScale = tempScale;
            }
        }
}

function windowToCanvas(obj, x, y){
    var bbox = obj.getBoundingClientRect();
    return {
        x:x - bbox.left - (bbox.width - obj.width) / 2,
        y:y - bbox.top - (bbox.height - obj.height) / 2
    };
}