package cl.duoc.forofs3.foro.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UsuarioReferenciaService {
    @PersistenceContext
    private EntityManager entityManager;

    public void verificarUsuario(Long usuarioId) {
        Number cantidad = (Number) entityManager.createNativeQuery(
                "SELECT COUNT(*) FROM USUARIOS WHERE ID = :usuarioId")
            .setParameter("usuarioId", usuarioId)
            .getSingleResult();

        if (cantidad.longValue() == 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "El usuario indicado no existe");
        }
    }
}
