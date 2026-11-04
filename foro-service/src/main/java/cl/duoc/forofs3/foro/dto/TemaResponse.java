package cl.duoc.forofs3.foro.dto;

import java.time.LocalDateTime;

public record TemaResponse(
    Long id, String titulo, String contenido,
    Long usuarioId, Long categoriaId, LocalDateTime fechaCreacion
) {}
