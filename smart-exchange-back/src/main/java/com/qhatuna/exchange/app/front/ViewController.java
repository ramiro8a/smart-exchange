package com.qhatuna.exchange.app.front;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ViewController {
    @RequestMapping({
            "/login","/confirma/{token}","/password-reset/{token}", "/registro",
            "/cliente/nueva-operacion","/cliente/cuentas-bancarias","/cliente/operaciones",
            "/operaciones/principal","/operaciones/clientes/{clienteId}"
    })
    public String index() {
        return "forward:/index.html";
    }
}
