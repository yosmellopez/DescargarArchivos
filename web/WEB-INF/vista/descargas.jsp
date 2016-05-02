<%@page pageEncoding="UTF-8" contentType="text/html" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="seg" uri="http://www.springframework.org/security/tags" %>
<seg:authentication property="principal" var="u"/>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Lista de Descargas</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <link type="image/x-icon" rel="icon" href="<c:url value="/logo.png"/>"/>
        <link rel="stylesheet" type="text/css" href="<c:url value="/font-awesome.css"/>"/>
        <link rel="stylesheet" type="text/css" href="<c:url value="/theme-crisp/theme-crisp-all.css"/>"/>
        <script type="text/javascript" src="<c:url value="/ext-all-debug.js"/>"></script>
        <script type="text/javascript" src="<c:url value="/locale-es.js"/>"></script>
        <script type="text/javascript" src="<c:url value="/Concurrent.Thread.min.js"/>"></script>
        <script>
            var appFolder = "<c:url value="/app"/>";
        </script>
        <script type="text/javascript" src="<c:url value="/appDescarga.js"/>"></script>
        <script type="text/javascript">
            var operando = false;
            var usuario = "${u.usuario}", nombreCompleto = "${u.nombreApellidos}";
            document.ready = readCookie();
            function readCookie() {
                var nameEQ = 'descargaArchivo' + "=";
                var ca = document.cookie.split(';');
                existe = false;
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) === ' ')
                        c = c.substring(1, c.length);
                    if (c.indexOf(nameEQ) === 0) {
                        existe = true;
                    }
                }
                if (!existe) {
                    window.location.replace('/DescargarArchivos/login.html');
                }
            }
        </script>
    </head>
    <body>
        <div id="contenido"></div>
        <div id="centro"></div>
    </body>
</html>
