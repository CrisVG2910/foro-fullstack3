package cl.duoc.forofs3.foro.dto;

import java.time.LocalDateTime;

public record ComentarioResponse(
    Long id, String contenido, Long usuarioId,
    Long temaId, LocalDateTime fechaCreacion
) {}
