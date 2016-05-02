package config;

import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.ldap.authentication.ad.ActiveDirectoryLdapAuthenticationProvider;
import org.springframework.security.web.authentication.rememberme.PersistentTokenBasedRememberMeServices;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;
import util.AutenticacionExitosa;
import util.AutenticacionFallida;
import util.AutenticacionRememberMe;
import util.EncriptadorContrasena;
import util.JdbcPersistenceTokenRepository;
import util.ServicioAutenticacion;

@EnableWebSecurity
@Configuration
public class SeguridadApp extends WebSecurityConfigurerAdapter {

    @Autowired
    ServicioAutenticacion autenticacion;

    @Autowired
    AutenticacionRememberMe rememberMe;

    @Autowired
    EncriptadorContrasena encriptadorContrasena;

    @Autowired
    DataSource dataSource;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(authenticationProvider());
//        auth.ldapAuthentication().userDnPatterns("uid={0},ou=users,ou=system").userDetailsContextMapper(autenticacion)
//                .contextSource(contextSource()).ldapAuthoritiesPopulator(ldapAuthoritiesPopulator());
//                .passwordCompare().passwordEncoder(encriptadorContrasena);
//        auth.inMemoryAuthentication().withUser("yosmel").password("123").roles("Admin", "User").and().withUser("ricardo").password("123").roles("Admin");
    }

    @Override
    //CN=Internet_VRIP,OU=squid,DC=ult,DC=edu,DC=cu
    protected void configure(HttpSecurity http) throws Exception {
        http.headers().frameOptions().disable().and().csrf().disable().exceptionHandling().accessDeniedPage("/denegado.html").and()
                .authorizeRequests().antMatchers("/inicio.html").hasAnyAuthority("Profesores",/* "Internet_VRIP",*/ "Administradores").and().
                formLogin().loginPage("/").loginProcessingUrl("/login_check").successHandler(autenticacionExitosa())
                .passwordParameter("password").usernameParameter("usuario").failureHandler(autenticacionFallida()).and()
                .logout().logoutSuccessUrl("/").logoutUrl("/salir.html").deleteCookies("descargaArchivo").and()
                .rememberMe().rememberMeServices(rememberMeServices());
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/recursos/**");
    }

//    @Bean
//    public AuthenticationProvider authenticationProvider() {
//        LdapAuthenticationProvider provider = new LdapAuthenticationProvider(bindAuthenticator(), ldapAuthoritiesPopulator());
//        provider.setUserDetailsContextMapper(autenticacion);
//        provider.setUseAuthenticationRequestCredentials(false);
//        return provider;
//    }
//
//    @Bean
//    public DefaultSpringSecurityContextSource contextSource() {
//        DefaultSpringSecurityContextSource source = new DefaultSpringSecurityContextSource("ldap://localhost:10389/");
//        source.setUserDn("uid=admin,ou=system");
//        source.setPassword("secret");
//        return source;
//    }
//
//    @Bean
//    public BindAuthenticator bindAuthenticator() {
//        BindAuthenticator authenticator = new BindAuthenticator(contextSource());
//        authenticator.setUserDnPatterns(new String[]{"uid={0}", "ou=users", "ou=system"});
//        return authenticator;
//    }
//
//    @Bean
//    public DefaultLdapAuthoritiesPopulator ldapAuthoritiesPopulator() {
//        DefaultLdapAuthoritiesPopulator dlap = new DefaultLdapAuthoritiesPopulator(contextSource(), "ou=groups,ou=system");
//        dlap.setGroupSearchFilter("(uniqueMember={0})");
//        dlap.setConvertToUpperCase(false);
//        dlap.setRolePrefix("");
//        return dlap;
//    }
    @Bean
    public ActiveDirectoryLdapAuthenticationProvider authenticationProvider() {
        ActiveDirectoryLdapAuthenticationProvider provider = new ActiveDirectoryLdapAuthenticationProvider("ult.edu.cu", "ldap://10.22.0.4/");
        provider.setUserDetailsContextMapper(autenticacion);
        return provider;
    }

    @Bean
    public AutenticacionFallida autenticacionFallida() {
        AutenticacionFallida fallida = new AutenticacionFallida();
        fallida.setUsernameParameter("usuario");
        return fallida;
    }

    @Bean
    public PersistentTokenRepository persistentTokenRepository() {
        JdbcPersistenceTokenRepository db = new JdbcPersistenceTokenRepository();
        db.setDataSource(dataSource);
        db.setCreateTableOnStartup(true);
        return db;
    }

    @Bean
    public PersistentTokenBasedRememberMeServices rememberMeServices() {
        PersistentTokenBasedRememberMeServices services = new PersistentTokenBasedRememberMeServices("myappkey", rememberMe, persistentTokenRepository());
        services.setParameter("recordarme");
        services.setCookieName("usuarioRecordado");
        return services;
    }

    @Bean
    public AutenticacionExitosa autenticacionExitosa() {
        return new AutenticacionExitosa();
    }
}
