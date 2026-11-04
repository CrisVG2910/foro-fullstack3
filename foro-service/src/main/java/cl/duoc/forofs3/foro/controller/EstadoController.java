package cl.duoc.forofs3.foro.controller;

import java.util.Map;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/estado")
public class EstadoController {
    private final JdbcTemplate jdbc;
    public EstadoController(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    @GetMapping
    public Map<String, String> estado() { return Map.of("servicio", "foro-service", "estado", "OK"); }

    @GetMapping("/bd")
    public Map<String, Object> baseDatos() {
        Integer resultado = jdbc.queryForObject("SELECT 1 FROM DUAL", Integer.class);
        return Map.of("servicio", "foro-service", "conexion", "OK", "resultado", resultado);
    }
}
