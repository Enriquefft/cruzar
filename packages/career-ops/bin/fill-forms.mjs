#!/usr/bin/env node

/**
 * fill-forms.mjs -- Fill job application forms via Playwright (headed mode)
 *
 * Usage:
 *   node fill-forms.mjs                    # Fill all applications
 *   node fill-forms.mjs --wave 1           # Fill only Wave 1
 *   node fill-forms.mjs --id linear        # Fill single application
 *   node fill-forms.mjs --start-from 5     # Skip first N
 *
 * NEVER clicks Submit.
 *
 * PENDING (block M8 — fill-forms v2 multi-tenant upgrade):
 *   Lines ~36-46 contain a hardcoded `candidate` object from the absorbed
 *   source (see ADR-03 + ADR-08). This is intentionally left in place by P3
 *   and MUST be parameterized in M8 to `{ candidate, application, cvPath,
 *   answersPath, workspaceDir }` passed via JSON on stdin or flags. Until
 *   M8 lands, do NOT run this binary against real applications — it will
 *   leak the absorbed source's identity. See
 *   packages/career-ops/CLAUDE.md for the multi-tenant rule.
 */

import { chromium } from 'playwright';
import { readFile } from 'fs/promises';
import { resolve } from 'path';

const __dirname = new URL('.', import.meta.url).pathname;
const manifest = JSON.parse(await readFile(resolve(__dirname, 'applications-manifest.json'), 'utf-8'));

const args = process.argv.slice(2);
const waveFilter = args.includes('--wave') ? parseInt(args[args.indexOf('--wave') + 1]) : null;
const idFilter = args.includes('--id') ? args[args.indexOf('--id') + 1] : null;
const startFrom = args.includes('--start-from') ? parseInt(args[args.indexOf('--start-from') + 1]) : 0;

let apps = manifest;
if (waveFilter) apps = apps.filter(a => a.wave === waveFilter);
if (idFilter) apps = apps.filter(a => a.id === idFilter);
apps = apps.slice(startFrom);

console.log(`\n=== Form Filler ===`);
console.log(`Applications: ${apps.length}`);
console.log(`RULE: Will NEVER click Submit/Send/Apply\n`);

const candidate = {
  firstName: 'Enrique',
  lastName: 'Flores',
  fullName: 'Enrique Flores',
  email: 'enrique.flores@utec.edu.pe',
  phone: '+51926689401',
  linkedin: 'https://linkedin.com/in/enriqueflores000',
  github: 'https://github.com/Enriquefft',
  location: 'Lima, Peru',
  portfolio: 'https://github.com/Enriquefft',
};

/**
 * Parse answers .md file into a map of field_name_lower -> value
 */
function parseAnswersFile(content) {
  const answers = {};
  const sections = content.split(/^### /gm).slice(1); // split by ### headers

  for (const section of sections) {
    const lines = section.trim().split('\n');
    const fieldName = lines[0].trim().replace(/\s*\(.*?\)\s*$/, '').trim(); // remove (Required)/(Optional)
    const key = fieldName.toLowerCase();

    // Extract value: look for ``` code blocks or plain text
    const rest = lines.slice(1).join('\n').trim();
    const codeMatch = rest.match(/```\n?([\s\S]*?)```/);

    if (codeMatch) {
      answers[key] = codeMatch[1].trim();
    } else {
      // Use everything after the field name, stripping markdown formatting
      let value = rest
        .replace(/^\*\*.*?\*\*\s*\n?/, '') // remove bold question text
        .replace(/^`[^`]+`.*$/gm, '')      // remove file references
        .replace(/^\(.*?\)$/gm, '')         // remove parenthetical notes
        .replace(/^---$/gm, '')
        .replace(/^Leave blank.*$/gim, '')
        .trim();
      if (value) answers[key] = value;
    }
  }
  return answers;
}

const delay = ms => new Promise(r => setTimeout(r, ms));

const browser = await chromium.launch({
  headless: false,
  slowMo: 80,
  args: ['--start-maximized'],
});

const context = await browser.newContext({ viewport: null });

async function fillFieldByLabel(page, labelText, value) {
  if (!value) return false;

  try {
    // Strategy 1: Find label containing text, then find nearby input/textarea
    const labels = await page.$$('label, h3, h4, [class*="label"], [class*="Label"], p');
    for (const label of labels) {
      const text = (await label.textContent()).trim().toLowerCase();
      if (!text.includes(labelText.toLowerCase())) continue;

      // Look for input/textarea as sibling, child, or via 'for' attribute
      const forId = await label.getAttribute('for').catch(() => null);
      let input = null;

      if (forId) {
        input = await page.$(`#${forId}`);
      }
      if (!input) {
        // Look in parent container for input/textarea
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
        console.log(`  [OK] "${labelText}" = "${value.substring(0, 60)}${value.length > 60 ? '...' : ''}"`);
        return true;
      }
    }

    // Strategy 2: Use Playwright's getByLabel
    const byLabel = page.getByLabel(labelText, { exact: false });
    if (await byLabel.count() > 0) {
      const first = byLabel.first();
      await first.click();
      await first.fill(value);
      console.log(`  [OK] "${labelText}" = "${value.substring(0, 60)}..."`);
      return true;
    }

    // Strategy 3: placeholder text
    const byPlaceholder = page.getByPlaceholder(labelText, { exact: false });
    if (await byPlaceholder.count() > 0) {
      await byPlaceholder.first().fill(value);
      console.log(`  [OK] "${labelText}" (placeholder) = "${value.substring(0, 60)}..."`);
      return true;
    }
  } catch (e) {
    // Silent fail, we'll report unfilled fields
  }

  console.log(`  [MISS] Could not find field: "${labelText}"`);
  return false;
}

async function uploadFile(page, filePath, buttonText) {
  const absPath = resolve(__dirname, filePath);
  try {
    // Look for file input (may be hidden)
    const fileInputs = await page.$$('input[type="file"]');
    if (fileInputs.length > 0) {
      // Try to find the right one near the label
      for (const fi of fileInputs) {
        const parent = await fi.evaluateHandle(el => el.closest('[class*="upload"], [class*="resume"], [class*="file"], [class*="attach"], div'));
        const parentText = parent ? await parent.evaluate(el => el.textContent || '').catch(() => '') : '';
        if (parentText.toLowerCase().includes(buttonText.toLowerCase()) || fileInputs.length === 1) {
          await fi.setInputFiles(absPath);
          console.log(`  [UPLOAD] ${filePath}`);
          return true;
        }
      }
      // Fallback: use first file input
      await fileInputs[0].setInputFiles(absPath);
      console.log(`  [UPLOAD] ${filePath} (first input)`);
      return true;
    }

    // Try clicking an upload button to trigger file dialog
    const uploadBtn = await page.$(`button:has-text("${buttonText}"), [role="button"]:has-text("${buttonText}"), label:has-text("${buttonText}")`);
    if (uploadBtn) {
      const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser', { timeout: 5000 }),
        uploadBtn.click(),
      ]);
      await fileChooser.setFiles(absPath);
      console.log(`  [UPLOAD] ${filePath} (via button)`);
      return true;
    }
  } catch (e) {
    console.log(`  [MISS] Upload failed for ${filePath}: ${e.message}`);
  }
  return false;
}

async function fillForm(page, app, answers) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await delay(3000);

  // Click "Apply" button if present (opens the form on job listing pages)
  try {
    const applyBtn = await page.$('a:has-text("Apply"), button:has-text("Apply")');
    if (applyBtn) {
      const text = await applyBtn.textContent();
      // Don't click "Submit Application" — only "Apply" / "Apply Now"
      if (!text.toLowerCase().includes('submit')) {
        console.log(`  Clicking "${text.trim()}" to open form...`);
        await applyBtn.click();
        await delay(3000);
      }
    }
  } catch {}

  // Standard fields (always try these)
  await fillFieldByLabel(page, 'First name', candidate.firstName);
  await fillFieldByLabel(page, 'Last name', candidate.lastName);
  await fillFieldByLabel(page, 'Full name', candidate.fullName);
  await fillFieldByLabel(page, 'Name', candidate.fullName);
  await fillFieldByLabel(page, 'Email', candidate.email);
  await fillFieldByLabel(page, 'Phone', candidate.phone);

  // Upload resume
  await uploadFile(page, app.cv, 'Resume');
  await delay(1000);

  // Upload cover letter if there's a second file input
  const fileInputs = await page.$$('input[type="file"]');
  if (fileInputs.length > 1) {
    await uploadFile(page, app.cover, 'Cover');
  }

  // Fill all fields from answers file
  for (const [key, value] of Object.entries(answers)) {
    // Skip meta fields we already handled
    if (['name', 'email', 'resume', 'cover letter', 'notes for manual review before submitting'].includes(key)) continue;
    if (key.startsWith('cover letter')) {
      // Try to paste cover letter text into textarea
      await fillFieldByLabel(page, 'Cover letter', value);
      continue;
    }
    await fillFieldByLabel(page, key, value);
  }

  // Also fill standard link fields directly
  await fillFieldByLabel(page, 'LinkedIn', candidate.linkedin);
  await fillFieldByLabel(page, 'GitHub', candidate.github);
  await fillFieldByLabel(page, 'Portfolio', candidate.portfolio);
  await fillFieldByLabel(page, 'Website', candidate.portfolio);
  await fillFieldByLabel(page, 'Location', candidate.location);
  await fillFieldByLabel(page, 'Country', answers['country of residence'] || 'Peru');

  // Scroll to bottom so user can review
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
}

// === Main loop ===
for (let i = 0; i < apps.length; i++) {
  const app = apps[i];
  console.log(`\n[${ i + 1}/${apps.length}] ${app.company} -- ${app.role}`);
  console.log(`  URL: ${app.url}`);

  // Parse answers
  let answers = {};
  try {
    const answersContent = await readFile(resolve(__dirname, app.answers), 'utf-8');
    answers = parseAnswersFile(answersContent);
    console.log(`  Parsed ${Object.keys(answers).length} answer fields`);
  } catch (e) {
    console.log(`  Warning: Could not parse answers: ${e.message}`);
  }

  const page = await context.newPage();

  try {
    await page.goto(app.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await fillForm(page, app, answers);

    console.log(`\n  >>> FORM FILLED. Review in browser. NOT submitting. <<<`);
    console.log(`  >>> Full answers: ${app.answers} <<<`);
    console.log(`  >>> Press Enter for next application... <<<`);

    await new Promise(resolve => { process.stdin.once('data', resolve); });
  } catch (err) {
    console.error(`  ERROR: ${err.message}`);
    console.log(`  Press Enter to continue...`);
    await new Promise(resolve => { process.stdin.once('data', resolve); });
  }
}

console.log(`\n=== Done. ${apps.length} forms filled. NONE submitted. ===`);
await browser.close();
