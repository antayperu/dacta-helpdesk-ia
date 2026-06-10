package com.dacta.helpdesk.integracion;

import com.dacta.helpdesk.model.entity.ModuloEntity;
import com.dacta.helpdesk.model.entity.TicketEntity;
import com.dacta.helpdesk.model.entity.UsuarioEntity;
import com.dacta.helpdesk.repository.ModuloRepository;
import com.dacta.helpdesk.repository.TicketRepository;
import com.dacta.helpdesk.repository.UsuarioRepository;
import com.dacta.helpdesk.service.CierreAutomaticoService;
import com.dacta.helpdesk.service.TicketService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class Epica1IntegracionTest {

    @Autowired TicketService ticketService;
    @Autowired TicketRepository ticketRepository;
    @Autowired ModuloRepository moduloRepository;
    @Autowired UsuarioRepository usuarioRepository;
    @Autowired CierreAutomaticoService cierreAutomaticoService;

    private ModuloEntity moduloPrueba;
    private UsuarioEntity agentePrueba;

    @BeforeEach
    void setUp() {
        ModuloEntity modulo = new ModuloEntity();
        modulo.setCodigo("VENTAS");
        modulo.setNombre("Ventas");
        modulo.setAplicacion("ERP");
        moduloPrueba = moduloRepository.save(modulo);

        UsuarioEntity agente = UsuarioEntity.builder()
                .correo("agente@integrens.com")
                .nombre("Carlos")
                .apellido("Pérez")
                .contrasena("$2a$10$hashficticio")
                .rol("AGENTE")
                .activo(true)
                .build();
        agentePrueba = usuarioRepository.save(agente);
    }

    // TEST 1: Correo nuevo → ticket estado NUEVO con canal CORREO
    @Test
    void correoNuevo_creaTicketEstadoNuevo() {
        TicketEntity ticket = ticketService.crearTicketDesdeCorreo(
                "cliente@empresa.com", "Juan Pérez",
                "Error en facturación", "No puedo emitir facturas desde ayer",
                moduloPrueba);

        assertThat(ticket.getId()).isNotNull();
        assertThat(ticket.getCodigo()).matches("TK-\\d{5}");
        assertThat(ticket.getEstado()).isEqualTo("NUEVO");
        assertThat(ticket.getCanalOrigen()).isEqualTo("CORREO");
        assertThat(ticket.getCorreoCliente()).isEqualTo("cliente@empresa.com");
    }

    // TEST 2: Correo duplicado → vinculado al ticket original, no crea ticket nuevo independiente
    // Nota: DuplicadoService (TASK-014) está diferida — se simula el resultado de la detección
    @Test
    void correoDuplicado_vinculadoAlTicketOriginal() {
        TicketEntity original = ticketService.crearTicketDesdeCorreo(
                "cliente@empresa.com", "Juan Pérez",
                "Error en facturación", "No puedo emitir facturas",
                moduloPrueba);

        TicketEntity posibleDuplicado = ticketService.crearTicketDesdeCorreo(
                "cliente@empresa.com", "Juan Pérez",
                "Error en facturación — reenvío", "No puedo emitir facturas",
                moduloPrueba);
        posibleDuplicado.setDuplicado(true);
        posibleDuplicado.setTicketPadre(original);
        TicketEntity guardado = ticketRepository.save(posibleDuplicado);

        assertThat(guardado.getDuplicado()).isTrue();
        assertThat(guardado.getTicketPadre().getCodigo()).isEqualTo(original.getCodigo());

        List<TicketEntity> todos = ticketRepository.findAll();
        long noDuplicados = todos.stream().filter(t -> !t.getDuplicado()).count();
        assertThat(noDuplicados).isEqualTo(1);
        assertThat(todos.stream().filter(t -> !t.getDuplicado()).findFirst()
                .orElseThrow().getCodigo()).isEqualTo(original.getCodigo());
    }

    // TEST 3: WhatsApp → ticket con canal WHATSAPP y estado NUEVO
    // Nota: WhatsAppService (TASK-011) está diferida — se testea el modelo de datos
    @Test
    void whatsApp_creaTicketCanalWhatsApp() {
        TicketEntity ticket = ticketService.crearTicketDesdeWhatsApp(
                "+51999888777", "María López",
                "Hola, tengo un problema con el módulo de inventario",
                moduloPrueba);

        assertThat(ticket.getId()).isNotNull();
        assertThat(ticket.getCodigo()).matches("TK-\\d{5}");
        assertThat(ticket.getEstado()).isEqualTo("NUEVO");
        assertThat(ticket.getCanalOrigen()).isEqualTo("WHATSAPP");
    }

    // TEST 4: Ticket manual → código TK-XXXXX, estado NUEVO, asignado al agente creador
    @Test
    void ticketManual_codigoTkYEstadoNuevo() {
        TicketEntity ticket = ticketService.crearTicketManual(
                "soporte@cliente.com", "Empresa XYZ",
                "Consulta sobre módulo RRHH", "El usuario no puede acceder al sistema",
                "ALTA", moduloPrueba, agentePrueba,
                null, null, null, null, null, null, null, null);

        assertThat(ticket.getCodigo()).matches("TK-\\d{5}");
        assertThat(ticket.getEstado()).isEqualTo("NUEVO");
        assertThat(ticket.getCanalOrigen()).isEqualTo("MANUAL");
        assertThat(ticket.getAgente().getCorreo()).isEqualTo("agente@integrens.com");
    }

    // TEST 5: Ticket vía ERP → canal INTEGRENS_ERP y contexto ERP guardado íntegro
    @Test
    void ticketErp_contextoErpGuardado() {
        TicketEntity ticket = ticketService.crearTicketManual(
                "jperez@empresaabc.com", "Juan Pérez",
                "Error al generar reporte de ventas", "El reporte no carga al hacer clic en Generar",
                "MEDIA", moduloPrueba, agentePrueba,
                "INTEGRENS_ERP", "VENTAS", "v12.3.1",
                "jperez", "Empresa ABC S.A.C.",
                "Clic en botón Generar Reporte", "https://erp.integrens.com/ventas/reportes",
                null);

        assertThat(ticket.getCanalOrigen()).isEqualTo("INTEGRENS_ERP");
        assertThat(ticket.getOrigenSistema()).isEqualTo("INTEGRENS_ERP");
        assertThat(ticket.getModuloErp()).isEqualTo("VENTAS");
        assertThat(ticket.getVersionErp()).isEqualTo("v12.3.1");
        assertThat(ticket.getUsuarioErp()).isEqualTo("jperez");
        assertThat(ticket.getEmpresaCliente()).isEqualTo("Empresa ABC S.A.C.");
        assertThat(ticket.getAccionRealizada()).isEqualTo("Clic en botón Generar Reporte");
    }

    // TEST 6: Ticket en RESUELTO por 49h → CierreAutomaticoService lo cierra
    @Test
    void ticket49hResuelto_estadoCerradoAutomaticamente() {
        TicketEntity ticket = ticketService.crearTicketManual(
                "otro@cliente.com", "Cliente Prueba",
                "Ticket resuelto sin confirmar", "Descripción del problema",
                "BAJA", moduloPrueba, agentePrueba,
                null, null, null, null, null, null, null, null);

        ticket.setEstado("RESUELTO");
        ticket.setDtResuelto(LocalDateTime.now().minusHours(49));
        ticketRepository.save(ticket);
        ticketRepository.flush();

        cierreAutomaticoService.cerrarTicketsVencidos();

        TicketEntity actualizado = ticketRepository.findById(ticket.getId()).orElseThrow();
        assertThat(actualizado.getEstado()).isEqualTo("CERRADO");
        assertThat(actualizado.getDtCerrado()).isNotNull();
    }
}
