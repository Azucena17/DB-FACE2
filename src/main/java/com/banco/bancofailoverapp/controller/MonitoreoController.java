package com.banco.bancofailoverapp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MonitoreoController {

    @GetMapping("/api/monitoreo/estado")
    public String estadoSistema() {
        return "Sistema Bancario BancoFailoverApp funcionando correctamente";
    }
}
