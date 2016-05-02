/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package util;

import org.springframework.dao.DataAccessException;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;

public class JdbcPersistenceTokenRepository extends JdbcTokenRepositoryImpl {

    private boolean createTableOnStartup;

    public JdbcPersistenceTokenRepository() {
        super();
    }

    @Override
    protected void initDao() {
        if (createTableOnStartup) {
            try {
                getJdbcTemplate().execute(CREATE_TABLE_SQL);
            } catch (DataAccessException e) {
                logger.info("La tabla para recordar los usuarios ya está creada");
            }
        }
    }

    @Override
    public void setCreateTableOnStartup(boolean createTableOnStartup) {
        this.createTableOnStartup = createTableOnStartup;
    }

}
