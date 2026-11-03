
package cl.duoc.forofs3.usuarios.security;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;

    public JwtService(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    public String generarToken(Authentication authentication) {

        Instant ahora = Instant.now();

        String rol = authentication.getAuthorities()
            .stream()
            .map(GrantedAuthority::getAuthority)
            .filter(authority -> authority.startsWith("ROLE_"))
            .map(authority -> authority.substring(5))
            .findFirst()
            .orElseThrow(() ->
                new IllegalStateException("Usuario sin rol")
            );

        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer("foro-fullstack3")
            .issuedAt(ahora)
            .expiresAt(ahora.plus(1, ChronoUnit.HOURS))
            .subject(authentication.getName())
            .claim("rol", rol)
            .build();

        JwsHeader header = JwsHeader
            .with(MacAlgorithm.HS256)
            .build();

        return jwtEncoder.encode(
            JwtEncoderParameters.from(header, claims)
        ).getTokenValue();
    }
}
