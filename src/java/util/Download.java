package util;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import model.Descarga;
import repositorio.DescargaJpa;

public class Download extends Thread {

    private URL url = null;

    private long tamano = 0;

    private long tamanoDescarga = 20971520;

    private DescargaJpa descargaJpa;

    private Descarga descarga;

    private File file;

    public Download(URL url, Descarga descarga, DescargaJpa descargaJpa) {
        this.url = url;
        this.descargaJpa = descargaJpa;
        this.descarga = descarga;
    }

    public Download(URL url, Descarga descarga, DescargaJpa descargaJpa, File file) {
        this.url = url;
        this.descargaJpa = descargaJpa;
        this.descarga = descarga;
        this.file = file;
    }

    public Download(URL url, Descarga descarga, DescargaJpa descargaJpa, File file, long tamanoDescarga) {
        this.url = url;
        this.descargaJpa = descargaJpa;
        this.descarga = descarga;
        this.file = file;
        this.tamanoDescarga = tamanoDescarga;
    }

    @Override
    public void run() {
        try {
            HttpURLConnection urlConnection = (HttpURLConnection) this.url.openConnection();
            String contentType = urlConnection.getContentType();
            System.out.println(contentType);
            tamano = urlConnection.getContentLengthLong();
            int responseCode = urlConnection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                urlConnection.setConnectTimeout(0);
                String p = url.getFile();
                String nombre = p.substring(p.lastIndexOf("/") + 1, p.length());
                System.out.println(tamano);
                System.out.println(nombre);
                if (tamano < tamanoDescarga && tamano > 0) {
                    if (!file.exists()) {
                        file.createNewFile();
                    }
                    FileWriter writer = new FileWriter(file, true);
                    try (BufferedWriter bufferWritter = new BufferedWriter(writer)) {
                        bufferWritter.newLine();
                        bufferWritter.write(descarga.getUrl());
                    }
                    descarga.setMensaje("Descarga insertada. Su descarga será realizada luego. Por favor espere hasta que se haya descargado.");
                    descarga.setPendiente(false);
                    descarga.setNombre(nombre.replaceAll("%20", " "));
                    descarga.setEliminar(false);
                    descarga.setNotificado(false);
                    descarga.setTamano(tamano);
                    descargaJpa.saveAndFlush(descarga);
                } else {
                    descarga.setMensaje("Su descarga no se insertó porque supera el limite del tamaño de descarga. Eliminela o será eliminada luego.");
                    descarga.setPendiente(false);
                    descarga.setEliminar(true);
                    descargaJpa.saveAndFlush(descarga);
                }
            }
        } catch (IOException ioException) {
            ioException.printStackTrace();
        }
    }
}
