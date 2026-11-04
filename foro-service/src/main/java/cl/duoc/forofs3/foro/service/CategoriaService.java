package cl.duoc.forofs3.foro.service;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import cl.duoc.forofs3.foro.dto.*;
import cl.duoc.forofs3.foro.entity.Categoria;
import cl.duoc.forofs3.foro.repository.*;

@Service
@Transactional(readOnly = true)
public class CategoriaService {
    private final CategoriaRepository categorias;
    private final TemaRepository temas;

    public CategoriaService(CategoriaRepository categorias, TemaRepository temas) {
        this.categorias = categorias;
        this.temas = temas;
    }

    private Categoria obtenerEntidad(Long id) {
        return categorias.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada"));
    }

    private CategoriaResponse respuesta(Categoria categoria) {
        return new CategoriaResponse(categoria.getId(), categoria.getNombre(), categoria.getDescripcion());
    }

    public List<CategoriaResponse> listar() {
        return categorias.findAll().stream().map(this::respuesta).toList();
    }

    public CategoriaResponse obtener(Long id) { return respuesta(obtenerEntidad(id)); }

    @Transactional
    public CategoriaResponse crear(CategoriaRequest request) {
        String nombre = request.nombre().trim();
        if (categorias.existsByNombreIgnoreCase(nombre)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Categoría duplicada");
        }
        Categoria categoria = new Categoria();
        categoria.setNombre(nombre);
        categoria.setDescripcion(request.descripcion() == null ? null : request.descripcion().trim());
        return respuesta(categorias.save(categoria));
    }

    @Transactional
    public CategoriaResponse actualizar(Long id, CategoriaRequest request) {
        Categoria categoria = obtenerEntidad(id);
        String nombre = request.nombre().trim();
        if (categorias.existsByNombreIgnoreCaseAndIdNot(nombre, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Categoría duplicada");
        }
        categoria.setNombre(nombre);
        categoria.setDescripcion(request.descripcion() == null ? null : request.descripcion().trim());
        return respuesta(categorias.save(categoria));
    }

    @Transactional
    public void eliminar(Long id) {
        Categoria categoria = obtenerEntidad(id);
        if (temas.existsByCategoriaId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "No se puede eliminar una categoría con temas asociados");
        }
        categorias.delete(categoria);
    }
}
