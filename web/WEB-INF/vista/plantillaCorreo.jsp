<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<div style="min-height: 600px;">
    <div style="margin-top: 7px;">
        <div>
            <h3 style="background-color: #2752DD;text-shadow: 0 1px 0 #aecef4;padding: 10px;color: #fff;line-height: 20px;margin: 0;">
                Nuevas Notificaciones De Descargas
            </h3>
        </div>
        <div style="padding: 10px;background: #fff;">
            <div style="min-height: 500px; width: 100%;">
                <div style="width: 100%; height: 100%; position: relative; background-color: transparent;">
                    <ul style="margin: 0;max-height: 350px;overflow-y: scroll;min-width: 360px;">
                        <c:forEach items="${descargas}" var="descarga">
                            <li>
                                <a href="http://10.22.0.54:8094/DescargarArchivos/${descarga.nombre}">
                                </a>
                            </li>
                        </c:forEach>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>