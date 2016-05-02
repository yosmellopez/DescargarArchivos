package tareas;

import java.io.File;
import java.util.List;
import model.Descarga;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import repositorio.DescargaJpa;

@Service
public class TareaBusquedaArchivos {

    @Autowired
    Environment env;

    @Autowired
    DescargaJpa descargaJpa;

    @Scheduled(cron = "0 0-59 0-23 * * *")
    public void ejecutarTareaBusquedaDescarga() {
        String dir = env.getProperty("dirArchivoDescargado");
        File directorio = new File(dir);
        if (directorio.isDirectory()) {
            File[] listFiles = directorio.listFiles();
            List<Descarga> descargas = descargaJpa.findByDescargado(false);
            for (File file : listFiles) {
                Descarga descarga = buscarDescarga(file, descargas);
                if (descarga != null) {
                    descarga.setDescargado(true);
                    descarga.setMensaje("Su descarga ya está lista. Para descargar de clic en el enlace (Descargar)");
                    descargaJpa.saveAndFlush(descarga);
                }
            }
        }
    }

    private Descarga buscarDescarga(File file, List<Descarga> descargas) {
        for (Descarga descarga : descargas) {
            if (descarga.getNombre() != null) {
                if (descarga.getNombre().equals(file.getName())) {
                    return descarga;
                }
            }
        }
        return null;
    }
}
