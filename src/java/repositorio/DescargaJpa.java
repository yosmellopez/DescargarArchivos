package repositorio;

import java.util.List;
import model.Descarga;
import model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DescargaJpa extends JpaRepository<Descarga, Long> {

    public List<Descarga> findByDescargado(Boolean descargado);

    public List<Descarga> findByUsuarioAndNotificado(Usuario usurio, Boolean descargado);

    public List<Descarga> findByEliminar(Boolean eliminado);

}
