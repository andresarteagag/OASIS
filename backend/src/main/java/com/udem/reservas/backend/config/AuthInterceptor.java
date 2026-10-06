package com.udem.reservas.backend.config;

import com.udem.reservas.backend.model.Usuario;
import com.udem.reservas.backend.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;
import java.util.Optional;

/**
 * Autenticación por token (Authorization: Bearer ...) y control de rol.
 * Punto único donde se decide qué rutas son públicas, de usuario o solo de administrador.
 */
@Component
public class AuthInterceptor implements HandlerInterceptor {
    public static final String USUARIO = "usuarioActual";
    private final UsuarioService usuarios;

    public AuthInterceptor(UsuarioService usuarios) { this.usuarios = usuarios; }

    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) throws IOException {
        String m = req.getMethod(), path = req.getRequestURI();
        if ("OPTIONS".equals(m) || esPublica(m, path)) return true;

        String h = req.getHeader("Authorization");
        Optional<Usuario> u = (h != null && h.startsWith("Bearer ")) ? usuarios.sesionDe(h.substring(7)) : Optional.empty();
        if (u.isEmpty()) { responder(res, 401, "Tu sesión expiró. Inicia sesión de nuevo."); return false; }
        if (soloAdmin(m, path) && !u.get().esAdmin()) {
            responder(res, 403, "Solo el administrador puede realizar esta acción"); return false;
        }
        req.setAttribute(USUARIO, u.get());
        return true;
    }

    private boolean esPublica(String m, String p) {
        return "POST".equals(m) && (p.equals("/api/usuarios/login") || p.equals("/api/usuarios/registrar"));
    }

    private boolean soloAdmin(String m, String p) {
        if (p.equals("/api/usuarios/logout")) return false;
        if (p.startsWith("/api/usuarios")) return true;
        if (p.startsWith("/api/escenarios")) return !"GET".equals(m);
        if (p.startsWith("/api/reservas/reporte") || p.startsWith("/api/reservas/escenario")) return true;
        return "GET".equals(m) && p.equals("/api/reservas");
    }

    private void responder(HttpServletResponse res, int status, String msg) throws IOException {
        res.setStatus(status);
        res.setContentType("application/json;charset=UTF-8");
        res.getWriter().write("{\"message\":\"" + msg + "\"}");
    }
}
