package com.udem.reservas.backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class CrearReservaDto {
    private String correoUsuario;
    private String nombreEscenario;
    private LocalDate fecha;
    private LocalTime horaInicio;

    public String getCorreoUsuario() { return correoUsuario; }
    public void setCorreoUsuario(String correoUsuario) { this.correoUsuario = correoUsuario; }

    public String getNombreEscenario() { return nombreEscenario; }
    public void setNombreEscenario(String nombreEscenario) { this.nombreEscenario = nombreEscenario; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public LocalTime getHoraInicio() { return horaInicio; }
    public void setHoraInicio(LocalTime horaInicio) { this.horaInicio = horaInicio; }
}