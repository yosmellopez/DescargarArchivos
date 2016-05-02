package control;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.Date;
import javax.persistence.PersistenceException;
import javax.servlet.http.HttpServletRequest;
import model.Descarga;
import model.Usuario;
import org.hibernate.exception.SQLGrammarException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpRequest;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;
import repositorio.DescargaJpa;
import repositorio.UsuarioJpa;
import util.Download;
import util.MapeadorObjetos;

@Controller
public class DescargaControl {

    @Autowired
    Environment environment;

    @Autowired
    DescargaJpa descargaJpa;

    @Autowired
    UsuarioJpa usuarioJpa;

    @Autowired
    MapeadorObjetos mapeadorObjetos;

    @RequestMapping(value = "descarga.json", method = RequestMethod.POST)
    public ModelAndView insertarDescarga(HttpServletRequest request, @RequestBody Descarga descarga, @AuthenticationPrincipal Usuario user) throws IOException {
        String property = environment.getProperty("dirArchivoDescarga");
        String tamano = environment.getProperty("tamanoDescarga");
        long calcularTamano = calcularTamano(tamano);
        System.out.println(calcularTamano);
        File file = new File(property + "/archivo.txt");
        String ip = request.getRemoteHost();
        System.out.println(ip);
        ModelMap map = new ModelMap();
        descarga.setUsuario(user);
        descarga.setDescargado(false);
        descarga.setPendiente(true);
        descarga.setMensaje("Descarga pendiente de inserción");
        descarga.setFecha(new Date());
        descarga.setIp(ip);
//        descargaJpa.saveAndFlush(descarga);
        Download download = new Download(new URL(descarga.getUrl()), descarga, descargaJpa, file, calcularTamano);
        download.start();
        map.put("lista", descarga);
        map.put("success", true);
        return new ModelAndView(new MappingJackson2JsonView(mapeadorObjetos), map);
    }

    @RequestMapping(value = "/descarga.json", method = RequestMethod.GET)
    public ModelAndView listarDescargas(Pageable p, ModelMap map) {
        Page<Descarga> findAll = descargaJpa.findAll(p);
        map.put("lista", findAll.getContent());
        map.put("total", findAll.getTotalElements());
        return new ModelAndView(new MappingJackson2JsonView(mapeadorObjetos), map);
    }

    @RequestMapping(value = "/descarga.json/{idDescarga}", method = RequestMethod.DELETE)
    public ModelAndView eliminarDescarga(@PathVariable("idDescarga") Descarga descarga, @AuthenticationPrincipal Usuario user, ModelMap map) {
        if (user != null) {
            if (user.contieneRol("Administradores") || descarga.getUsuario().getIdUsuario() == user.getIdUsuario()) {
                descargaJpa.delete(descarga);
                map.put("success", true);
            } else {
                map.put("success", false);
                map.put("msg", "Usted no puede eliminar una descarga que no insertó");
            }
        } else {
            map.put("success", false);
            map.put("msg", "No se puede eliminar la descarga porque su sesión ha expirado. <br/>Inicie Sesión e inténtelo de nuevo");
        }
        return new ModelAndView(new MappingJackson2JsonView(mapeadorObjetos), map);
    }

    @RequestMapping(value = "/descarga.json/{idDescarga}", method = RequestMethod.PUT)
    public ModelAndView modificarDescarga(@RequestBody Descarga d, @PathVariable("idDescarga") Descarga descarga, @AuthenticationPrincipal Usuario user, ModelMap map) {
        if (user != null) {
            if (descarga.getUsuario().getIdUsuario() == user.getIdUsuario()) {
                descarga.setUrl(d.getUrl());
                descargaJpa.saveAndFlush(descarga);
                map.put("success", true);
            } else {
                map.put("success", false);
                map.put("msg", "Usted no puede modificar una descarga que no insertó");
            }
        } else {
            map.put("success", false);
            map.put("msg", "No se puede modificar la descarga porque su sesión ha expirado. <br/>Inicie Sesión e inténtelo de nuevo");
        }
        return new ModelAndView(new MappingJackson2JsonView(mapeadorObjetos), map);
    }

    @ExceptionHandler(Exception.class)
    public ModelAndView tratarExcepcion(Exception e) {
        ModelMap modelMap = new ModelMap();
        if (e instanceof JpaSystemException) {
            JpaSystemException jse = (JpaSystemException) e;
            modelMap.put("msg", tratarMensaje(jse.getMostSpecificCause()));
        } else if (e instanceof PersistenceException) {
            JpaSystemException exception = new JpaSystemException((PersistenceException) e);
            modelMap.put("msg", tratarMensaje(exception.getMostSpecificCause()));
        } else if (e instanceof DataIntegrityViolationException) {
            DataIntegrityViolationException exception = (DataIntegrityViolationException) e;
            modelMap.put("msg", tratarMensaje(exception.getMostSpecificCause()));
        } else if (e instanceof SQLGrammarException) {
            SQLGrammarException exception = (SQLGrammarException) e;
            modelMap.put("msg", tratarMensaje(exception.getCause()));
        } else {
            modelMap.put("msg", e.getMessage());
        }
        modelMap.put("success", false);
        return new ModelAndView(new MappingJackson2JsonView(mapeadorObjetos), modelMap);
    }

    private String tratarMensaje(Throwable e) {
        String message = e.getMessage();
        if (message.contains("ci_unico")) {
            return "Ya existe un aspirante con este no. identidad.";
        } else if (message.contains("nombre_apellidos_unico")) {
            return "Ya existe un aspirante con este nombre y apellidos.";
        } else if (message.contains("fk_resumen_sicometrico_aspirante")) {
            return "No se puede eliminar este aspirante porque todavía está siendo usado en documento aprobatorio. Para eliminarlo debe eliminar el documento aprobatorio.";
        } else if (message.contains("fk_resumen_sicometrico_aspirante")) {
            return "No se puede eliminar este aspirante porque todavía está siendo usado en resumen psicométrico. Para eliminarlo debe eliminar el resumen psicométrico.";
        } else if (message.contains("fk_departamento_id_facultad")) {
            return "No se puede eliminar esta facultad porque contiene departamentos.";
        } else {
            return message;
        }
    }

    private long calcularTamano(String tamano) {
        String tam = tamano.substring(0, tamano.length() - 1);
        String unidad = tamano.substring(tamano.length() - 1);
        long size = Long.parseLong(tam);
        switch (unidad.toUpperCase()) {
            case "B":
                return size;
            case "K":
                return size * 1024;
            case "M":
                return size * 1048576;
            case "G":
                return size * 1073741824;
            case "T":
                return size * 107374182400L;
        }
        return 0;
    }
}
