# Cruzar — Traction

**Date:** 2026-04-14
**Status:** Active

Canonical definition of traction + milestone thresholds. Every deck, pitch, or internal decision that invokes "traction" derives from this file.

---

## Definition

**Traccion = placements verificables.** Nada mas cuenta.

Moneda valida, en orden de peso:

1. **Contract signed** — candidato firmo offer para rol remoto internacional. Start date confirmado.
2. **Offer extended** — empleador internacional emitio offer formal al candidato.
3. **Interview scheduled** — screening o entrevista real con empleador internacional, fecha confirmada.

Metricas leading (apps enviadas, responses, screens pasadas) son utiles para debugging interno. **No cuentan como traccion** en decks ni en milestones.

---

## Milestones

| Fase | Ventana | Threshold | Que desbloquea |
|------|---------|-----------|----------------|
| 0 — WoZ validation | Dia 1-14 | 1 interview scheduled de cohorte de 5 usuarios | Decision: escalar Fase 1 o re-diagnosticar funnel |
| 1 — First revenue | Mes 1-3 | 1 fee estudiantil cobrado (primer $ de Cruzar) | Abrir outreach a empresas pequenas/medianas |
| 2 — Employer traction | Mes 3-6 | 2-3 placements cobrados (student-side) + 1 empresa paga placement fee | Abrir conversaciones con universidades |
| 3 — Institutional deal | Mes 6-12 | 1 universidad firmada (anchor + outcomes) con 10+ placements acumulados | Seed conversation |

**Threshold seed:** 3 paying logos universitarios + 10+ placements + $30-50K ARR. `Estimate:` basado en benchmarks de AI-native recruiting — ver [business/research/revenue-model.md](../business/research/revenue-model.md).

---

## Tipo de cliente por fase

"Cliente" = quien paga. Distinto a "usuario" = quien usa el producto.

| Fase | Cliente primario | Modelo | Ticket | Por que |
|------|------------------|--------|--------|---------|
| 1 | Estudiante individual | Success fee al placement | USD 800-1500 flat | Cero CAC, convierte WoZ directo, no requiere pipeline de ventas paralelo |
| 2 | Empresa pequena/mediana | Placement fee por hire | USD 3K-5K (10-15% annual comp) | Ya hay supply validada. Ciclo 2-4 semanas. Ticket 3-5x mas alto que student fee |
| 3 | Universidad | Anchor + outcomes | USD 5-20K | Requiere 10+ placements como proof institucional. Ciclo 1-3 meses |

Las fases se agregan, no reemplazan. En Mes 6 Cruzar opera los 3 segmentos en paralelo.

Detalle de estructura + montos por modelo: ver [product/cruzar/pricing.md](../product/cruzar/pricing.md).

---

## Open questions

- **Fee estudiantil exacto.** Rango $800-1500 es referencia. Bajar a $500 si friccion; subir a 100% primer mes si rol paga alto. Calibrar con primeros 3 candidatos.
- **Cobranza internacional.** Si candidato Fase 1 trabaja en empresa US/EU y cobra en USD, usar Wise o Deel. Si cobra en PEN, transferencia interbancaria. Definir en contrato de servicios.
- **Verificacion de start date.** Que evidencia pedimos al candidato (paycheck screenshot? Email RRHH?). Definir antes de firmar primer service agreement.
- **Consent para apps autonomas.** Requerido antes del Dia 4 del WoZ. Draft del consent form pendiente.

---

## Historial

| Fecha | Cambio |
|-------|--------|
| 2026-04-14 | Creacion. Traccion = placements verificables. Fase 1 cliente = estudiante success fee. |
