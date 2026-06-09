package com.dacta.helpdesk.service;

import com.dacta.helpdesk.model.dto.LoginRequestDto;
import com.dacta.helpdesk.model.dto.LoginResponseDto;
import com.dacta.helpdesk.model.entity.UsuarioEntity;
import com.dacta.helpdesk.repository.UsuarioRepository;
import com.dacta.helpdesk.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private static final int MAX_INTENTOS = 5;

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthService(UsuarioRepository usuarioRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponseDto login(LoginRequestDto request) {
        UsuarioEntity usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas"));

        if (!usuario.getActivo()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Usuario inactivo");
        }

        if (usuario.getBloqueado()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Usuario bloqueado — contacte al administrador");
        }

        if (!passwordEncoder.matches(request.getContrasena(), usuario.getContrasena())) {
            int intentos = usuario.getIntentosFallidos() + 1;
            usuario.setIntentosFallidos(intentos);
            if (intentos >= MAX_INTENTOS) {
                usuario.setBloqueado(true);
            }
            usuarioRepository.save(usuario);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas");
        }

        usuario.setIntentosFallidos(0);
        usuarioRepository.save(usuario);

        String token = jwtUtil.generateToken(usuario.getCorreo(), usuario.getRol());

        return LoginResponseDto.builder()
                .token(token)
                .correo(usuario.getCorreo())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .rol(usuario.getRol())
                .build();
    }
}
