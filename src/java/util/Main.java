/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package util;

import java.io.File;
import java.io.IOException;
import java.nio.file.CopyOption;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 *
 * @author Yosmel
 */
public class Main {

    public static void main(String[] args) throws IOException {
//        String serverDir = System.getProperty("catalina.base");
//        bdDescarga.db
//        File file = new File(serverDir + "/bin/bdDescarga.db");
        File file = new File("E:\\Trabajo\\NetBeansProjects\\DescargarArchivos\\bdDescarga.db");
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
//        File nuevo = new File(serverDir + "/bin/bdDescarga" + dateFormat.format(new Date()) + ".db");
//        String dirDescarga = environment.getProperty("dirArchivoDescarga");
        String dirDescarga = "E:\\Trabajo\\NetBeansProjects\\DescargarArchivos";
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
    }
}
