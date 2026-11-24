package ${package}.controller;

import ${package}.dto.SaludoResponse;
import ${package}.service.SaludoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/saludo")
public class SaludoController {
    private final SaludoService service;

    public SaludoController(SaludoService service) {
        this.service = service;
    }

    @GetMapping
    public SaludoResponse saludar() {
        return service.saludar();
    }
}
