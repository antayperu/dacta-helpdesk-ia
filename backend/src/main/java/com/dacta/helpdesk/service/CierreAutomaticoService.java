package com.dacta.helpdesk.service;

import com.dacta.helpdesk.model.entity.TicketEntity;
import com.dacta.helpdesk.repository.TicketRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CierreAutomaticoService {

    private static final Logger log = LoggerFactory.getLogger(CierreAutomaticoService.class);

    private final TicketRepository ticketRepository;
    private final TicketService ticketService;

    @Autowired
    public CierreAutomaticoService(TicketRepository ticketRepository,
                                   TicketService ticketService) {
        this.ticketRepository = ticketRepository;
        this.ticketService = ticketService;
    }

    @Scheduled(fixedDelay = 3600000) // cada hora
    public void cerrarTicketsVencidos() {
        LocalDateTime limite = LocalDateTime.now().minusHours(48);
        List<TicketEntity> vencidos = ticketRepository
                .findByEstadoAndDtResueltoBefore("RESUELTO", limite);

        if (vencidos.isEmpty()) return;

        log.info("CierreAutomatico: {} tickets a cerrar", vencidos.size());
        for (TicketEntity ticket : vencidos) {
            ticketService.cerrarAutomaticamente(ticket);
            log.info("Cerrado automáticamente: {}", ticket.getCodigo());
        }
    }
}
