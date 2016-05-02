package tareas;

import java.util.List;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import model.Descarga;
import model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ViewResolver;
import repositorio.DescargaJpa;
import repositorio.UsuarioJpa;
import util.MiCorreo;

@Service
public class ServicioTareaNotificacion {

    @Autowired
    ViewResolver viewResolver;

    @Autowired
    MiCorreo miCorreo;

    @Autowired
    DescargaJpa descargaJpa;

    @Autowired
    UsuarioJpa usuarioJpa;

    @Autowired
    Environment environment;

    @Scheduled(cron = "0 0-59 0-23 * * *")
    public void ejecutarBusquedaNotificaciones() throws Exception {
        List<Usuario> findAll = usuarioJpa.findAll(new Specification<Usuario>() {
            @Override
            public Predicate toPredicate(Root<Usuario> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                Join<Usuario, Descarga> join = root.join("descargas");
                return cb.and(cb.equal(join.get("descargado"), true), cb.equal(join.get("notificado"), false));
            }
        });
        for (Usuario usuario : findAll) {
            List<Descarga> descargas = descargaJpa.findByUsuarioAndNotificado(usuario, false);
            miCorreo.setAsunto("Nuevas notificaciones del sistema de descargas");
            miCorreo.setFrom("WebDescargaArchivos");
            miCorreo.setMensaje(mostrarMensaje(descargas));
            miCorreo.setTo(usuario.getCorreo());
            miCorreo.sendMail();
            for (Descarga descarga : descargas) {
                descarga.setNotificado(true);
                descargaJpa.saveAndFlush(descarga);
            }
        }
    }

    public String mostrarMensaje(List<Descarga> descargas) {
        String mensaje = "<div style=\"min-height: 600px;\"><div style=\"margin-top: 7px;\"><div>\n"
                + "<h3 style=\"background-color: #2752DD;text-shadow: 0 1px 0 #aecef4;padding: 10px;color: #fff;line-height: 20px;margin: 0;\">\n"
                + "Descargas completadas</h3></div><div style=\"padding: 10px;background: #fff;\">\n"
                + "<div style=\"min-height: 500px; width: 100%;\"><div style=\"width: 100%; height: 100%; position: relative; background-color: transparent;\">\n"
                + "<ul style=\"margin: 0;max-height: 350px;overflow-y: scroll;min-width: 360px;\">";
        for (Descarga descarga : descargas) {
            mensaje += "<li><a href=\"http://10.22.0.54/Descargas_Programadas/" + descarga.getNombre() + "\">" + descarga.getNombre() + "</a></li>";
        }
        return mensaje += "</ul></div></div></div></div></div>";
    }

}
