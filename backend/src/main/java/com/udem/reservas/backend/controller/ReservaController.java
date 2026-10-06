package com.udem.reservas.backend.controller;

import com.udem.reservas.backend.config.AuthInterceptor;
import com.udem.reservas.backend.dto.CrearReservaDto;
import com.udem.reservas.backend.model.Reserva;
import com.udem.reservas.backend.model.Usuario;
import com.udem.reservas.backend.service.ReservaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin("*")
public class ReservaController {
    private final ReservaService service;

    public ReservaController(ReservaService service) { this.service = service; }

    /** El usuario solo reserva a su nombre; el administrador puede reservar para cualquiera. */
    @PostMapping("/crear")
    public Reserva crear(@RequestBody CrearReservaDto dto, @RequestAttribute(AuthInterceptor.USUARIO) Usuario actual) {
        if (!actual.esAdmin()) dto.setCorreoUsuario(actual.getCorreoInstitucional());
        return service.crear(dto);
    }

    @GetMapping
    public List<Reserva> listar() { return service.listarTodas(); }

    @GetMapping("/usuario/{correo}")
    public List<Reserva> porUsuario(@PathVariable String correo, @RequestAttribute(AuthInterceptor.USUARIO) Usuario actual) {
        if (!actual.esAdmin() && !actual.getCorreoInstitucional().equalsIgnoreCase(correo)) {
            throw new SecurityException("Solo puedes consultar tus propias reservas");
        }
        return service.obtenerPorUsuario(correo);
    }

    @PutMapping("/{id}")
    public Reserva actualizar(@PathVariable String id, @RequestBody CrearReservaDto dto, @RequestAttribute(AuthInterceptor.USUARIO) Usuario actual) {
        return service.actualizar(id, dto, actual);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable String id, @RequestAttribute(AuthInterceptor.USUARIO) Usuario actual) {
        service.eliminar(id, actual);
    }

    @GetMapping("/escenario/{nombre}")
    public List<Reserva> porEscenario(@PathVariable String nombre) { return service.obtenerPorEscenario(nombre); }

    @GetMapping("/reporte/por-escenario")
    public Map<String, Long> reporte() { return service.contarReservasPorEscenario(); }
}
