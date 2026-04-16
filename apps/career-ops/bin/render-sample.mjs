#!/usr/bin/env node

/**
 * render-sample.mjs — Render the CV template against a realistic fixture
 * to produce `templates/cv-sample.pdf` for brand/design review.
 *
 * This is review-only tooling: it reuses the production HTML template but
 * renders with Playwright + whichever Chromium it finds (system Chrome
 * fallback for dev machines missing libgbm). The production path
 * (`bin/generate-pdf.mjs`) is untouched.
 *
 * Usage:
 *   node bin/render-sample.mjs [--format=a4|letter]
 */

import { readFile, writeFile, mkdtemp, rm } from 'fs/promises';
import { existsSync } from 'fs';
import { dirname, resolve, join } from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TEMPLATE = resolve(ROOT, 'templates/cv-template.html');
const FONTS_DIR = resolve(ROOT, 'fonts');
const OUT_PDF = resolve(ROOT, 'templates/cv-sample.pdf');

const FIXTURE = {
  LANG: 'en',
  PAGE_WIDTH: '180mm',
  DOC_ID: 'DOSSIER · CRZ-C02-014 · 2026-04-15',
  NAME: 'Renata Salcedo Arenas',
  HEADLINE: 'Senior Backend Engineer · Distributed Systems · Go / TypeScript',
  LOCATION: 'Arequipa, PE · UTC−5',
  LANG_TAGS: 'ES native · EN C1',
  PHONE: '+51 9xx xxx 214',
  EMAIL: 'renata.salcedo@candidate.cruzarapp.com',
  LINKEDIN_URL: 'https://linkedin.com/in/rsalcedo',
  LINKEDIN_DISPLAY: 'linkedin.com/in/rsalcedo',
  PORTFOLIO_URL: 'https://rsalcedo.dev',
  PORTFOLIO_DISPLAY: 'rsalcedo.dev',
  VERIFY_TAG: 'PLACEMENT-READY · COHORT 02',
  VERIFY_ID: 'c02-014',

  SECTION_SUMMARY: 'Summary',
  SECTION_COMPETENCIES: 'Core Competencies',
  SECTION_EXPERIENCE: 'Experience',
  SECTION_PROJECTS: 'Projects',
  SECTION_EDUCATION: 'Education',
  SECTION_CERTIFICATIONS: 'Certifications',
  SECTION_SKILLS: 'Skills',

  SUMMARY_TEXT:
    'Backend engineer with <strong>6 years</strong> building ' +
    'high-throughput payment and logistics infrastructure across LatAm. ' +
    'Led the migration of a 400-req/s monolith to an event-driven ' +
    'Go/Kafka platform; cut p99 latency by <strong>62%</strong> and ' +
    'on-call incidents by <strong>74%</strong>. Comfortable owning ' +
    'systems end to end - schema, service, deploy, runbook.',

  COMPETENCIES: [
    'Distributed Systems',
    'Event-Driven Architecture',
    'Go · TypeScript',
    'PostgreSQL · Kafka',
    'Kubernetes · Terraform',
    'Observability (OTel)',
    'Payments · PCI',
    'Mentorship',
  ]
    .map((c) => `<span class="competency-tag">${c}</span>`)
    .join('\n      '),

  EXPERIENCE: [
    {
      period: '2023 - Present',
      loc: 'Remote · LATAM',
      role: 'Staff Backend Engineer',
      company: 'Culqi Pay · Lima, PE',
      bullets: [
        'Designed the real-time reconciliation engine processing <strong>1.2M transactions/day</strong> across 4 acquirers; reduced chargeback dispute window from 72h to 4h.',
        'Led the platform-wide Kafka migration (8 services, 14 engineers); maintained zero-downtime cutover with dual-write + replay.',
        'Owned the incident-response rotation and RCA standard; MTTR dropped from <strong>48 min</strong> to <strong>11 min</strong> over two quarters.',
      ],
    },
    {
      period: '2021 - 2023',
      loc: 'Hybrid · Lima',
      role: 'Senior Backend Engineer',
      company: 'Rappi · Latin America Logistics',
      bullets: [
        'Shipped the dynamic pricing service in Go (gRPC, Redis, Postgres); powered <strong>+11% gross margin</strong> on courier offers.',
        'Rewrote the order-state machine to be durable and idempotent; eliminated <strong>~$180k/mo</strong> in duplicate-charge refunds.',
      ],
    },
    {
      period: '2019 - 2021',
      loc: 'Lima, PE',
      role: 'Software Engineer',
      company: 'Yape (BCP)',
      bullets: [
        'Built the peer-to-peer transfer API serving <strong>3.4M DAU</strong>; scaled the service from 500 RPS to 7k RPS.',
        'Introduced contract testing across 6 microservices; cut release-blocking regressions by <strong>58%</strong>.',
      ],
    },
  ]
    .map(
      (j) => `
    <div class="job">
      <div class="job-period">${j.period}<span class="loc">${j.loc}</span></div>
      <div class="job-body">
        <div class="job-header">
          <span class="job-role">${j.role}</span>
          <span class="job-company">${j.company}</span>
        </div>
        <ul>
          ${j.bullets.map((b) => `<li>${b}</li>`).join('\n          ')}
        </ul>
      </div>
    </div>`,
    )
    .join('\n    '),

  PROJECTS: [
    {
      meta: 'OSS · 2024',
      title: 'pgkafka-bridge',
      badge: '1.4k ★',
      desc: 'Postgres logical-replication to Kafka bridge written in Go. Exactly-once delivery via transactional outbox + consumer-group checkpoint.',
      tech: 'Go · Postgres · Kafka · Protobuf',
    },
    {
      meta: 'SIDE · 2023',
      title: 'Ruta Norte · Transit Uptime Map',
      badge: 'Live',
      desc: 'Real-time uptime dashboard for Lima Metropolitano BRT stations. Ingests GTFS-RT + user reports; SLA-style monthly reports for the municipality.',
      tech: 'TypeScript · Deno · SQLite · htmx',
    },
  ]
    .map(
      (p) => `
    <div class="project">
      <div class="project-meta">${p.meta}</div>
      <div class="project-body">
        <div>
          <span class="project-title">${p.title}</span>
          <span class="project-badge">${p.badge}</span>
        </div>
        <div class="project-desc">${p.desc}</div>
        <div class="project-tech">${p.tech}</div>
      </div>
    </div>`,
    )
    .join('\n    '),

  EDUCATION: [
    {
      year: '2015 - 2020',
      title: 'B.Sc. Computer Science',
      org: 'Universidad Nacional de San Agustín · Arequipa',
      desc: 'Graduated with honors (top 5%). Thesis: distributed consensus on partitioned networks.',
    },
  ]
    .map(
      (e) => `
    <div class="edu-item">
      <div class="edu-year">${e.year}</div>
      <div class="edu-body">
        <span class="edu-title">${e.title}</span><span class="edu-org">${e.org}</span>
        <div class="edu-desc">${e.desc}</div>
      </div>
    </div>`,
    )
    .join('\n    '),

  CERTIFICATIONS: [
    {
      year: '2024',
      title: 'CKA - Certified Kubernetes Administrator',
      org: 'CNCF / Linux Foundation',
    },
  ]
    .map(
      (c) => `
    <div class="cert-item">
      <div class="cert-year">${c.year}</div>
      <div>
        <span class="cert-title">${c.title}</span><span class="cert-org">${c.org}</span>
      </div>
      <div></div>
    </div>`,
    )
    .join('\n    '),

  SKILLS: [
    { category: 'Languages', items: 'Go · TypeScript · Python · SQL' },
    { category: 'Data', items: 'Postgres · Redis · Kafka · ClickHouse' },
    { category: 'Platform', items: 'Kubernetes · Terraform · AWS · GCP' },
    { category: 'Observability', items: 'OpenTelemetry · Prometheus · Grafana · Loki' },
  ]
    .map(
      (s) => `
    <div class="skill-item">
      <span class="skill-category">${s.category}</span>
      <span>${s.items}</span>
    </div>`,
    )
    .join('\n    '),
};

function fillTemplate(tpl, data) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in data)) throw new Error(`missing fixture key: ${key}`);
    return String(data[key]);
  });
}

/**
 * Resolve a Chromium-compatible executable. Prefers Playwright's bundled
 * headless shell; falls back to system Google Chrome for dev machines
 * (NixOS, minimal Linux) missing the usual shared libs.
 */
function resolveChromeExecutable() {
  const candidates = [
    '/run/current-system/sw/bin/google-chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const format =
    (args.find((a) => a.startsWith('--format=')) || '--format=a4').split('=')[1];
  if (!['a4', 'letter'].includes(format)) {
    console.error(`Invalid format "${format}". Use: a4, letter`);
    process.exit(1);
  }

  const tpl = await readFile(TEMPLATE, 'utf-8');
  const rendered = fillTemplate(tpl, FIXTURE);

  const workDir = await mkdtemp(join(tmpdir(), 'cruzar-cv-sample-'));
  const htmlPath = join(workDir, 'cv.html');

  // Rewrite relative ./fonts/ URLs to absolute file:// paths so the
  // headless browser picks them up regardless of CWD.
  const absoluteHtml = rendered.replace(
    /url\(['"]?\.\/fonts\//g,
    `url('file://${FONTS_DIR}/`,
  ).replace(
    /file:\/\/([^'")]+)\.(woff2?|ttf|otf)['"]?\)/g,
    `file://$1.$2')`,
  );
  await writeFile(htmlPath, absoluteHtml, 'utf-8');

  const chromePath = resolveChromeExecutable();
  const launchOpts = { headless: true };
  if (chromePath) {
    console.log(`🧭 Using browser: ${chromePath}`);
    launchOpts.executablePath = chromePath;
  } else {
    console.log(`🧭 Using Playwright bundled Chromium`);
  }

  const browser = await chromium.launch(launchOpts);
  try {
    const page = await browser.newPage();
    await page.setContent(absoluteHtml, {
      waitUntil: 'networkidle',
      baseURL: `file://${workDir}/`,
    });
    await page.evaluate(() => document.fonts.ready);

    const pdfBuffer = await page.pdf({
      format,
      printBackground: true,
      preferCSSPageSize: true, // honors @page { size: A4; margin: 14mm } in CSS
    });
    await writeFile(OUT_PDF, pdfBuffer);
    console.log(`✅ Sample PDF: ${OUT_PDF} (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);
  } finally {
    await browser.close();
    await rm(workDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error('❌ render-sample failed:', err);
  process.exit(1);
});
