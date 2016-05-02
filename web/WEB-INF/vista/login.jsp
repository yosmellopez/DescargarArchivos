<%@page pageEncoding="UTF-8" contentType="text/html" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Iniciar Sesión</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <link type="image/x-icon" rel="icon" href="<c:url value="/logo.png"/>"/>
        <link rel="stylesheet" type="text/css" href="<c:url value="/theme-triton/theme-triton-all.css"/>"/>
        <link rel="stylesheet" type="text/css" href="<c:url value="/theme-triton/Admin-all.css"/>"/>
        <link rel="stylesheet" type="text/css" href="<c:url value="/font-awesome.css"/>"/>
        <script type="text/javascript" src="<c:url value="/ext-all.js"/>"></script>
        <script type="text/javascript" src="<c:url value="/locale-es.js"/>"></script>
        <script type="text/javascript" src="<c:url value="/sha-512.js"/>"></script>
        <script type="text/javascript">
            var nombreUsuario = '', error = '';
            nombreUsuario = "${sessionScope.LAST_USERNAME}";
            error = "${sessionScope.LAST_EXCEPTION}";
        </script>
        <script type="text/javascript" src="<c:url value="/login.js"/>"></script>
    </head>
    <body>
        <div id="contenido"></div>
        <div id="centro"></div>
    </body>
</html>
