package cl.duoc.forofs3.foro.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "TEMAS")
public class Tema {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "TITULO", nullable = false, length = 200)
    private String titulo;

    @Lob
    @Column(name = "CONTENIDO", nullable = false, columnDefinition = "CLOB")
    private String contenido;

    @Column(name = "USUARIO_ID", nullable = false)
    private Long usuarioId;

    @Column(name = "CATEGORIA_ID", nullable = false)
    private Long categoriaId;

    @Column(name = "FECHA_CREACION", updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    void inicializarFecha() {
        if (fechaCreacion == null) fechaCreacion = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getContenido() { return contenido; }
    public void setContenido(String contenido) { this.contenido = contenido; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public Long getCategoriaId() { return categoriaId; }
    public void setCategoriaId(Long categoriaId) { this.categoriaId = categoriaId; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
}
