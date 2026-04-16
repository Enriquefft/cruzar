import { Slide, Notes } from '@enriquefft/prez'

const slides = (
  <>
    {/* 1. Title */}
    <Slide>
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-20">
        <div className="text-sm tracking-[0.3em] text-emerald-400/80 mb-8">PROPUESTA INTERNA</div>
        <h1 className="text-9xl font-bold tracking-tight">Cruzar</h1>
        <p className="mt-8 text-2xl text-white/60 max-w-3xl text-center leading-relaxed">
          Infraestructura de talento AI-native para llevar candidatos de mercados emergentes al empleo global
        </p>
        <div className="mt-16 text-sm text-white/40 tracking-wider">ABRIL 2026</div>
      </div>
      <Notes>
        Abrir con calma. "Pasé la semana investigando lo que deberíamos construir juntos. Aquí está."
      </Notes>
    </Slide>

    {/* 2. The problem */}
    <Slide>
      <div className="flex flex-col justify-center h-full bg-stone-100 text-slate-900 p-24">
        <div className="text-sm tracking-[0.3em] text-slate-500 mb-6">EL PROBLEMA</div>
        <h2 className="text-6xl font-bold leading-tight mb-12 max-w-4xl">
          Los estudiantes de Aprendly hablan inglés.
          <br />
          <span className="text-slate-400">Pero ganan como si no lo hablaran.</span>
        </h2>
        <div className="grid grid-cols-2 gap-16 mt-8">
          <div>
            <div className="text-sm tracking-wider text-slate-500 mb-3">TRABAJO LOCAL</div>
            <div className="text-5xl font-bold text-slate-900">S/ 1,800–2,500</div>
            <div className="text-lg text-slate-600 mt-2">al mes, egresado en Perú</div>
          </div>
          <div>
            <div className="text-sm tracking-wider text-emerald-600 mb-3">REMOTO INTERNACIONAL</div>
            <div className="text-5xl font-bold text-emerald-600">USD 1,500–4,500</div>
            <div className="text-lg text-slate-600 mt-2">al mes, mismas skills</div>
          </div>
        </div>
        <div className="mt-12 text-2xl text-slate-700">
          Delta de <span className="font-bold text-emerald-600">3-5x</span>. Nadie los conecta.
        </div>
      </div>
      <Notes>
        Pausa después del número. 3-5x viene de MTPE, INEI, Deel, Terminal, Torre. Los estudiantes de Aprendly ya son este perfil.
      </Notes>
    </Slide>

    {/* 3. Market size / role table */}
    <Slide>
      <div className="flex flex-col h-full bg-slate-950 text-white p-20">
        <div className="text-sm tracking-[0.3em] text-emerald-400/80 mb-4">MERCADO REAL</div>
        <h2 className="text-5xl font-bold mb-10">Roles donde LatAm ya está siendo contratado</h2>
        <div className="grid grid-cols-2 gap-x-16 gap-y-5 text-lg">
          <div className="flex justify-between border-b border-white/10 pb-3">
            <span>Junior Frontend Dev</span>
            <span className="text-emerald-400 font-mono">$18K–35K</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-3">
            <span>Backend Dev</span>
            <span className="text-emerald-400 font-mono">$24K–48K</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-3">
            <span>SDR / BDR</span>
            <span className="text-emerald-400 font-mono">$15K–28K + comm</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-3">
            <span>Customer Support</span>
            <span className="text-emerald-400 font-mono">$10K–20K</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-3">
            <span>Data Analyst</span>
            <span className="text-emerald-400 font-mono">$20K–40K</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-3">
            <span>Ops / PM Coordinator</span>
            <span className="text-emerald-400 font-mono">$14K–28K</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-3">
            <span>QA / Test Engineer</span>
            <span className="text-emerald-400 font-mono">$15K–30K</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-3">
            <span>Digital Marketing</span>
            <span className="text-emerald-400 font-mono">$14K–28K</span>
          </div>
        </div>
        <div className="mt-10 text-xl text-white/60">
          Perú = una de las ubicaciones de mayor arbitraje en LatAm. El costo de vida amplifica el delta.
        </div>
      </div>
      <Notes>
        Fuentes: Deel Global Hiring 2024, Terminal LatAm Salary Guide, Torre.ai, Arc.dev. Contrataciones activas hoy.
      </Notes>
    </Slide>

    {/* 4. Why now */}
    <Slide>
      <div className="flex flex-col justify-center h-full bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-950 text-white p-20">
        <div className="text-sm tracking-[0.3em] text-emerald-400/80 mb-6">POR QUÉ AHORA</div>
        <h2 className="text-6xl font-bold mb-16">Cuatro cosas se alinearon este año</h2>
        <div className="grid grid-cols-2 gap-12">
          <div>
            <div className="text-5xl font-bold text-emerald-400 mb-3">51</div>
            <div className="text-lg text-white/80">universidades cerradas por SUNEDU. Las 94 sobrevivientes pelean más duro por diferenciación.</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-emerald-400 mb-3">Ponte en Carrera</div>
            <div className="text-lg text-white/80">Datos de empleabilidad y salarios son públicos por universidad. No se pueden esconder resultados.</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-emerald-400 mb-3">#1</div>
            <div className="text-lg text-white/80">La empleabilidad es el factor que más influye en decisiones de matrícula. Matrícula = ingreso.</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-emerald-400 mb-3">Voice AI</div>
            <div className="text-lg text-white/80">OpenAI Realtime, Deepgram, Claude: el stack para entrevistas AI viables en días, no años.</div>
          </div>
        </div>
      </div>
      <Notes>
        Las universidades están en crisis de diferenciación. Los datos de empleabilidad son públicos. La tecnología de voz recién es usable. Nadie en Perú está conectando las piezas.
      </Notes>
    </Slide>

    {/* 5. Cruzar one paragraph */}
    <Slide>
      <div className="flex flex-col justify-center h-full bg-stone-100 text-slate-900 p-24">
        <div className="text-sm tracking-[0.3em] text-slate-500 mb-6">QUÉ ES CRUZAR</div>
        <p className="text-4xl leading-relaxed font-medium max-w-5xl">
          Un sistema de IA que lleva a un estudiante desde la matrícula hasta su empleo internacional.
          Lo <span className="text-emerald-600 font-bold">diagnostica</span> en 15 minutos.
          Lo <span className="text-emerald-600 font-bold">valida</span> mediante simulaciones de escenarios reales.
          Lo <span className="text-emerald-600 font-bold">coloca</span> vía automatización.
          Y le da a la universidad un <span className="text-emerald-600 font-bold">dashboard vivo</span> de cada paso.
        </p>
      </div>
      <Notes>
        Leer despacio. Es el párrafo central. No improvisar.
      </Notes>
    </Slide>

    {/* 6. Four pillars */}
    <Slide>
      <div className="flex flex-col h-full bg-slate-950 text-white p-20">
        <div className="text-sm tracking-[0.3em] text-emerald-400/80 mb-6">CÓMO FUNCIONA</div>
        <h2 className="text-5xl font-bold mb-16">Cuatro pilares</h2>
        <div className="grid grid-cols-4 gap-6 flex-1">
          <div className="border border-white/10 rounded-xl p-8 flex flex-col">
            <div className="text-emerald-400 font-mono text-sm mb-4">01</div>
            <div className="text-3xl font-bold mb-4">Diagnose</div>
            <div className="text-white/70 text-base leading-relaxed">
              Cuestionario conversacional + evaluación de inglés hablado. Perfil con nivel CEFR, matches de roles, gaps, delta salarial.
            </div>
          </div>
          <div className="border border-white/10 rounded-xl p-8 flex flex-col bg-emerald-950/40">
            <div className="text-emerald-400 font-mono text-sm mb-4">02</div>
            <div className="text-3xl font-bold mb-4">Prepare + Validate</div>
            <div className="text-white/70 text-base leading-relaxed">
              Simulación de escenarios reales del rol objetivo. Un agente hace de cliente/prospecto. Otro evalúa. Credencial de soft skills.
            </div>
          </div>
          <div className="border border-white/10 rounded-xl p-8 flex flex-col">
            <div className="text-emerald-400 font-mono text-sm mb-4">03</div>
            <div className="text-3xl font-bold mb-4">Place</div>
            <div className="text-white/70 text-base leading-relaxed">
              Aplicación autónoma a 50-100 roles por candidato. CV generado del perfil. Tracking por estado.
            </div>
          </div>
          <div className="border border-white/10 rounded-xl p-8 flex flex-col">
            <div className="text-emerald-400 font-mono text-sm mb-4">04</div>
            <div className="text-3xl font-bold mb-4">Track</div>
            <div className="text-white/70 text-base leading-relaxed">
              Dashboard vivo para la universidad. Funnel, métricas, proyecciones, reportes exportables.
            </div>
          </div>
        </div>
      </div>
      <Notes>
        Pilar 2 es donde nadie más está. Los otros tres existen sueltos en el mercado. La combinación + el modo de validar no.
      </Notes>
    </Slide>

    {/* 7. Student journey */}
    <Slide>
      <div className="flex flex-col justify-center h-full bg-stone-100 text-slate-900 p-16">
        <div className="text-sm tracking-[0.3em] text-slate-500 mb-4">EL VIAJE DEL ESTUDIANTE</div>
        <h2 className="text-5xl font-bold mb-10">De matriculado a colocado</h2>
        <img src="/3.png" alt="Student journey flow" className="w-full max-h-[280px] object-contain mb-8" />
        <div className="grid grid-cols-3 gap-6 text-base">
          <div className="p-5 bg-slate-50 rounded-lg">
            <div className="text-slate-500 text-xs mb-1 tracking-wider">EL ESTUDIANTE VIVE</div>
            <div className="text-slate-800">Un proceso guiado, con feedback claro en cada etapa.</div>
          </div>
          <div className="p-5 bg-slate-50 rounded-lg">
            <div className="text-slate-500 text-xs mb-1 tracking-wider">LA UNIVERSIDAD VE</div>
            <div className="text-slate-800">Cada estudiante y cada etapa actualizada en su dashboard.</div>
          </div>
          <div className="p-5 bg-emerald-50 rounded-lg">
            <div className="text-emerald-700 text-xs mb-1 tracking-wider">CRUZAR ENTREGA</div>
            <div className="text-slate-800">Entrevistas internacionales reales. Ofertas. Colocaciones.</div>
          </div>
        </div>
      </div>
      <Notes>
        El estudiante es el sujeto. No opera un CRM. Le pasa algo.
      </Notes>
    </Slide>

    {/* 8. The differentiator: scenario simulation */}
    <Slide>
      <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white p-12">
        <div className="text-sm tracking-[0.3em] text-emerald-400/80 mb-3">EL DIFERENCIADOR</div>
        <h2 className="text-5xl font-bold mb-2">Simulación de escenarios reales</h2>
        <p className="text-lg text-white/60 mb-6 max-w-4xl">
          No es una entrevista. Es el trabajo, ejecutado frente a un agente que actúa como una persona real.
        </p>
        <img src="/2.png" alt="Scenario simulation: persona, candidato, evaluador" className="w-full flex-1 object-contain rounded-lg" />
        <div className="text-base text-emerald-300/90 mt-4 text-center">
          CEFR, readiness de rol y soft skills en una sola conversación de voz. Del lado del candidato. Portable. Nadie lo tiene armado así.
        </div>
      </div>
      <Notes>
        Esta diapositiva cierra la conversación con la universidad. HireVue analiza cómo hablas durante una entrevista. Cruzar te pone adentro del trabajo y mide cómo lo haces.
      </Notes>
    </Slide>

    {/* 9. Competitive whitespace */}
    <Slide>
      <div className="flex flex-col h-full bg-stone-100 text-slate-900 p-20">
        <div className="text-sm tracking-[0.3em] text-slate-500 mb-6">EL ESPACIO SIN OCUPAR</div>
        <h2 className="text-5xl font-bold mb-12">Nadie construye lo que Cruzar construye</h2>
        <div className="grid grid-cols-2 gap-8 flex-1">
          <div className="space-y-4">
            <div className="p-5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-bold text-lg">Marketplaces LatAm</div>
              <div className="text-slate-600 text-sm">Near, Turing, Terminal, Andela, Toptal</div>
              <div className="text-slate-500 text-xs mt-1">Employer-side. Solo devs. Crowded.</div>
            </div>
            <div className="p-5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-bold text-lg">Bootcamps</div>
              <div className="text-slate-600 text-sm">Henry, Laboratoria, Platzi, Microverse</div>
              <div className="text-slate-500 text-xs mt-1">Enseñan. No colocan a escala.</div>
            </div>
            <div className="p-5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-bold text-lg">AI recruiting tools</div>
              <div className="text-slate-600 text-sm">HireVue, Mercor, Apriora, Sonara</div>
              <div className="text-slate-500 text-xs mt-1">Employer-side. Scores desechables.</div>
            </div>
            <div className="p-5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-bold text-lg">Plataformas universitarias</div>
              <div className="text-slate-600 text-sm">Handshake, Symplicity, 12Twenty</div>
              <div className="text-slate-500 text-xs mt-1">Bolsas de trabajo. No AI-native. No colocación internacional.</div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="p-10 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-xl text-center max-w-md">
              <div className="text-sm tracking-[0.3em] text-emerald-200 mb-6">CRUZAR</div>
              <div className="text-2xl font-bold leading-tight mb-4">
                Del lado del candidato
                <br />
                + Universidad como cliente
                <br />
                + Pipeline completo con IA
                <br />
                + Soft skills validadas con escenario
              </div>
              <div className="text-emerald-100 text-base mt-6 font-medium">
                Una sola sesión produce todo. El candidato se lleva el perfil.
              </div>
            </div>
          </div>
        </div>
      </div>
      <Notes>
        Los cuatro cuadrantes existen por separado. La intersección no. Lo verifiqué en 14 documentos de research esta semana.
      </Notes>
    </Slide>

    {/* 10. Why Aprendly uniquely wins */}
    <Slide>
      <div className="flex flex-col justify-center h-full bg-slate-950 text-white p-20">
        <div className="text-sm tracking-[0.3em] text-emerald-400/80 mb-6">POR QUÉ APRENDLY</div>
        <h2 className="text-6xl font-bold mb-14 max-w-4xl">Activos que ningún competidor puede copiar rápido</h2>
        <div className="grid grid-cols-2 gap-10">
          <div className="flex gap-5">
            <div className="text-emerald-400 text-4xl font-bold">01</div>
            <div>
              <div className="text-xl font-bold mb-2">Pipeline de candidatos existente</div>
              <div className="text-white/70">Los estudiantes de Aprendly son exactamente el perfil objetivo. Disponibles desde el día 1.</div>
            </div>
          </div>
          <div className="flex gap-5">
            <div className="text-emerald-400 text-4xl font-bold">02</div>
            <div>
              <div className="text-xl font-bold mb-2">Red universitaria</div>
              <div className="text-white/70">UTEC, USIL, Cientifica listas para negociar. 90%+ de las 94 universidades licenciadas alcanzables.</div>
            </div>
          </div>
          <div className="flex gap-5">
            <div className="text-emerald-400 text-4xl font-bold">03</div>
            <div>
              <div className="text-xl font-bold mb-2">Expertise de Miura</div>
              <div className="text-white/70">6+ años coaching inglés, International Business. Founder-market fit directo.</div>
            </div>
          </div>
          <div className="flex gap-5">
            <div className="text-emerald-400 text-4xl font-bold">04</div>
            <div>
              <div className="text-xl font-bold mb-2">Legitimidad institucional</div>
              <div className="text-white/70">ProInnovate 11G aprobado, 12G en proceso. Negocio operativo de 2 años.</div>
            </div>
          </div>
          <div className="flex gap-5">
            <div className="text-emerald-400 text-4xl font-bold">05</div>
            <div>
              <div className="text-xl font-bold mb-2">Ejecución técnica</div>
              <div className="text-white/70">Fork de aplicación autónoma funcionando. R&D en simulación de agentes. Stack AI actualizado.</div>
            </div>
          </div>
          <div className="flex gap-5">
            <div className="text-emerald-400 text-4xl font-bold">06</div>
            <div>
              <div className="text-xl font-bold mb-2">Velocidad</div>
              <div className="text-white/70">Equipo capaz de enviar en días lo que otros envían en trimestres.</div>
            </div>
          </div>
        </div>
      </div>
      <Notes>
        Alguien de afuera tardaría años en construir la red, el pipeline y la credibilidad. Ya los tenemos.
      </Notes>
    </Slide>

    {/* 11. Who buys */}
    <Slide>
      <div className="flex flex-col justify-center h-full bg-stone-100 text-slate-900 p-20">
        <div className="text-sm tracking-[0.3em] text-slate-500 mb-6">A QUIÉN LE VENDEMOS</div>
        <h2 className="text-5xl font-bold mb-12">Universidades bajo presión competitiva real</h2>
        <div className="grid grid-cols-2 gap-16">
          <div>
            <div className="text-sm tracking-wider text-slate-500 mb-4">EL COMPRADOR</div>
            <div className="space-y-6">
              <div>
                <div className="text-2xl font-bold">VP Académico / Rector</div>
                <div className="text-slate-600 mt-1">Autoridad de presupuesto. Ve rankings, acreditación, matrícula.</div>
              </div>
              <div>
                <div className="text-2xl font-bold">Career Services</div>
                <div className="text-slate-600 mt-1">Campeón interno. Lleva la propuesta al VP. Tiene el dolor diario.</div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm tracking-wider text-slate-500 mb-4">QUÉ LES DUELE</div>
            <div className="space-y-4 text-lg">
              <div className="flex gap-3">
                <span className="text-emerald-600 font-bold">→</span>
                <span>94 universidades compiten por la misma matrícula tras cierre de 51</span>
              </div>
              <div className="flex gap-3">
                <span className="text-emerald-600 font-bold">→</span>
                <span>Empleabilidad es el factor #1 en decisión de matrícula</span>
              </div>
              <div className="flex gap-3">
                <span className="text-emerald-600 font-bold">→</span>
                <span>Ponte en Carrera publica datos de salario y empleo. Nada que esconder.</span>
              </div>
              <div className="flex gap-3">
                <span className="text-emerald-600 font-bold">→</span>
                <span>Ninguna universidad peruana coloca estudiantes internacionalmente</span>
              </div>
              <div className="flex gap-3">
                <span className="text-emerald-600 font-bold">→</span>
                <span>Career services tiene 3-8 personas sin herramientas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Notes>
        La matrícula es ingreso. La empleabilidad es lo que impulsa la matrícula. Los datos ahora son públicos, así que las universidades no pueden esconder resultados bajos.
      </Notes>
    </Slide>

    {/* 12. The pitch to universities */}
    <Slide>
      <div className="flex flex-col justify-center h-full bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-20">
        <div className="text-sm tracking-[0.3em] text-emerald-400/80 mb-6">EL PITCH</div>
        <div className="max-w-5xl">
          <p className="text-5xl font-bold leading-tight mb-12">
            "Colocamos a sus estudiantes en trabajos internacionales."
          </p>
          <p className="text-2xl text-white/70 leading-relaxed mb-6">
            Aquí está la prueba con estudiantes de Aprendly.
          </p>
          <p className="text-2xl text-white/70 leading-relaxed mb-6">
            Aquí está cómo se ve a escala para su cohorte.
          </p>
          <p className="text-2xl text-white/70 leading-relaxed">
            Aquí está lo que nadie más en Perú ofrece.
          </p>
        </div>
      </div>
      <Notes>
        No vendemos producto. Vendemos resultado y la evidencia de que ya lo entregamos.
      </Notes>
    </Slide>

    {/* 13. Pricing */}
    <Slide>
      <div className="flex flex-col h-full bg-stone-100 text-slate-900 p-20">
        <div className="text-sm tracking-[0.3em] text-slate-500 mb-6">MODELO COMERCIAL</div>
        <h2 className="text-5xl font-bold mb-12">Piloto founding partner</h2>
        <div className="grid grid-cols-2 gap-12 flex-1">
          <div className="bg-slate-50 rounded-xl p-10">
            <div className="text-sm tracking-wider text-slate-500 mb-4">ESTRUCTURA</div>
            <div className="space-y-5">
              <div>
                <div className="text-4xl font-bold text-slate-900">$8,000</div>
                <div className="text-slate-600 mt-1">Anchor no-reembolsable. Setup + primeras 4 semanas.</div>
              </div>
              <div className="border-t border-slate-200 pt-5">
                <div className="text-4xl font-bold text-emerald-600">+ $12,000</div>
                <div className="text-slate-600 mt-1">Outcomes. 3 milestones de $4K cada uno.</div>
              </div>
              <div className="border-t border-slate-200 pt-5 flex items-baseline gap-3">
                <div className="text-2xl font-bold text-slate-900">Máx</div>
                <div className="text-4xl font-bold text-slate-900">$20,000</div>
                <div className="text-slate-500">· 12 semanas · 40 estudiantes</div>
              </div>
            </div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-10 border border-emerald-200">
            <div className="text-sm tracking-wider text-emerald-700 mb-4">POR QUÉ FUNCIONA</div>
            <div className="space-y-5 text-slate-800">
              <div>
                <div className="font-bold text-lg">De-risk total para la universidad</div>
                <div className="text-slate-600 text-sm mt-1">Anchor bajo, outcomes pagados solo si se cumplen</div>
              </div>
              <div>
                <div className="font-bold text-lg">Novedoso en categoría</div>
                <div className="text-slate-600 text-sm mt-1">Nadie combina cliente-universidad con pricing por resultados</div>
              </div>
              <div>
                <div className="font-bold text-lg">Founding partner status</div>
                <div className="text-slate-600 text-sm mt-1">Primer partner en LatAm. 36 meses de precio fijo. Co-marketing.</div>
              </div>
              <div>
                <div className="font-bold text-lg">Camino claro a renovación</div>
                <div className="text-slate-600 text-sm mt-1">$25-45K/año, 100-250 estudiantes, post-piloto</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Notes>
        Estructura calibrada al presupuesto discrecional de un VP Académico en Perú. El research confirmó que en la categoría nadie más cobra con outcomes.
      </Notes>
    </Slide>

    {/* 14. GTM sequence */}
    <Slide>
      <div className="flex flex-col justify-center h-full bg-slate-950 text-white p-20">
        <div className="text-sm tracking-[0.3em] text-emerald-400/80 mb-6">SECUENCIA</div>
        <h2 className="text-5xl font-bold mb-14">De Aprendly a LatAm</h2>
        <div className="space-y-6">
          <div className="flex items-center gap-8 p-6 border border-white/10 rounded-xl">
            <div className="text-3xl font-bold text-emerald-400 min-w-[140px]">Semana 1-1.5</div>
            <div>
              <div className="text-xl font-bold">Tracción con estudiantes Aprendly</div>
              <div className="text-white/60">3-5 candidatos seleccionados → entrevistas internacionales como prueba</div>
            </div>
          </div>
          <div className="flex items-center gap-8 p-6 border border-white/10 rounded-xl">
            <div className="text-3xl font-bold text-emerald-400 min-w-[140px]">Semana 2-3</div>
            <div>
              <div className="text-xl font-bold">UTEC con evidencia</div>
              <div className="text-white/60">Reunión con career services. Proof en mano, no demo.</div>
            </div>
          </div>
          <div className="flex items-center gap-8 p-6 border border-white/10 rounded-xl">
            <div className="text-3xl font-bold text-emerald-400 min-w-[140px]">Mes 2-3</div>
            <div>
              <div className="text-xl font-bold">USIL + Cientifica</div>
              <div className="text-white/60">Expansión vía red existente de Miura</div>
            </div>
          </div>
          <div className="flex items-center gap-8 p-6 border border-emerald-500/40 rounded-xl bg-emerald-950/30">
            <div className="text-3xl font-bold text-emerald-400 min-w-[140px]">Mes 4+</div>
            <div>
              <div className="text-xl font-bold">Perú como beachhead → LatAm</div>
              <div className="text-white/60">Infraestructura del canal de universidades → expansión regional</div>
            </div>
          </div>
        </div>
      </div>
      <Notes>
        90 días para tres universidades. La red ya existe. Solo hay que activarla.
      </Notes>
    </Slide>

    {/* 15. Research done */}
    <Slide>
      <div className="flex flex-col justify-center h-full bg-stone-100 text-slate-900 p-20">
        <div className="text-sm tracking-[0.3em] text-slate-500 mb-6">INVESTIGACIÓN</div>
        <h2 className="text-5xl font-bold mb-4">14 documentos de research esta semana</h2>
        <p className="text-xl text-slate-600 mb-12">Decisiones con fuente. Nada improvisado.</p>
        <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-base">
          <div className="flex gap-3"><span className="text-emerald-600 font-bold">→</span><span>Delta salarial Perú vs remoto internacional</span></div>
          <div className="flex gap-3"><span className="text-emerald-600 font-bold">→</span><span>Dinámica universitaria en Perú post-SUNEDU</span></div>
          <div className="flex gap-3"><span className="text-emerald-600 font-bold">→</span><span>Estado real de career services en Perú</span></div>
          <div className="flex gap-3"><span className="text-emerald-600 font-bold">→</span><span>Panorama competitivo LatAm/AI recruiting</span></div>
          <div className="flex gap-3"><span className="text-emerald-600 font-bold">→</span><span>Metodología CEFR via IA</span></div>
          <div className="flex gap-3"><span className="text-emerald-600 font-bold">→</span><span>Stack de voice AI (OpenAI, LiveKit, etc.)</span></div>
          <div className="flex gap-3"><span className="text-emerald-600 font-bold">→</span><span>Catálogo de roles remotos para LatAm</span></div>
          <div className="flex gap-3"><span className="text-emerald-600 font-bold">→</span><span>Análisis de nichos (tamaño + crowding)</span></div>
          <div className="flex gap-3"><span className="text-emerald-600 font-bold">→</span><span>Soft skills AI landscape</span></div>
          <div className="flex gap-3"><span className="text-emerald-600 font-bold">→</span><span>Emulación humana en agentes de IA</span></div>
          <div className="flex gap-3"><span className="text-emerald-600 font-bold">→</span><span>Modelos de revenue en categorías adyacentes</span></div>
          <div className="flex gap-3"><span className="text-emerald-600 font-bold">→</span><span>Naming + verificación de dominios</span></div>
          <div className="flex gap-3"><span className="text-emerald-600 font-bold">→</span><span>Posicionamiento competitivo</span></div>
          <div className="flex gap-3"><span className="text-emerald-600 font-bold">→</span><span>Contexto de reunión UTEC</span></div>
        </div>
      </div>
      <Notes>
        Los comparto después de la reunión si los quieren. Son la base de cada decisión acá.
      </Notes>
    </Slide>

    {/* 16. Key findings */}
    <Slide>
      <div className="flex flex-col justify-center h-full bg-slate-950 text-white p-20">
        <div className="text-sm tracking-[0.3em] text-emerald-400/80 mb-6">HALLAZGOS CLAVE</div>
        <h2 className="text-5xl font-bold mb-12">Lo que la investigación validó</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="border-l-4 border-emerald-500 pl-6">
            <div className="text-3xl font-bold mb-2">3-5x</div>
            <div className="text-white/70">Multiplicador salarial real. Lima es una de las ubicaciones de mayor arbitraje en LatAm.</div>
          </div>
          <div className="border-l-4 border-emerald-500 pl-6">
            <div className="text-3xl font-bold mb-2">0</div>
            <div className="text-white/70">Universidades peruanas que hacen colocación internacional sistemática.</div>
          </div>
          <div className="border-l-4 border-emerald-500 pl-6">
            <div className="text-3xl font-bold mb-2">~$120</div>
            <div className="text-white/70">Costo total de voice AI para todo el piloto. 200 entrevistas, OpenAI Realtime.</div>
          </div>
          <div className="border-l-4 border-emerald-500 pl-6">
            <div className="text-3xl font-bold mb-2">85-90%</div>
            <div className="text-white/70">Agreement de scoring CEFR via LLM con raters humanos. Confiable.</div>
          </div>
          <div className="border-l-4 border-emerald-500 pl-6">
            <div className="text-3xl font-bold mb-2">SDR / CS / Ops</div>
            <div className="text-white/70">Nichos con menor competencia y mayor peso en soft skills.</div>
          </div>
          <div className="border-l-4 border-emerald-500 pl-6">
            <div className="text-3xl font-bold mb-2">Vacío</div>
            <div className="text-white/70">Categoría competitiva: supply-side + universidad + pipeline completo + soft skills.</div>
          </div>
        </div>
      </div>
      <Notes>
        Cada número tiene fuente. Los hallazgos son los que definen qué construimos primero.
      </Notes>
    </Slide>

    {/* 17. Tech stack */}
    <Slide>
      <div className="flex flex-col h-full bg-stone-100 text-slate-900 p-20">
        <div className="text-sm tracking-[0.3em] text-slate-500 mb-6">STACK</div>
        <h2 className="text-5xl font-bold mb-4">Herramientas maduras, nada experimental</h2>
        <p className="text-xl text-slate-600 mb-12">Todo lo que ves acá corre en producción en otras empresas hoy.</p>
        <div className="grid grid-cols-3 gap-6 flex-1">
          <div className="p-6 bg-slate-50 rounded-xl">
            <div className="text-sm text-slate-500 mb-2">VOICE</div>
            <div className="text-xl font-bold">OpenAI Realtime</div>
            <div className="text-sm text-slate-600 mt-2">STT + LLM + TTS en un solo WebSocket. 1-2 días de build.</div>
          </div>
          <div className="p-6 bg-slate-50 rounded-xl">
            <div className="text-sm text-slate-500 mb-2">TRANSCRIPCIÓN</div>
            <div className="text-xl font-bold">Deepgram Nova</div>
            <div className="text-sm text-slate-600 mt-2">Maneja acento latino. $200 de crédito inicial.</div>
          </div>
          <div className="p-6 bg-slate-50 rounded-xl">
            <div className="text-sm text-slate-500 mb-2">SCORING</div>
            <div className="text-xl font-bold">Claude Sonnet</div>
            <div className="text-sm text-slate-600 mt-2">CEFR rubric scoring + evaluador de escenarios.</div>
          </div>
          <div className="p-6 bg-slate-50 rounded-xl">
            <div className="text-sm text-slate-500 mb-2">BACKEND</div>
            <div className="text-xl font-bold">Next.js + Neon</div>
            <div className="text-sm text-slate-600 mt-2">Postgres + Drizzle + Server Actions. Tier gratuito.</div>
          </div>
          <div className="p-6 bg-slate-50 rounded-xl">
            <div className="text-sm text-slate-500 mb-2">UI</div>
            <div className="text-xl font-bold">shadcn + Tailwind v4</div>
            <div className="text-sm text-slate-600 mt-2">Componentes como código fuente. Tokens semánticos.</div>
          </div>
          <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="text-sm text-emerald-700 mb-2">COSTO MSP</div>
            <div className="text-xl font-bold">~$30/mes + $120 total</div>
            <div className="text-sm text-slate-700 mt-2">Recurrente + voice AI para todo el piloto. Ajustado al presupuesto.</div>
          </div>
        </div>
      </div>
      <Notes>
        Cada elección del stack tiene justificación en el research. Desde el día 1 todo queda listo para escalar.
      </Notes>
    </Slide>

    {/* 17.5 Dashboard mockup */}
    <Slide>
      <div className="flex flex-col h-full bg-slate-950 text-white p-12">
        <div className="text-sm tracking-[0.3em] text-emerald-400/80 mb-3">LO QUE VE LA UNIVERSIDAD</div>
        <h2 className="text-5xl font-bold mb-6">Dashboard institucional</h2>
        <img src="/1.png" alt="Cruzar institutional dashboard mockup for UTEC" className="w-full flex-1 object-contain rounded-lg border border-white/10" />
        <div className="text-base text-white/60 mt-4 text-center">
          Cada estudiante, cada etapa, cada score, actualizados en vivo. Reporte exportable para el VP Académico.
        </div>
      </div>
      <Notes>
        Este es el artefacto que convence al comprador. Career services ve a sus estudiantes. VP Académico ve números agregados. Un solo dashboard.
      </Notes>
    </Slide>

    {/* 18. MSP traction first */}
    <Slide>
      <div className="flex flex-col justify-center h-full bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white p-20">
        <div className="text-sm tracking-[0.3em] text-emerald-400/80 mb-6">EJECUCIÓN</div>
        <h2 className="text-6xl font-bold mb-4">Tracción primero. Venta después.</h2>
        <p className="text-2xl text-white/70 mb-14 max-w-4xl">
          Una universidad no compra un demo. Compra evidencia de que ya lo logramos con otra persona. El MSP está armado para producir esa evidencia antes de pedir firma.
        </p>
        <div className="grid grid-cols-2 gap-8">
          <div className="p-8 border border-white/20 rounded-xl bg-slate-900/40">
            <div className="text-sm tracking-wider text-emerald-400 mb-4">FASE 1 · SEMANA 1-1.5</div>
            <div className="text-3xl font-bold mb-4">Traction</div>
            <div className="text-white/70 space-y-2">
              <div>→ 3-5 estudiantes Aprendly diagnosticados</div>
              <div>→ Preparados en escenarios reales</div>
              <div>→ 50-100 aplicaciones por candidato</div>
              <div>→ Al menos 1 invitación a entrevista internacional</div>
            </div>
          </div>
          <div className="p-8 border border-emerald-500/40 rounded-xl bg-emerald-950/40">
            <div className="text-sm tracking-wider text-emerald-400 mb-4">FASE 2 · SEMANA 2-3</div>
            <div className="text-3xl font-bold mb-4">University sell</div>
            <div className="text-white/70 space-y-2">
              <div>→ Proof package armado con resultados reales</div>
              <div>→ Demo en vivo del producto completo</div>
              <div>→ Propuesta founding partner para UTEC</div>
              <div>→ Career services con leave-behind para VP</div>
            </div>
          </div>
        </div>
      </div>
      <Notes>
        Evidencia supera demo. El producto y el piloto son la misma cosa, no dos cosas separadas.
      </Notes>
    </Slide>

    {/* 19. Timeline */}
    <Slide>
      <div className="flex flex-col h-full bg-stone-100 text-slate-900 p-20">
        <div className="text-sm tracking-[0.3em] text-slate-500 mb-6">CRONOGRAMA</div>
        <h2 className="text-5xl font-bold mb-14">De cero a primer deal en 3 semanas</h2>
        <div className="space-y-6">
          {[
            { week: 'Días 1-2', focus: 'Dominio + brand + landing page + data model', status: 'Foundation' },
            { week: 'Días 2-5', focus: 'Diagnóstico end-to-end (CEFR + role matching)', status: 'Core product' },
            { week: 'Días 3-6', focus: 'Voice interview + scenario simulation', status: 'Core product' },
            { week: 'Días 5-7', focus: 'Dashboard + ejecución de aplicaciones autónomas', status: 'Traction' },
            { week: 'Semana 2', focus: 'Monitoreo de respuestas + coaching + resultados', status: 'Traction' },
            { week: 'Semana 2-3', focus: 'Proof package + demo prep + reunión UTEC', status: 'Sale' },
          ].map((row) => (
            <div key={row.week} className="flex items-center gap-8 pb-5 border-b border-slate-200">
              <div className="text-lg font-bold text-slate-900 min-w-[140px]">{row.week}</div>
              <div className="flex-1 text-slate-700">{row.focus}</div>
              <div className={`text-xs tracking-wider px-3 py-1 rounded-full ${
                row.status === 'Foundation' ? 'bg-slate-200 text-slate-700' :
                row.status === 'Core product' ? 'bg-emerald-100 text-emerald-700' :
                row.status === 'Traction' ? 'bg-blue-100 text-blue-700' :
                'bg-amber-100 text-amber-700'
              }`}>{row.status.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>
      <Notes>
        Build y tracción corren en paralelo. No esperamos al producto perfecto para empezar a aplicar.
      </Notes>
    </Slide>

    {/* 20. Structural proposal */}
    <Slide>
      <div className="flex flex-col justify-center h-full bg-slate-950 text-white p-20">
        <div className="text-sm tracking-[0.3em] text-emerald-400/80 mb-6">ESTRUCTURA PROPUESTA</div>
        <h2 className="text-6xl font-bold mb-6">Cruzar como spinoff</h2>
        <p className="text-2xl text-white/70 mb-12 max-w-4xl">
          No es una línea de producto de Aprendly. Es una entidad nueva con cap table propio y espacio para crecer como venture.
        </p>
        <div className="grid grid-cols-2 gap-10">
          <div className="p-8 border border-white/20 rounded-xl">
            <div className="text-sm tracking-wider text-slate-400 mb-4">APRENDLY</div>
            <div className="text-xl font-bold mb-4">Founding partner</div>
            <div className="text-white/70 space-y-2 text-base">
              <div>→ Wedge: estudiantes como primer cohorte</div>
              <div>→ Distribución: red universitaria</div>
              <div>→ Credibilidad: legitimidad institucional</div>
              <div>→ Domain expertise: Miura co-fundadora</div>
            </div>
          </div>
          <div className="p-8 border border-emerald-500/40 rounded-xl bg-emerald-950/30">
            <div className="text-sm tracking-wider text-emerald-400 mb-4">CRUZAR</div>
            <div className="text-xl font-bold mb-4">Entidad independiente</div>
            <div className="text-white/70 space-y-2 text-base">
              <div>→ Cap table propio</div>
              <div>→ Camino de fundraising independiente</div>
              <div>→ Techo de ambición venture-scale</div>
              <div>→ Aprendly participa vía equity, no como producto</div>
            </div>
          </div>
        </div>
        <p className="mt-10 text-lg text-white/60 max-w-4xl">
          Por qué: si Cruzar es un producto de Aprendly, el techo es el de Aprendly. Un spinoff deja que Cruzar crezca sin ese tope, y Aprendly se queda con equity en esa entidad más grande.
        </p>
      </div>
      <Notes>
        Decisión estructural. Aprendly no pierde nada. Gana equity en una entidad con mayor techo.
      </Notes>
    </Slide>

    {/* 21. Contributions + equity */}
    <Slide>
      <div className="flex flex-col justify-center h-full bg-stone-100 text-slate-900 p-20">
        <div className="text-sm tracking-[0.3em] text-slate-500 mb-6">CONTRIBUCIONES + EQUITY</div>
        <h2 className="text-5xl font-bold mb-10">Ambas partes ponen capital</h2>
        <div className="grid grid-cols-2 gap-10 mb-10">
          <div className="p-8 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-sm tracking-wider text-slate-500 mb-4">APRENDLY / MIURA APORTA</div>
            <div className="space-y-3 text-base text-slate-800">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span>Capital mensual</span><span className="font-mono">S/ 1,500</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span>Activos Aprendly</span><span className="font-bold">Pipeline + red</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span>Tiempo de Miura</span><span className="font-bold">Co-fundadora</span>
              </div>
              <div className="flex justify-between">
                <span>Credibilidad</span><span className="font-bold">ProInnovate + marca</span>
              </div>
            </div>
          </div>
          <div className="p-8 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="text-sm tracking-wider text-emerald-700 mb-4">YO APORTO</div>
            <div className="space-y-3 text-base text-slate-800">
              <div className="flex justify-between border-b border-emerald-200 pb-2">
                <span>Tarifa real del producto</span><span className="font-mono font-bold">≥ S/ 15,000/mes</span>
              </div>
              <div className="flex justify-between border-b border-emerald-200 pb-2">
                <span>IP técnica</span><span className="font-bold">Fork + R&D</span>
              </div>
              <div className="flex justify-between border-b border-emerald-200 pb-2">
                <span>Tiempo como co-fundador</span><span className="font-bold">Dedicado</span>
              </div>
              <div className="flex justify-between">
                <span>Research semanal</span><span className="font-bold">Base del producto</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 bg-slate-900 text-white rounded-xl flex items-center justify-around">
          <div className="text-center">
            <div className="text-sm tracking-wider text-white/60 mb-1">MIURA (VIA APRENDLY)</div>
            <div className="text-4xl font-bold">55%</div>
          </div>
          <div className="text-center">
            <div className="text-sm tracking-wider text-emerald-400 mb-1">YO</div>
            <div className="text-4xl font-bold text-emerald-400">35%</div>
          </div>
          <div className="text-center">
            <div className="text-sm tracking-wider text-white/60 mb-1">OPTION POOL</div>
            <div className="text-4xl font-bold">10%</div>
          </div>
        </div>
        <div className="mt-6 text-base text-slate-600 text-center">
          Vesting 4 años · cliff de 1 año · retroactivo al día 1 de Fase 1 · ambos fundadores en el mismo schedule
        </div>
      </div>
      <Notes>
        Por este producto yo cobraría al menos S/15K al mes, probablemente mucho más. Acepto S/1,500 a cambio de equity. El 35% refleja eso más la IP + research.
      </Notes>
    </Slide>

    {/* 22. Decision */}
    <Slide>
      <div className="flex flex-col justify-center items-center h-full bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white p-20 text-center">
        <div className="text-sm tracking-[0.3em] text-emerald-400/80 mb-8">DECISIÓN</div>
        <h2 className="text-7xl font-bold mb-16 max-w-5xl leading-tight">
          Qué necesitamos decidir hoy
        </h2>
        <div className="grid grid-cols-3 gap-8 max-w-6xl w-full">
          <div className="p-8 border border-white/20 rounded-xl">
            <div className="text-5xl font-bold text-emerald-400 mb-4">01</div>
            <div className="text-xl font-bold mb-2">Construir Cruzar</div>
            <div className="text-white/60 text-sm">Acuerdo de avanzar con esta dirección</div>
          </div>
          <div className="p-8 border border-white/20 rounded-xl">
            <div className="text-5xl font-bold text-emerald-400 mb-4">02</div>
            <div className="text-xl font-bold mb-2">Estructura de equity</div>
            <div className="text-white/60 text-sm">Abierto a negociación desde la propuesta</div>
          </div>
          <div className="p-8 border border-emerald-500/40 rounded-xl bg-emerald-950/40">
            <div className="text-5xl font-bold text-emerald-400 mb-4">03</div>
            <div className="text-xl font-bold mb-2">Arrancar el lunes</div>
            <div className="text-white/60 text-sm">Fase 1 comienza esta semana</div>
          </div>
        </div>
        <p className="mt-20 text-xl text-white/50">Preguntas.</p>
      </div>
      <Notes>
        Cerrar con decisión. No salir con "lo pensamos y te contamos" sin al menos un compromiso parcial hoy.
      </Notes>
    </Slide>
  </>
)

export default slides
