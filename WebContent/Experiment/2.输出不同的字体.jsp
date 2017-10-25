<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>打印不同字号的字体</title>
</head>
<body>
	<table>
	 <% // 循环 %>    
	 <% /* 循环 */ %>
	<%
	for(int i=1;i<=7;i++)
	{
		out.print("<tr><font size=");%>
		<%=i%>
		<%out.print("px>size=");%>
		<%=i%>
		<%
		out.print("号字体：Hello World！</font></tr><br>");
	}%>
	</table> 
	
</body>
</html>