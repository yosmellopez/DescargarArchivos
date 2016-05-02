package config;

import java.util.Properties;
import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import util.AutenticacionRememberMe;
import util.EncriptadorContrasena;
import util.MapeadorObjetos;
import util.ServicioAutenticacion;

@Configuration
@EnableWebMvc
@EnableJpaRepositories(basePackages = {"repositorio"})
@EnableTransactionManagement
@EnableSpringDataWebSupport
@PropertySource(value = {"/WEB-INF/config.properties"})
public class AppPrincipalConfig {

    @Autowired
    Environment environment;

    @Bean(name = "dataSource")
    public DataSource dataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource("jdbc:sqlite:bdDescarga.db");
        dataSource.setDriverClassName("org.sqlite.JDBC");
        dataSource.setUsername("");
        dataSource.setPassword("");
        return dataSource;
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        LocalContainerEntityManagerFactoryBean factory = new LocalContainerEntityManagerFactoryBean();
        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        vendorAdapter.setGenerateDdl(Boolean.TRUE);
        vendorAdapter.setShowSql(Boolean.FALSE);
        factory.setDataSource(dataSource());
        Properties p = new Properties();
        p.put("hibernate.dialect", "sqlDriver.SQLiteDialect5");
        factory.setJpaProperties(p);
        factory.setJpaVendorAdapter(vendorAdapter);
        factory.setPackagesToScan("model");
        factory.setPersistenceUnitName("DescargaArchivos");
        factory.afterPropertiesSet();
        return factory;
    }

    @Bean(name = "transactionManager")
    public PlatformTransactionManager transactionManager() {
        EntityManagerFactory emf = entityManagerFactory().getObject();
        return new JpaTransactionManager(emf);
    }

    @Bean(name = "messageSource")
    public MessageSource configureMessageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasename("/WEB-INF/messages");
        messageSource.setCacheSeconds(0);
        return messageSource;
    }

    @Bean
    public MapeadorObjetos mapeadorObjetos() {
        return new MapeadorObjetos();
    }

    @Bean
    public ServicioAutenticacion servicioAutenticacion() {
        return new ServicioAutenticacion();
    }

    @Bean
    public AutenticacionRememberMe autenticacionRememberMe() {
        return new AutenticacionRememberMe();
    }

    @Bean
    public EncriptadorContrasena encriptadorContrasena() {
        return new EncriptadorContrasena();
    }
}
