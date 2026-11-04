package cl.duoc.forofs3.foro.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import cl.duoc.forofs3.foro.entity.Comentario;

public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    List<Comentario> findByTemaIdOrderByIdAsc(Long temaId);
    boolean existsByTemaId(Long temaId);
}
