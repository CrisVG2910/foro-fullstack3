
package cl.duoc.forofs3.usuarios.dto;

import jakarta.validation.constraints.*;

public record UsuarioCrearRequest(
    @NotBlank
    @Size(max = 100)
    String nombre,

    @NotBlank
    @Email
    @Size(max = 150)
    String email,

    @NotBlank
    @Size(min = 8, max = 72)
    String password
) {}
