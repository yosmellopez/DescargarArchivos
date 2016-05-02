package util;

import org.springframework.security.authentication.encoding.ShaPasswordEncoder;

public class EncriptadorContrasena extends ShaPasswordEncoder {
    
    public EncriptadorContrasena() {
        super(512);
    }
    
}
