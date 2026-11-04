package cl.duoc.forofs3.foro.service;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import cl.duoc.forofs3.foro.dto.*;
import cl.duoc.forofs3.foro.entity.Comentario;
import cl.duoc.forofs3.foro.repository.ComentarioRepository;

@Service
@Transactional(readOnly = true)
public class ComentarioService {
    private final ComentarioRepository comentarios;
    private final TemaService temas;
    private final UsuarioReferenciaService usuarios;

    public ComentarioService(ComentarioRepository comentarios, TemaService temas,
                             UsuarioReferenciaService usuarios) {
        this.comentarios = comentarios;
        this.temas = temas;
        this.usuarios = usuarios;
    }

    private Comentario entidad(Long id) {
        return comentarios.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Comentario no encontrado"));
    }

    private ComentarioResponse respuesta(Comentario comentario) {
        return new ComentarioResponse(comentario.getId(), comentario.getContenido(),
            comentario.getUsuarioId(), comentario.getTemaId(), comentario.getFechaCreacion());
    }

    public List<ComentarioResponse> listarPorTema(Long temaId) {
        temas.verificarTema(temaId);
        return comentarios.findByTemaIdOrderByIdAsc(temaId)
            .stream().map(this::respuesta).toList();
    }

    public ComentarioResponse obtener(Long id) { return respuesta(entidad(id)); }

    @Transactional
    public ComentarioResponse crear(Long temaId, ComentarioCrearRequest request) {
        temas.verificarTema(temaId);
        usuarios.verificarUsuario(request.usuarioId());
        Comentario comentario = new Comentario();
        comentario.setTemaId(temaId);
        comentario.setUsuarioId(request.usuarioId());
        comentario.setContenido(request.contenido().trim());
        return respuesta(comentarios.save(comentario));
    }

    @Transactional
    public ComentarioResponse actualizar(Long id, ComentarioActualizarRequest request) {
        Comentario comentario = entidad(id);
        comentario.setContenido(request.contenido().trim());
        return respuesta(comentarios.save(comentario));
    }

    @Transactional
    public void eliminar(Long id) {
        comentarios.delete(entidad(id));
    }
}
