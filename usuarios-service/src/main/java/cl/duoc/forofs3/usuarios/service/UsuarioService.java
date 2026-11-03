
package cl.duoc.forofs3.usuarios.service;

import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.crypto.password.PasswordEncoder;

import cl.duoc.forofs3.usuarios.dto.*;
import cl.duoc.forofs3.usuarios.entity.Usuario;
import cl.duoc.forofs3.usuarios.repository.UsuarioRepository;

@Service
@Transactional(readOnly = true)
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder encoder;


    public UsuarioService(
            UsuarioRepository repository,
            PasswordEncoder encoder) {

        this.repository = repository;
        this.encoder = encoder;
    }


    private UsuarioResponse convertir(Usuario usuario) {
        return new UsuarioResponse(
            usuario.getId(),
            usuario.getNombre(),
            usuario.getEmail(),
            usuario.getRol()
        );
    }

    public List<UsuarioResponse> listar() {
        return repository.findAll()
                .stream()
                .map(this::convertir)
                .toList();
    }

    public UsuarioResponse obtener(Long id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        return convertir(usuario);
    }

    @Transactional
    public UsuarioResponse crear(UsuarioCrearRequest request) {
        String email = request.email().trim()
                .toLowerCase(Locale.ROOT);

        if (repository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, "El correo ya está registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.nombre().trim());
        usuario.setEmail(email);
        usuario.setPasswordHash(encoder.encode(request.password()));
        usuario.setRol("USER");

        return convertir(repository.save(usuario));
    }

    @Transactional
    public UsuarioResponse actualizar(
            Long id, UsuarioActualizarRequest request) {

        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        String email = request.email().trim()
                .toLowerCase(Locale.ROOT);

        if (!usuario.getEmail().equalsIgnoreCase(email)
                && repository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, "El correo ya está registrado");
        }

        usuario.setNombre(request.nombre().trim());
        usuario.setEmail(email);

        return convertir(repository.save(usuario));
    }

    @Transactional
    public void eliminar(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Usuario no encontrado");
        }

        repository.deleteById(id);
    }
}
