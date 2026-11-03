
package cl.duoc.forofs3.usuarios.dto;

import jakarta.validation.constraints.*;

public record UsuarioActualizarRequest(
    @NotBlank
    @Size(max = 100)
    String nombre,

    @NotBlank
    @Email
    @Size(max = 150)
    String email
) {}
