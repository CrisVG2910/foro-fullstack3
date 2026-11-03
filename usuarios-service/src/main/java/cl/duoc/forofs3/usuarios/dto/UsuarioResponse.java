
package cl.duoc.forofs3.usuarios.dto;

public record UsuarioResponse(
    Long id,
    String nombre,
    String email,
    String rol
) {}
