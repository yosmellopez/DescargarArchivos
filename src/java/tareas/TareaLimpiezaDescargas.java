/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package tareas;

import java.util.List;
import model.Descarga;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import repositorio.DescargaJpa;

@Service
public class TareaLimpiezaDescargas {

    @Autowired
    DescargaJpa descargaJpa;

    @Scheduled(cron = "0 0 0-23 * * *")
    public void limpiarDescargasEliminadas() {
        List<Descarga> descargas = descargaJpa.findByEliminar(true);
        for (Descarga descarga : descargas) {
            descargaJpa.delete(descarga);
        }
    }
}
