package cl.duoc.forofs3.foro.dto;

import jakarta.validation.constraints.*;

public record ComentarioCrearRequest(
    @NotBlank String contenido,
    @NotNull @Positive Long usuarioId
) {}
