package cl.duoc.forofs3.usuarios.dto;

public record LoginResponse(
    String accessToken,
    String tokenType,
    long expiresIn,
    String rol
) {}
