package cl.duoc.forofs3.foro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import cl.duoc.forofs3.foro.entity.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    boolean existsByNombreIgnoreCase(String nombre);
    boolean existsByNombreIgnoreCaseAndIdNot(String nombre, Long id);
}
