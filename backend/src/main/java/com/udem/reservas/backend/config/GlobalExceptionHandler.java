package com.udem.reservas.backend.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.NoSuchElementException;

/** Convierte excepciones de negocio en respuestas JSON {"message": "..."} con el código HTTP adecuado. */
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> badRequest(IllegalArgumentException e) { return build(HttpStatus.BAD_REQUEST, e); }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> conflict(IllegalStateException e) { return build(HttpStatus.CONFLICT, e); }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, String>> notFound(NoSuchElementException e) { return build(HttpStatus.NOT_FOUND, e); }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<Map<String, String>> forbidden(SecurityException e) { return build(HttpStatus.FORBIDDEN, e); }

    private ResponseEntity<Map<String, String>> build(HttpStatus s, Exception e) {
        return ResponseEntity.status(s).body(Map.of("message", e.getMessage()));
    }
}
