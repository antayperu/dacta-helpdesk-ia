# INTEGRENS-BRAND-SKILL — Design System Oficial
# DACTA Help Desk IA v1.0
# Basado en: Paleta de colores extraída del ERP Integrens real
# Versión: 1.0 | Fecha: 2026-05-31
# Orquestador: Camilo Ortega FR
# USO: Claude Code DEBE leer este archivo antes de generar
#      cualquier mockup o componente frontend

---

## INSTRUCCIÓN PARA CLAUDE CODE

Lee este documento COMPLETO antes de escribir una sola línea
de código frontend. Aplica TODAS las especificaciones aquí
definidas sin excepción. No uses colores, fuentes ni
dimensiones que no estén en este documento.

---

## 1. PALETA DE COLORES INTEGRENS

### Colores primarios — extraídos del ERP Integrens real

```css
:root {
  /* Púrpuras principales */
  --int-purple:       #5B33D4;  /* Púrpura principal — botones, acciones, logo */
  --int-purple-dark:  #453E72;  /* Púrpura oscuro — header, navbar */
  --int-purple-deep:  #3B2A8F;  /* Púrpura profundo — hover de botones */
  --int-purple-mid:   #4F38A2;  /* Púrpura medio — gradientes */

  /* Sidebar */
  --int-sidebar:      #353C44;  /* Gris azulado oscuro — sidebar principal */
  --int-sidebar-hover:#2C333B;  /* Sidebar hover */

  /* Acento */
  --int-cyan:         #38C1E1;  /* Cyan — botones especiales, badges activos */
  --int-cyan-dark:    #2AAEC8;  /* Cyan hover */

  /* Fondos */
  --int-bg-lavanda:   #F2F0FE;  /* Lavanda claro — fondo general */
  --int-bg-lavanda-md:#E9E7FF;  /* Lavanda medio — cards, hover */
  --int-bg-white:     #FFFFFF;  /* Blanco — panels, formularios */

  /* Neutros */
  --int-text-dark:    #1E1B2E;  /* Texto principal */
  --int-text-mid:     #4A4560;  /* Texto secundario */
  --int-text-light:   #8B87A8;  /* Texto deshabilitado, placeholders */
  --int-border:       #DDD9F5;  /* Bordes de inputs y cards */
  --int-border-light: #EEEAFF;  /* Bordes muy sutiles */
}
```

### Colores semánticos — estados de tickets

```css
:root {
  /* Urgencia */
  --urgencia-critica:      #EF4444;
  --urgencia-critica-bg:   #FEE2E2;
  --urgencia-alta:         #F97316;
  --urgencia-alta-bg:      #FFEDD5;
  --urgencia-media:        #EAB308;
  --urgencia-media-bg:     #FEF9C3;
  --urgencia-baja:         #22C55E;
  --urgencia-baja-bg:      #DCFCE7;

  /* Estados de ticket */
  --estado-nuevo:          #38C1E1;
  --estado-nuevo-bg:       #E0F7FB;
  --estado-progreso:       #5B33D4;
  --estado-progreso-bg:    #EDE8FB;
  --estado-pendiente:      #F97316;
  --estado-pendiente-bg:   #FFEDD5;
  --estado-resuelto:       #22C55E;
  --estado-resuelto-bg:    #DCFCE7;
  --estado-cerrado:        #8B87A8;
  --estado-cerrado-bg:     #F1F0F8;
  --estado-reabierto:      #EF4444;
  --estado-reabierto-bg:   #FEE2E2;
}
```

---

## 2. TIPOGRAFÍA

```css
/* OBLIGATORIO — nunca usar Inter, Roboto, Arial ni system fonts */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

:root {
  --font-main: 'Plus Jakarta Sans', sans-serif;
}
```

### Escala tipográfica

```css
/* Display — títulos grandes */
font-size: clamp(28px, 3vw, 40px);
font-weight: 800;
letter-spacing: -0.02em;
color: #FFFFFF;  /* sobre fondos oscuros */

/* H1 — títulos de página */
font-size: 24px; font-weight: 700; color: var(--int-text-dark);

/* H2 — títulos de sección */
font-size: 18px; font-weight: 600; color: var(--int-text-dark);

/* H3 — subtítulos */
font-size: 15px; font-weight: 600; color: var(--int-text-dark);

/* Body */
font-size: 14px; font-weight: 400;
line-height: 1.6; color: var(--int-text-mid);

/* Caption */
font-size: 12px; font-weight: 500;
letter-spacing: 0.06em; text-transform: uppercase;
color: var(--int-text-light);
```

---

## 3. LOGO INTEGRENS

```
Archivo:    frontend/public/assets/images/logo-integrens.png
Formato:    PNG con fondo transparente (RGBA)
Dimensiones originales: 400 x 121 px

Tamaños de uso:
- Login panel izquierdo:  280px ancho  ← MÍNIMO OBLIGATORIO
- Sidebar expandido:      180px ancho
- Header aplicación:      160px ancho

REGLA CRÍTICA: Siempre incrustar como Base64 en HTML standalone.
Comando para convertir:
  python -c "import base64; print('data:image/png;base64,' +
  base64.b64encode(open('frontend/public/assets/images/
  logo-integrens.png','rb').read()).decode())"

REGLA: Sobre fondo oscuro (#353C44, #453E72) — funciona directo.
REGLA: Sobre fondo blanco — el logo se ve bien por transparencia.
REGLA: Nunca usar el logo con ancho menor a 120px.
REGLA: Siempre mantener proporción — nunca distorsionar.
```

---

## 4. COMPONENTES — ESPECIFICACIONES EXACTAS

### Botón Primario

```css
.btn-primary {
  background:    #5B33D4;
  color:         #FFFFFF;
  height:        52px;
  padding:       0 28px;
  border-radius: 10px;
  font-size:     15px;
  font-weight:   600;
  font-family:   var(--font-main);
  border:        none;
  cursor:        pointer;
  width:         100%;
  transition:    all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-primary:hover {
  background: #3B2A8F;
  transform:  translateY(-1px);
  box-shadow: 0 8px 24px rgba(91, 51, 212, 0.35);
}
```

### Botón de acción especial (Cyan)

```css
.btn-accent {
  background:    #38C1E1;
  color:         #FFFFFF;
  height:        44px;
  padding:       0 20px;
  border-radius: 10px;
  font-size:     14px;
  font-weight:   600;
}
.btn-accent:hover { background: #2AAEC8; }
```

### Input de formulario

```css
.input-field {
  height:        52px;
  border:        1.5px solid #DDD9F5;
  border-radius: 10px;
  padding:       0 16px;
  font-size:     14px;
  font-family:   var(--font-main);
  color:         #1E1B2E;
  background:    #FFFFFF;
  width:         100%;
  transition:    border-color 0.2s ease, box-shadow 0.2s ease;
}
.input-field:focus {
  outline:      none;
  border-color: #5B33D4;
  box-shadow:   0 0 0 3px rgba(91, 51, 212, 0.12);
}
.input-field::placeholder { color: #8B87A8; }
```

### Sidebar

```css
.sidebar {
  width:           260px;
  min-width:       260px;
  background:      #353C44;
  height:          100vh;
  padding:         24px 0;
  display:         flex;
  flex-direction:  column;
}

/* Header del sidebar — franja púrpura superior */
.sidebar-header {
  background:  linear-gradient(135deg, #453E72 0%, #5B33D4 100%);
  padding:     20px 20px 24px;
  margin-bottom: 8px;
}

/* Item de menú */
.sidebar-item {
  padding:       11px 20px;
  color:         rgba(255,255,255,0.60);
  font-size:     13.5px;
  font-weight:   500;
  border-radius: 8px;
  margin:        2px 10px;
  cursor:        pointer;
  transition:    all 0.15s ease;
  display:       flex;
  align-items:   center;
  gap:           10px;
}
.sidebar-item:hover {
  background: rgba(255,255,255,0.08);
  color:      #FFFFFF;
}
.sidebar-item.active {
  background:  rgba(91,51,212,0.30);
  color:       #FFFFFF;
  border-left: 3px solid #38C1E1;
  padding-left: 17px;
}
```

### Card de ticket

```css
.ticket-card {
  background:    #FFFFFF;
  border:        1px solid #EEEAFF;
  border-radius: 12px;
  padding:       16px 20px;
  cursor:        pointer;
  transition:    all 0.15s ease;
}
.ticket-card:hover {
  border-color: #5B33D4;
  box-shadow:   0 4px 16px rgba(91, 51, 212, 0.10);
  transform:    translateY(-1px);
}
```

### Badges de urgencia

```css
.badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.badge-critica  { background: #FEE2E2; color: #DC2626; }
.badge-alta     { background: #FFEDD5; color: #EA580C; }
.badge-media    { background: #FEF9C3; color: #CA8A04; }
.badge-baja     { background: #DCFCE7; color: #16A34A; }
```

### Badges de estado

```css
.badge-nuevo      { background: #E0F7FB; color: #0E7FA8; }
.badge-progreso   { background: #EDE8FB; color: #5B33D4; }
.badge-pendiente  { background: #FFEDD5; color: #EA580C; }
.badge-resuelto   { background: #DCFCE7; color: #16A34A; }
.badge-cerrado    { background: #F1F0F8; color: #6B6890; }
.badge-reabierto  { background: #FEE2E2; color: #DC2626; }
```

---

## 5. LAYOUT — ESTRUCTURA DE PANTALLAS

### Login — Split layout

```
┌──────────────────────────────────────────────────┐
│  PANEL IZQUIERDO 45%    │  PANEL DERECHO 55%     │
│                         │                        │
│  Fondo: gradiente       │  Fondo: #FFFFFF        │
│  #453E72 → #353C44     │  Top border 3px:       │
│                         │  #453E72→#5B33D4→cyan │
│  Logo Integrens 280px   │                        │
│  mb: 48px               │  Label uppercase cyan  │
│                         │  Título "Bienvenido"   │
│  Título display bold    │  Subtítulo             │
│  Subtítulo italic       │                        │
│  3 features con iconos  │  Input correo          │
│                         │  Input contraseña      │
│  Badge versión abajo    │  Checkbox + link       │
│                         │  Botón #5B33D4         │
│                         │  Divider               │
│                         │  Badges seguridad      │
└──────────────────────────────────────────────────┘
```

### Layout principal de la aplicación

```
┌─────────────────────────────────────────────────┐
│  SIDEBAR #353C44  │  CONTENIDO PRINCIPAL        │
│  260px fijo       │  background: #F2F0FE        │
│                   │                             │
│  Header gradient  │  Header 64px #FFFFFF        │
│  #453E72→#5B33D4  │  border-bottom: #DDD9F5    │
│                   │  ─────────────────────────  │
│  Logo 180px       │  Contenido scrollable       │
│  Menú por rol     │  padding: 24px              │
│  ─────────────    │                             │
│  Nombre + rol     │                             │
└─────────────────────────────────────────────────┘
```

---

## 6. ESPACIADO Y BORDES

```css
:root {
  /* Espaciado — múltiplos de 4 */
  --space-1: 4px;   --space-2: 8px;
  --space-3: 12px;  --space-4: 16px;
  --space-5: 20px;  --space-6: 24px;
  --space-8: 32px;  --space-10: 40px;
  --space-12: 48px; --space-16: 64px;

  /* Border radius */
  --radius-sm:  6px;   /* badges, chips */
  --radius-md:  10px;  /* inputs, botones */
  --radius-lg:  12px;  /* cards */
  --radius-xl:  16px;  /* modales */
  --radius-2xl: 20px;  /* panels grandes */

  /* Sombras */
  --shadow-sm: 0 1px 3px rgba(91,51,212,0.06);
  --shadow-md: 0 4px 16px rgba(91,51,212,0.08);
  --shadow-lg: 0 8px 32px rgba(91,51,212,0.12);
  --shadow-btn: 0 8px 24px rgba(91,51,212,0.30);
}
```

---

## 7. ANIMACIONES

```css
:root { --ease: cubic-bezier(0.4, 0, 0.2, 1); }

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}

/* Uso estándar */
/* Wrapper página: animation: fadeIn 0.6s var(--ease) forwards */
/* Contenido: animation: fadeSlideUp 0.7s var(--ease) 0.3s both */
/* Items lista (stagger): delays 0.1s, 0.2s, 0.3s... */
/* Nunca más de 600ms por animación */
```

---

## 8. HEADER DE APLICACIÓN

```css
.app-header {
  height:          64px;
  background:      #FFFFFF;
  border-bottom:   1px solid #DDD9F5;
  padding:         0 24px;
  display:         flex;
  align-items:     center;
  justify-content: space-between;
  position:        sticky;
  top:             0;
  z-index:         100;
  box-shadow:      0 1px 8px rgba(91,51,212,0.06);
}

/* Badge IA activa */
.ia-badge {
  background:    rgba(91,51,212,0.08);
  border:        1px solid rgba(91,51,212,0.20);
  color:         #5B33D4;
  padding:       4px 12px;
  border-radius: 20px;
  font-size:     12px;
  font-weight:   500;
  display:       flex;
  align-items:   center;
  gap:           6px;
}
/* Punto verde pulsante */
.ia-dot {
  width: 7px; height: 7px;
  background: #22C55E;
  border-radius: 50%;
  animation: pulse 2s infinite;
}
```

---

## 9. RESPONSIVE — BREAKPOINTS

```
xs: 0px     — base mobile
sm: 640px   — mobile grande
md: 768px   — tablet
lg: 1024px  — desktop
xl: 1280px  — desktop ancho

Login split: activo en md+, columna única en sm-
Sidebar: visible fijo en lg+, overlay en md-, oculto por defecto en sm
Dashboard: 4 cols en xl, 2 cols en md, 1 col en sm
```

---

## 10. REGLAS CRÍTICAS PARA CLAUDE CODE

```
✅ SIEMPRE leer este archivo antes de cualquier tarea frontend
✅ SIEMPRE usar #5B33D4 como color principal (NO #2E4AF6)
✅ SIEMPRE usar #353C44 para el sidebar (NO #003366)
✅ SIEMPRE usar #453E72 para el header/navbar
✅ SIEMPRE incrustar logo-integrens.png como Base64
✅ SIEMPRE logo a mínimo 280px en login, 160px en sidebar
✅ SIEMPRE usar Plus Jakarta Sans desde Google Fonts
✅ SIEMPRE hacer archivos 100% standalone (CSS+JS en el HTML)
✅ SIEMPRE incluir todas las variables CSS en :root

❌ NUNCA usar #2E4AF6, #003366 o colores DACTA corporativos
❌ NUNCA usar Inter, Roboto, Arial ni system fonts
❌ NUNCA logo menor a 120px de ancho
❌ NUNCA inventar colores fuera de esta paleta
❌ NUNCA generar frontend sin haber leído este archivo
```

---

## 11. ORDEN DE LECTURA OBLIGATORIO PARA CLAUDE CODE

Antes de generar CUALQUIER archivo frontend:
1. AGENTS.md
2. CONVENTIONS.md
3. docs/specs/SPEC-001-historias-usuario.md
4. docs/skills/INTEGRENS-BRAND-SKILL.md ← ESTE ARCHIVO
5. Ejecutar la tarea del TASK-LIST

---
*DACTA S.A.C. — Documento controlado*
*INTEGRENS-BRAND-SKILL v1.0 — 2026-05-31*
*Orquestador: Camilo Ortega FR — QE / SDD*
