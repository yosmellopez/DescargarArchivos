package tareas;

import java.io.File;
import java.io.IOException;
import java.nio.file.CopyOption;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import repositorio.DescargaJpa;

@Service
public class TareaLogBD {

    @Autowired
    Environment environment;

    @Autowired
    DescargaJpa descargaJpa;

    @Scheduled(cron = "0 56 22 * * *")
    public void crearArchivoLogBD() throws IOException {
        String serverDir = System.getProperty("catalina.base");
//        bdDescarga.db
        File file = new File(serverDir + "/bin/bdDescarga.db");
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
        String dirDescarga = environment.getProperty("dirArchivoDescarga");
//        String dirDescarga = "E:\\Trabajo\\NetBeansProjects\\DescargarArchivos";
        File folderApp = new File(dirDescarga);
        File folderLogs = new File(folderApp, "logsBd");
        if (!folderLogs.exists()) {
            folderLogs.mkdir();
        }
        File nuevo = new File(folderLogs.getAbsolutePath() + "/bdDescarga" + dateFormat.format(new Date()) + ".db");
        Path FROM = Paths.get(file.getAbsolutePath());
        Path TO = Paths.get(nuevo.getAbsolutePath());
        CopyOption[] options = new CopyOption[]{
            StandardCopyOption.REPLACE_EXISTING,
            StandardCopyOption.COPY_ATTRIBUTES,};
        Files.copy(FROM, TO, options);
        descargaJpa.deleteAllInBatch();
    }
}
