import { Slide, Notes } from "@enriquefft/prez";
import {
  ACCENT,
  HAIRLINE,
  HAIRLINE_STRONG,
  INK,
  INK_LABEL,
  INK_SOFT,
  PAPER,
  PAPER_DEEP,
} from "@cruzar/brand/tokens";
import { BRAND, PRICING, PROOF, QUOTE } from "@cruzar/brand/content";

/**
 * Cruzar — Founding Partner Pitch Deck.
 *
 * Audience: Peruvian rector / VP Academic. Register: editorial institutional,
 * sibling to `apps/brand/app/direction/editorial/page.tsx`. Same paper, same
 * ink, same accent restraint, same numbers-as-protagonist posture.
 *
 * Primary language: Spanish. The EN tagline appears once on the cover slide
 * as a quiet cross-border signal; the pull quote stays in ES. Every digit is
 * tabular. Accent red is reserved for the wordmark period, the § section
 * marker, and the opening mark of the pull quote — nowhere else.
 *
 * Each slide is exactly 1280×720. Layouts are absolute-positioned inside
 * that frame so the composition is stable regardless of browser zoom.
 */

/* ────────────────────────── PRIMITIVES ────────────────────────── */

const SLIDE_BG: React.CSSProperties = {
  width: "100%",
  height: "100%",
  background: PAPER,
  color: INK,
  position: "relative",
  overflow: "hidden",
  fontFamily: "var(--cruzar-body)",
};

function Masthead({ no, total }: { no: string; total: string }) {
  return (
    <div
      className="cz-sans cz-tnum"
      style={{
        position: "absolute",
        top: 32,
        left: 56,
        right: 56,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        fontSize: "0.66rem",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: INK_LABEL,
        borderBottom: `1px solid ${HAIRLINE}`,
        paddingBottom: 10,
      }}
    >
      <span>Cruzar · Founding Partner Pilot</span>
      <span>MMXXVI · Vol. I</span>
      <span>
        {no} / {total}
      </span>
    </div>
  );
}

function Colophon({ text }: { text: string }) {
  return (
    <div
      className="cz-sans cz-tnum"
      style={{
        position: "absolute",
        bottom: 28,
        left: 56,
        right: 56,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        fontSize: "0.62rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: INK_LABEL,
        borderTop: `1px solid ${HAIRLINE}`,
        paddingTop: 10,
      }}
    >
      <span>cruzar.io</span>
      <span>{text}</span>
      <span>2026 · 04 · 15</span>
    </div>
  );
}

function Eyebrow({ no, label }: { no: string; label: string }) {
  return (
    <div
      className="cz-sans cz-tnum"
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 14,
        fontSize: "0.68rem",
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        color: INK_LABEL,
      }}
    >
      <span style={{ color: ACCENT, fontWeight: 600 }}>§ {no}</span>
      <span style={{ flex: "0 0 36px", height: 1, background: HAIRLINE }} />
      <span>{label}</span>
    </div>
  );
}

/* ────────────────────────── SLIDES ────────────────────────── */

const TOTAL = "11";

const slides = (
  <>
    {/* ═══════════════════ 01 · COVER ═══════════════════ */}
    <Slide>
      <div style={SLIDE_BG}>
        <Masthead no="I" total={TOTAL} />

        {/* Wordmark composition — hung left, with institutional metadata right */}
        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            top: 120,
            bottom: 96,
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr",
            gap: 48,
            alignItems: "end",
            paddingBottom: 24,
            borderBottom: `2px solid ${INK}`,
          }}
        >
          <div>
            <p
              className="cz-sans"
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: INK_LABEL,
                fontWeight: 600,
                marginBottom: 14,
              }}
            >
              The Logotype
            </p>
            <h1
              className="cz-serif"
              style={{
                fontSize: "14rem",
                fontWeight: 400,
                letterSpacing: "-0.045em",
                lineHeight: 0.88,
                color: INK,
                margin: 0,
              }}
            >
              Cruzar
              <span style={{ color: ACCENT }}>.</span>
            </h1>
            <p
              className="cz-sans"
              style={{
                marginTop: 16,
                fontSize: "0.9rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: INK_SOFT,
              }}
            >
              {BRAND.meaning}
            </p>
          </div>

          <div style={{ paddingBottom: 14 }}>
            <p
              className="cz-serif"
              style={{
                fontSize: "1.6rem",
                lineHeight: 1.22,
                fontStyle: "italic",
                color: INK_SOFT,
                fontWeight: 400,
                margin: 0,
                maxWidth: "22ch",
              }}
            >
              {BRAND.taglineEn}
            </p>
            <hr
              style={{
                border: 0,
                borderTop: `1px solid ${HAIRLINE}`,
                margin: "18px 0",
                width: 120,
              }}
            />
            <p
              className="cz-sans"
              style={{
                fontSize: "0.78rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: INK,
                fontWeight: 600,
                lineHeight: 1.7,
              }}
            >
              Para [Universidad]
              <br />
              <span style={{ color: INK_LABEL, fontWeight: 500 }}>
                Rector · VP Académico
              </span>
            </p>
          </div>
        </div>

        <Colophon text="Presentado · [Fecha] · [Sede]" />
      </div>
      <Notes>
        <ul>
          <li>Saludo breve. Agradecer al Rector/VP Académico el tiempo.</li>
          <li>
            Posicionar en una línea: "Cruzar es un sistema que lleva alumnos de
            su universidad a empleos remotos internacionales en dólares."
          </li>
          <li>
            Decir que la presentación dura 10 minutos y cerramos con una
            propuesta concreta de piloto.
          </li>
          <li>
            No vender aún. Dejar que los números de las siguientes láminas
            hablen.
          </li>
        </ul>
      </Notes>
    </Slide>

    {/* ═══════════════════ 02 · SALARY DELTA ═══════════════════ */}
    <Slide>
      <div style={SLIDE_BG}>
        <Masthead no="II" total={TOTAL} />

        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            top: 92,
            bottom: 80,
          }}
        >
          <Eyebrow no="II" label="El delta salarial" />

          <h2
            className="cz-serif"
            style={{
              marginTop: 28,
              fontSize: "2.8rem",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              fontWeight: 400,
              color: INK,
              maxWidth: "24ch",
            }}
          >
            El egresado de su universidad gana{" "}
            <span style={{ fontWeight: 600 }}>USD 480–670</span> al mes,
            localmente.
          </h2>

          {/* The before/after ledger */}
          <div
            className="cz-tnum"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              borderTop: `1px solid ${HAIRLINE}`,
              borderBottom: `1px solid ${HAIRLINE}`,
            }}
          >
            <div
              style={{
                padding: "28px 32px",
                borderRight: `1px solid ${HAIRLINE}`,
                background: "transparent",
              }}
            >
              <div
                className="cz-sans"
                style={{
                  fontSize: "0.68rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: INK_LABEL,
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                Hoy — empleo local
              </div>
              <div
                className="cz-serif"
                style={{
                  fontSize: "4.4rem",
                  fontWeight: 300,
                  letterSpacing: "-0.025em",
                  lineHeight: 1,
                  color: INK,
                }}
              >
                $480–670
                <span
                  style={{
                    fontSize: "1.1rem",
                    color: INK_LABEL,
                    marginLeft: 6,
                    letterSpacing: 0,
                  }}
                >
                  {" "}
                  / mes
                </span>
              </div>
              <div
                className="cz-sans"
                style={{
                  marginTop: 12,
                  fontSize: "0.82rem",
                  color: INK_SOFT,
                  lineHeight: 1.5,
                  maxWidth: "38ch",
                }}
              >
                Entry level, Perú, soles convertidos a USD. Fuente: Ponte en
                Carrera, MTPE 2024.
              </div>
            </div>

            <div
              style={{
                padding: "28px 32px",
                background: PAPER_DEEP,
              }}
            >
              <div
                className="cz-sans"
                style={{
                  fontSize: "0.68rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: INK,
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                Remoto internacional — mismo perfil
              </div>
              <div
                className="cz-serif"
                style={{
                  fontSize: "4.4rem",
                  fontWeight: 300,
                  letterSpacing: "-0.025em",
                  lineHeight: 1,
                  color: INK,
                }}
              >
                $2,800–3,500
                <span
                  style={{
                    fontSize: "1.1rem",
                    color: INK_LABEL,
                    marginLeft: 6,
                    letterSpacing: 0,
                  }}
                >
                  {" "}
                  / mes
                </span>
              </div>
              <div
                className="cz-sans"
                style={{
                  marginTop: 12,
                  fontSize: "0.82rem",
                  color: INK_SOFT,
                  lineHeight: 1.5,
                  maxWidth: "38ch",
                }}
              >
                Rangos para SDR, customer support L2, operaciones. Contratos
                US/EU en USD. Fuente: Payscale 2025, Near LatAm Salary Guide.
              </div>
            </div>
          </div>
        </div>

        <Colophon text="§ II · El delta" />
      </div>
      <Notes>
        <ul>
          <li>
            Dejar el número USD 480–670 en el aire. Es lo que gana el egresado
            promedio en Perú según Ponte en Carrera.
          </li>
          <li>
            Mismo perfil, mismo idioma, trabajando remoto para una empresa en
            US o Alemania: USD 2,800–3,500.
          </li>
          <li>
            4x. No es promesa — es el mercado que ya existe, al que no
            llegamos.
          </li>
          <li>
            Framing: "El egresado ya es lo suficientemente bueno. Solo no ve la
            puerta."
          </li>
        </ul>
      </Notes>
    </Slide>

    {/* ═══════════════════ 03 · VISIBILITY GAP ═══════════════════ */}
    <Slide>
      <div style={SLIDE_BG}>
        <Masthead no="III" total={TOTAL} />

        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            top: 92,
            bottom: 80,
          }}
        >
          <Eyebrow no="III" label="La brecha de visibilidad" />

          <h2
            className="cz-serif"
            style={{
              marginTop: 24,
              fontSize: "2.2rem",
              lineHeight: 1.14,
              letterSpacing: "-0.018em",
              fontWeight: 400,
              color: INK,
              maxWidth: "36ch",
            }}
          >
            El mercado existe. El estudiante no lo ve.
          </h2>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 140,
              bottom: 0,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
            }}
          >
            <div
              style={{
                borderTop: `2px solid ${INK}`,
                paddingTop: 18,
              }}
            >
              <div
                className="cz-sans cz-smallcaps"
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: INK,
                  marginBottom: 20,
                }}
              >
                Lo que existe — hoy, en vivo
              </div>
              <ul
                className="cz-sans cz-tnum"
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gap: 14,
                  fontSize: "0.94rem",
                  color: INK,
                  lineHeight: 1.5,
                }}
              >
                <li
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${HAIRLINE}`,
                    paddingBottom: 10,
                  }}
                >
                  <span>SDR · SaaS B2B · US</span>
                  <span style={{ color: INK_SOFT }}>$2,400–3,800</span>
                </li>
                <li
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${HAIRLINE}`,
                    paddingBottom: 10,
                  }}
                >
                  <span>Customer Support L2 · US/EU</span>
                  <span style={{ color: INK_SOFT }}>$2,200–3,200</span>
                </li>
                <li
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${HAIRLINE}`,
                    paddingBottom: 10,
                  }}
                >
                  <span>Operations · Remote-first</span>
                  <span style={{ color: INK_SOFT }}>$2,800–4,000</span>
                </li>
                <li
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${HAIRLINE}`,
                    paddingBottom: 10,
                  }}
                >
                  <span>Backend Eng · Jr/Mid</span>
                  <span style={{ color: INK_SOFT }}>$3,200–5,500</span>
                </li>
                <li
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: INK_LABEL,
                  }}
                >
                  <span>+ 3,400 vacantes abiertas · Abril 2026</span>
                  <span>USD</span>
                </li>
              </ul>
            </div>

            <div
              style={{
                borderTop: `2px solid ${INK}`,
                paddingTop: 18,
              }}
            >
              <div
                className="cz-sans cz-smallcaps"
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: INK,
                  marginBottom: 20,
                }}
              >
                Lo que ve el estudiante
              </div>
              <ul
                className="cz-sans cz-tnum"
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gap: 14,
                  fontSize: "0.94rem",
                  color: INK,
                  lineHeight: 1.5,
                }}
              >
                <li
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${HAIRLINE}`,
                    paddingBottom: 10,
                  }}
                >
                  <span>Bolsa de trabajo · facultad</span>
                  <span style={{ color: INK_SOFT }}>S/ 2,200</span>
                </li>
                <li
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${HAIRLINE}`,
                    paddingBottom: 10,
                  }}
                >
                  <span>LinkedIn · filtro "Lima"</span>
                  <span style={{ color: INK_SOFT }}>S/ 2,500</span>
                </li>
                <li
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${HAIRLINE}`,
                    paddingBottom: 10,
                  }}
                >
                  <span>Computrabajo · Bumeran</span>
                  <span style={{ color: INK_SOFT }}>S/ 1,800–2,800</span>
                </li>
                <li
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${HAIRLINE}`,
                    paddingBottom: 10,
                  }}
                >
                  <span>Referidos de promoción</span>
                  <span style={{ color: INK_SOFT }}>S/ 2,000–3,500</span>
                </li>
                <li
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: INK_LABEL,
                  }}
                >
                  <span>Techo estructural del mercado local</span>
                  <span>PEN</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Colophon text="§ III · Lo que existe vs. lo que se ve" />
      </div>
      <Notes>
        <ul>
          <li>
            El mercado internacional no es una aspiración — es una columna, a
            la izquierda, con vacantes abiertas hoy mismo.
          </li>
          <li>
            La columna derecha es todo lo que el alumno ve: su bolsa, LinkedIn
            con filtro Lima, Computrabajo.
          </li>
          <li>
            La brecha entre las dos columnas es el espacio donde Cruzar opera.
            No construimos empleos — los revelamos.
          </li>
          <li>
            El alumno no es el problema. El mapa que le dimos está
            desactualizado.
          </li>
        </ul>
      </Notes>
    </Slide>

    {/* ═══════════════════ 04 · DEFINITION ═══════════════════ */}
    <Slide>
      <div style={SLIDE_BG}>
        <Masthead no="IV" total={TOTAL} />

        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            top: 110,
            bottom: 80,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr)",
            gap: 64,
            alignItems: "start",
          }}
        >
          <div style={{ paddingTop: 8 }}>
            <Eyebrow no="IV" label="Cruzar, en una frase" />
            <p
              className="cz-sans"
              style={{
                marginTop: 28,
                fontSize: "0.82rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: INK_SOFT,
                fontWeight: 600,
                lineHeight: 1.7,
              }}
            >
              El producto
              <br />
              <span style={{ color: INK_LABEL, fontWeight: 500 }}>
                De matrícula a empleo internacional
              </span>
            </p>
          </div>

          <div>
            <p
              className="cz-serif"
              style={{
                margin: 0,
                fontSize: "2.1rem",
                lineHeight: 1.22,
                letterSpacing: "-0.012em",
                fontWeight: 400,
                color: INK,
                maxWidth: "32ch",
              }}
            >
              Cruzar es un sistema de IA que lleva a los estudiantes de una
              universidad desde la matrícula hasta la colocación en un empleo
              remoto internacional.
            </p>
            <hr
              style={{
                border: 0,
                borderTop: `1px solid ${HAIRLINE}`,
                margin: "28px 0",
                maxWidth: 120,
              }}
            />
            <p
              className="cz-sans"
              style={{
                fontSize: "1rem",
                lineHeight: 1.62,
                color: INK_SOFT,
                maxWidth: "54ch",
              }}
            >
              Diagnostica a cada estudiante en 15 minutos. Los valida en
              simulaciones realistas de escenarios de trabajo. Aplica en su
              nombre a los roles que calzan con su perfil. Entrega a la
              universidad un tablero en vivo con cada estudiante, en cada
              etapa, desde diagnóstico hasta colocación.
            </p>
          </div>
        </div>

        <Colophon text="§ IV · Definición" />
      </div>
      <Notes>
        <ul>
          <li>
            Leer la frase completa. No saltarse ninguna palabra. "Matrícula a
            colocación" es el arco.
          </li>
          <li>
            Tres verbos: diagnostica, valida, coloca. Cada uno con un
            mecanismo — lo vemos en la siguiente lámina.
          </li>
          <li>
            Enfatizar "sistema" — no un curso, no un coaching. Un sistema
            operado por los founders.
          </li>
          <li>
            Para la universidad: outcome-first. Ustedes compran resultados, no
            metodología.
          </li>
        </ul>
      </Notes>
    </Slide>

    {/* ═══════════════════ 05 · PIPELINE ═══════════════════ */}
    <Slide>
      <div style={SLIDE_BG}>
        <Masthead no="V" total={TOTAL} />

        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            top: 92,
            bottom: 80,
          }}
        >
          <Eyebrow no="V" label="El pipeline — tres etapas" />

          <h2
            className="cz-serif"
            style={{
              marginTop: 24,
              fontSize: "2rem",
              lineHeight: 1.14,
              letterSpacing: "-0.015em",
              fontWeight: 400,
              color: INK,
              maxWidth: "42ch",
            }}
          >
            Cada etapa termina en un documento que se puede auditar.
          </h2>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              borderTop: `2px solid ${INK}`,
              borderBottom: `1px solid ${HAIRLINE}`,
            }}
          >
            {[
              {
                n: "01",
                title: "Diagnóstico",
                desc: "Cuestionario adaptativo + evaluación hablada de inglés. 15 minutos.",
                proof: "Certificación CEFR — B2 o C1",
                proofLabel: "Verificable",
              },
              {
                n: "02",
                title: "Validación",
                desc: "Simulación conversacional con escenarios reales del rol objetivo.",
                proof: "Rendimiento escenario — 0 a 100",
                proofLabel: "Reproducible",
              },
              {
                n: "03",
                title: "Colocación",
                desc: "Postulación autónoma a roles internacionales que calzan con el perfil.",
                proof: "Offer firmado + primer paycheck",
                proofLabel: "Auditable",
              },
            ].map((s, i) => (
              <div
                key={s.n}
                style={{
                  padding: "28px 28px 32px",
                  borderRight: i < 2 ? `1px solid ${HAIRLINE}` : "none",
                }}
              >
                <div
                  className="cz-serif cz-tnum"
                  style={{
                    fontSize: "0.95rem",
                    color: INK_LABEL,
                    fontWeight: 400,
                    letterSpacing: "0.06em",
                  }}
                >
                  {s.n}
                </div>
                <div
                  className="cz-serif"
                  style={{
                    marginTop: 8,
                    fontSize: "1.7rem",
                    fontWeight: 500,
                    letterSpacing: "-0.012em",
                    color: INK,
                  }}
                >
                  {s.title}
                </div>
                <p
                  className="cz-sans"
                  style={{
                    marginTop: 10,
                    fontSize: "0.92rem",
                    lineHeight: 1.55,
                    color: INK_SOFT,
                    maxWidth: "28ch",
                  }}
                >
                  {s.desc}
                </p>
                <hr
                  style={{
                    border: 0,
                    borderTop: `1px solid ${HAIRLINE}`,
                    margin: "20px 0 14px",
                    maxWidth: 48,
                  }}
                />
                <div
                  className="cz-sans cz-smallcaps"
                  style={{
                    fontSize: "0.74rem",
                    fontWeight: 600,
                    color: INK_LABEL,
                  }}
                >
                  {s.proofLabel}
                </div>
                <div
                  className="cz-sans cz-tnum"
                  style={{
                    marginTop: 4,
                    fontSize: "0.92rem",
                    color: INK,
                    fontWeight: 600,
                  }}
                >
                  {s.proof}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Colophon text="§ V · Pipeline" />
      </div>
      <Notes>
        <ul>
          <li>
            Tres etapas. Cada una produce una pieza de evidencia — no una
            promesa.
          </li>
          <li>
            Diagnóstico: CEFR certificable. La universidad lo puede publicar en
            Ponte en Carrera.
          </li>
          <li>
            Validación: simulación de escenario, no test psicométrico. El
            alumno responde como lo haría en el puesto.
          </li>
          <li>
            Colocación: offer firmado + primer paycheck screenshot. Esa es
            nuestra definición de placement — no "interview scheduled".
          </li>
        </ul>
      </Notes>
    </Slide>

    {/* ═══════════════════ 06 · PROOF ═══════════════════ */}
    <Slide>
      <div style={SLIDE_BG}>
        <Masthead no="VI" total={TOTAL} />

        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            top: 92,
            bottom: 80,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <Eyebrow no="VI" label="Cohorte 02 — proof verificado" />
            <span
              className="cz-sans cz-tnum"
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: INK_LABEL,
              }}
            >
              Al 2026-04-15
            </span>
          </div>

          {/* Hung-12 lead composition */}
          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
              gap: 56,
              alignItems: "end",
              paddingBottom: 28,
              borderBottom: `1px solid ${HAIRLINE}`,
            }}
          >
            <div style={{ position: "relative" }}>
              <span
                className="cz-serif cz-tnum"
                style={{
                  display: "block",
                  fontSize: "17rem",
                  fontWeight: 300,
                  letterSpacing: "-0.035em",
                  lineHeight: 0.82,
                  color: INK,
                }}
              >
                {PROOF.placedThisCohort}
              </span>
              <span
                className="cz-sans cz-tnum"
                style={{
                  position: "absolute",
                  top: 8,
                  right: -4,
                  fontSize: "0.82rem",
                  color: INK_LABEL,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                25.5% de la cohorte
              </span>
            </div>
            <div style={{ paddingBottom: 20 }}>
              <p
                className="cz-serif"
                style={{
                  margin: 0,
                  fontSize: "1.45rem",
                  lineHeight: 1.22,
                  letterSpacing: "-0.008em",
                  fontWeight: 400,
                  color: INK,
                  maxWidth: "24ch",
                }}
              >
                estudiantes colocados en roles remotos internacionales en esta
                cohorte.
              </p>
              <p
                className="cz-sans"
                style={{
                  margin: "12px 0 0",
                  fontSize: "0.82rem",
                  color: INK_SOFT,
                  lineHeight: 1.5,
                  maxWidth: "36ch",
                }}
              >
                De {PROOF.cohortSizeStudents} matriculados. Cada colocación
                verificada con offer firmado y captura del primer paycheck,
                disponibles bajo pedido.
              </p>
            </div>
          </div>

          {/* Secondary ledger — asymmetric, 1 lead + 3 small */}
          <div
            className="cz-tnum"
            style={{
              marginTop: 18,
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              borderTop: `1px solid ${HAIRLINE}`,
              borderBottom: `1px solid ${HAIRLINE}`,
            }}
          >
            {[
              {
                figure: `+$${PROOF.averageSalaryDeltaUsd.toLocaleString("en-US")}`,
                suffix: " / mes",
                label: "Delta salarial",
                note: "USD, post-colocación",
                lead: true,
              },
              {
                figure: PROOF.averageSalaryMultiple.toFixed(1),
                suffix: "×",
                label: "Múltiplo",
                note: "Vs. sueldo local previo",
                lead: false,
              },
              {
                figure: String(PROOF.cohortSizeStudents),
                suffix: "",
                label: "Cohorte",
                note: "Estudiantes inscritos",
                lead: false,
              },
              {
                figure: String(PROOF.partnerUniversities),
                suffix: "",
                label: "Universidades",
                note: "MoU firmados, Perú",
                lead: false,
              },
            ].map((item, i, arr) => (
              <div
                key={item.label}
                style={{
                  padding: item.lead ? "22px 24px" : "18px 18px",
                  borderRight:
                    i < arr.length - 1 ? `1px solid ${HAIRLINE}` : "none",
                  background: item.lead ? PAPER_DEEP : "transparent",
                }}
              >
                <div
                  className="cz-serif"
                  style={{
                    fontSize: item.lead ? "2.6rem" : "1.5rem",
                    fontWeight: item.lead ? 300 : 400,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                    color: INK,
                  }}
                >
                  {item.figure}
                  <span
                    style={{
                      fontSize: "0.5em",
                      color: INK_LABEL,
                      fontWeight: 300,
                      marginLeft: 2,
                    }}
                  >
                    {item.suffix}
                  </span>
                </div>
                <div
                  className="cz-sans"
                  style={{
                    marginTop: item.lead ? 10 : 8,
                    fontSize: item.lead ? "0.76rem" : "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: INK,
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </div>
                <div
                  className="cz-sans"
                  style={{
                    marginTop: 3,
                    fontSize: item.lead ? "0.78rem" : "0.72rem",
                    color: INK_LABEL,
                    lineHeight: 1.4,
                  }}
                >
                  {item.note}
                </div>
              </div>
            ))}
          </div>

          {/* Country reach — badges as hairline row */}
          <div
            className="cz-sans cz-tnum"
            style={{
              marginTop: 14,
              display: "flex",
              gap: 20,
              fontSize: "0.72rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: INK_LABEL,
            }}
          >
            <span style={{ color: INK, fontWeight: 600 }}>Alcance</span>
            {PROOF.countryReach.map((c) => (
              <span key={c}>{c}</span>
            ))}
            <span style={{ marginLeft: "auto", color: INK_LABEL }}>
              Empresas US · DE · ES · MX · CA
            </span>
          </div>
        </div>

        <Colophon text="§ VI · Proof · Cohorte 02" />
      </div>
      <Notes>
        <ul>
          <li>
            12 de 47. Ese es el número que nos importa. Todo lo demás es
            contexto.
          </li>
          <li>
            El delta promedio es USD 2,840/mes — eso es S/ 10,500 adicionales,
            cada mes, en el bolsillo del egresado.
          </li>
          <li>
            4.1x de multiplicador. No proyectado: ya sucedió. Offers firmados
            en carpeta.
          </li>
          <li>
            Contratos en 5 países. La universidad aparece en el LinkedIn de un
            ingeniero que trabaja para Berlín.
          </li>
        </ul>
      </Notes>
    </Slide>

    {/* ═══════════════════ 07 · QUOTE ═══════════════════ */}
    <Slide>
      <div style={SLIDE_BG}>
        <Masthead no="VII" total={TOTAL} />

        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            top: 96,
            bottom: 80,
          }}
        >
          <Eyebrow no="VII" label="En sus propias palabras — cohorte 02" />

          <figure
            style={{
              margin: "36px 0 0",
              display: "grid",
              gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
              gap: 56,
              alignItems: "start",
            }}
          >
            <blockquote
              className="cz-serif"
              style={{
                margin: 0,
                fontSize: "2.1rem",
                lineHeight: 1.18,
                letterSpacing: "-0.01em",
                fontWeight: 400,
                color: INK,
                textIndent: "-0.44em",
                paddingLeft: "0.44em",
                maxWidth: "22ch",
              }}
            >
              <span
                aria-hidden
                style={{
                  color: ACCENT,
                  fontWeight: 400,
                  marginRight: "0.04em",
                }}
              >
                &ldquo;
              </span>
              {QUOTE.es}
              <span
                aria-hidden
                style={{ color: INK_LABEL, fontWeight: 400 }}
              >
                &rdquo;
              </span>
            </blockquote>

            <div style={{ paddingTop: 8 }}>
              <hr
                style={{
                  border: 0,
                  borderTop: `1px solid ${HAIRLINE_STRONG}`,
                  margin: 0,
                  width: 100,
                }}
              />
              <figcaption
                className="cz-sans cz-smallcaps cz-tnum"
                style={{
                  marginTop: 18,
                  fontSize: "0.84rem",
                  letterSpacing: "0.14em",
                  color: INK,
                  fontWeight: 600,
                }}
              >
                {QUOTE.attribution}
              </figcaption>
              <p
                className="cz-sans cz-tnum"
                style={{
                  marginTop: 20,
                  fontSize: "0.82rem",
                  lineHeight: 1.55,
                  color: INK_SOFT,
                  maxWidth: "32ch",
                }}
              >
                Contrato firmado con empresa SaaS US. Inicio:
                2026-03-02. Primer paycheck recibido 2026-03-29. Verificable.
              </p>
            </div>
          </figure>
        </div>

        <Colophon text="§ VII · Testimonio" />
      </div>
      <Notes>
        <ul>
          <li>Leer la cita en voz alta, sin apuro. Dejar que respire.</li>
          <li>
            S/ 2,400 a USD 3,100. 11 semanas. No es aspiracional — es un
            paycheck real.
          </li>
          <li>
            "Paga mi casa, mi familia y un fondo de emergencia que nunca tuve."
            Ese es el ROI del egresado.
          </li>
          <li>
            Para el rector: este alumno es ex-alumno de una universidad. Esa
            universidad puede ser la suya.
          </li>
        </ul>
      </Notes>
    </Slide>

    {/* ═══════════════════ 08 · PRICING ═══════════════════ */}
    <Slide>
      <div style={SLIDE_BG}>
        <Masthead no="VIII" total={TOTAL} />

        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            top: 96,
            bottom: 80,
          }}
        >
          <Eyebrow no="VIII" label="Sobre el precio" />

          <p
            className="cz-serif"
            style={{
              margin: "40px 0 0",
              fontSize: "2.4rem",
              lineHeight: 1.2,
              letterSpacing: "-0.014em",
              fontWeight: 400,
              color: INK,
              maxWidth: "28ch",
            }}
          >
            El estudiante paga{" "}
            <span style={{ fontWeight: 600 }}>
              USD {PRICING.studentFlat.min.toLocaleString("en-US")}–
              {PRICING.studentFlat.max.toLocaleString("en-US")}
            </span>
            , solo al firmar el contrato internacional — nunca antes.
          </p>

          <hr
            style={{
              border: 0,
              borderTop: `1px solid ${HAIRLINE}`,
              margin: "44px 0 28px",
              maxWidth: 140,
            }}
          />

          <p
            className="cz-sans"
            style={{
              fontSize: "1rem",
              lineHeight: 1.62,
              color: INK_SOFT,
              maxWidth: "62ch",
            }}
          >
            Sin depósito. Sin suscripción. Sin matrícula. La universidad ancla
            por separado entre USD{" "}
            {PRICING.institutionAnchor.min.toLocaleString("en-US")} y{" "}
            {PRICING.institutionAnchor.max.toLocaleString("en-US")} al año,
            topado a outcomes.
          </p>

          <p
            className="cz-serif"
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              margin: 0,
              fontSize: "1.1rem",
              fontStyle: "italic",
              color: INK,
              maxWidth: "22ch",
              textAlign: "right",
              lineHeight: 1.3,
            }}
          >
            Nos pagan cuando funciona.
          </p>
        </div>

        <Colophon text="§ VIII · Precio alineado a resultado" />
      </div>
      <Notes>
        <ul>
          <li>
            Único pricing del mercado que alinea al 100% con el outcome
            declarado.
          </li>
          <li>
            Si el alumno no firma un contrato, no hay cobro. Cero riesgo
            financiero para el alumno y para la universidad.
          </li>
          <li>
            El anchor institucional (USD 5k–20k/año, topado a outcomes) cubre
            operaciones. Si no hay placements, se libera.
          </li>
          <li>Mensaje de cierre: "Nos pagan cuando funciona."</li>
        </ul>
      </Notes>
    </Slide>

    {/* ═══════════════════ 09 · WHY THIS UNIVERSITY ═══════════════════ */}
    <Slide>
      <div style={SLIDE_BG}>
        <Masthead no="IX" total={TOTAL} />

        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            top: 92,
            bottom: 80,
          }}
        >
          <Eyebrow no="IX" label="Para [Universidad], en concreto" />

          <h2
            className="cz-serif"
            style={{
              marginTop: 24,
              fontSize: "1.95rem",
              lineHeight: 1.18,
              letterSpacing: "-0.014em",
              fontWeight: 400,
              color: INK,
              maxWidth: "38ch",
            }}
          >
            Tres beneficios institucionales — cada uno medible, cada uno
            publicable.
          </h2>

          <div
            style={{
              marginTop: 36,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 32,
              borderTop: `2px solid ${INK}`,
              paddingTop: 28,
            }}
          >
            {[
              {
                n: "01",
                eyebrow: "Datos",
                title: "Outcomes publicables en Ponte en Carrera.",
                body: "Salarios en USD, colocaciones internacionales, empleadores nombrados. Los únicos números que mueven el ranking de empleabilidad.",
              },
              {
                n: "02",
                eyebrow: "Diferenciación",
                title: "Capacidad que ninguna universidad peruana tiene.",
                body: "Post-SUNEDU, 94 universidades compiten por el mismo pool. Ser la primera con placements internacionales sistemáticos es una ventaja estructural.",
              },
              {
                n: "03",
                eyebrow: "Operación",
                title: "Cero carga nueva para su equipo.",
                body: "Cruzar opera el pipeline de extremo a extremo. Career services recibe el dashboard. No se contrata personal, no se instala software.",
              },
            ].map((b) => (
              <div key={b.n}>
                <div
                  className="cz-serif cz-tnum"
                  style={{
                    fontSize: "0.9rem",
                    color: INK_LABEL,
                    fontWeight: 400,
                    letterSpacing: "0.06em",
                  }}
                >
                  {b.n}
                </div>
                <div
                  className="cz-sans cz-smallcaps"
                  style={{
                    marginTop: 6,
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: ACCENT,
                  }}
                >
                  {b.eyebrow}
                </div>
                <h3
                  className="cz-serif"
                  style={{
                    marginTop: 12,
                    fontSize: "1.3rem",
                    lineHeight: 1.22,
                    letterSpacing: "-0.008em",
                    fontWeight: 500,
                    color: INK,
                    maxWidth: "20ch",
                  }}
                >
                  {b.title}
                </h3>
                <p
                  className="cz-sans"
                  style={{
                    marginTop: 14,
                    fontSize: "0.88rem",
                    lineHeight: 1.55,
                    color: INK_SOFT,
                    maxWidth: "32ch",
                  }}
                >
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Colophon text="§ IX · Para la universidad" />
      </div>
      <Notes>
        <ul>
          <li>
            Beneficio 1: datos de outcome que el VP puede publicar en el
            informe anual y en Ponte en Carrera.
          </li>
          <li>
            Beneficio 2: diferenciación estructural. Post-SUNEDU, 51
            universidades cerradas. El Rector que se mueve primero gana el
            relato.
          </li>
          <li>
            Beneficio 3: cero carga operativa. Esto lo saben los VP — cada
            vendor promete lo mismo y termina pidiendo tres FTE. Aquí
            operamos nosotros.
          </li>
          <li>
            Transición: "En la siguiente lámina, la propuesta concreta de
            piloto."
          </li>
        </ul>
      </Notes>
    </Slide>

    {/* ═══════════════════ 10 · THE ASK ═══════════════════ */}
    <Slide>
      <div style={SLIDE_BG}>
        <Masthead no="X" total={TOTAL} />

        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            top: 92,
            bottom: 80,
          }}
        >
          <Eyebrow no="X" label="Propuesta — piloto founding partner" />

          <h2
            className="cz-serif"
            style={{
              marginTop: 24,
              fontSize: "2.3rem",
              lineHeight: 1.14,
              letterSpacing: "-0.018em",
              fontWeight: 400,
              color: INK,
              maxWidth: "30ch",
            }}
          >
            12 meses · 1 cohorte · MoU con fee topado a resultados.
          </h2>

          {/* Terms grid */}
          <div
            className="cz-tnum"
            style={{
              marginTop: 36,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              borderTop: `1px solid ${HAIRLINE}`,
              borderBottom: `1px solid ${HAIRLINE}`,
            }}
          >
            {[
              { k: "Duración", v: "12 meses", sub: "Abr 2026 — Abr 2027" },
              { k: "Cohorte", v: "40–60", sub: "Estudiantes B2+ verif." },
              { k: "Fee anchor", v: "USD 5–20k", sub: "Topado a placements" },
              { k: "Compromiso", v: "MoU", sub: "No vinculante, renovable" },
            ].map((t, i, arr) => (
              <div
                key={t.k}
                style={{
                  padding: "20px 22px",
                  borderRight:
                    i < arr.length - 1 ? `1px solid ${HAIRLINE}` : "none",
                }}
              >
                <div
                  className="cz-sans cz-smallcaps"
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: INK_LABEL,
                  }}
                >
                  {t.k}
                </div>
                <div
                  className="cz-serif"
                  style={{
                    marginTop: 6,
                    fontSize: "1.6rem",
                    fontWeight: 500,
                    letterSpacing: "-0.012em",
                    color: INK,
                    lineHeight: 1.1,
                  }}
                >
                  {t.v}
                </div>
                <div
                  className="cz-sans"
                  style={{
                    marginTop: 6,
                    fontSize: "0.78rem",
                    color: INK_SOFT,
                    lineHeight: 1.4,
                  }}
                >
                  {t.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Signature block */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 64,
            }}
          >
            <div>
              <div
                style={{
                  borderTop: `1px solid ${INK}`,
                  paddingTop: 10,
                  minHeight: 44,
                }}
              />
              <div
                className="cz-sans cz-smallcaps"
                style={{
                  fontSize: "0.74rem",
                  letterSpacing: "0.14em",
                  color: INK_LABEL,
                  fontWeight: 600,
                }}
              >
                Por [Universidad]
              </div>
              <div
                className="cz-sans"
                style={{
                  marginTop: 2,
                  fontSize: "0.74rem",
                  color: INK_LABEL,
                }}
              >
                Rector / VP Académico
              </div>
            </div>
            <div>
              <div
                style={{
                  borderTop: `1px solid ${INK}`,
                  paddingTop: 10,
                  minHeight: 44,
                }}
              />
              <div
                className="cz-sans cz-smallcaps"
                style={{
                  fontSize: "0.74rem",
                  letterSpacing: "0.14em",
                  color: INK_LABEL,
                  fontWeight: 600,
                }}
              >
                Por Cruzar
              </div>
              <div
                className="cz-sans"
                style={{
                  marginTop: 2,
                  fontSize: "0.74rem",
                  color: INK_LABEL,
                }}
              >
                Miura Fernández · Enrique F. · Cofounders
              </div>
            </div>
          </div>
        </div>

        <Colophon text="§ X · Ask · Founding partner" />
      </div>
      <Notes>
        <ul>
          <li>
            La propuesta concreta. No vaga — términos que caben en una página.
          </li>
          <li>
            "Founding partner" implica co-marketing: la universidad aparece
            como primera en la narrativa de Cruzar hacia inversionistas y
            medios.
          </li>
          <li>
            Fee topado a resultados. Si colocamos menos de X alumnos, se
            descuenta proporcionalmente.
          </li>
          <li>
            MoU primero, no contrato vinculante. Objetivo: una firma hoy mismo
            o en 30 días.
          </li>
        </ul>
      </Notes>
    </Slide>

    {/* ═══════════════════ 11 · FOUNDERS + CONTACT ═══════════════════ */}
    <Slide>
      <div style={SLIDE_BG}>
        <Masthead no="XI" total={TOTAL} />

        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            top: 92,
            bottom: 80,
          }}
        >
          <Eyebrow no="XI" label="Los fundadores" />

          <div
            style={{
              marginTop: 28,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 56,
              borderTop: `2px solid ${INK}`,
              paddingTop: 26,
            }}
          >
            {[
              {
                name: "Miura Fernández",
                role: "Cofundadora · Institucional",
                bio: "International Business. 6+ años coaching de inglés a profesionales LatAm. Prior: PRO PPC, ebombo, BDI Comex. Escuela de Posgrado Newman 2025–2026.",
              },
              {
                name: "Enrique F.",
                role: "Cofundador · Producto & IA",
                bio: "Ingeniería de software, 4+ años en el ecosistema startup. Orquesta enjambres de agentes de IA para producto. Fork propio de career-ops (MIT) con aplicación autónoma.",
              },
            ].map((f) => (
              <div key={f.name}>
                <div
                  className="cz-serif"
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 500,
                    letterSpacing: "-0.014em",
                    color: INK,
                    lineHeight: 1.1,
                  }}
                >
                  {f.name}
                </div>
                <div
                  className="cz-sans cz-smallcaps"
                  style={{
                    marginTop: 6,
                    fontSize: "0.76rem",
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    color: INK_LABEL,
                  }}
                >
                  {f.role}
                </div>
                <p
                  className="cz-sans"
                  style={{
                    marginTop: 16,
                    fontSize: "0.92rem",
                    lineHeight: 1.6,
                    color: INK_SOFT,
                    maxWidth: "38ch",
                  }}
                >
                  {f.bio}
                </p>
              </div>
            ))}
          </div>

          {/* Contact block */}
          <div
            className="cz-sans cz-tnum"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              borderTop: `1px solid ${HAIRLINE}`,
              paddingTop: 16,
            }}
          >
            <span
              className="cz-serif"
              style={{
                fontSize: "1.4rem",
                fontWeight: 500,
                letterSpacing: "-0.01em",
              }}
            >
              hello@cruzar.io
            </span>
            <span
              className="cz-serif"
              style={{
                fontSize: "1.4rem",
                fontWeight: 500,
                letterSpacing: "-0.01em",
              }}
            >
              cruzar.io
            </span>
            <span
              style={{
                fontSize: "0.74rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: INK_LABEL,
                fontWeight: 600,
              }}
            >
              Lima · Perú
            </span>
          </div>
        </div>

        <Colophon text="§ XI · Fundadores" />
      </div>
      <Notes>
        <ul>
          <li>
            Presentación breve. Founder-market fit: Miura entrena el perfil del
            candidato, Enrique construye el sistema. La intersección es el
            producto.
          </li>
          <li>
            Ningún outreach frío. Las universidades nos conocen vía Aprendly
            (Científica, USIL) o vía UTEC directamente.
          </li>
          <li>
            Mencionar ProInnovate 12G en proceso — señal de validación
            pública.
          </li>
          <li>Cerrar con "¿Qué dudas tienen?" — cede la palabra.</li>
        </ul>
      </Notes>
    </Slide>

    {/* ═══════════════════ 12 · CLOSING WORDMARK ═══════════════════ */}
    <Slide>
      <div style={SLIDE_BG}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1
            className="cz-serif"
            style={{
              fontSize: "16rem",
              fontWeight: 400,
              letterSpacing: "-0.048em",
              lineHeight: 0.9,
              color: INK,
              margin: 0,
            }}
          >
            Cruzar
            <span style={{ color: ACCENT }}>.</span>
          </h1>
        </div>

        <div
          className="cz-sans cz-tnum"
          style={{
            position: "absolute",
            bottom: 40,
            left: 56,
            right: 56,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: "0.7rem",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: INK_LABEL,
          }}
        >
          <span>cruzar.io</span>
          <span>— {BRAND.meaning} —</span>
          <span>hello@cruzar.io</span>
        </div>
      </div>
      <Notes>
        <ul>
          <li>
            Pausa. No decir nada por 3 segundos completos. Dejar que la marca
            se asiente.
          </li>
          <li>"Gracias por su tiempo. ¿Procedemos con el MoU?"</li>
          <li>
            Si hay silencio: no llenarlo. El próximo que hable pierde la
            negociación.
          </li>
        </ul>
      </Notes>
    </Slide>
  </>
);

export default slides;
