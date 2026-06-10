package com.dacta.helpdesk.service;

import com.dacta.helpdesk.model.entity.*;
import com.dacta.helpdesk.repository.TicketHistorialRepository;
import com.dacta.helpdesk.repository.TicketRepository;
import com.dacta.helpdesk.util.TicketCodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketHistorialRepository ticketHistorialRepository;
    private final TicketCodeGenerator ticketCodeGenerator;

    @Autowired
    public TicketService(TicketRepository ticketRepository,
                         TicketHistorialRepository ticketHistorialRepository,
                         TicketCodeGenerator ticketCodeGenerator) {
        this.ticketRepository = ticketRepository;
        this.ticketHistorialRepository = ticketHistorialRepository;
        this.ticketCodeGenerator = ticketCodeGenerator;
    }

    @Transactional
    public TicketEntity crearTicketManual(String correoCliente, String nombreCliente,
                                          String asunto, String descripcion,
                                          String urgencia, ModuloEntity modulo,
                                          UsuarioEntity agente, String origenSistema,
                                          String moduloErp, String versionErp,
                                          String usuarioErp, String empresaCliente,
                                          String accionRealizada, String urlPantalla,
                                          String screenshotBase64) {
        String canal = "INTEGRENS_ERP".equals(origenSistema) ? "INTEGRENS_ERP" : "MANUAL";

        TicketEntity ticket = new TicketEntity();
        ticket.setCodigo(ticketCodeGenerator.generarSiguienteCodigo());
        ticket.setAsunto(asunto);
        ticket.setDescripcion(descripcion);
        ticket.setCanalOrigen(canal);
        ticket.setEstado("NUEVO");
        ticket.setUrgencia(urgencia);
        ticket.setModulo(modulo);
        ticket.setAgente(agente);
        ticket.setCorreoCliente(correoCliente);
        ticket.setNombreCliente(nombreCliente);
        ticket.setOrigenSistema(origenSistema);
        ticket.setModuloErp(moduloErp);
        ticket.setVersionErp(versionErp);
        ticket.setUsuarioErp(usuarioErp);
        ticket.setEmpresaCliente(empresaCliente);
        ticket.setAccionRealizada(accionRealizada);
        ticket.setUrlPantalla(urlPantalla);
        ticket.setScreenshotBase64(screenshotBase64);

        TicketEntity guardado = ticketRepository.save(ticket);

        registrarHistorial(guardado, null, "NUEVO", agente, "Ticket creado manualmente");

        return guardado;
    }

    @Transactional
    public TicketEntity crearTicketDesdeCorreo(String correoCliente, String nombreCliente,
                                               String asunto, String descripcion,
                                               ModuloEntity modulo) {
        TicketEntity ticket = new TicketEntity();
        ticket.setCodigo(ticketCodeGenerator.generarSiguienteCodigo());
        ticket.setAsunto(asunto);
        ticket.setDescripcion(descripcion);
        ticket.setCanalOrigen("CORREO");
        ticket.setEstado("NUEVO");
        ticket.setUrgencia("MEDIA");
        ticket.setModulo(modulo);
        ticket.setCorreoCliente(correoCliente);
        ticket.setNombreCliente(nombreCliente);
        TicketEntity guardado = ticketRepository.save(ticket);
        registrarHistorial(guardado, null, "NUEVO", null, "Ticket creado desde correo");
        return guardado;
    }

    @Transactional
    public TicketEntity crearTicketDesdeWhatsApp(String telefonoCliente, String nombreCliente,
                                                  String mensaje, ModuloEntity modulo) {
        String asunto = "WhatsApp: " + (mensaje.length() > 100 ? mensaje.substring(0, 100) : mensaje);
        TicketEntity ticket = new TicketEntity();
        ticket.setCodigo(ticketCodeGenerator.generarSiguienteCodigo());
        ticket.setAsunto(asunto);
        ticket.setDescripcion(mensaje);
        ticket.setCanalOrigen("WHATSAPP");
        ticket.setEstado("NUEVO");
        ticket.setUrgencia("MEDIA");
        ticket.setModulo(modulo);
        ticket.setCorreoCliente(telefonoCliente);
        ticket.setNombreCliente(nombreCliente);
        TicketEntity guardado = ticketRepository.save(ticket);
        registrarHistorial(guardado, null, "NUEVO", null, "Ticket creado desde WhatsApp");
        return guardado;
    }

    @Transactional
    public TicketEntity reabrirTicket(Long idTicket, String motivo, UsuarioEntity usuario) {
        TicketEntity ticket = ticketRepository.findById(idTicket)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket no encontrado"));

        String estadoActual = ticket.getEstado();
        if (!"RESUELTO".equals(estadoActual) && !"CERRADO".equals(estadoActual)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Solo se pueden reabrir tickets en estado RESUELTO o CERRADO");
        }

        ticket.setEstado("REABIERTO");
        ticket.setDtResuelto(null);
        ticket.setDtCerrado(null);
        TicketEntity guardado = ticketRepository.save(ticket);

        registrarHistorial(guardado, estadoActual, "REABIERTO", usuario, motivo);

        return guardado;
    }

    @Transactional
    public TicketEntity cerrarAutomaticamente(TicketEntity ticket) {
        ticket.setEstado("CERRADO");
        ticket.setDtCerrado(LocalDateTime.now());
        TicketEntity guardado = ticketRepository.save(ticket);

        registrarHistorial(guardado, "RESUELTO", "CERRADO", null,
                "Cierre automático — 48h sin respuesta");

        return guardado;
    }

    private void registrarHistorial(TicketEntity ticket, String estadoAnterior,
                                    String estadoNuevo, UsuarioEntity usuario,
                                    String comentario) {
        TicketHistorialEntity historial = new TicketHistorialEntity();
        historial.setTicket(ticket);
        historial.setEstadoAnterior(estadoAnterior);
        historial.setEstadoNuevo(estadoNuevo);
        historial.setUsuario(usuario);
        historial.setComentario(comentario);
        ticketHistorialRepository.save(historial);
    }
}
