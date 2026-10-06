package com.udem.reservas.backend.service;

import com.udem.reservas.backend.dto.CrearUsuarioDto;
import com.udem.reservas.backend.dto.SesionDto;
import com.udem.reservas.backend.model.Usuario;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class UsuarioService {
    private static final String DOMINIO = "@soyudemedellin.edu.co";
    private final List<Usuario> usuarios = new CopyOnWriteArrayList<>();
    private final Map<String, Usuario> sesiones = new ConcurrentHashMap<>();

    public UsuarioService() {
        usuarios.add(new Usuario("Admin", "Admin", "0000", Usuario.ADMIN_EMAIL, "admin123"));
    }

    public Usuario crear(CrearUsuarioDto dto) {
        validar(dto, true);
        if (buscar(dto.getCorreoInstitucional()).isPresent()) {
            throw new IllegalStateException("Ya existe un usuario con ese correo");
        }
        Usuario u = new Usuario(dto.getNombre().trim(), dto.getApellidos().trim(), dto.getCedula().trim(),
                dto.getCorreoInstitucional().trim().toLowerCase(), dto.getContrasena());
        usuarios.add(u);
        return u;
    }

    public Usuario actualizar(String correo, CrearUsuarioDto dto) {
        Usuario u = buscar(correo).orElseThrow(() -> new NoSuchElementException("Usuario no encontrado"));
        validar(dto, false);
        u.setNombre(dto.getNombre().trim());
        u.setApellidos(dto.getApellidos().trim());
        u.setCedula(dto.getCedula().trim());
        if (dto.getContrasena() != null && !dto.getContrasena().isBlank()) {
            if (dto.getContrasena().length() < 6) throw new IllegalArgumentException("La contraseña debe tener al menos 6 caracteres");
            u.setContrasena(dto.getContrasena());
        }
        return u;
    }

    public void eliminar(String correo) {
        Usuario u = buscar(correo).orElseThrow(() -> new NoSuchElementException("Usuario no encontrado"));
        if (u.esAdmin()) throw new IllegalStateException("No se puede eliminar al administrador");
        usuarios.remove(u);
        sesiones.values().removeIf(x -> x == u);
    }

    public List<Usuario> listar() { return usuarios; }

    public Optional<Usuario> buscar(String correo) {
        if (correo == null) return Optional.empty();
        return usuarios.stream().filter(u -> u.getCorreoInstitucional().equalsIgnoreCase(correo.trim())).findFirst();
    }

    public Optional<SesionDto> iniciarSesion(String correo, String contrasena) {
        return buscar(correo).filter(u -> u.getContrasena().equals(contrasena)).map(this::abrirSesion);
    }

    public SesionDto abrirSesion(Usuario u) {
        String token = UUID.randomUUID().toString();
        sesiones.put(token, u);
        return new SesionDto(token, u);
    }

    public Optional<Usuario> sesionDe(String token) { return Optional.ofNullable(sesiones.get(token)); }

    public void cerrarSesion(String token) { sesiones.remove(token); }

    private void validar(CrearUsuarioDto d, boolean conCorreo) {
        if (vacio(d.getNombre()) || vacio(d.getApellidos()) || vacio(d.getCedula())) {
            throw new IllegalArgumentException("Nombre, apellidos y cédula son obligatorios");
        }
        if (conCorreo) {
            if (vacio(d.getCorreoInstitucional()) || !d.getCorreoInstitucional().trim().toLowerCase().endsWith(DOMINIO)) {
                throw new IllegalArgumentException("Debe usar un correo institucional " + DOMINIO);
            }
            if (d.getContrasena() == null || d.getContrasena().length() < 6) {
                throw new IllegalArgumentException("La contraseña debe tener al menos 6 caracteres");
            }
        }
    }

    private boolean vacio(String s) { return s == null || s.isBlank(); }
}
