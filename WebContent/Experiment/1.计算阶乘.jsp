<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>计算8的阶乘</title>
</head>
<body>
	<%!int factorial(int s){
		int f = 1;
		for(int i=1;i<=s;i++){
			f = f*i;
		}
		return f;
	}%>
	<%!int m=8;%>
	<%="8!的阶乘为："+factorial(m)%>
</body>
</html>