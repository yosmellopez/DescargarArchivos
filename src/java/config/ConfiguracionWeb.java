/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package config;

import java.util.List;
import java.util.Properties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.web.method.annotation.AuthenticationPrincipalArgumentResolver;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.JstlView;
import org.springframework.web.servlet.view.UrlBasedViewResolver;
import tareas.ServicioTareaNotificacion;
import tareas.TareaBusquedaArchivos;
import tareas.TareaLimpiezaDescargas;
import tareas.TareaLogBD;
import util.MiCorreo;

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = {"control"})
@EnableScheduling
public class ConfiguracionWeb extends WebMvcConfigurerAdapter {

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        PageableHandlerMethodArgumentResolver resolver = new PageableHandlerMethodArgumentResolver();
        resolver.setSizeParameterName("limit");
        resolver.setOneIndexedParameters(true);
        AuthenticationPrincipalArgumentResolver principalArgumentResolver = new AuthenticationPrincipalArgumentResolver();
        argumentResolvers.add(resolver);
        argumentResolvers.add(principalArgumentResolver);
    }

    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }

    @Bean
    public ViewResolver viewResolver() {
        UrlBasedViewResolver resolver = new UrlBasedViewResolver();
        resolver.setPrefix("/WEB-INF/vista/");
        resolver.setSuffix(".jsp");
        resolver.setViewClass(JstlView.class);
        return resolver;

    }

    @Bean
    public JavaMailSenderImpl mailSenderImpl() {
        JavaMailSenderImpl impl = new JavaMailSenderImpl();
        impl.setHost("10.22.1.2");
//        impl.setHost("200.14.53.69");
        impl.setPort(25);
        impl.setUsername("yosmellp");
        impl.setPassword("miultpassword3*");
        Properties properties = new Properties();
        properties.put("mail.smtp.auth", true);
        properties.put("mail.smtp.starttls.enable", false);
        impl.setJavaMailProperties(properties);
        return impl;
    }

    @Bean
    public MiCorreo miCorreo() {
        MiCorreo correo = new MiCorreo();
        correo.setMailSender(mailSenderImpl());
        return correo;
    }

    @Bean
    public ServicioTareaNotificacion servicioTareaNotificacion() {
        return new ServicioTareaNotificacion();
    }

    @Bean
    public TareaBusquedaArchivos tareaBusquedaArchivos() {
        return new TareaBusquedaArchivos();
    }

    @Bean
    public TareaLimpiezaDescargas tareaLimpiezaDescargas() {
        return new TareaLimpiezaDescargas();
    }

    @Bean
    public TareaLogBD tareaLogBD() {
        return new TareaLogBD();
    }
}
