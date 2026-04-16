# Research: Voice Interview Technical Approaches

**Date:** 2026-04-14
**Sources:** OpenAI, ElevenLabs, Vapi, LiveKit, Gemini docs, pricing pages

**Workload:** ~200 interviews x 15 min = 50 hours total audio for the pilot.

---

## Comparison

| Approach | Setup Time | Latency | Cost (50hr) | Voice Quality | Browser | Verdict |
|----------|-----------|---------|-------------|---------------|---------|---------|
| **OpenAI Realtime API** | 1-2 days | 300-500ms | ~$120 | Good, natural | All major | **RECOMMENDED** |
| Gemini Live API | 1-2 days | 300-500ms | <$100 | Decent, less mature | All major | Strong alternative, cheapest |
| ElevenLabs Conv. AI | 1-2 days | ~500ms | ~$300 | Best in class | Widget | Best voice quality, less LLM flexibility |
| Vapi.ai | 2-3 days | <500ms | $210-$750 | Depends on TTS | Widget | Overkill for 40 users |
| LiveKit Agents | 3-5 days | 200-400ms | ~$150-300 | Choose TTS | WebRTC | Production-grade, too much infra for MSP |
| Browser-only (Web Speech) | 0.5-1 day | 1-3s | Cheapest | Robotic | Chrome only | Unprofessional, fragile |

## Recommendation: OpenAI Realtime API

`View:` (the actual MSP decision belongs in [product/cruzar/](../../product/cruzar/), not here)

**Why:**
- Single WebSocket/WebRTC connection. One API handles STT + LLM + TTS natively.
- No pipeline chaining (unlike LiveKit where you wire up 3 separate providers).
- $0.04/min. Entire pilot costs ~$120.
- 1-2 days to build for a skilled developer.
- Client-side JS SDK available.
- Professional voice quality, natural enough for interviews.
- Works in all major browsers, no native app.

**Why not LiveKit (the ARCHITECTURE.md choice):**
LiveKit is the right answer at 10,000 users. At 40 users, it's 3-5 days of setup for infrastructure you don't need. The OpenAI Realtime API gives you a working voice interview faster. Migration to LiveKit is a Phase 2+ decision when scale demands it.

**Why not ElevenLabs:**
Best voice quality but less flexibility in LLM orchestration. If interview "feel" matters more than cost, this is the alternative. ~$300 for the pilot.

**Why not browser-only:**
Web Speech API STT is slow, Chrome-only, unreliable. Not professional enough for interviews that determine someone's career readiness.

## Architecture Note

The MSP voice interview is built on OpenAI Realtime. The architecture ALLOWS migration to LiveKit later without rewriting the interview logic (question selection, follow-up generation, scoring). The voice transport layer is isolated from the interview orchestration layer.
