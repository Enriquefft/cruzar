# Research: CEFR Assessment via AI

**Date:** 2026-04-14
**Sources:** Cambridge research, ETS adjacent work, Speechace, Pearson Versant documentation, CEFR framework

---

## Critical CEFR Boundaries for Job Placement

- **B1:** Familiar topics, simple connected speech, frequent pauses, circumlocution. Not ready for professional international roles.
- **B2 (threshold for professional work):** Fluent interaction with native speakers without strain. Can argue positions, explain trade-offs, speculate about hypotheticals. This is the minimum for international placement.
- **C1:** Effortless fluency, precise lexical choice, rare errors in complex structures. Opens senior/client-facing roles.
- **C2:** Near-native. Not worth testing for.

Key discrimination: **B1 vs B2** (ready or not) and **B2 vs C1** (which roles open up).

## Commercial APIs

- **Pearson Versant:** Gold standard automated spoken CEFR. Enterprise licensing, expensive.
- **Speechace:** Pronunciation scoring (phoneme-level). No holistic CEFR. Useful as add-on.
- **ELSA Speak / Duolingo:** Proprietary, not available as third-party APIs.
- **EF SET:** Reading/listening only, no speaking.

No cheap accessible API does holistic spoken CEFR scoring. DIY approach is viable and competitive.

## Recommended Approach: ASR + LLM Rubric Scoring

**Pipeline:** Browser microphone → Whisper or Deepgram transcription → Claude/GPT-4o scores transcript against CEFR rubric

**Reliability:** GPT-4-class models achieve ~85-90% adjacent-level agreement with trained human raters. Human inter-rater agreement itself is ~80-90%. Meets "within one level" requirement.

**Scoring structure:** Rubric-based outperforms holistic. Score separately on:
1. Range of vocabulary
2. Grammatical accuracy and range
3. Coherence and cohesion
4. Task achievement

Then derive overall level. Include anchor examples at each level in the prompt.

**Transcript-only is sufficient for v1.** Audio features (pronunciation, hesitation, pace) improve discrimination at A1-B1 but matter less at B2+. Upgrade path: add Whisper word-level timestamps for words-per-minute and pause frequency.

## Minimum Viable Question Set (5 questions)

1. **Self-introduction** (A2 floor): "Tell me about yourself and what you do."
2. **Describe a process** (B1 discriminator): "Explain how you would organize a team event at work."
3. **Opinion + justification** (B1/B2 boundary): "Some people think remote work is better than office work. What's your opinion and why?"
4. **Hypothetical + problem-solving** (B2/C1 boundary): "If your company had to cut costs by 20%, what approach would you recommend and what trade-offs would you accept?"
5. **Abstract reasoning** (C1 ceiling): "How has technology changed the way people build professional relationships, and is that change net positive?"

Weight questions 3-5 more heavily (less gameable than self-intro).

## Pitfalls

- **Transcript-only misses fluency:** Mitigate with word-level timestamps for WPM and pause frequency in v2.
- **Accented English:** Whisper handles LatAm-accented English well. LLM scoring on transcript is accent-agnostic. CEFR says accent should not penalize.
- **Topic knowledge confounds level:** Questions must span domains (not just tech).
- **Rehearsed responses:** Self-intro easily gamed. Weight accordingly.

## MSP Decision

Build: browser audio capture → Deepgram STT → Claude rubric scoring → CEFR level + sub-scores. Five questions. Ship in days. Accurate within one level for 85%+ of test-takers.
