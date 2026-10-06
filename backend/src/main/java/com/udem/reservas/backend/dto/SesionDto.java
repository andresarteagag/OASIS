package com.udem.reservas.backend.dto;

import com.udem.reservas.backend.model.Usuario;

/** Respuesta de login/registro: token de sesión + usuario (sin contraseña). */
public record SesionDto(String token, Usuario usuario) {}
