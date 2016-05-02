<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@taglib prefix="seg" uri="http://www.springframework.org/security/tags" %>
<seg:authentication property="principal" var="u"/>
<!DOCTYPE html>
<html lang="es">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta charset="UTF-8">
        <meta name="viewport" content="initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="msapplication-tap-highlight" content="no">
        <title>Descargas de Archivos | Acceso Denegado</title>
        <link type="image/x-icon" rel="icon" href="<c:url value="/logo.png"/>"/>
        <link rel="stylesheet" type="text/css" href="<c:url value="/font-awesome.css"/>"/>
        <link rel="stylesheet" type="text/css" href="<c:url value="/theme-crisp/theme-crisp-all.css"/>"/>
        <link rel="stylesheet" href="<c:url value="/uikit.almost-flat.min.css"/>">
        <link rel="stylesheet" href="<c:url value="/error_page.min.css"/>">
        <script src="<c:url value="/analytics.js"/>"></script>
        <script type="text/javascript" src="<c:url value="/locale-es.js"/>"></script>
        <script>
            var appFolder = "<c:url value="/app"/>";
            var salirUrl = "<c:url value="/salir.html"/>";
            var nombreCompleto = "${u}";
        </script>
        <script src="<c:url value="/appAdminDescarga.js"/>"></script>
    <body class="error_page">

        <div class="error_page_header">
            <div class="uk-width-8-10 uk-container-center">
                Administración de Descargas
            </div>
        </div>
        <div class="error_page_content">
            <div class="uk-width-8-10 uk-container-center" id="centro">

            </div>
        </div>
    </body>
</html>

