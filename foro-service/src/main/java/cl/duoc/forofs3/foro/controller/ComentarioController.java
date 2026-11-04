package cl.duoc.forofs3.foro.controller;

import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import cl.duoc.forofs3.foro.dto.*;
import cl.duoc.forofs3.foro.service.ComentarioService;

@RestController
public class ComentarioController {
    private final ComentarioService service;
    public ComentarioController(ComentarioService service) { this.service = service; }

    @GetMapping("/api/temas/{temaId}/comentarios")
    public List<ComentarioResponse> listar(@PathVariable Long temaId) {
        return service.listarPorTema(temaId);
    }

    @PostMapping("/api/temas/{temaId}/comentarios")
    public ResponseEntity<ComentarioResponse> crear(
            @PathVariable Long temaId, @Valid @RequestBody ComentarioCrearRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(temaId, request));
    }

    @GetMapping("/api/comentarios/{id}")
    public ComentarioResponse obtener(@PathVariable Long id) { return service.obtener(id); }

    @PutMapping("/api/comentarios/{id}")
    public ComentarioResponse actualizar(
            @PathVariable Long id, @Valid @RequestBody ComentarioActualizarRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/api/comentarios/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
