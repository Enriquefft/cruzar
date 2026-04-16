# Cruzar — Guía de marca

Documento canónico para el uso de la identidad Cruzar. Cualquier integrante del equipo, contratista o agencia externa debe leer este archivo antes de producir superficies (landing, deck, CV, email, dashboard, templates, slides, social, anuncios, papelería). No contiene secciones sujetas a interpretación: si una regla no está aquí, no existe — en lugar de inventar, preguntar y actualizar este archivo.

- **SSOT de tokens:** [`apps/brand/lib/tokens.ts`](../../apps/brand/lib/tokens.ts) (color, tipografía, espacio, escala, mark).
- **SSOT de fuentes:** [`apps/brand/lib/fonts.ts`](../../apps/brand/lib/fonts.ts) (configuraciones de `next/font/google`).
- **SSOT de contenido:** [`apps/brand/lib/content.ts`](../../apps/brand/lib/content.ts) (nombre, tagline, promesa, proof, pricing).
- **Referencia visual navegable:** `/brand/guidelines` en `apps/brand` (Deliverable 2 de Capa 5).
- **Contexto de diseño:** [`.impeccable.md`](../../.impeccable.md).

Idioma del documento: español. Tokens, nombres de archivos y encabezados estructurales (`Status`, `Historial`, `Open questions`) permanecen en inglés para preservar grep.

---

## A. El wordmark

### A.1 Anatomía

El wordmark consiste en **dos componentes, ambos obligatorios**:

1. La palabra `Cruzar` en Literata, peso 400, sin modificaciones al dibujo tipográfico.
2. El **punto acento** (`.`) inmediatamente después de la `r`, coloreado en `ACCENT` (`oklch(0.42 0.14 30)` — aged red).

El punto **no es puntuación gramatical**. Es parte integral de la marca. No se elimina, no se sustituye, no se recolorea, no se desplaza.

Implementación canónica: [`apps/brand/components/Logotype.tsx`](../../apps/brand/components/Logotype.tsx). Archivo SVG de respaldo: `apps/brand/public/cruzar-wordmark.svg` y `cruzar-wordmark-inverted.svg`. Cualquier consumidor (email, deck, PDF) debe referenciar uno de estos artefactos — no redibujar el wordmark a mano.

### A.2 Clear space

Padding mínimo alrededor del wordmark: **1× la altura-x de la `C`** por cada lado (arriba, abajo, izquierda, derecha). A escala de `height=64px`, la altura-x aproximada es de 36px — por tanto el clear space exigido es de al menos 36px.

Dentro del clear space no se permite ningún elemento: ni texto, ni borde, ni gráfico, ni fondo adicional. Se permite el color base de la superficie (PAPER o INK) y nada más.

### A.3 Tamaños mínimos

Locked por Capa 1 (stress test del wordmark en [`apps/brand/app/brand/logotype-studies/page.tsx`](../../apps/brand/app/brand/logotype-studies/page.tsx)). El piso digital es **20 px** (ver `WORDMARK.minSize` en `tokens.ts`); las medidas en impresión derivan proporcionalmente de ese valor:

| Medio | Mínimo |
| --- | --- |
| Digital (pantalla, @1× y @2×) | **20 px** de altura total del wordmark |
| Digital (favicon / avatar cuadrado 16×16 px) | El wordmark no cabe — usar la variante **mark-only**: el punto acento sólo, sin la palabra `Cruzar`. |
| Impresión offset / láser | **5 mm** de altura total |
| Impresión en serigrafía / materiales textiles | **8 mm** de altura total |
| Grabado o impresión en relieve | **10 mm** de altura total |

Por debajo de estos umbrales la `C` mayúscula pierde la modulación del trazo de Literata y el punto acento se percibe como mancha aleatoria. Todo uso del wordmark que caiga por debajo del mínimo de su medio debe cambiar a la variante mark-only.

### A.4 Contextos permitidos

Permitidos sin fricción:

1. **Tinta sobre papel** — wordmark en `INK` sobre `PAPER` o `PAPER_DEEP`.
2. **Papel sobre tinta** — wordmark en `PAPER` sobre `INK`. El punto sigue en `ACCENT`.
3. **Monocromo 1-bit** — negro #000 o blanco #fff sólo cuando la reproducción técnica lo exige (sellos, fax, impresión en una tinta). En monocromo, el punto acento es el mismo color que la palabra. No se emula el rojo con trama.

Prohibidos sin excepción:

- Cualquier fondo cuyo color esté dentro de `ΔE 25` (en OKLCH) del `ACCENT`. Si el punto acento no puede distinguirse del fondo por diferencia perceptual, el contexto queda vetado.
- Gradientes de cualquier tipo detrás del wordmark.
- Fotografías sin *scrim* sólido intermedio. Si debe superponerse sobre fotografía, aplicar una capa de `PAPER` o `INK` al 100% de opacidad cubriendo al menos el clear space en todas las direcciones.
- Patterns, texturas, mallas, puntos, tramas — ninguno.

### A.5 Modificaciones prohibidas

Cada una con su razón:

| Modificación | Por qué está prohibida |
| --- | --- |
| Inclinar / sesgar / hacer italics falsos | El grafismo de Literata ya provee una variante italic diseñada; cualquier inclinación programática destruye el calce óptico. Además, la inclinación del wordmark proyecta "startup divertido" — lo opuesto al registro institucional. |
| Añadir sombra (drop-shadow, text-shadow, glow) | La sombra es el primer reflejo de slop editorial; destruye la lectura plana tipográfica que sostiene el registro Economist/Stripe. |
| Outline / stroke sobre las letras | Outline es recurso de emergencia para marcas con contraste insuficiente. Cruzar no lo necesita y lo prohibe. |
| Gradientes en cualquier letra | Ban absoluto de `impeccable` (ver [`SKILL.md`](../../.claude/skills/impeccable/SKILL.md)). Además convierte la marca en decorativa en lugar de significativa. |
| Recolorear el punto a cualquier cosa distinta de `ACCENT` | El punto es la única instancia del color acento autorizada por superficie (A.1 + B.3). Recolorearlo elimina el único acento aprobado. |
| Eliminar el punto | El punto es parte de la marca, no puntuación. Eliminarlo es equivalente a borrar la `r`. |
| Sustituir el punto por otro glifo (asterisco, guión, círculo, cuadrado, emoji) | El glifo es un punto tipográfico específico. Cualquier reemplazo destruye la identidad. |
| Separar el punto del resto del wordmark | La posición del punto está fijada por el kerning de Literata al final de la `r`. Cualquier separación manual produce un espaciado inconsistente entre superficies. |
| Escalar el punto de forma independiente | El punto hereda el `font-size` del wordmark. No se le asigna tamaño propio. |
| Usar el wordmark como parte de una frase larga | El wordmark no se concatena con otras palabras en la misma línea tipográfica (por ejemplo "Bienvenido a Cruzar." no se escribe con el wordmark). Cuando `Cruzar` aparece en prosa, se escribe como texto en la fuente corriente, sin el punto acento. |

#### ACCENT halo-zone ban

Nunca colocar el wordmark sobre fondos dentro de ΔL < 0.2 o ΔH < 20° del color `ACCENT` (la zona-halo). El period desaparece visualmente — el punto es la única instancia de acento autorizada por superficie y perderlo por vecindad tonal borra la identidad. Verificado en Capa 3: cualquier tono terra/brick, rojo cálido o aged red como fondo cae en la zona-halo y queda vetado para el wordmark.

---

## B. Color

### B.1 Tokens

| Nombre | OKLCH | Hex (fallback) | Rol |
| --- | --- | --- | --- |
| `PAPER` | `oklch(0.97 0.012 85)` | `#f6f1e5` | Canvas — fondo dominante |
| `PAPER_DEEP` | `oklch(0.945 0.014 82)` | `#efe7d6` | Shelf / sección secundaria |
| `CARD` | `oklch(0.985 0.006 82)` | `#f9f6ee` | Superficie elevada sobre paper |
| `INK` | `oklch(0.18 0.01 80)` | `#262219` | Texto de cuerpo y titulares |
| `INK_SOFT` | `oklch(0.38 0.012 80)` | `#5a524a` | Texto secundario |
| `INK_LABEL` | `oklch(0.55 0.012 80)` | `#898178` | Decorativo / label-only — falla WCAG AA en todas las superficies Cruzar; usar sólo en eyebrows, captions, metadata y column headers en mono |
| `HAIRLINE` | `oklch(0.82 0.012 80)` | `#d1c9bb` | Divisores 1px |
| `HAIRLINE_STRONG` | `oklch(0.72 0.012 80)` | `#b4ac9e` | Divisores de sección densos |
| `ACCENT` | `oklch(0.42 0.14 30)` | `#8c3523` | Aged red — punto acento, marcadores de sección |
| `SIGNAL` | `oklch(0.55 0.16 35)` | `#c25836` | Terra/brick — operator surfaces |
| `SIGNAL_DIM` | `oklch(0.55 0.16 35 / 0.12)` | — | Tint de fila / banda de estado |

Los valores hex son **fallback** únicamente para motores que no entienden OKLCH (email renderers antiguos, GDI, PowerPoint). En todas las superficies modernas (web, CSS, SVG, PDF vía Chromium) se usa el valor OKLCH.

### B.2 Regla 60-30-10

La distribución es **peso visual**, no conteo de pixeles:

- **60% PAPER / PAPER_DEEP / CARD** — canvas y superficies.
- **30% INK / INK_SOFT / INK_LABEL / HAIRLINE** — tipografía y estructura.
- **10% ACCENT o SIGNAL** — énfasis quirúrgico.

### B.3 Presupuesto de acento

**Por superficie** (una pantalla, una slide, un PDF de una hoja, un email):

- **Registro editorial**: máximo **2 instancias** de `ACCENT` — el punto del wordmark cuenta como una. Es decir, el wordmark + un marcador de sección (§ I, § II…) es el techo. Un tercer uso degrada el acento a decoración.
- **Registro field/operator**: acento editorial `ACCENT` **no se usa**. En su lugar, `SIGNAL` puede aparecer hasta **3 instancias** (métrica lead, flag de estado, cabecera de tabla destacada). `SIGNAL_DIM` como tint de fila no cuenta contra el presupuesto.

La razón es impeccable: los acentos funcionan *porque* son escasos. El presupuesto lo codifica.

### B.4 Contraste WCAG

Combinaciones **sancionadas**:

| Texto | Fondo | Ratio | Uso autorizado |
| --- | --- | --- | --- |
| `INK` | `PAPER` | 13.5:1 — AAA | Cuerpo, titulares, prosa |
| `INK` | `PAPER_DEEP` | 12.2:1 — AAA | Cuerpo sobre shelf |
| `INK` | `CARD` | 14.1:1 — AAA | Cuerpo sobre superficie elevada |
| `INK_SOFT` | `PAPER` | 7.1:1 — AAA | Texto secundario |
| `INK_LABEL` | `PAPER` | 3.3–3.5:1 — **falla AA** | Decorativo / label-only: sólo eyebrows, captions, metadata, column headers en mono. Nunca prosa ni cualquier texto que un usuario deba leer en long form. |
| `PAPER` | `INK` | 13.5:1 — AAA | Inverted surfaces |
| `ACCENT` | `PAPER` | 5.9:1 — AA | El punto del wordmark, marcadores `§` |
| `SIGNAL` | `PAPER` | 3.9:1 — AA Large | Sólo ≥18px o ≥14px bold |

Combinaciones **prohibidas**:

- `INK_LABEL` para cualquier texto de prosa — falla WCAG AA en todas las superficies Cruzar (3.3–3.5:1). Sanctionado sólo en eyebrows pequeños en mayúsculas tracked, captions, metadata y column headers en mono. Verificado en Capa 3.
- `ACCENT` sobre `SIGNAL_DIM` o cualquier tint rojizo — contraste insuficiente y confusión de jerarquía.
- `SIGNAL` para prosa de cuerpo — falla contraste por debajo de 18px.
- Cualquier par que combine dos tonos cálidos de la misma familia con ΔL < 0.2 (p.ej. `PAPER` sobre `PAPER_DEEP`).

### B.5 Dark-mode tokens

Locked por Capa 3. Valores exactos en `tokens.ts` (aggregate `colorDark`):

| Nombre | OKLCH | Rol |
| --- | --- | --- |
| `DARK_PAPER` | `oklch(0.19 0.012 80)` | Canvas — fondo dominante dark |
| `DARK_PAPER_DEEP` | `oklch(0.155 0.012 80)` | Shelf / sección secundaria |
| `DARK_CARD` | `oklch(0.225 0.012 80)` | Superficie elevada sobre paper |
| `DARK_INK` | `oklch(0.94 0.01 85)` | Texto de cuerpo y titulares |
| `DARK_INK_SOFT` | `oklch(0.78 0.012 82)` | Texto secundario |
| `DARK_INK_LABEL` | `oklch(0.6 0.012 80)` | Decorativo / label-only — mismas restricciones que `INK_LABEL` en light |
| `DARK_HAIRLINE` | `oklch(0.32 0.012 80)` | Divisores 1px |
| `ACCENT_DARK` | `oklch(0.68 0.17 32)` | **Punto del wordmark en superficies dark — nunca usar `ACCENT` directamente** |

Regla crítica: el punto del wordmark sobre cualquier superficie dark se pinta con `ACCENT_DARK`, **no con `ACCENT`**. Capa 3 stress-tested `ACCENT` (L=0.42) sobre `DARK_PAPER`: ratio ≈ 2.2:1, falla. `ACCENT_DARK` (L=0.68, C=0.17) rinde ≈ 5.9:1 sobre `DARK_PAPER` preservando la identidad cromática del acento aged red a través de los filtros CVD (deuteranopia, protanopia, tritanopia).

Dashboards de operador son el contexto primario dark-mode. Cualquier otra superficie permanece light-first salvo excepción documentada.

### B.6 Combinaciones de color prohibidas

- `ACCENT` + cualquier gradiente de fondo — rompe los *bans* absolutos de `impeccable`.
- Acento neón o colores saturados fuera de los tokens definidos — el brief explícitamente anti-referencia la paleta AI-edtech (cyan, púrpura, neón).
- Colores de banderas LatAm como crutch identitario (rojo-blanco-rojo peruano, verde-blanco-rojo mexicano). Cruzar es cross-border; la bandera es el antítesis.
- Pure black `#000` y pure white `#fff`. Siempre se usan `INK` y `PAPER`.

---

## C. Tipografía

### C.1 Los cuatro roles

Los cuatro roles tipográficos están definidos en `FONT_FAMILY` en `tokens.ts`. Este stack fue locked tras el head-to-head de Capa 2 (ver [`apps/brand/app/brand/type-studies/page.tsx`](../../apps/brand/app/brand/type-studies/page.tsx)):

| Rol | Familia | Uso |
| --- | --- | --- |
| `display` | **Literata** | Titulares editoriales, wordmark, números protagonistas, pull quotes |
| `body` | **Funnel Sans** | Prosa general, párrafos, UI de lectura |
| `bodyDense` | **Geologica** | Superficies field-register (dashboards, CV, tablas densas) |
| `mono` | **Geist Mono** (400 / 500) | Datos tabulares, labels all-caps, códigos, IDs, timestamps |

### C.2 Reglas de jerarquía

- `display` **sólo** para headlines, pull quotes, el wordmark, y figuras-protagonistas (la cifra huge de una métrica lead). Nunca para labels, botones, o prosa.
- `body` **sólo** para prosa de lectura en superficies de registro editorial (landing, deck, emails formales).
- `bodyDense` **sólo** para superficies de registro field/operator (dashboards, CV, tablas de datos densas).
- `mono` **sólo** para datos (números con unidades), labels en mayúsculas tracked, IDs, códigos, timestamps, meta-strips. **Nunca** para prosa continua (>2 líneas seguidas).

### C.3 Cifras tabulares — siempre on

Toda superficie debe aplicar `font-variant-numeric: tabular-nums lining-nums` en cualquier contexto donde aparezcan dígitos. Esto incluye tablas, ledgers, métricas, fechas, precios, y párrafos de prosa que contengan cifras. La razón es que Cruzar vende sobre números (placement count, salary delta, CEFR, fecha de pago); cualquier salto de ancho de cifra es ruido que compite con la prueba.

### C.4 Longitud de línea

Cuerpo de prosa: **65–75 caracteres** (token `measure.prose = "72ch"`).
Captions y micro-copy: **≤42ch** (`measure.caption`).

### C.5 Prohibiciones

- Nunca correr prosa larga en `display` — la serifa está diseñada para titulares, no para 8 líneas de párrafo.
- Nunca usar `mono` para prosa — destruye la densidad de lectura.
- Nunca usar `display` para labels o UI de tamaño <32px — a ese tamaño la serifa pierde definición.
- Nunca usar all-caps en párrafos de cuerpo. All-caps se reserva para labels cortos y headings de sección.
- Nunca `letter-spacing` positivo sobre `display` por encima de `-0.01em` (Literata al 400 ya está espaciado; abrir tracking degrada el kerning).
- Nunca mezclar más de 2 tamaños de tipografía en un mismo bloque de contenido de menos de 400px de ancho.

---

## D. Layout & espacio

### D.1 Escala de espacio 4pt

Definida en `space` de `tokens.ts`:

| Token | Valor | Uso canónico |
| --- | --- | --- |
| `space.1` | 4px | Gap entre glyph y label inline |
| `space.2` | 8px | Gap dentro de un MetaItem |
| `space.3` | 12px | Gap entre celdas de una tabla densa |
| `space.4` | 16px | Gap estándar entre elementos de un bloque |
| `space.6` | 24px | Padding de section header |
| `space.8` | 32px | Gap entre bloques hermanos |
| `space.12` | 48px | Gap entre secciones de un documento |
| `space.16` | 64px | Padding exterior de page container |
| `space.24` | 96px | Separación entre secciones mayores en superficies editoriales |

Cualquier valor de spacing fuera de esta escala es una desviación y requiere justificación en comentario de código.

### D.2 Escala tipográfica modular

Definida en `text` de `tokens.ts`, ratio ~1.25:

```
xs = 0.72rem
sm = 0.88rem
base = 1rem
lg = 1.25rem
xl = 1.56rem
2xl = 1.95rem
display3 = clamp(1.4rem, 2.2vw, 1.9rem)
display2 = clamp(2rem, 4.5vw, 3.5rem)
display1 = clamp(4.5rem, 16vw, 12.5rem)
```

Superficies de producto (dashboards) usan los pasos fijos en rem. Superficies de marketing / editorial usan los pasos `display1`/`display2`/`display3` fluidos.

### D.3 Asimetría preferida sobre centrado

Las composiciones centradas (todo alineado al centro del viewport) son la señal visual más reflejo-AI. Cruzar prefiere **layouts asimétricos con alineación izquierda dominante**: una columna de 2fr + columna de 1fr, una cifra protagonista colgada a la izquierda con copy a la derecha, rieles numerados al margen (§ I, § II).

Centrar se permite sólo para: el wordmark aislado en una slide de apertura, el single pull quote, y estados vacíos (empty states) con una sola instrucción.

### D.4 Hairlines sobre stripes coloreados — regla dura

**Regla absoluta**, citada desde [`SKILL.md#absolute_bans`](../../.claude/skills/impeccable/SKILL.md):

> BAN 1: Side-stripe borders on cards/list items/callouts/alerts
> PATTERN: `border-left:` or `border-right:` with width greater than 1px
> INCLUDES: hard-coded colors AND CSS variables

Consecuencia en Cruzar:

- Divisores, cards, callouts y alerts usan siempre `1px solid HAIRLINE` o `1px solid HAIRLINE_STRONG`.
- Nunca un `border-left: 3px solid ACCENT` o equivalente.
- Énfasis lateral se logra con tipografía (número hung al margen, eyebrow `§ I`), no con franjas de color.

### D.5 Prohibiciones de layout

- **Cards dentro de cards** — plano la jerarquía; si el contenido necesita anidamiento, separar por hairline o por variación de `PAPER` / `PAPER_DEEP` / `CARD`, no por doble border.
- **Grids idénticos de cards** — mismo tamaño, mismo ícono arriba, mismo heading y mismo texto repetido. Es la señal más identificable de AI-slop. Variar tamaños y densidades según la jerarquía.
- **"Hero metric template"** — cifra gigante + label pequeño + 3 sub-stats alineadas + acento en gradiente. Cruzar usa figuras protagonistas, pero sin el patrón reflejo (la cifra se cuelga asimétrica, no se centra sobre sub-stats).
- **Side-stripe accents >1px** — prohibido por D.4.
- **Modales para confirmaciones triviales** — usar inline feedback o undo pattern.

---

## E. Fotografía e ilustración

### E.1 Regla actual — MVP

**No se usa fotografía en Cruzar.** Cero fotos. Ni de personas, ni de oficinas, ni de laptops, ni de paisajes.

Razón: el stock de "equipos diversos sonriendo frente a laptops" es la estética AI-edtech que Cruzar anti-referencia explícitamente. Cualquier foto de stock introduciría exactamente la textura que el brief proscribe. La ausencia de fotografía es un statement — la marca respira datos y tipografía, no personas genéricas.

### E.2 Si la fotografía entrara más adelante

Cuando un día la marca incorpore fotografía (post-cohort 04, documentado en `mvp-0.md` o superior), las reglas serán:

- Sujetos reales: estudiantes Cruzar verificados, outcomes reales, con permiso escrito por foto.
- Fondos reales: no estudios, no green-screen, no backdrops corporativos. La habitación donde estudian, la calle donde viven, la silla donde trabajan.
- Tratamiento: tintado sutil hacia `PAPER` (duotono con `INK` + `PAPER` o un ligero warm-shift). Sin saturación plena.
- Nunca centradas (romper el encuadre, crop editorial).
- Nunca con texto superpuesto más grande de lo que el sistema tipográfico permite (captions `caption` en `INK_LABEL`, nada más).

### E.3 Ilustración

- **No se usan ilustraciones de personas** — ni silhouettes, ni estilizadas, ni vectorizadas. Cualquier dibujo de personas proyecta edtech infantil.
- **No se usan abstract gradient blobs** — el género de "formas orgánicas púrpura-azul" es el tell AI por antonomasia.
- **No se usan íconos isométricos** ni set de íconos de stock (Heroicons, Lucide, Font Awesome como decoración).
- **Sí se permiten**: marcadores tipográficos (§, ·, ▸, ◐, ●, ◆) usados como elementos funcionales del sistema; el wordmark y variantes. Nada más.

---

## F. Voz (cross-reference)

La voz editorial canónica vive en `product/cruzar/brand-voice.md` (a producir en su propia capa — Capa 6 si se abre, o documento separado en paralelo). Resumen de 3 oraciones:

- **Cruzar habla como** un analista editorial de The Economist que entiende empleos remotos: preciso, con cifras, sin adjetivos promocionales, sin inglés forzado al traducir al español.
- **Cruzar nunca habla como** una startup disruptora ("revolucionamos", "unlock your potential"), una bootcamp motivacional ("¡Tú puedes!"), o un agente AI ("As an AI…"). Prohibido el corporate-speak y el hype de Silicon Valley traducido.
- **Regla bilingüe**: cada superficie tiene que funcionar **unchanged** en ES y EN. Una no es traducción de la otra — ambas son versiones primarias. Nada de "Powered by Cruzar" en una landing en español.

---

## G. Firmas de email

### G.1 Formato fijo

Plantilla canónica (HTML, consumida desde `@cruzar/brand/tokens` para colores y `@cruzar/brand/fonts` para la fuente):

```
<Nombre del founder>
<Rol>
Cruzar.  ← wordmark inline, SVG embebido, height=18px
cruzar.io · <email>
```

**Ejemplo:**

```
Enrique Flores-Talavera
Co-founder · Product & Engineering
Cruzar.
cruzar.io · enrique@cruzar.io
```

Reglas del render:

- La palabra `Cruzar.` es el wordmark real (SVG embebido desde `/cruzar-wordmark.svg` o render inline de `Logotype.tsx`). No es texto plano con un punto — es el logotype.
- Colores: `INK` para el nombre y el rol, `INK_SOFT` para la línea de contacto, `ACCENT` para el punto del wordmark (ya está en el SVG).
- Sin imagen de avatar, sin tracking pixel.

### G.2 Prohibiciones

- **Sin quotes motivacionales** ("Keep crossing borders", "Dream big"…).
- **Sin disclaimer de móvil** ("Sent from my iPhone", "Please excuse brevity").
- **Sin imagen attachment** como firma (PNG, JPG de una tarjeta de presentación). El wordmark va inline SVG; nada más.
- **Sin íconos de redes sociales coloreados** — los handles (G.3) se escriben como texto; no se embeben íconos de Twitter / LinkedIn.
- **Sin legal disclaimer multi-línea** que ocupe más espacio que la firma en sí.

---

## H. Handles sociales

### H.1 Web

- **Dominio canónico**: `cruzar.io`.
- **Email corporativo**: `<name>@cruzar.io`.

### H.2 Convenciones para plataformas (aún no registradas)

Cuando se registren, los handles deben coincidir con la siguiente convención:

| Plataforma | Handle | Display name |
| --- | --- | --- |
| Twitter / X | `@cruzar` (fallback `@cruzarHQ` si el primero no está disponible) | `Cruzar.` |
| LinkedIn | `/company/cruzar` (fallback `/company/cruzarHQ`) | `Cruzar.` |
| Instagram | `@cruzar` (fallback `@cruzar.io`) | `Cruzar.` |
| GitHub | `cruzar` (fallback `cruzar-io`) | `Cruzar.` |
| YouTube | `@cruzar` (fallback `@cruzarHQ`) | `Cruzar.` |

**Regla crítica: NO registrar los handles todavía.** Este documento fija la convención de forma que, el día que se registren, todas las superficies apunten al mismo string. Registrar ahora significa squatting sin plan de contenido, lo cual genera riesgo legal y de reputación (handles muertos).

### H.3 Display name

En **todas** las plataformas el display name incluye el punto acento: `Cruzar.` (no `Cruzar` solo). En campos de texto plano que no soportan el estilo del acento (la mayoría), el punto se escribe como punto tipográfico normal — la plataforma no lo colorea, pero la forma del nombre queda consistente con el wordmark.

---

## I. Nombrado de archivos

### I.1 Patrón canónico

```
cruzar-{type}-{descriptor}-{YYYY-MM-DD}.{ext}
```

Donde:

- `type` ∈ `deck`, `cv`, `email`, `report`, `mou`, `invoice`, `proposal`, `brief`, `template`, `screenshot`, `og`, `logo`.
- `descriptor` es un slug kebab-case que identifica la audiencia o el contenido, no su estado. Ejemplos: `rector-utec`, `backend-candidate-es`, `cohort-02-placements`, `institution-anchor-terms`.
- Fecha `YYYY-MM-DD` absoluta. Sin `final`, sin `v2`, sin `FINAL_v3_reallyFINAL`.

### I.2 Ejemplos

| Contexto | Nombre de archivo |
| --- | --- |
| Pitch deck para rector de UTEC, 15 abril 2026 | `cruzar-deck-rector-utec-2026-04-15.pdf` |
| CV de candidato backend, versión en inglés, entregado a Plaid | `cruzar-cv-plaid-backend-2026-04-12.pdf` |
| MoU firmado con universidad Pacífico | `cruzar-mou-pacifico-2026-03-28.pdf` |
| Screenshot del dashboard para investor update | `cruzar-screenshot-dashboard-cohort-02-2026-04-15.png` |
| Proposal de partnership con Platzi | `cruzar-proposal-platzi-2026-04-10.pdf` |
| Wordmark SVG para export | `cruzar-logo-wordmark-2026-04-15.svg` |

### I.3 Por qué

El problema "Untitled1.pdf" al compartir externamente destruye la percepción institucional. Cada archivo que sale de Cruzar debe llevar el nombre al frente, la fecha clara, y el descriptor que permite al receptor archivarlo sin pensar.

---

## J. Charts y data-viz

### J.1 Paleta de 4 colores

Para gráficos, plots y data-viz donde `ACCENT` sólo no basta, Cruzar usa una paleta canónica de **4 colores** definida en `tokens.ts` (`CHART_1..CHART_4`, aggregate `chart`):

| Token | OKLCH | Rol |
| --- | --- | --- |
| `CHART_1` | `oklch(0.50 0.15 30)` | Terra — series 1 (anchor, más cercana a `ACCENT`) |
| `CHART_2` | `oklch(0.52 0.10 110)` | Olive — series 2 |
| `CHART_3` | `oklch(0.45 0.08 235)` | Slate — series 3 |
| `CHART_4` | `oklch(0.62 0.12 75)` | Ochre — series 4 |

Reglas:

- El orden es canónico. Asignar siempre `CHART_1` a la primera serie, `CHART_2` a la segunda, etc. Nunca reordenar por gusto.
- Las hues están separadas por ≥45° a lightness medio matching, **verificado distinguible bajo deuteranopia, protanopia y tritanopia** en Capa 3 — seguro para audiencia con daltonismo.
- Si un gráfico necesita más de 4 series, es señal de que hay que agrupar categorías. No se extiende la paleta.
- El punto del wordmark sigue siendo la única instancia de `ACCENT` en la superficie. La paleta de charts **no convierte** `CHART_1` en acento — son tokens separados con restricciones distintas.

---

## K. Ruta de promoción

### K.1 SSOT y propagación

- **`apps/brand/lib/tokens.ts`** es la única fuente de verdad para color, tipografía, espacio y escala.
- **`apps/brand/lib/fonts.ts`** es la única fuente de verdad para las configuraciones `next/font/google`.
- **`apps/brand/lib/content.ts`** es la única fuente de verdad para nombre, tagline, promesa, proof y pricing textual.

Todo consumidor (`apps/web`, `apps/career-ops`, `apps/brand` mismo, futuros `apps/deck`, slides de prez, templates de email) importa desde el workspace `@cruzar/brand`:

```ts
import { ACCENT, INK, PAPER, FONT_STACK, space } from "@cruzar/brand/tokens";
import { display, body } from "@cruzar/brand/fonts";
import { BRAND, PROOF } from "@cruzar/brand/content";
```

### K.2 Cambiar la marca = editar `tokens.ts`

Cualquier cambio en colores, fuentes, escala o espacio se hace **sólo** en `tokens.ts`. El cambio se propaga automáticamente a todas las superficies que consumen desde `@cruzar/brand/tokens`. Nunca se duplica un valor.

### K.3 Regla de PR review

En code review de cualquier PR que toque una superficie de marca:

1. **Buscar valores hex o OKLCH inline** en el diff. Si encontrados, rechazar el PR — deben migrarse a un token en `tokens.ts`.
2. **Buscar nombres de fuente como string** (ej. `"Literata"`, `"Funnel Sans"`, `"Geist Mono"`). Si encontrados fuera de `lib/fonts.ts`, `lib/tokens.ts` o los SVG canónicos del wordmark, rechazar — deben usar `FONT_STACK.display` o `var(--cruzar-display)`.
3. **Buscar valores de espacio fuera de la escala 4pt** (ej. `padding: 7px`, `margin: 13px`). Rechazar si no hay justificación documentada.
4. **Buscar `border-left:` / `border-right:` con width >1px**. Rechazar sin excepción (regla dura de `impeccable`).
5. **Buscar gradient text** (`background-clip: text` con gradiente). Rechazar sin excepción.
6. **Verificar nuevos artifacts** (templates, slide decks, email templates): deben consumir desde `@cruzar/brand` o ser rechazados.

Cualquier desviación de esta guía que no esté documentada como excepción explícita en este archivo — con razón y fecha — es por default un bug, no una feature.

---

## Historial

| Fecha | Evento |
| --- | --- |
| 2026-04-15 | Capa 5 — lock inicial. Tokens `tokens.ts`, fuentes `fonts.ts`, contenido `content.ts` ya consolidados. Capa 1 (logotype stress test) y Capa 3 (dark-mode tokens) aún sin lock; reglas de A.3 y B.5 marcadas como provisionales. |
| 2026-04-15 | Capas 1 – 3 locked. A.3 baja el piso digital a 20 px (favicon usa variante mark-only). A.5 añade ban de zona-halo ACCENT. B.1/B.4 renombran `INK_MUTE → INK_LABEL` con warning WCAG AA explícito. B.5 lock de paleta dark (`DARK_PAPER`…`ACCENT_DARK`) con nota de que el punto dark usa `ACCENT_DARK`, nunca `ACCENT`. C.1 swap de stack tipográfico: Literata (display) + Geist Mono (mono), tras Capa 2 head-to-head; Funnel Sans y Geologica holdovers. Nueva sección J (charts y data-viz) con paleta `CHART_1..CHART_4` CVD-tested. Sección de ruta de promoción renumerada J → K. |
