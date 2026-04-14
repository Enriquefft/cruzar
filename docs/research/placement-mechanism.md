# Placement Mechanism: Job Board Partnerships vs. Autonomous Application

**Date:** 2026-04-13

---

## Original Plan

Partner with US job boards / talent platforms to place students. Build relationships, funnel prepared candidates through established channels.

**Status:** Not viable for Shape 1. Founder has very limited US contacts. Building these partnerships takes time and depends on having a track record of placed candidates (chicken-and-egg).

## Current Reality

Autonomous job application exists via founder's fork of `github.com/santifer/career-ops` (MIT license). Browser automation that finds and applies to jobs at volume. Founder tested on himself: scraped 176 jobs, applied to top 20% (~35) by match.

**Unvalidated:**
- Response/reply rates from automated applications
- ATS delivery and parsing success
- Generalization to non-engineer profiles
- Regulatory/platform ban risk at scale
- Quality of applications for non-technical roles

## Strategic Decision

Autonomous application removes the dependency on US job board partnerships. The company can start placing students immediately without needing to build a partner network first.

This is a significant strategic advantage:
- No chicken-and-egg problem (don't need placements to get partnerships to get placements)
- Speed to first outcome: can begin applying for students as soon as they're diagnosed and prepared
- Control: own the full pipeline from diagnosis to application
- Data: every application generates match quality signal

## Risks

- **Regulatory:** LinkedIn, Indeed, other platforms actively fight automated applications. Account bans are real.
- **Quality:** Automated applications may be lower quality than targeted, relationship-based placements
- **Scale:** Works for 35 applications on a strong engineer profile. Unclear at 100+ for mixed profiles.
- **Reputation:** If employers detect mass automated applications from the same source, it could burn the company's reputation

## Implication for Product

Autonomous application is not a deferred feature. It's the fulfillment engine. Without it, the product diagnoses and prepares but doesn't place. Placement is the revenue event and the pilot milestone.

However, it should be invisible to the institutional buyer. The university cares about the outcome (student placed), not the mechanism. The dashboard shows placement status, not application automation metrics.

## Next Steps for Validation

- Wait for reply-rate data from founder's 35 personal test applications
- Test on a non-engineer profile
- Assess ban risk: how many applications before platforms flag the account?
- Build anti-detection and rate-limiting into the automation
