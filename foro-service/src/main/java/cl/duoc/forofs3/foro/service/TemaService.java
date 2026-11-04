package cl.duoc.forofs3.foro.service;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import cl.duoc.forofs3.foro.dto.*;
import cl.duoc.forofs3.foro.entity.Tema;
import cl.duoc.forofs3.foro.repository.*;

@Service
@Transactional(readOnly = true)
public class TemaService {
    private final TemaRepository temas;
    private final CategoriaRepository categorias;
    private final ComentarioRepository comentarios;
    private final UsuarioReferenciaService usuarios;

    public TemaService(TemaRepository temas, CategoriaRepository categorias,
                       ComentarioRepository comentarios, UsuarioReferenciaService usuarios) {
        this.temas = temas;
        this.categorias = categorias;
        this.comentarios = comentarios;
        this.usuarios = usuarios;
    }

    private Tema entidad(Long id) {
        return temas.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Tema no encontrado"));
    }

    public void verificarTema(Long id) { entidad(id); }

    private void verificarCategoria(Long id) {
        if (!categorias.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Categoría no encontrada");
        }
    }

    private TemaResponse respuesta(Tema tema) {
        return new TemaResponse(tema.getId(), tema.getTitulo(), tema.getContenido(),
            tema.getUsuarioId(), tema.getCategoriaId(), tema.getFechaCreacion());
    }

    public List<TemaResponse> listar(String buscar, Long categoriaId) {
        String q = buscar == null ? null : buscar.trim();
        if (q != null && q.isEmpty()) q = null;
        List<Tema> resultado;
        if (q != null && categoriaId != null) {
            resultado = temas.findByCategoriaIdAndTituloContainingIgnoreCaseOrderByIdDesc(categoriaId, q);
        } else if (q != null) {
            resultado = temas.findByTituloContainingIgnoreCaseOrderByIdDesc(q);
        } else if (categoriaId != null) {
            resultado = temas.findByCategoriaIdOrderByIdDesc(categoriaId);
        } else {
            resultado = temas.findAllByOrderByIdDesc();
        }
        return resultado.stream().map(this::respuesta).toList();
    }

    public TemaResponse obtener(Long id) { return respuesta(entidad(id)); }

    @Transactional
    public TemaResponse crear(TemaCrearRequest request) {
        usuarios.verificarUsuario(request.usuarioId());
        verificarCategoria(request.categoriaId());
        Tema tema = new Tema();
        tema.setTitulo(request.titulo().trim());
        tema.setContenido(request.contenido().trim());
        tema.setUsuarioId(request.usuarioId());
        tema.setCategoriaId(request.categoriaId());
        return respuesta(temas.save(tema));
    }

    @Transactional
    public TemaResponse actualizar(Long id, TemaActualizarRequest request) {
        Tema tema = entidad(id);
        verificarCategoria(request.categoriaId());
        tema.setTitulo(request.titulo().trim());
        tema.setContenido(request.contenido().trim());
        tema.setCategoriaId(request.categoriaId());
        return respuesta(temas.save(tema));
    }

    @Transactional
    public void eliminar(Long id) {
        Tema tema = entidad(id);
        if (comentarios.existsByTemaId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "No se puede eliminar un tema que tiene comentarios");
        }
        temas.delete(tema);
    }
}
