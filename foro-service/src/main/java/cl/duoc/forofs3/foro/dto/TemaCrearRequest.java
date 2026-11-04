package cl.duoc.forofs3.foro.dto;

import jakarta.validation.constraints.*;

public record TemaCrearRequest(
    @NotBlank @Size(max = 200) String titulo,
    @NotBlank String contenido,
    @NotNull @Positive Long usuarioId,
    @NotNull @Positive Long categoriaId
) {}
