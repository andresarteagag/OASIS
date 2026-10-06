package com.udem.reservas.backend.model;

import java.time.LocalDate;
import java.time.LocalTime;

public class Reserva {
    private String id = java.util.UUID.randomUUID().toString();
    private String correoUsuario;
    private String nombreEscenario;
    private LocalDate fecha;
    private LocalTime horaInicio;

    public Reserva() {}

    public Reserva(String correoUsuario, String nombreEscenario, LocalDate fecha, LocalTime horaInicio) {
        this.correoUsuario = correoUsuario;
        this.nombreEscenario = nombreEscenario;
        this.fecha = fecha;
        this.horaInicio = horaInicio;
    }

    public String getId() { return id; }
    public String getCorreoUsuario() { return correoUsuario; }
    public void setCorreoUsuario(String correoUsuario) { this.correoUsuario = correoUsuario; }

    public String getNombreEscenario() { return nombreEscenario; }
    public void setNombreEscenario(String nombreEscenario) { this.nombreEscenario = nombreEscenario; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public LocalTime getHoraInicio() { return horaInicio; }
    public void setHoraInicio(LocalTime horaInicio) { this.horaInicio = horaInicio; }
}
