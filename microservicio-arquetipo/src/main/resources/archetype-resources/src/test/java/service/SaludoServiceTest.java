package ${package}.service;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SaludoServiceTest {
    @Test
    void servicioDevuelveRespuesta() {
        assertTrue(new SaludoService().saludar().mensaje().contains("microservicio"));
    }
}
