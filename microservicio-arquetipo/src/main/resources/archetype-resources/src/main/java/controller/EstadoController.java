package ${package}.controller;

import java.util.Map;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/estado")
public class EstadoController {
    private final JdbcTemplate jdbc;

    public EstadoController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping
    public Map<String, String> estado() {
        return Map.of("servicio", "generado-desde-arquetipo", "estado", "OK");
    }

    @GetMapping("/bd")
    public Map<String, Object> baseDatos() {
        Integer resultado = jdbc.queryForObject("SELECT 1 FROM DUAL", Integer.class);
        return Map.of("baseDatos", "Oracle", "resultado", resultado);
    }
}
