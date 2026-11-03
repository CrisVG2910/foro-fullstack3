
package cl.duoc.forofs3.usuarios.controller;

import java.util.Locale;
import java.util.Map;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import cl.duoc.forofs3.usuarios.dto.LoginRequest;
import cl.duoc.forofs3.usuarios.dto.LoginResponse;
import cl.duoc.forofs3.usuarios.security.JwtService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService) {

        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody LoginRequest request) {

        try {
            String email = request.email()
                .trim()
                .toLowerCase(Locale.ROOT);

            Authentication authentication =
                authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                        email,
                        request.password()
                    )
                );

            String token = jwtService.generarToken(authentication);

            String rol = authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> authority.startsWith("ROLE_"))
                .map(authority -> authority.substring(5))
                .findFirst()
                .orElseThrow();

            return new LoginResponse(
                token,
                "Bearer",
                3600,
                rol
            );

        } catch (AuthenticationException ex) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Credenciales incorrectas"
            );
        }
    }

    @GetMapping("/me")
    public Map<String, String> perfil(
            JwtAuthenticationToken authentication) {

        return Map.of(
            "email", authentication.getToken().getSubject(),
            "rol", authentication.getToken().getClaimAsString("rol")
        );
    }
}
