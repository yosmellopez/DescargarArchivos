package config;

import java.io.File;
import javax.servlet.Filter;
import javax.servlet.MultipartConfigElement;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;
import javax.servlet.annotation.MultipartConfig;
import org.springframework.orm.jpa.support.OpenEntityManagerInViewFilter;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.filter.DelegatingFilterProxy;
import org.springframework.web.multipart.support.MultipartFilter;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

public class InicializadorAplicacion extends AbstractAnnotationConfigDispatcherServletInitializer {

    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class[]{AppPrincipalConfig.class, AppAdminConfig.class, SeguridadApp.class};
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class[]{ConfiguracionWeb.class};
    }

    @Override
    protected String[] getServletMappings() {
        return new String[]{"/"};
    }

    @Override
    protected Filter[] getServletFilters() {
        CharacterEncodingFilter filter = new CharacterEncodingFilter("UTF-8");
        filter.setForceEncoding(true);
        return new Filter[]{new OpenEntityManagerInViewFilter(), new DelegatingFilterProxy("springSecurityFilterChain"), new MultipartFilter(), filter};
    }

    @Override
    protected void customizeRegistration(ServletRegistration.Dynamic registration) {
        String uploadDir = System.getProperty("catalina.base") + "/work/Catalina/localhost/DescargarArchivos/bdDescarga/";
        File file = new File(uploadDir);
        if (!file.exists()) {
            file.mkdir();
        }
        MultipartConfigElement element = new MultipartConfigElement(uploadDir, 1000000000000000L, 1000000000000000L, 0);
        registration.setMultipartConfig(element);
    }

}
