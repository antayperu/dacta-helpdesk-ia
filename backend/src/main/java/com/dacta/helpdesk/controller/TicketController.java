package com.dacta.helpdesk.controller;

import com.dacta.helpdesk.model.dto.CrearTicketManualDto;
import com.dacta.helpdesk.model.dto.TicketResumenDto;
import com.dacta.helpdesk.model.entity.ModuloEntity;
import com.dacta.helpdesk.model.entity.TicketEntity;
import com.dacta.helpdesk.model.entity.UsuarioEntity;
import com.dacta.helpdesk.repository.ModuloRepository;
import com.dacta.helpdesk.repository.TicketRepository;
import com.dacta.helpdesk.repository.UsuarioRepository;
import com.dacta.helpdesk.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;
    private final TicketRepository ticketRepository;
    private final ModuloRepository moduloRepository;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public TicketController(TicketService ticketService,
                            TicketRepository ticketRepository,
                            ModuloRepository moduloRepository,
                            UsuarioRepository usuarioRepository) {
        this.ticketService = ticketService;
        this.ticketRepository = ticketRepository;
        this.moduloRepository = moduloRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/manual")
    public ResponseEntity<Map<String, String>> crearManual(
            @Valid @RequestBody CrearTicketManualDto dto,
            Authentication auth) {

        String correoAgente = auth.getName();
        UsuarioEntity agente = usuarioRepository.findByCorreoAndActivoTrue(correoAgente)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        ModuloEntity modulo = moduloRepository.findById(dto.getIdModulo())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Módulo no encontrado"));

        TicketEntity ticket = ticketService.crearTicketManual(
                dto.getCorreoCliente(), dto.getNombreCliente(),
                dto.getAsunto(), dto.getDescripcion(),
                dto.getUrgencia(), modulo, agente,
                dto.getOrigenSistema(), dto.getModuloErp(),
                dto.getVersionErp(), dto.getUsuarioErp(),
                dto.getEmpresaCliente(), dto.getAccionRealizada(),
                dto.getUrlPantalla(), dto.getScreenshotBase64()
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("codigo", ticket.getCodigo(), "id", ticket.getId().toString()));
    }

    @GetMapping
    public ResponseEntity<Page<TicketResumenDto>> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String estado,
            Authentication auth) {

        String rol = auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        if ("GERENCIA".equals(rol)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Sin acceso a la lista de tickets");
        }

        PageRequest pageable = PageRequest.of(page, size, Sort.by("dtCreado").descending());
        Page<TicketEntity> tickets;

        if ("SUPERVISOR".equals(rol)) {
            tickets = estado != null
                    ? ticketRepository.findByEstado(estado, pageable)
                    : ticketRepository.findAll(pageable);
        } else {
            UsuarioEntity agente = usuarioRepository.findByCorreoAndActivoTrue(auth.getName())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
            tickets = estado != null
                    ? ticketRepository.findByAgenteAndEstado(agente, estado, pageable)
                    : ticketRepository.findByAgenteOrAgenteIsNull(agente, pageable);
        }

        return ResponseEntity.ok(tickets.map(this::toResumenDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketEntity> detalle(@PathVariable Long id, Authentication auth) {
        TicketEntity ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket no encontrado"));

        String rol = auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        if ("AGENTE".equals(rol)) {
            UsuarioEntity agente = usuarioRepository.findByCorreoAndActivoTrue(auth.getName())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
            boolean esPropio = ticket.getAgente() != null && ticket.getAgente().getId().equals(agente.getId());
            boolean sinAsignar = ticket.getAgente() == null;
            if (!esPropio && !sinAsignar) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN);
            }
        }

        return ResponseEntity.ok(ticket);
    }

    @PatchMapping("/{id}/reabrir")
    public ResponseEntity<Map<String, String>> reabrir(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication auth) {

        UsuarioEntity usuario = usuarioRepository.findByCorreoAndActivoTrue(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        String motivo = body.getOrDefault("motivo", "Reapertura solicitada");
        TicketEntity ticket = ticketService.reabrirTicket(id, motivo, usuario);

        return ResponseEntity.ok(Map.of("codigo", ticket.getCodigo(), "estado", ticket.getEstado()));
    }

    private TicketResumenDto toResumenDto(TicketEntity t) {
        TicketResumenDto dto = new TicketResumenDto();
        dto.setId(t.getId());
        dto.setCodigo(t.getCodigo());
        dto.setAsunto(t.getAsunto());
        dto.setEstado(t.getEstado());
        dto.setUrgencia(t.getUrgencia());
        dto.setCanalOrigen(t.getCanalOrigen());
        dto.setCorreoCliente(t.getCorreoCliente());
        dto.setNombreCliente(t.getNombreCliente());
        dto.setDtCreado(t.getDtCreado());
        if (t.getAgente() != null) {
            dto.setNombreAgente(t.getAgente().getNombre() + " " + t.getAgente().getApellido());
        }
        if (t.getModulo() != null) {
            dto.setNombreModulo(t.getModulo().getNombre());
        }
        return dto;
    }
}
