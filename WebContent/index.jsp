<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE HTML>
<html>
  <head>
    <base href="<%=basePath%>">
    <title>My JSP 'index.jsp' starting page</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<style type="text/css">
		*{
           padding: 0px;
           margin: 0px auto;
      	 }
      	 #button0{margin: 20px; size: 20px;
		    border-radius: 3px;
		    padding: 0 15px;
		    display: inline-block;
		    vertical-align: middle;
		    line-height: 32px;
		    text-transform: capitalize;
		    border-style: solid;
		    border-width: 1px;
		    cursor:pointer;}
      	 #button1{margin-left: 50px;margin-top: 10px; 
		    border-radius: 3px;
		    padding: 0 15px;
		    display: inline-block;
		    vertical-align: middle;
		    line-height: 32px;
		    text-transform: capitalize;
		    border-style: solid;
		    border-width: 1px;
		    cursor:pointer;}
      	 #button2{margin-left: 50px;margin-top: 10px; 
		    border-radius: 3px;
		    padding: 0 15px;
		    display: inline-block;
		    vertical-align: middle;
		    line-height: 32px;
		    text-transform: capitalize;
		    border-style: solid;
		    border-width: 1px;
		    cursor:pointer;}
      	 #choose_file{
			height: 32px;
		    background: #fff;
		    border-radius: 3px;
		    padding: 0 15px;
		    display: inline-block;
		    vertical-align: middle;
		    line-height: 32px;
		    text-transform: capitalize;
		    border-style: solid;
		    border-width: 1px;
		    cursor:pointer;
		    float: left;
		}
	.scroll{
	  
      width: 100px;
      height: 5px;
      background: #ccc;
      position: relative;
    }
    .bar{
      position: absolute;
      width: 5px;
      height: 10px;
      background: #369;
      top: -3px;
      left: 0%;
      cursor: pointer;
    }
    .mask{
      position: absolute;
      left: 0;
      top: 0;
      background: #369;
      width: 0%;
      height: 5px;
    }
	</style>
  </head>
  
<body>
  	
 <div id = "imgPlayer"  style = "text-align:center;border: solid;">
        <canvas id="imgCanva" OnClick=""  width="480px" height="320px" style = "border: solid;margin-top:10px"></canvas>
    
     <div>
     	<select id="select" onchange="select()" style="width:120px;">
     		<option value="0">0</option>
     		<option value="1">1</option>
     		<option value="-1">-1</option>
     	</select>
    	<button id="button0" OnClick="start()" value="开始">开始</button>
    </div>
   </div>
	<script src="jquery-1.8.3.min.js"></script>
	<script type="text/javascript" src="websocket.js"></script>
  
  </body>
</html>
