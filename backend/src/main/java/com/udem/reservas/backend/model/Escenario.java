package com.udem.reservas.backend.model;

public class Escenario {
    private String nombre;
    private String descripcion; 
    private boolean disponible;

    public Escenario() {}

    public Escenario(String nombre, String descripcion, boolean disponible) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.disponible = disponible;
    }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public boolean isDisponible() { return disponible; }
    public void setDisponible(boolean disponible) { this.disponible = disponible; }
}