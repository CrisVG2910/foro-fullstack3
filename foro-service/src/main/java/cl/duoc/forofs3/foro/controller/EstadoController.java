
package cl.duoc.forofs3.foro.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/estado")
public class EstadoController {

    @GetMapping
    public Map<String, String> obtenerEstado() {
        return Map.of(
            "servicio", "foro-service",
            "estado", "OK"
        );
    }
}
