package control;

import java.io.IOException;
import javax.servlet.http.Part;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;
import repositorioAdmin.DescargaAdminJpa;

@Controller
@RequestMapping(value = "/admin")
public class AdminControl {

    @Autowired
    DescargaAdminJpa descargaAdminJpa;

    @RequestMapping(value = "/admin.html")
    public ModelAndView paginaAdmin() {
        return new ModelAndView("admin");
    }

    @RequestMapping(value = "/subirArchivoLog.do", method = {RequestMethod.GET, RequestMethod.POST})
    public ModelAndView subirArchivo(@RequestPart("archivo") Part archivo) throws IOException {
        ModelMap map = new ModelMap();
        archivo.write("bdLog.bd");
        map.put("success", true);
        map.put("lista", descargaAdminJpa.findAll());
        return new ModelAndView(new MappingJackson2JsonView(), map);
    }

}
