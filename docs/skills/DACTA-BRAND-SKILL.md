# DACTA-BRAND-SKILL — Design System Oficial
# DACTA Help Desk IA v1.0
# Versión: 1.0 | Fecha: 2026-05-31
# Orquestador: Camilo Ortega FR
# USO: Claude Code DEBE leer este archivo antes de generar cualquier mockup o componente frontend

---

## INSTRUCCIÓN PARA CLAUDE CODE

Antes de generar cualquier archivo HTML, JSX o CSS del proyecto,
lee este documento completo. Aplica TODAS las especificaciones aquí
definidas. No improvises valores — si no está aquí, pregunta al
Orquestador antes de proceder.

---

## 1. PALETA DE COLORES

### Colores DACTA Help Desk IA (Sistema de Mesa de Ayuda)

```css
/* Colores primarios DACTA */
--dacta-primary:      #2E4AF6;  /* Azul principal — botones, acciones, links activos */
--dacta-primary-dark: #1E37E0;  /* Azul hover — estado hover de botones */
--dacta-primary-light:#4A5EF7;  /* Azul claro — fondos de badges activos */
--dacta-steel:        #6FA3B2;  /* Azul acero — elementos secundarios, iconos, bordes */
--dacta-navy:         #003366;  /* Azul marino — sidebar, cabeceras, menú principal */
--dacta-navy-mid:     #00234D;  /* Azul marino medio — gradientes sidebar */
--dacta-navy-deep:    #001A33;  /* Azul marino profundo — fondos oscuros */
```

### Colores Integrens ERP (Para referencia visual y consistencia)

```css
/* Colores extraídos del ERP Integrens real */
--integrens-purple:   #5B33D4;  /* Púrpura principal Integrens — logo, botones */
--integrens-purple-dk:#473D79;  /* Púrpura oscuro — header del ERP */
--integrens-purple-md:#4F38A2;  /* Púrpura medio — gradientes */
--integrens-sidebar:  #353C44;  /* Gris oscuro sidebar Integrens */
--integrens-cyan:     #38C1E1;  /* Cyan acento — botones de acción especiales */
```

### Colores semánticos del sistema de tickets

```css
/* Urgencia */
--urgencia-critica:   #EF4444;  /* Rojo — tickets críticos */
--urgencia-alta:      #F97316;  /* Naranja — tickets alta prioridad */
--urgencia-media:     #EAB308;  /* Amarillo — tickets media prioridad */
--urgencia-baja:      #22C55E;  /* Verde — tickets baja prioridad */

/* Estados */
--estado-nuevo:       #6FA3B2;  /* Azul acero */
--estado-progreso:    #2E4AF6;  /* Azul principal */
--estado-pendiente:   #F97316;  /* Naranja */
--estado-resuelto:    #22C55E;  /* Verde */
--estado-cerrado:     #94A3B8;  /* Gris */
--estado-reabierto:   #EF4444;  /* Rojo */

/* Neutros */
--neutral-50:         #F8FAFC;
--neutral-100:        #F1F5F9;
--neutral-200:        #E2E8F0;
--neutral-400:        #94A3B8;
--neutral-600:        #475569;
--neutral-800:        #1E293B;
--neutral-900:        #0F172A;
```

---

## 2. TIPOGRAFÍA

### Fuente principal

```css
/* OBLIGATORIO: Nunca usar Inter, Roboto, Arial ni system fonts */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

--font-main: 'Plus Jakarta Sans', sans-serif;
```

### Escala tipográfica

```css
/* Display — títulos grandes en pantallas de bienvenida */
--text-display:  clamp(28px, 3vw, 38px);  font-weight: 800; letter-spacing: -0.02em;

/* Headings */
--text-h1:  24px;  font-weight: 700;
--text-h2:  20px;  font-weight: 600;
--text-h3:  16px;  font-weight: 600;

/* Body */
--text-body:    15px;  font-weight: 400;  line-height: 1.6;
--text-body-sm: 13px;  font-weight: 400;  line-height: 1.5;
--text-caption: 12px;  font-weight: 500;  letter-spacing: 0.04em;
--text-label:   11px;  font-weight: 500;  letter-spacing: 0.08em;  text-transform: uppercase;
```

---

## 3. LOGO DACTA

### Especificaciones de uso

```
Archivo: frontend/public/assets/images/logo-dacta.png
Formato: PNG con fondo transparente (RGBA)
Dimensiones originales: 400 x 133 px

Tamaños de uso:
- Sidebar colapsado:      32px altura
- Sidebar expandido:      120px ancho
- Login panel izquierdo:  200px ancho  ← IMPORTANTE: nunca menos de 200px
- Header aplicación:      140px ancho
- Documentos/reportes:    160px ancho

REGLA: Siempre mantener proporción. Nunca distorsionar.
REGLA: Sobre fondo oscuro (#003366, #001A33) — el logo funciona directo.
REGLA: Sobre fondo blanco — agregar padding mínimo de 16px alrededor.
REGLA: Incrustar como Base64 en mockups HTML para evitar dependencia de rutas.
```

---

## 4. COMPONENTES — ESPECIFICACIONES EXACTAS

### Botón Primario

```css
.btn-primary {
  background:    #2E4AF6;
  color:         #FFFFFF;
  height:        52px;
  padding:       0 28px;
  border-radius: 10px;
  font-size:     15px;
  font-weight:   600;
  border:        none;
  cursor:        pointer;
  transition:    all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  width:         100%;  /* En formularios siempre full width */
}
.btn-primary:hover {
  background: #1E37E0;
  transform:  translateY(-1px);
  box-shadow: 0 8px 24px rgba(46, 74, 246, 0.35);
}
```

### Input de formulario

```css
.input-field {
  height:        52px;
  border:        1.5px solid #E2E8F0;
  border-radius: 8px;
  padding:       0 16px;
  font-size:     15px;
  font-family:   var(--font-main);
  color:         #1E293B;
  background:    #FFFFFF;
  width:         100%;
  transition:    border-color 0.2s ease;
}
.input-field:focus {
  outline:       none;
  border-color:  #2E4AF6;
  box-shadow:    0 0 0 3px rgba(46, 74, 246, 0.12);
}
.input-field::placeholder { color: #94A3B8; }
```

### Sidebar

```css
.sidebar {
  width:      260px;        /* Expandido */
  min-width:  260px;
  background: #003366;      /* Azul marino DACTA — NUNCA cambiar */
  height:     100vh;
  padding:    24px 0;
  display:    flex;
  flex-direction: column;
}

/* Item de menú */
.sidebar-item {
  padding:       12px 20px;
  color:         rgba(255,255,255,0.65);
  font-size:     14px;
  font-weight:   500;
  border-radius: 8px;
  margin:        2px 12px;
  cursor:        pointer;
  transition:    all 0.15s ease;
}
.sidebar-item:hover  { background: rgba(255,255,255,0.08); color: #FFFFFF; }
.sidebar-item.active { background: rgba(46,74,246,0.25);  color: #FFFFFF; border-left: 3px solid #2E4AF6; }
```

### Card de ticket

```css
.ticket-card {
  background:    #FFFFFF;
  border:        1px solid #E2E8F0;
  border-radius: 12px;
  padding:       16px 20px;
  cursor:        pointer;
  transition:    all 0.15s ease;
}
.ticket-card:hover {
  border-color: #2E4AF6;
  box-shadow:   0 4px 16px rgba(46, 74, 246, 0.08);
  transform:    translateY(-1px);
}
```

### Badge de urgencia

```css
.badge { 
  padding: 3px 10px; border-radius: 20px; 
  font-size: 11px; font-weight: 600; 
}
.badge-critica  { background: #FEE2E2; color: #DC2626; }
.badge-alta     { background: #FFEDD5; color: #EA580C; }
.badge-media    { background: #FEF9C3; color: #CA8A04; }
.badge-baja     { background: #DCFCE7; color: #16A34A; }
```

### Badge de estado

```css
.badge-nuevo      { background: #E0F2FE; color: #0369A1; }
.badge-progreso   { background: #EEF2FF; color: #4338CA; }
.badge-pendiente  { background: #FFEDD5; color: #EA580C; }
.badge-resuelto   { background: #DCFCE7; color: #16A34A; }
.badge-cerrado    { background: #F1F5F9; color: #475569; }
.badge-reabierto  { background: #FEE2E2; color: #DC2626; }
```

---

## 5. LAYOUT — ESTRUCTURA DE PANTALLAS

### Layout principal de la aplicación

```
┌─────────────────────────────────────────────┐
│  SIDEBAR (#003366) │  CONTENIDO PRINCIPAL    │
│  260px fijo        │  flex: 1               │
│                    │  background: #F8FAFC   │
│  Logo DACTA 140px  │                        │
│  Menú por rol      │  Header 64px           │
│  ───────────────   │  ────────────────────  │
│  Nombre + rol      │  Contenido scrollable  │
└─────────────────────────────────────────────┘
```

### Login — Split layout

```
┌──────────────────────────────────────────────┐
│  PANEL IZQUIERDO   │  PANEL DERECHO          │
│  45% ancho         │  55% ancho              │
│  background:       │  background: #FFFFFF    │
│  gradiente navy    │                         │
│                    │  Formulario centrado    │
│  Logo DACTA 200px  │  max-width: 400px       │
│  Titular display   │                         │
│  3 features        │  Input correo           │
│                    │  Input contraseña       │
│                    │  Botón Ingresar         │
└──────────────────────────────────────────────┘
```

### Dashboard — Grid de métricas

```
┌─────────────────────────────────────────────┐
│  [Tarjeta] [Tarjeta] [Tarjeta] [Tarjeta]   │  ← 4 cols en desktop
│                                             │
│  [Gráfico barras 60%] [Gráfico torta 38%]  │
│                                             │
│  [Tabla agentes — ancho completo]           │
└─────────────────────────────────────────────┘
```

---

## 6. ESPACIADO Y BORDES

```css
/* Sistema de espaciado — usar siempre múltiplos de 4 */
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;

/* Border radius */
--radius-sm:  6px;   /* badges, chips pequeños */
--radius-md:  8px;   /* inputs, botones pequeños */
--radius-lg:  12px;  /* cards, panels */
--radius-xl:  16px;  /* modales, panels grandes */
--radius-2xl: 20px;  /* panels de login */

/* Sombras */
--shadow-sm:  0 1px 3px rgba(0,0,0,0.08);
--shadow-md:  0 4px 16px rgba(0,0,0,0.08);
--shadow-lg:  0 8px 32px rgba(0,0,0,0.12);
--shadow-primary: 0 8px 24px rgba(46,74,246,0.25);
```

---

## 7. ANIMACIONES

```css
/* Curva de animación estándar DACTA */
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);

/* Entrada de página */
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Entrada staggered (elementos en lista) */
animation: fadeSlideUp 0.5s var(--ease-standard) both;
/* Usar animation-delay: 0.1s, 0.2s, 0.3s para elementos sucesivos */

/* Fade simple */
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* REGLA: Nunca más de 600ms para una animación de UI */
/* REGLA: Siempre usar forwards o both en animation-fill-mode */
```

---

## 8. RESPONSIVE — BREAKPOINTS

```css
/* Mobile first */
/* xs: 0px — base */
/* sm: 640px */
/* md: 768px — tablet */
/* lg: 1024px — desktop */
/* xl: 1280px — desktop ancho */

/* Sidebar: visible en lg+, colapsado en md, oculto en sm- */
/* Login split: activo en md+, columna única en sm- */
/* Dashboard grid: 4 cols en xl, 2 cols en md, 1 col en sm */
```

---

## 9. HEADER DE LA APLICACIÓN

```css
.app-header {
  height:     64px;
  background: #FFFFFF;
  border-bottom: 1px solid #E2E8F0;
  padding:    0 24px;
  display:    flex;
  align-items: center;
  justify-content: space-between;
  position:   sticky;
  top:        0;
  z-index:    100;
}

/* Indicador "IA activa" en el header */
.ia-badge {
  background: rgba(46,74,246,0.08);
  border:     1px solid rgba(46,74,246,0.2);
  color:      #2E4AF6;
  padding:    4px 10px;
  border-radius: 20px;
  font-size:  12px;
  font-weight: 500;
}
/* Punto pulsante verde de estado activo */
.ia-badge::before {
  content: '';
  display: inline-block;
  width: 6px; height: 6px;
  background: #22C55E;
  border-radius: 50%;
  margin-right: 6px;
  animation: pulse 2s infinite;
}
```

---

## 10. REGLAS CRÍTICAS PARA CLAUDE CODE

```
✅ SIEMPRE incrustar logo-dacta.png como Base64 en archivos HTML standalone
✅ SIEMPRE usar Plus Jakarta Sans desde Google Fonts
✅ SIEMPRE usar los HEX exactos definidos en sección 1
✅ SIEMPRE respetar las dimensiones de componentes de sección 4
✅ SIEMPRE incluir CSS variables en :root al inicio del <style>
✅ SIEMPRE hacer archivos 100% standalone (CSS y JS en el mismo HTML)
✅ SIEMPRE verificar responsive en el breakpoint md (768px)

❌ NUNCA usar Inter, Roboto, Arial o system fonts
❌ NUNCA inventar colores fuera de la paleta definida
❌ NUNCA usar el logo con ancho menor a 120px
❌ NUNCA usar border-radius mayor a 20px en componentes principales
❌ NUNCA omitir las animaciones de entrada definidas en sección 7
❌ NUNCA generar mockup sin haber leído este archivo primero
```

---

## 11. ORDEN DE LECTURA PARA CLAUDE CODE

Antes de generar CUALQUIER archivo de frontend, leer en este orden:
1. AGENTS.md
2. CONVENTIONS.md
3. docs/specs/SPEC-001-historias-usuario.md
4. docs/skills/DACTA-BRAND-SKILL.md ← ESTE ARCHIVO
5. Luego ejecutar la tarea específica del TASK-LIST

---
*DACTA S.A.C. — Documento controlado*
*DACTA-BRAND-SKILL v1.0 — 2026-05-31*
*Orquestador: Camilo Ortega FR — QE / SDD*
