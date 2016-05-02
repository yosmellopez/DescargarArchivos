package model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import util.SerializadorFechaTraza;

@Entity
@Table(name = "descarga")
public class Descarga implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_descarga")
    @Basic(optional = false)
    private Long idDescarga;

    @Column(name = "url")
    private String url;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "mensaje", length = 2000)
    private String mensaje;

    @Column(name = "ip", length = 2000)
    private String ip;

    @Column(name = "descargado")
    private Boolean descargado;

    @Column(name = "tamano")
    private Long tamano;

    @Column(name = "pendiente")
    private Boolean pendiente;

    @Column(name = "eliminar")
    private Boolean eliminar;

    @Column(name = "notificado")
    private Boolean notificado;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha")
    @JsonSerialize(using = SerializadorFechaTraza.class)
    private Date fecha;

    @ManyToOne
    @JoinColumn(name = "usuario", referencedColumnName = "id_usuario")
    private Usuario usuario;

    public Descarga() {
    }

    public Long getIdDescarga() {
        return idDescarga;
    }

    public void setIdDescarga(Long idDescarga) {
        this.idDescarga = idDescarga;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Boolean getDescargado() {
        return descargado;
    }

    public void setDescargado(Boolean descargado) {
        this.descargado = descargado;
    }

    public Boolean getPendiente() {
        return pendiente;
    }

    public void setPendiente(Boolean pendiente) {
        this.pendiente = pendiente;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public Boolean getEliminar() {
        return eliminar;
    }

    public void setEliminar(Boolean eliminar) {
        this.eliminar = eliminar;
    }

    public Long getTamano() {
        return tamano;
    }

    public void setTamano(Long tamano) {
        this.tamano = tamano;
    }

    public Boolean getNotificado() {
        return notificado;
    }

    public void setNotificado(Boolean notificado) {
        this.notificado = notificado;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

}
