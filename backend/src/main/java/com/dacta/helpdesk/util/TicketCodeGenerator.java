package com.dacta.helpdesk.util;

import com.dacta.helpdesk.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TicketCodeGenerator {

    private final TicketRepository ticketRepository;

    @Autowired
    public TicketCodeGenerator(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public synchronized String generarSiguienteCodigo() {
        long total = ticketRepository.count();
        long siguiente = total + 1;
        return String.format("TK-%05d", siguiente);
    }
}
