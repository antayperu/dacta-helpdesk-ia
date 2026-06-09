package com.dacta.helpdesk.model.dto;

public class LoginResponseDto {

    private String token;
    private String correo;
    private String nombre;
    private String apellido;
    private String rol;

    public String getToken() { return token; }
    public String getCorreo() { return correo; }
    public String getNombre() { return nombre; }
    public String getApellido() { return apellido; }
    public String getRol() { return rol; }

    public static LoginResponseDtoBuilder builder() { return new LoginResponseDtoBuilder(); }

    public static class LoginResponseDtoBuilder {
        private String token;
        private String correo;
        private String nombre;
        private String apellido;
        private String rol;

        public LoginResponseDtoBuilder token(String token) { this.token = token; return this; }
        public LoginResponseDtoBuilder correo(String correo) { this.correo = correo; return this; }
        public LoginResponseDtoBuilder nombre(String nombre) { this.nombre = nombre; return this; }
        public LoginResponseDtoBuilder apellido(String apellido) { this.apellido = apellido; return this; }
        public LoginResponseDtoBuilder rol(String rol) { this.rol = rol; return this; }

        public LoginResponseDto build() {
            LoginResponseDto dto = new LoginResponseDto();
            dto.token = this.token;
            dto.correo = this.correo;
            dto.nombre = this.nombre;
            dto.apellido = this.apellido;
            dto.rol = this.rol;
            return dto;
        }
    }
}
