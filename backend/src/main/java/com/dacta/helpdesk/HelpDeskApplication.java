// Autor: Camilo Ortega FR
// Fecha: 2026-05-31
// Descripcion: Clase principal del proyecto DACTA Help Desk IA v1.0
package com.dacta.helpdesk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HelpDeskApplication {

    public static void main(String[] args) {
        SpringApplication.run(HelpDeskApplication.class, args);
    }
}
