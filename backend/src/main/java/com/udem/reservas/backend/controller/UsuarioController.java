package com.udem.reservas.backend.controller;

import com.udem.reservas.backend.config.AuthInterceptor;
import com.udem.reservas.backend.dto.*;
import com.udem.reservas.backend.model.Usuario;
import com.udem.reservas.backend.service.ReservaService;
import com.udem.reservas.backend.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin("*")
public class UsuarioController {
    private final UsuarioService service;
    private final ReservaService reservas;

    public UsuarioController(UsuarioService service, ReservaService reservas) {
        this.service = service;
        this.reservas = reservas;
    }

    // Públicos
    @PostMapping("/registrar")
    public SesionDto registrar(@RequestBody CrearUsuarioDto dto) { return service.abrirSesion(service.crear(dto)); }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginUsuarioDto dto) {
        return service.iniciarSesion(dto.getCorreoInstitucional(), dto.getContrasena())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(401).body(java.util.Map.of("message", "Correo o contraseña incorrectos")));
    }

    @PostMapping("/logout")
    public void logout(@RequestHeader("Authorization") String auth) { service.cerrarSesion(auth.substring(7)); }

    // Solo administrador (ver AuthInterceptor)
    @GetMapping
    public List<Usuario> listar() { return service.listar(); }

    @PostMapping
    public Usuario crear(@RequestBody CrearUsuarioDto dto) { return service.crear(dto); }

    @PutMapping("/{correo}")
    public Usuario actualizar(@PathVariable String correo, @RequestBody CrearUsuarioDto dto) { return service.actualizar(correo, dto); }

    @DeleteMapping("/{correo}")
    public void eliminar(@PathVariable String correo) {
        service.eliminar(correo);
        reservas.eliminarDeUsuario(correo);
    }
}
