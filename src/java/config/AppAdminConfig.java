package config;

import java.util.Properties;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Configuration
@EnableWebMvc
@EnableJpaRepositories(basePackages = {"repositorioAdmin"}, entityManagerFactoryRef = "entityManagerFactoryLogs", transactionManagerRef = "transactionManager")
@EnableTransactionManagement
@EnableSpringDataWebSupport
public class AppAdminConfig {

    @Autowired
    Environment environment;

    @Bean(name = "dataSourceBdLogs")
    public DataSource dataSourceBdLogs() {
        String bdLogdFolder = System.getProperty("catalina.base") + environment.getProperty("dirBaseDatos");
        DriverManagerDataSource dataSource = new DriverManagerDataSource("jdbc:sqlite:" + bdLogdFolder + "bdLog.bd");
        dataSource.setDriverClassName("org.sqlite.JDBC");
        dataSource.setUsername("");
        dataSource.setPassword("");
        return dataSource;
    }

    @Bean(name = "entityManagerFactoryLogs")
    public LocalContainerEntityManagerFactoryBean entityManagerFactoryLogs() {
        LocalContainerEntityManagerFactoryBean factory = new LocalContainerEntityManagerFactoryBean();
        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        vendorAdapter.setGenerateDdl(Boolean.FALSE);
        vendorAdapter.setShowSql(Boolean.FALSE);
        factory.setDataSource(dataSourceBdLogs());
        Properties p = new Properties();
        p.put("hibernate.dialect", "sqlDriver.SQLiteDialect5");
        factory.setJpaProperties(p);
        factory.setJpaVendorAdapter(vendorAdapter);
        factory.setPackagesToScan("model");
        factory.setPersistenceUnitName("DescargaLogs");
        factory.afterPropertiesSet();
        return factory;
    }
}
