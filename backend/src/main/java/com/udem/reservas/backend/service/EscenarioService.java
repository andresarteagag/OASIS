package com.udem.reservas.backend.service;

import com.udem.reservas.backend.model.Escenario;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class EscenarioService {

    private final List<Escenario> escenarios = new ArrayList<>();

    public EscenarioService() {
        // Inicializamos con algunos escenarios disponibles y descripción
        escenarios.add(new Escenario("Cancha de fútbol", "Campo de césped sintético para fútbol 11", true));
        escenarios.add(new Escenario("Cancha de baloncesto", "Cancha cubierta para baloncesto", true));
        escenarios.add(new Escenario("Cancha de tenis", "Cancha de tenis profesional", true));
        escenarios.add(new Escenario("Gimnasio", "Gimnasio con máquinas y pesas", true));
    }

    public List<Escenario> listarEscenarios() {
        return escenarios;
    }

    public Escenario obtenerPorNombre(String nombre) {
        return escenarios.stream()
                .filter(e -> e.getNombre().trim().equalsIgnoreCase(nombre.trim()))
                .findFirst()
                .orElse(null);
    }

    public void actualizarDisponibilidad(String nombre, boolean disponible) {
        Escenario escenario = obtenerPorNombre(nombre);
        if (escenario != null) {
            escenario.setDisponible(disponible);
        }
    }

    public Escenario crearEscenario(Escenario escenario) {
        System.out.println("[LOG] " + LocalDateTime.now() + " - Creación de escenario: " + escenario.getNombre());
        escenarios.add(escenario);
        return escenario;
    }

    // Nuevo método para editar usando nombre original
    public Escenario editarEscenario(String nombreOriginal, String nombre, String descripcion, boolean disponible) {
        Escenario existente = obtenerPorNombre(nombreOriginal);
        if (existente != null) {
            System.out.println("[LOG] " + LocalDateTime.now() + " - Edición de escenario: " + nombreOriginal + " -> " + nombre);
            existente.setNombre(nombre);
            existente.setDescripcion(descripcion);
            existente.setDisponible(disponible);
        }
        return existente;
    }

    public void eliminarEscenario(String nombre) {
        System.out.println("[LOG] " + LocalDateTime.now() + " - Eliminación de escenario: " + nombre);
        boolean eliminado = escenarios.removeIf(e ->
            e.getNombre().trim().equalsIgnoreCase(nombre.trim())
        );
        System.out.println("¿Eliminado?: " + eliminado);
    }
}