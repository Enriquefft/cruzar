#!/usr/bin/env node

/**
 * fill-forms.mjs v2 — Multi-tenant Playwright form filler (headed mode)
 *
 * Input: JSON on stdin with shape:
 *   {
 *     candidate: { firstName, lastName, email, phone, linkedin, github?, portfolio?, location, timezone, workAuthorization },
 *     application: { company_name, role_normalized, job_url, platform },
 *     cvPath: string,
 *     answersPath?: string,
 *     workspaceDir: string
 *   }
 *
 * Output: structured JSON on stdout:
 *   { filled: [...], missed: [...], needsHuman: [...], screenshots: [...], finalStateScreenshot: string }
 *
 * Exit code 0 on success, non-zero on failure.
 *
 * ETHICAL SUBMIT GATE (INVIOLABLE):
 *   This binary NEVER clicks any element whose text matches /submit|send|apply now/i
 *   beyond the listing-page "Apply" trigger that opens the actual form.
 *   Every subsequent submit is Miura's manual click in the headed browser.
 *   See apps/career-ops/CLAUDE.md for the full rule.
 */

import { chromium } from 'playwright';
import { readFile, mkdir, writeFile } from 'fs/promises';
import { resolve, basename } from 'path';

// ---------------------------------------------------------------------------
// Input parsing — JSON on stdin
// ---------------------------------------------------------------------------

let rawInput = '';
for await (const chunk of process.stdin) {
  rawInput += chunk;
  // Stop reading once we have a complete JSON object
  try { JSON.parse(rawInput); break; } catch { /* keep reading */ }
}

if (!rawInput.trim()) {
  process.stderr.write('ERROR: No JSON input on stdin.\n');
  process.exit(1);
}

let input;
try {
  input = JSON.parse(rawInput);
} catch {
  process.stderr.write('ERROR: Invalid JSON on stdin.\n');
  process.exit(1);
}

const { candidate, application, cvPath, answersPath, workspaceDir } = input;

if (!candidate || !application || !cvPath || !workspaceDir) {
  process.stderr.write('ERROR: Missing required fields: candidate, application, cvPath, workspaceDir.\n');
  process.exit(1);
}

// Derive fullName from candidate fields
const fullName = `${candidate.firstName} ${candidate.lastName}`;

// ---------------------------------------------------------------------------
// Platform detection — Greenhouse adapter vs generic fallback
// ---------------------------------------------------------------------------

/**
 * Detect platform from URL pattern.
 * Returns 'greenhouse' for boards.greenhouse.io or embedded Greenhouse layouts.
 * Falls back to application.platform or 'other'.
 */
function detectPlatform(jobUrl) {
  const url = jobUrl.toLowerCase();
  if (url.includes('boards.greenhouse.io') || url.includes('greenhouse.io')) return 'greenhouse';
  if (url.includes('jobs.lever.co')) return 'lever';
  if (url.includes('jobs.ashbyhq.com')) return 'ashby';
  return application.platform || 'other';
}

const detectedPlatform = detectPlatform(application.job_url);

/**
 * Greenhouse-specific selector map. Greenhouse forms use consistent IDs
 * across boards.greenhouse.io and embedded layouts.
 */
const GREENHOUSE_SELECTORS = {
  firstName: '#first_name',
  lastName: '#last_name',
  email: '#email',
  phone: '#phone',
  resume: '#resume_file, input[name="resume"]',
  linkedin: '#job_application_answers_attributes_0_text_value, input[name*="linkedin"], input[placeholder*="LinkedIn"]',
  coverLetter: '#cover_letter_file, input[name="cover_letter"]',
  location: '#job_application_location, input[name*="location"]',
};

// ---------------------------------------------------------------------------
// Workspace-scoped I/O helpers
// ---------------------------------------------------------------------------

const outputDir = resolve(workspaceDir, 'output');
await mkdir(outputDir, { recursive: true });

/**
 * Parse answers .md file into a map of field_name_lower -> value
 */
function parseAnswersFile(content) {
  const answers = {};
  const sections = content.split(/^### /gm).slice(1);

  for (const section of sections) {
    const lines = section.trim().split('\n');
    const fieldName = lines[0].trim().replace(/\s*\(.*?\)\s*$/, '').trim();
    const key = fieldName.toLowerCase();

    const rest = lines.slice(1).join('\n').trim();
    const codeMatch = rest.match(/```\n?([\s\S]*?)```/);

    if (codeMatch) {
      answers[key] = codeMatch[1].trim();
    } else {
      let value = rest
        .replace(/^\*\*.*?\*\*\s*\n?/, '')
        .replace(/^`[^`]+`.*$/gm, '')
        .replace(/^\(.*?\)$/gm, '')
        .replace(/^---$/gm, '')
        .replace(/^Leave blank.*$/gim, '')
        .trim();
      if (value) answers[key] = value;
    }
  }
  return answers;
}

const delay = ms => new Promise(r => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// Result tracking
// ---------------------------------------------------------------------------

const filled = [];
const missed = [];
const needsHuman = [];
const screenshots = [];

// ---------------------------------------------------------------------------
// Browser setup
// ---------------------------------------------------------------------------

const browser = await chromium.launch({
  headless: false,
  slowMo: 80,
  args: ['--start-maximized'],
});

const context = await browser.newContext({ viewport: null });

// ---------------------------------------------------------------------------
// Field filling — generic heuristic (fallback for all platforms)
// ---------------------------------------------------------------------------

async function fillFieldByLabel(page, labelText, value) {
  if (!value) return false;

  try {
    // Strategy 1: Find label containing text, then find nearby input/textarea
    const labels = await page.$$('label, h3, h4, [class*="label"], [class*="Label"], p');
    for (const label of labels) {
      const text = (await label.textContent()).trim().toLowerCase();
      if (!text.includes(labelText.toLowerCase())) continue;

      const forId = await label.getAttribute('for').catch(() => null);
      let input = null;

      if (forId) {
        input = await page.$(`#${forId}`);
      }
      if (!input) {
        const parent = await label.evaluateHandle(el => {
          let p = el.parentElement;
          while (p && !p.querySelector('input, textarea, select')) {
            p = p.parentElement;
            if (!p || p.tagName === 'FORM') break;
          }
          return p;
        });
        if (parent) {
          input = await parent.$('textarea') || await parent.$('input:not([type="file"]):not([type="hidden"]):not([type="checkbox"])') || await parent.$('select');
        }
      }

      if (input) {
        const tag = await input.evaluate(el => el.tagName.toLowerCase());
        if (tag === 'select') {
          await input.selectOption({ label: value }).catch(() => input.selectOption(value).catch(() => {}));
        } else {
          await input.click();
          await input.fill('');
          await input.fill(value);
        }
        filled.push({ field: labelText, truncatedValue: value.substring(0, 60) });
        return true;
      }
    }

    // Strategy 2: Playwright's getByLabel
    const byLabel = page.getByLabel(labelText, { exact: false });
    if (await byLabel.count() > 0) {
      const first = byLabel.first();
      await first.click();
      await first.fill(value);
      filled.push({ field: labelText, truncatedValue: value.substring(0, 60) });
      return true;
    }

    // Strategy 3: placeholder text
    const byPlaceholder = page.getByPlaceholder(labelText, { exact: false });
    if (await byPlaceholder.count() > 0) {
      await byPlaceholder.first().fill(value);
      filled.push({ field: labelText, truncatedValue: value.substring(0, 60) });
      return true;
    }
  } catch {
    // Silent fail, we'll report unfilled fields
  }

  missed.push({ key: labelText.toLowerCase(), label: labelText });
  return false;
}

// ---------------------------------------------------------------------------
// Greenhouse-specific field filling
// ---------------------------------------------------------------------------

async function fillGreenhouseField(page, selector, value) {
  if (!value) return false;
  try {
    const el = await page.$(selector);
    if (!el) return false;
    const tag = await el.evaluate(el => el.tagName.toLowerCase());
    if (tag === 'select') {
      await el.selectOption({ label: value }).catch(() => el.selectOption(value).catch(() => {}));
    } else if (tag === 'input' || tag === 'textarea') {
      await el.click();
      await el.fill('');
      await el.fill(value);
    }
    filled.push({ field: selector, truncatedValue: value.substring(0, 60) });
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// File upload — workspace-scoped
// ---------------------------------------------------------------------------

async function uploadFile(page, filePath, buttonText) {
  // filePath is already absolute (from workspaceDir) or relative to workspaceDir
  const absPath = resolve(workspaceDir, filePath);
  try {
    const fileInputs = await page.$$('input[type="file"]');
    if (fileInputs.length > 0) {
      for (const fi of fileInputs) {
        const parent = await fi.evaluateHandle(el => el.closest('[class*="upload"], [class*="resume"], [class*="file"], [class*="attach"], div'));
        const parentText = parent ? await parent.evaluate(el => el.textContent || '').catch(() => '') : '';
        if (parentText.toLowerCase().includes(buttonText.toLowerCase()) || fileInputs.length === 1) {
          await fi.setInputFiles(absPath);
          filled.push({ field: `upload:${buttonText}`, truncatedValue: basename(filePath) });
          return true;
        }
      }
      await fileInputs[0].setInputFiles(absPath);
      filled.push({ field: `upload:${buttonText}`, truncatedValue: basename(filePath) });
      return true;
    }

    const uploadBtn = await page.$(`button:has-text("${buttonText}"), [role="button"]:has-text("${buttonText}"), label:has-text("${buttonText}")`);
    if (uploadBtn) {
      const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser', { timeout: 5000 }),
        uploadBtn.click(),
      ]);
      await fileChooser.setFiles(absPath);
      filled.push({ field: `upload:${buttonText}`, truncatedValue: basename(filePath) });
      return true;
    }
  } catch (e) {
    missed.push({ key: `upload:${buttonText}`, label: `Upload ${buttonText}` });
  }
  return false;
}

// ---------------------------------------------------------------------------
// Greenhouse-specific file upload by selector
// ---------------------------------------------------------------------------

async function uploadGreenhouseFile(page, selector, filePath) {
  const absPath = resolve(workspaceDir, filePath);
  try {
    const el = await page.$(selector);
    if (el) {
      const tag = await el.evaluate(el => el.tagName.toLowerCase());
      if (tag === 'input') {
        await el.setInputFiles(absPath);
        filled.push({ field: selector, truncatedValue: basename(filePath) });
        return true;
      }
    }
  } catch { /* fallthrough to generic */ }
  return false;
}

// ---------------------------------------------------------------------------
// Screenshot helper — writes to workspaceDir/output/
// ---------------------------------------------------------------------------

async function takeScreenshot(page, label) {
  const filename = `${label}-${Date.now()}.png`;
  const filepath = resolve(outputDir, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  screenshots.push(filepath);
  return filepath;
}

// ---------------------------------------------------------------------------
// ETHICAL SUBMIT GATE — INVIOLABLE
// This function determines whether a button click is safe.
// Only the listing-page "Apply" trigger is clicked. Any element whose text
// matches /submit|send|apply now/i beyond the initial Apply trigger is NEVER
// clicked. Miura clicks submit manually in the headed browser.
// ---------------------------------------------------------------------------

function isApplyTriggerSafe(buttonText) {
  const lower = buttonText.toLowerCase().trim();
  // Reject anything that looks like a form submission
  if (lower.includes('submit')) return false;
  if (lower.includes('send')) return false;
  if (/apply\s*now/i.test(lower)) return false;
  // Only allow the simple "Apply" or "Apply for this job" listing-page triggers
  return lower.includes('apply');
}

// ---------------------------------------------------------------------------
// Main form fill logic
// ---------------------------------------------------------------------------

async function fillForm(page, answers) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await delay(3000);

  // Click "Apply" button if present (opens the form on job listing pages)
  // ETHICAL SUBMIT GATE: only click if text does NOT match submit/send/apply now
  try {
    const applyBtn = await page.$('a:has-text("Apply"), button:has-text("Apply")');
    if (applyBtn) {
      const text = await applyBtn.textContent();
      if (isApplyTriggerSafe(text)) {
        process.stderr.write(`  Clicking "${text.trim()}" to open form...\n`);
        await applyBtn.click();
        await delay(3000);
      }
    }
  } catch { /* no apply button found, form may already be open */ }

  // Platform-specific filling
  if (detectedPlatform === 'greenhouse') {
    await fillGreenhouseFields(page, answers);
  } else {
    await fillGenericFields(page, answers);
  }

  // Take pre-review screenshot
  await takeScreenshot(page, 'pre-review');

  // Scroll to bottom so operator can review
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
}

// ---------------------------------------------------------------------------
// Greenhouse adapter — per-platform selector map
// ---------------------------------------------------------------------------

async function fillGreenhouseFields(page, answers) {
  // Try Greenhouse-specific selectors first
  let ghHit = false;
  ghHit = await fillGreenhouseField(page, GREENHOUSE_SELECTORS.firstName, candidate.firstName) || ghHit;
  ghHit = await fillGreenhouseField(page, GREENHOUSE_SELECTORS.lastName, candidate.lastName) || ghHit;
  ghHit = await fillGreenhouseField(page, GREENHOUSE_SELECTORS.email, candidate.email) || ghHit;
  ghHit = await fillGreenhouseField(page, GREENHOUSE_SELECTORS.phone, candidate.phone) || ghHit;

  if (candidate.linkedin) {
    await fillGreenhouseField(page, GREENHOUSE_SELECTORS.linkedin, candidate.linkedin);
  }
  if (candidate.location) {
    await fillGreenhouseField(page, GREENHOUSE_SELECTORS.location, candidate.location);
  }

  // Upload resume via Greenhouse selector, fall back to generic
  const resumeUploaded = await uploadGreenhouseFile(page, GREENHOUSE_SELECTORS.resume, cvPath);
  if (!resumeUploaded) {
    await uploadFile(page, cvPath, 'Resume');
  }
  await delay(1000);

  // If Greenhouse selectors didn't hit, fall back to generic for the standard fields
  if (!ghHit) {
    await fillGenericFields(page, answers);
    return;
  }

  // Fill remaining answer fields via generic heuristic
  for (const [key, value] of Object.entries(answers)) {
    if (['name', 'email', 'resume', 'cover letter', 'notes for manual review before submitting'].includes(key)) continue;
    if (key.startsWith('cover letter')) {
      await fillFieldByLabel(page, 'Cover letter', value);
      continue;
    }
    await fillFieldByLabel(page, key, value);
  }

  // Fill link fields that Greenhouse may render as custom questions
  if (candidate.github) await fillFieldByLabel(page, 'GitHub', candidate.github);
  if (candidate.portfolio) {
    await fillFieldByLabel(page, 'Portfolio', candidate.portfolio);
    await fillFieldByLabel(page, 'Website', candidate.portfolio);
  }
}

// ---------------------------------------------------------------------------
// Generic heuristic — works on all platforms as a fallback
// ---------------------------------------------------------------------------

async function fillGenericFields(page, answers) {
  // Standard fields
  await fillFieldByLabel(page, 'First name', candidate.firstName);
  await fillFieldByLabel(page, 'Last name', candidate.lastName);
  await fillFieldByLabel(page, 'Full name', fullName);
  await fillFieldByLabel(page, 'Name', fullName);
  await fillFieldByLabel(page, 'Email', candidate.email);
  await fillFieldByLabel(page, 'Phone', candidate.phone);

  // Upload resume
  await uploadFile(page, cvPath, 'Resume');
  await delay(1000);

  // Upload cover letter if there's a second file input
  const fileInputs = await page.$$('input[type="file"]');
  if (fileInputs.length > 1 && answers['cover letter']) {
    await uploadFile(page, cvPath, 'Cover');
  }

  // Fill all fields from answers file
  for (const [key, value] of Object.entries(answers)) {
    if (['name', 'email', 'resume', 'cover letter', 'notes for manual review before submitting'].includes(key)) continue;
    if (key.startsWith('cover letter')) {
      await fillFieldByLabel(page, 'Cover letter', value);
      continue;
    }
    await fillFieldByLabel(page, key, value);
  }

  // Fill standard link fields
  if (candidate.linkedin) await fillFieldByLabel(page, 'LinkedIn', candidate.linkedin);
  if (candidate.github) await fillFieldByLabel(page, 'GitHub', candidate.github);
  if (candidate.portfolio) {
    await fillFieldByLabel(page, 'Portfolio', candidate.portfolio);
    await fillFieldByLabel(page, 'Website', candidate.portfolio);
  }
  await fillFieldByLabel(page, 'Location', candidate.location);
  await fillFieldByLabel(page, 'Country', answers['country of residence'] || candidate.location);
}

// ---------------------------------------------------------------------------
// Main execution
// ---------------------------------------------------------------------------

process.stderr.write(`\n=== Form Filler v2 ===\n`);
process.stderr.write(`Platform: ${detectedPlatform}\n`);
process.stderr.write(`URL: ${application.job_url}\n`);
process.stderr.write(`RULE: Will NEVER click Submit/Send/Apply Now\n\n`);

// Parse answers (workspace-scoped)
let answers = {};
if (answersPath) {
  try {
    const answersContent = await readFile(resolve(workspaceDir, answersPath), 'utf-8');
    answers = parseAnswersFile(answersContent);
    process.stderr.write(`  Parsed ${Object.keys(answers).length} answer fields\n`);
  } catch (e) {
    process.stderr.write(`  Warning: Could not parse answers: ${e.message}\n`);
  }
}

const page = await context.newPage();
let finalStateScreenshot = '';

try {
  await page.goto(application.job_url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await fillForm(page, answers);

  process.stderr.write(`\n  >>> FORM FILLED. Review in browser. NOT submitting. <<<\n`);
  process.stderr.write(`  >>> Filled: ${filled.length}, Missed: ${missed.length}, NeedsHuman: ${needsHuman.length} <<<\n`);
  process.stderr.write(`  >>> Press Enter when done reviewing... <<<\n`);

  // Wait for operator review (Miura clicks submit manually, then presses Enter)
  await new Promise(resolve => { process.stdin.resume(); process.stdin.once('data', resolve); });

  // Take final-state screenshot after operator review
  finalStateScreenshot = await takeScreenshot(page, 'final-state');

  // Write draft JSON to workspaceDir
  const draftPath = resolve(outputDir, 'draft.json');
  await writeFile(draftPath, JSON.stringify({ filled, missed, needsHuman, screenshots, finalStateScreenshot }, null, 2));

  // Output structured result on stdout
  const result = {
    filled: filled.map(f => f.field),
    missed: missed.map(m => ({ key: m.key, label: m.label })),
    needsHuman: needsHuman.map(n => ({ key: n.key, label: n.label, reason: n.reason })),
    screenshots,
    finalStateScreenshot,
  };
  process.stdout.write(JSON.stringify(result) + '\n');
  await browser.close();
  process.exit(0);
} catch (err) {
  process.stderr.write(`  ERROR: ${err.message}\n`);

  // Attempt error screenshot
  try { await takeScreenshot(page, 'error'); } catch { /* ignore */ }

  const result = {
    filled: filled.map(f => f.field),
    missed: missed.map(m => ({ key: m.key, label: m.label })),
    needsHuman: [{ key: 'error', label: 'Runtime error', reason: err.message }],
    screenshots,
    finalStateScreenshot: '',
  };
  process.stdout.write(JSON.stringify(result) + '\n');
  await browser.close();
  process.exit(1);
}
