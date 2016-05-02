/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package repositorio;

import model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface UsuarioJpa extends JpaRepository<Usuario, Integer>, JpaSpecificationExecutor<Usuario> {
    
    public Usuario findByUsuario(String usuario);
    
}
