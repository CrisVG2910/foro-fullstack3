package cl.duoc.forofs3.foro.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import cl.duoc.forofs3.foro.entity.Tema;

public interface TemaRepository extends JpaRepository<Tema, Long> {
    List<Tema> findAllByOrderByIdDesc();
    List<Tema> findByTituloContainingIgnoreCaseOrderByIdDesc(String titulo);
    List<Tema> findByCategoriaIdOrderByIdDesc(Long categoriaId);
    List<Tema> findByCategoriaIdAndTituloContainingIgnoreCaseOrderByIdDesc(Long categoriaId, String titulo);
    boolean existsByCategoriaId(Long categoriaId);
}
