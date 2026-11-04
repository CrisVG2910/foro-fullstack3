package cl.duoc.forofs3.foro.dto;

import jakarta.validation.constraints.NotBlank;

public record ComentarioActualizarRequest(@NotBlank String contenido) {}
