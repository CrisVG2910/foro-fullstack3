package ${package}.service;

import ${package}.dto.SaludoResponse;
import org.springframework.stereotype.Service;

@Service
public class SaludoService {
    public SaludoResponse saludar() {
        return new SaludoResponse("Hola desde un microservicio generado por arquetipo Maven");
    }
}
