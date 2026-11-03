package cl.duoc.forofs3.usuarios.controller;

import java.util.Map;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/estado")
public class EstadoController {

    private final JdbcTemplate jdbcTemplate;

    public EstadoController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public Map<String, String> estado() {
        return Map.of(
            "servicio", "usuarios-service",
            "estado", "OK"
        );
    }

    @GetMapping("/bd")
    public Map<String, Object> comprobarBD() {
        Integer resultado = jdbcTemplate.queryForObject(
            "SELECT 1 FROM dual",
            Integer.class
        );

        return Map.of(
            "servicio", "usuarios-service",
            "baseDatos", "Oracle",
            "conexion", "OK",
            "resultado", resultado
        );
    }
}
