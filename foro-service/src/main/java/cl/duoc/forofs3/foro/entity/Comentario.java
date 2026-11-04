package cl.duoc.forofs3.foro.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "COMENTARIOS")
public class Comentario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Lob
    @Column(name = "CONTENIDO", nullable = false, columnDefinition = "CLOB")
    private String contenido;

    @Column(name = "USUARIO_ID", nullable = false)
    private Long usuarioId;

    @Column(name = "TEMA_ID", nullable = false)
    private Long temaId;

    @Column(name = "FECHA_CREACION", updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    void inicializarFecha() {
        if (fechaCreacion == null) fechaCreacion = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getContenido() { return contenido; }
    public void setContenido(String contenido) { this.contenido = contenido; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public Long getTemaId() { return temaId; }
    public void setTemaId(Long temaId) { this.temaId = temaId; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
}
