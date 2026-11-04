package cl.duoc.forofs3.foro.controller;

import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import cl.duoc.forofs3.foro.dto.*;
import cl.duoc.forofs3.foro.service.TemaService;

@RestController
@RequestMapping("/api/temas")
public class TemaController {
    private final TemaService service;
    public TemaController(TemaService service) { this.service = service; }

    @GetMapping
    public List<TemaResponse> listar(@RequestParam(required = false) String buscar,
                                     @RequestParam(required = false) Long categoriaId) {
        return service.listar(buscar, categoriaId);
    }

    @GetMapping("/{id}")
    public TemaResponse obtener(@PathVariable Long id) { return service.obtener(id); }

    @PostMapping
    public ResponseEntity<TemaResponse> crear(@Valid @RequestBody TemaCrearRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(request));
    }

    @PutMapping("/{id}")
    public TemaResponse actualizar(@PathVariable Long id,
                                   @Valid @RequestBody TemaActualizarRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
