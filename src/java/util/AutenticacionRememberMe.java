package util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import repositorio.UsuarioJpa;

@Service
public class AutenticacionRememberMe implements UserDetailsService {

    @Autowired
    UsuarioJpa usuarioJpa;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return usuarioJpa.findByUsuario(username);
    }

}
