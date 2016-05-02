package util;

import java.util.ArrayList;
import java.util.Collection;
import model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.core.DirContextAdapter;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.ldap.userdetails.UserDetailsContextMapper;
import org.springframework.stereotype.Service;
import repositorio.UsuarioJpa;

@Service
public class ServicioAutenticacion implements UserDetailsContextMapper {

    @Autowired
    UsuarioJpa usuarioJpa;

    @Override
    public UserDetails mapUserFromContext(DirContextOperations ctx, String username, Collection<? extends GrantedAuthority> authorities) {
        Usuario usuario = usuarioJpa.findByUsuario(username);
        ArrayList<GrantedAuthority> authoritys = new ArrayList<>();
        if (usuario == null) {
            for (GrantedAuthority authority : authorities) {
                authoritys.add(authority);
            }
            usuario = new Usuario(username, authoritys, ctx.getStringAttribute("userPrincipalName"));
            usuario.setNombreApellidos(ctx.getStringAttribute("name"));
            usuarioJpa.saveAndFlush(usuario);
        }
        if (contieneProfesores(ctx.getStringAttribute("distinguishedName"))) {
            authoritys.add(new SimpleGrantedAuthority("Profesores"));
        }
        usuario.setNombreApellidos(ctx.getStringAttribute("name"));
        usuario.setApellidos(ctx.getStringAttribute("sn"));
        usuario.setNombre(ctx.getStringAttribute("givenName"));
        usuario.setCorreo(ctx.getStringAttribute("userPrincipalName"));
        usuario.setRoles(authoritys);
        return usuario;
    }

    @Override
    public void mapUserToContext(UserDetails user, DirContextAdapter ctx) {
    }

    private boolean contieneProfesores(String attribute) {
        return attribute.contains("OU=Profesores");
    }
}
