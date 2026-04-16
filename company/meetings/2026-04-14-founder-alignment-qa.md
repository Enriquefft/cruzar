# Cruzar — Q&A de Referencia para Pitch Meeting

Documento de consulta rápida para Q&A con Miura y equipo Aprendly. Respuestas honestas, específicas, sin hedging.

> Seccion 3 refleja propuesta pre-reunion 60/30/10; outcome real fue 50/50 draft bimestral. Captable vigente: [equity.md](../equity.md).

---

## 1. Producto / Técnico

**P1. ¿Qué tan confiable es el scoring de CEFR via voz? ¿Puede equivocarse con un estudiante real?**
R: El scoring se apoya en Deepgram STT + Claude Sonnet contra rúbrica CEFR estándar (CEFR-J descriptors). En benchmarks internos de modelos similares, la concordancia con evaluadores humanos está en 0.75–0.85 kappa para bandas A2–C1. Vamos a calibrar con 20–30 muestras Aprendly antes del pilot y publicamos margen de error (±1 sub-banda) con cada resultado.
*Emfatizar*: admitimos margen de error, por eso el reporte muestra banda + confidence score. *Cuidado*: no prometer "exacto como Cambridge".

**P2. ¿Qué pasa si la voz falla en medio del pilot (cae OpenAI Realtime, lag, audio malo)?**
R: Tenemos fallback en cascada: Realtime API primero, si hay degradación pasamos a Deepgram + TTS desacoplado (latencia +400ms pero funcional). El historial de conversación se persiste en Neon cada turno, así que un reconnect no pierde estado. Para el pilot de 40 estudiantes, budget de ~$120 nos deja headroom 3x si hay reintentos.
*Emfatizar*: ya está diseñado, no es hipotético. *Cuidado*: no minimizar — voice es el diferenciador, si falla, falla todo.

**P3. ¿La simulación de escenarios realmente puede evaluar soft skills, o es solo un chatbot disfrazado?**
R: En el MSP llegamos a ~60–70% de realismo: el prospecto AI tiene estado emocional básico (frustrado, interesado, escéptico) y memoria de conversación. Un agente evaluador separado puntúa sobre rúbrica (empathy, discovery, handling objections). No es full cognitive architecture — eso es R&D post-venta de 2+ meses. Pero supera por mucho el role-play humano inconsistente que usan bootcamps hoy.
*Emfatizar*: comparación justa es contra el status quo (nada), no contra un humano perfecto. *Cuidado*: si preguntan por research papers, mencionar que la validación contra evaluadores humanos es parte del roadmap Q3.

**P4. ¿Y los estudiantes que no hablan suficiente inglés para hacer la simulación en inglés?**
R: Ese es exactamente por qué Aprendly es el partner correcto: el funnel es "diagnosticar → preparar → validar → colocar". Estudiantes A2 o por debajo entran al track de preparación Aprendly primero, y solo entran a Place cuando Validate los aprueba en B2+. El diagnóstico inicial sirve para segmentar, no para rechazar.
*Emfatizar*: esto convierte Aprendly en parte estructural del funnel. *Cuidado*: no sonar como que estamos "gatekeeping" estudiantes.

**P5. ¿El fork autónomo ya está construido o es promesa?**
R: Construido y operando. Ya aplicó a posiciones reales. Lo que falta es integrarlo al dashboard Cruzar y agregar throttling + rotación de identidad para no trigger rate limits de LinkedIn/job boards. Eso es 3–4 días de trabajo, no semanas.
*Emfatizar*: llevar screenshot/demo del fork corriendo. *Cuidado*: si preguntan "¿ya colocó a alguien?", honesto: aplicó, no ha cerrado ofertas aún.

**P6. ¿Cómo saben que la simulación está midiendo soft skills y no solo fluidez?**
R: El evaluador agent tiene rúbrica separada por dimensión: comprehensión, razonamiento bajo presión, manejo de objeciones, empathy, structure. La puntuación es multi-dimensional, no un score único. En el pilot vamos a correlacionar esos scores contra outcomes reales (interview invitations) — esa es la validación empírica que nadie más tiene.
*Emfatizar*: data de pilot = moat defensible. *Cuidado*: no confundir con "validado científicamente" todavía.

**P7. ¿Qué pasa con data privacy de las grabaciones de voz de los estudiantes?**
R: Consent explícito antes de grabar, storage encriptado en Neon (Postgres), retención 12 meses default con opt-out. Para universidades vamos a firmar DPA específico. OpenAI Realtime API no retiene audio por política enterprise (verificar términos actuales antes del pilot).
*Emfatizar*: Peru no tiene GDPR pero sí Ley 29733 — cumplimos. *Cuidado*: si UTEC pregunta por soberanía de datos, admitir que storage es en US y ofrecer path a region LATAM.

---

## 2. Modelo de Negocio

**P8. ¿Por qué $8K de anchor y no más? Las universidades pagan mucho por servicios de empleabilidad.**
R: $8K es el umbral donde UTEC puede aprobar sin pasar por comité de compras (típicamente <$10K en universidades peruanas). Es pricing de entrada para ganar el primer logo, no el pricing de largo plazo. El outcomes component de hasta $12K duplica el contrato a $20K si entregamos, y en el contrato dos subimos anchor a $15–20K con outcomes a $25K+.
*Emfatizar*: es estrategia de land-and-expand, no de subvalorar. *Cuidado*: no sonar como que estamos regalando el producto.

**P9. ¿Y si UTEC rechaza el componente outcomes-based?**
R: Plan B es anchor $12K puro (sin outcomes) para el primer pilot, capturando el logo y la data. Plan C es pilot gratuito a cambio de case study firmado + referral a USIL/Cientifica. No nos vamos sin un logo.
*Emfatizar*: tenemos tres niveles de fallback, la decisión es sobre velocidad vs margen. *Cuidado*: no comprometer pricing sin consultar con Miura.

**P10. ¿Qué pasa si en Phase 1 solo conseguimos 1 invitación a entrevista, no 3–5?**
R: 1 invitación internacional verificable ya es proof suficiente para la pitch a UTEC — nadie más en Peru puede mostrar eso. Si es 0, pivoteamos el MSP a "validated pipeline" (X aplicaciones enviadas, Y en screening) y ajustamos el pitch a UTEC de "proven placements" a "proven process". Aún vendible, con menor anchor ($5–6K).
*Emfatizar*: tenemos narrativa para cada resultado. *Cuidado*: no prometer 3–5 a Miura como floor, es el target.

**P11. ¿Cómo escalamos más allá de UTEC, USIL, Cientifica? El mercado de universidades top en Peru se satura rápido.**
R: Tres vectores. Primero, regional: Chile, Colombia, México tienen la misma estructura universidad-como-cliente y mayor volumen (50+ universidades target combinadas). Segundo, corporate: una vez que tenemos supply de talento validado, BPOs y empresas globales pagan per-hire. Tercero, direct-to-student premium ($200–500/año) para el middle class LATAM que no está en universidades top.
*Emfatizar*: universidad es wedge, no endgame. *Cuidado*: no meternos en Brazil temprano — mercado distinto, portugués.

**P12. Eventualmente, ¿cómo se divide el revenue entre Cruzar y el empleador cuando coloquemos?**
R: Modelo target es placement fee 10–15% del primer año de salario del candidato, pagado por el empleador. Para un SDR remoto a $30K USD/año eso es $3–4.5K por colocación. Margen bruto alto porque el marginal cost por candidato ya procesado es <$20. Universidades no ven este revenue — es upside puro para Cruzar.
*Emfatizar*: doble monetización (universidad + empleador). *Cuidado*: si preguntan por conflicto de interés, clarificar que la universidad paga por el proceso, el empleador por el match.

**P13. ¿Por qué enfocarnos en SDR/customer support/ops y no en roles de mayor comp como ingeniería?**
R: Ingeniería ya tiene Triplebyte, Andela, Turing — mercado saturado con supply-side marketplaces. El abandoned middle ($40–80K) donde soft skills importa más que hard skills no tiene infra dedicada. Además, voice-based evaluation da diferenciación real solo donde comunicación es el skill core. SDR es producto-market fit obvio.
*Emfatizar*: es focus estratégico, no limitación técnica. *Cuidado*: si un empleado de Aprendly es ingeniero, no sonar despectivo.

---

## 3. Estructura y Equity

**P14. ¿Por qué 30% para ti? Es mucho para una persona.**
R: Tres razones concretas. Uno, cost basis real: me pagan S/1,500/mes cuando el mercado para mi stack es S/15K+. Los S/13,500 mensuales de comp diferido son ~S/162K/año de capital que estoy metiendo a Cruzar. A 4 años eso es S/648K de capital humano no remunerado. Dos, IP técnica: el fork autónomo + R&D de simulación + research competitivo son pre-existing contribution. Tres, ejecución crítica: sin alguien técnico con skin en el game, Cruzar no se construye.
*Emfatizar*: 30% es post-option pool, vesting 4 años — si me voy año 1 pierdo 75%. *Cuidado*: no ser defensivo; es una negociación, Miura puede contraofertar.

**P15. ¿Por qué spinoff en vez de línea de producto dentro de Aprendly?**
R: Cruzar necesita raise externo para escalar regionalmente — VCs no invierten en líneas de producto de academias de inglés, invierten en companies de talent infrastructure. Spinoff también protege a Aprendly de riesgo regulatorio de placements internacionales. Y permite cap table limpio para attraer talento técnico senior con equity real.
*Emfatizar*: es protección mutua, no separación. *Cuidado*: Miura puede leerlo como "me estás sacando del control" — enfatizar que ella mantiene 60%.

**P16. ¿Si Cruzar levanta capital después, cómo se diluye Aprendly?**
R: Todos se diluyen pro-rata en el round: si levantamos seed a 20% dilution, Miura va de 60% a 48%, yo de 30% a 24%, option pool se ajusta. Aprendly/Miura mantiene majority hasta un Series A minimum. Podemos estructurar protective provisions (board seat, veto rights en decisiones clave) en el shareholder agreement para asegurar control estratégico.
*Emfatizar*: dilution es normal y alineada. *Cuidado*: no prometer "nunca perderás control" — eventualmente en growth rounds, sí.

**P17. ¿Qué pasa si te vas de Cruzar en 6 meses?**
R: Vesting 4 años con cliff 1 año significa que si me voy antes del mes 12, pierdo 100% de mi equity. Después del cliff, vesting mensual — si me voy al mes 18, me quedo con 37.5% de mi 30% (11.25% del total). Hay también cláusula de good leaver / bad leaver en el shareholder agreement: si me sacan sin causa, acelera vesting; si me voy por mi cuenta o hay cause, no acelera.
*Emfatizar*: la estructura protege a Aprendly. *Cuidado*: tener el term sheet listo antes de firmar.

**P18. Aprendly tiene grants de ProInnovate (11G aprobado, 12G en proceso). ¿Cómo afecta el spinoff?**
R: Los grants están asignados a Aprendly S.A.C. para objetivos específicos (academia de inglés), no transferibles automáticamente a Cruzar. Dos opciones: uno, Cruzar licencia IP o servicios a Aprendly para cumplir objetivos del grant (clean); dos, aplicamos grants nuevos específicos para Cruzar (ProInnovate tiene líneas para edtech y empleabilidad). Recomiendo opción uno más opción dos en paralelo.
*Emfatizar*: los grants de Aprendly quedan en Aprendly, no se pierden. *Cuidado*: revisar términos específicos del grant antes de comprometer — algunos tienen cláusulas de spinoff.

**P19. ¿Qué IP de Aprendly se transfiere a Cruzar?**
R: Licencia no-exclusiva perpetua de: metodología pedagógica CEFR, curriculum existente, alumni data (con consent), brand halo para marketing en Peru. Cruzar desarrolla su propia IP: fork autónomo, simulación engine, evaluator agents, scoring system. Separación limpia evita confusión en futuros rounds.
*Emfatizar*: Aprendly no regala IP, licencia. *Cuidado*: valuación de la licencia puede ser debate — default es $0 a cambio del 60% equity de Miura.

**P20. Estructura legal en Peru: ¿SAC, holding, qué recomiendas?**
R: Cruzar S.A.C. como entidad operativa en Peru (standard para startups, permite inversión extranjera sin fricción). A medida que levantemos capital, flip a Delaware C-Corp con Cruzar Peru como subsidiaria — estándar para VCs US/LATAM. Costo del flip es ~$5–8K USD, hacerlo pre-seed o en seed round. Shareholder agreement se firma ahora en Peru con provisiones para el flip futuro.
*Emfatizar*: tenemos path claro, no improvisación. *Cuidado*: Miura probablemente quiere abogado propio — totalmente razonable, presupuestar el costo.

**P21. ¿Por qué 10% option pool y no más?**
R: 10% pre-money cubre las primeras 3–5 hires clave (typically CTO-equivalent, head of sales, lead engineer) con grants de 0.5–2% cada uno. Post-seed round probablemente expandimos a 15% (estándar VC). Más de 10% ahora diluye innecesariamente antes de tener las hires reales.
*Emfatizar*: es pool inicial, expandible. *Cuidado*: si Miura quiere reducir a 5%, push back — limita hiring.

---

## 4. Ejecución

**P22. ¿Realmente puedes construir esto en 1–1.5 semanas?**
R: Phase 1 no requiere construir el producto completo — requiere usar lo que ya tengo (fork autónomo + voice pipeline básico) para meter 3–5 estudiantes Aprendly en procesos internacionales. El dashboard bonito, la simulación full, el scoring calibrado — eso es Phase 2 y 3. En 1.5 semanas construyo el MVP de flujo end-to-end, no el producto final.
*Emfatizar*: scope de Phase 1 es deliberadamente pequeño. *Cuidado*: si Miura oye "MVP" puede pensar que entrego producto final en 2 semanas — aclarar.

**P23. ¿Qué pasa si Phase 1 no consigue ninguna entrevista en 10 días?**
R: Criterio de éxito de Phase 1 es aplicaciones enviadas + respuestas de screening, no invitations cerradas. Invitations son lagging indicator — pueden llegar semana 3–4. Si a día 10 no tenemos ni responses de screening, hay un problema de targeting (wrong roles) o de material (CVs débiles), ambos diagnosticables y corregibles en 2–3 días.
*Emfatizar*: success metric realista para el timeframe. *Cuidado*: no prometer invitations en 10 días a Miura — es timeline agresivo.

**P24. ¿Quién opera las aplicaciones autónomas día a día? ¿Tú solo?**
R: Yo en Phase 1 (3–5 estudiantes es manejable solo). Para Phase 2+, necesitamos un ops person part-time para monitorear el fork, resolver exceptions (captchas, applications que requieren essays custom), y hacer QA de output. Esa persona es la primera hire del option pool — probablemente alguien de Aprendly con tiempo parcial primero.
*Emfatizar*: path de hiring claro. *Cuidado*: no sonar como que voy a ser bottleneck permanente.

**P25. ¿Capacidad del equipo para Phase 2 (venta a UTEC)?**
R: Venta es Miura + yo: ella abre puerta con conexiones en universidades peruanas, yo hago el demo técnico y respondo objeciones de producto. 2–3 reuniones con UTEC en 2 semanas es factible. Para USIL y Cientifica en paralelo, necesitamos un SDR (puede ser alumnus Aprendly con el track de SDR que vamos a construir — meta-loop).
*Emfatizar*: dogfooding del producto. *Cuidado*: esto depende de que Miura tenga bandwidth para las reuniones — confirmar.

**P26. ¿Qué ancho de banda tiene Miura para esto mientras sigue operando Aprendly?**
R: Esta es pregunta para Miura, no para mí. Lo que Cruzar necesita de ella en el primer trimestre: 4–6 horas/semana (intros a universidades, strategic decisions, board-level sign-off). Operaciones día a día son mías. Si es más que eso, estamos mal estructurados.
*Emfatizar*: diseño explícito para proteger su tiempo. *Cuidado*: dejar que ella defina su capacity real, no asumir.

---

## 5. Riesgos

**P27. ¿Riesgo regulatorio de aplicaciones autónomas a job boards? ¿Es legal?**
R: Zona gris. Términos de servicio de LinkedIn prohíben automation, pero enforcement es contra scrapers masivos, no users legítimos aplicando a jobs. Riesgo real es ban de cuentas, no legal. Mitigación: aplicaciones usan cuenta del estudiante (con consent), throttling humano (max 10 apps/día por cuenta), rotación de patterns. Worst case: LinkedIn banea, pivotamos a job boards que permiten automation (Indeed API, company career sites direct).
*Emfatizar*: riesgo conocido y mitigado. *Cuidado*: no minimizar — si LinkedIn es el 80% del volumen, un ban duele.

**P28. ¿Qué pasa si OpenAI sube el precio de Realtime API 5x?**
R: Budget del pilot actual es ~$120 total, a 5x serían $600 — todavía absorbible dentro del $8K anchor. A más largo plazo, tenemos fallback a Deepgram STT + Claude voice (más barato, peor latencia) o self-hosted Whisper para scale. El voice pipeline está abstraído, el switching cost es 1–2 semanas de ingeniería.
*Emfatizar*: no estamos locked-in a OpenAI. *Cuidado*: si suben pricing 10x+, el unit economics cambia — admitir.

**P29. ¿Riesgo legal de colocar peruanos en empleos internacionales? ¿Hay temas de visa, taxes, contractor vs empleado?**
R: Modelo target es remote contractor, no empleado full — evita issues de visa y employment law internacional. El empleador paga al contractor peruano via plataformas como Deel o Remote (standard LATAM). Cruzar no es employer of record, es matching platform — riesgo legal está en Deel/Remote/empleador, no en Cruzar. Disclaimer claro en terms of service.
*Emfatizar*: somos matching, no employment. *Cuidado*: si preguntan por tax compliance del estudiante, derivar a partner como Deel.

**P30. ¿Qué pasa si alguien copia el producto? El moat no es obvio.**
R: Moat a corto plazo es velocidad + data de outcomes del pilot. Moat a mediano plazo es tres cosas compuestas: uno, relaciones con universidades LATAM (hard to replicate, take years), dos, dataset de correlación voice-scoring ↔ placement outcomes (crece con cada cohort), tres, integration con Aprendly supply. Fork autónomo es commodity, voice pipeline es commodity — el layer de evaluación + distribution es el moat.
*Emfatizar*: moat es compuesto, no una cosa. *Cuidado*: si preguntan por patents, honesto: no es patentable, es execution moat.

---

*Documento vivo. Actualizar después de la reunión con preguntas reales y respuestas que funcionaron.*
