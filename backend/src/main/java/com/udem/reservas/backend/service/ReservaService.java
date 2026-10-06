package com.udem.reservas.backend.service;

import com.udem.reservas.backend.dto.CrearReservaDto;
import com.udem.reservas.backend.model.Escenario;
import com.udem.reservas.backend.model.Reserva;
import com.udem.reservas.backend.model.Usuario;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@Service
public class ReservaService {
    private final List<Reserva> reservas = new CopyOnWriteArrayList<>();
    private final UsuarioService usuarios;
    private final EscenarioService escenarios;

    public ReservaService(UsuarioService usuarios, EscenarioService escenarios) {
        this.usuarios = usuarios;
        this.escenarios = escenarios;
    }

    /** Un usuario normal solo puede tener UNA reserva activa (futura). El administrador no tiene ese límite. */
    public Reserva crear(CrearReservaDto dto) {
        Usuario dueno = usuarios.buscar(dto.getCorreoUsuario()).orElseThrow(() -> new NoSuchElementException("Usuario no encontrado"));
        validarDatos(dto, null);
        if (!dueno.esAdmin() && obtenerPorUsuario(dueno.getCorreoInstitucional()).stream().anyMatch(this::esActiva)) {
            throw new IllegalStateException("Ya tienes una reserva activa. Edítala o cancélala para hacer otra.");
        }
        Reserva r = new Reserva(dueno.getCorreoInstitucional(), dto.getNombreEscenario().trim(), dto.getFecha(), dto.getHoraInicio());
        reservas.add(r);
        return r;
    }

    public Reserva actualizar(String id, CrearReservaDto dto, Usuario actual) {
        Reserva r = obtener(id, actual);
        if (!actual.esAdmin() && !esActiva(r)) throw new IllegalStateException("No puedes modificar una reserva que ya pasó");
        validarDatos(dto, r);
        r.setNombreEscenario(dto.getNombreEscenario().trim());
        r.setFecha(dto.getFecha());
        r.setHoraInicio(dto.getHoraInicio());
        return r;
    }

    public void eliminar(String id, Usuario actual) {
        Reserva r = obtener(id, actual);
        if (!actual.esAdmin() && !esActiva(r)) throw new IllegalStateException("No puedes cancelar una reserva que ya pasó");
        reservas.remove(r);
    }

    public void eliminarDeUsuario(String correo) { reservas.removeIf(r -> r.getCorreoUsuario().equalsIgnoreCase(correo)); }

    public List<Reserva> listarTodas() { return reservas; }

    public List<Reserva> obtenerPorUsuario(String correo) {
        return reservas.stream().filter(r -> r.getCorreoUsuario().equalsIgnoreCase(correo)).collect(Collectors.toList());
    }

    public List<Reserva> obtenerPorEscenario(String nombre) {
        return reservas.stream().filter(r -> r.getNombreEscenario().equalsIgnoreCase(nombre)).collect(Collectors.toList());
    }

    public Map<String, Long> contarReservasPorEscenario() {
        return reservas.stream().collect(Collectors.groupingBy(Reserva::getNombreEscenario, Collectors.counting()));
    }

    private Reserva obtener(String id, Usuario actual) {
        Reserva r = reservas.stream().filter(x -> x.getId().equals(id)).findFirst()
                .orElseThrow(() -> new NoSuchElementException("La reserva no existe"));
        if (!actual.esAdmin() && !r.getCorreoUsuario().equalsIgnoreCase(actual.getCorreoInstitucional())) {
            throw new SecurityException("Solo puedes gestionar tus propias reservas");
        }
        return r;
    }

    private boolean esActiva(Reserva r) { return LocalDateTime.of(r.getFecha(), r.getHoraInicio()).isAfter(LocalDateTime.now()); }

    private void validarDatos(CrearReservaDto d, Reserva excluir) {
        if (d.getNombreEscenario() == null || d.getFecha() == null || d.getHoraInicio() == null) {
            throw new IllegalArgumentException("Escenario, fecha y hora son obligatorios");
        }
        Escenario e = escenarios.obtenerPorNombre(d.getNombreEscenario());
        if (e == null) throw new NoSuchElementException("El escenario no existe");
        if (!e.isDisponible()) throw new IllegalStateException("El escenario no está disponible");
        if (!LocalDateTime.of(d.getFecha(), d.getHoraInicio()).isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("No puedes reservar en una fecha u hora pasada");
        }
        boolean ocupado = reservas.stream().anyMatch(r -> r != excluir
                && r.getNombreEscenario().equalsIgnoreCase(d.getNombreEscenario().trim())
                && r.getFecha().equals(d.getFecha()) && r.getHoraInicio().equals(d.getHoraInicio()));
        if (ocupado) throw new IllegalStateException("Ese escenario ya está reservado en esa fecha y hora");
    }
}
