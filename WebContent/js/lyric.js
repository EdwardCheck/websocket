var lyric = null;
var lyricContainer = null;
var lyricWrapper = null;
var isScroll = false;
var currentLine = null;
var lastLine = null;
var scrollTimeOut = null;
var scrollTop = 0;

function getLyric(url) {
    lyricContainer = document.getElementById('lyricContainer');
    lyricWrapper = document.getElementById('scrollText');
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'text';
    //fix for the messy code problem for Chinese.  reference: http://xx.time8.org/php/20101218/ajax-xmlhttprequest.html
    //request['overrideMimeType'] && request.overrideMimeType("text/html;charset=gb2312");
    request.onload = function() {
        lyric = parseLyric(request.response);
        //display lyric to the page
        appendLyric(lyric);
        // searchLyric("你");
    };

    request.onerror = request.onabort = function(e) {
        lyricContainer.textContent = '!failed to load the lyric :(';
    }
    lyricContainer.textContent = 'loading lyric...';
    request.send();
}

function appendLyric() {
    var fragment = document.createDocumentFragment();
    //clear the lyric container first
    lyricContainer.innerHTML = '';
    lyric.forEach(function(v, i, a) {
        var line = document.createElement('p');
        line.id = 'line-' + i;
        line.textContent = v[1];
        fragment.appendChild(line);
        lastLine = line;
    });
    // var nullDiv = document.createElement('div');
    // nullDiv.id = 'nullDiv';
    // fragment.appendChild(nullDiv);
    lyricContainer.appendChild(fragment);
}

function parseLyric(text) {
    //get each line from the text
    var lines = text.split('\n'),
    //this regex mathes the time [00.12.78]
        pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
        result = [];

    // Get offset from lyrics
    var offset = getOffset(text);

    //exclude the description parts or empty parts of the lyric
    while (!pattern.test(lines[0])) {
        lines = lines.slice(1);
    };
    //remove the last empty item
    lines[lines.length - 1].length === 0 && lines.pop();
    //display all content on the page
    lines.forEach(function(v, i, a) {
        var time = v.match(pattern),
            value = v.replace(pattern, '');
        time.forEach(function(v1, i1, a1) {
            //convert the [min:sec] to secs format then store into result
            var t = v1.slice(1, -1).split(':');
            result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]) + parseInt(offset) / 1000, value]);
        });
    });
    //sort the result by time
    result.sort(function(a, b) {
        return a[0] - b[0];
    });
    return result;
}

function getOffset() {
    //Returns offset in miliseconds.
    var offset = 0;
    try {
        // Pattern matches [offset:1000]
        var offsetPattern = /\[offset:\-?\+?\d+\]/g,
        // Get only the first match.
            offset_line = text.match(offsetPattern)[0],
        // Get the second part of the offset.
            offset_str = offset_line.split(':')[1];
        // Convert it to Int.
        offset = parseInt(offset_str);
    } catch (err) {
        //alert("offset error: "+err.message);
        offset = 0;
    }
    return offset;
}

function updateLyric() {
    if (!lyric || isScroll) return;
    for (var i = 0, l = lyric.length; i < l; i++) {
        var line = document.getElementById('line-' + i);
        if ((i < lyric.length -1) && wavesurfer.getCurrentTime() > lyric[i+1][0]/*preload the lyric by 0.50s*/ ) {
            continue;
        }
        if (currentLine != null) {
            currentLine.className = '';
        }
        line.className = 'active';
        currentLine = line;
        var currentScrollTop;
        if (line.offsetTop > lyricWrapper.clientHeight / 2) {
            if ((lastLine.offsetTop - lyricWrapper.scrollTop + 15) > lyricWrapper.clientHeight) {
                currentScrollTop = line.offsetTop - lyricWrapper.clientHeight / 2;
            } else {
                currentScrollTop = line.offsetTop;
            }
        } else {
            currentScrollTop = 0;
        }
        // console.log("currentScrollTop = " + currentScrollTop + "    scrollTop=" + scrollTop + "   orTop=" + lyricWrapper.scrollTop);
        if (scrollTop != currentScrollTop || scrollTop != lyricWrapper.scrollTop) {
            $("#scrollText").animate({scrollTop:currentScrollTop}, 800);
            scrollTop = currentScrollTop;
        }
        break;
    };
}

function startScroll() {
    if (!isPlaying) return;
    console.log("scroll");
    isScroll = true;
}

function stopScroll() {
    if (isScroll) {
        isScroll = false;
        // if (scrollTimeOut == null) {
        //     scrollTimeOut = setTimeout(endScroll, 3000);
        // }
    }
}

function endScroll() {
    console.log("121end");
    isScroll = false;
    window.clearTimeout(scrollTimeOut);
    scrollTimeOut = null;
}

function clearSearch() {
    if (!lyric) return;
    for (var i = 0, l = lyric.length; i < l; i++) {
        var lineText = document.getElementById('line-' + i).innerText;
        document.getElementById('line-' + i).innerHTML = lineText.replaceAll("", "<span class='search_word'>");
        document.getElementById('line-' + i).innerHTML = lineText.replaceAll("", "</span>");
    };
}

function searchLyric(word) {
    if (!lyric) return;
    for (var i = 0, l = lyric.length; i < l; i++) {
        var lineText = document.getElementById('line-' + i).innerText;
        var index = lineText.indexOf(word);
        if(index == -1) continue;
        document.getElementById('line-' + i).innerHTML = lineText.replaceAll(word, "<span class='search_word'>" + word + "</span>");
    };
}

String.prototype.replaceAll = function(s1, s2){
    return this.replace(new RegExp(s1, "gm"), s2);
}