/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package control;

import org.springframework.security.authentication.RememberMeAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class ControladorPeticion {

    @RequestMapping(value = "{pagina}.html", method = RequestMethod.GET)
    public ModelAndView mostrarPaginas(@PathVariable String pagina) {
        return new ModelAndView(pagina);
    }

    @RequestMapping(value = {"/", "/login.html"}, method = RequestMethod.GET)
    public ModelAndView inicio() {
        return new ModelAndView("login");
    }

    @RequestMapping(value = {"/inicio.html"}, method = RequestMethod.GET)
    public ModelAndView descargas() {
        return new ModelAndView("descargas");
    }

    private boolean isRememberMeAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }
        return RememberMeAuthenticationToken.class.isAssignableFrom(authentication.getClass());
    }
}
