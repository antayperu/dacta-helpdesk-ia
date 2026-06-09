-- V002__datos_iniciales.sql
-- DACTA Help Desk IA v1.0 — Datos iniciales del equipo
-- Autor: Camilo Ortega FR
-- Fecha: 2026-06-08
-- Contraseña inicial: admin (bcrypt)

-- ============================================================
-- Usuarios del equipo Integrens
-- ============================================================
INSERT INTO hds_usuario (correo, nombre, apellido, contrasena, rol) VALUES
    ('cortega@integrens.com',   'Camilo',  'Ortega Fuentes Rivera', '$2b$10$T4IFSrGwulKfvyVTWdkPDuHTAWaYhtQHodAOggoNQ4O1zLbk.758e', 'SUPERVISOR'),
    ('edelgado@integrens.com',  'Carlos',  'Delgado',               '$2b$10$T4IFSrGwulKfvyVTWdkPDuHTAWaYhtQHodAOggoNQ4O1zLbk.758e', 'AGENTE'),
    ('avillegas@integrens.com', 'Antonny', 'Villegas',              '$2b$10$T4IFSrGwulKfvyVTWdkPDuHTAWaYhtQHodAOggoNQ4O1zLbk.758e', 'AGENTE'),
    ('dyuyas@integrens.com',    'Diego',   'Yuyas',                 '$2b$10$T4IFSrGwulKfvyVTWdkPDuHTAWaYhtQHodAOggoNQ4O1zLbk.758e', 'AGENTE'),
    ('srafaile@integrens.com',  'Sebastian','Rafaile',              '$2b$10$T4IFSrGwulKfvyVTWdkPDuHTAWaYhtQHodAOggoNQ4O1zLbk.758e', 'GERENCIA');

-- ============================================================
-- Módulos de Integrens / Intelifac / Mobile
-- ============================================================
INSERT INTO hds_modulo (codigo, nombre, aplicacion) VALUES
    ('CMR-POS', 'Punto de Venta',         'ECS'),
    ('CMR-VEN', 'Ventas CRM',             'ECS'),
    ('LOG-ALM', 'Almacén / Inventario',   'ECS'),
    ('LOG-COM', 'Compras',                'ECS'),
    ('FIN-FAC', 'Facturación',            'ECS'),
    ('FIN-CXC', 'Cuentas por Cobrar',     'ECS'),
    ('RH',      'Recursos Humanos',       'ECS'),
    ('SYS',     'Sistema / Configuración','ECS'),
    ('IFACE',   'Intelifac',              'IFC'),
    ('MOB',     'Mobile',                 'MOV');
