package com.udem.reservas.backend.dto;

public class LoginUsuarioDto {

	private String correoInstitucional;
	private String contrasena;

    public String getCorreoInstitucional() { return correoInstitucional; }
    public void setCorreoInstitucional(String correoInstitucional) { this.correoInstitucional = correoInstitucional; }
	
    public String getContrasena() {	return contrasena; }
	public void setContrasena(String contrasena) { this.contrasena = contrasena; }
    
}
