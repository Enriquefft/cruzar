# Research: Realistic Human Emulation in AI Agents

**Date:** 2026-04-14
**Sources:** Stanford Generative Agents, Inworld AI, Hyperbound, ElevenLabs, Sesame AI, CoALA framework

---

## State of the Art

### Academic

- **Stanford Generative Agents (Park et al., 2023):** Agents with memory, reflection, planning. Emergent social behavior without scripting.
- **Stanford 1,000-Person Study (Park et al., 2024):** Created digital twins from real interviews. Synthetic agents replicated survey responses with **85% accuracy** on attitudes and behaviors. Closest work to validated human emulation.
- **GABM (2024-2025):** Generative agent-based models for social science. Bounded rationality and cognitive biases as emergent properties.
- **CoALA (2024):** "Cognitive Architectures for Language Agents." Systematic framework: memory modules, decision procedures, action spaces. Maps to human cognitive architecture.

### Products (Sales Training Simulation)

| Product | What It Does | Realism Level |
|---------|-------------|---------------|
| **Hyperbound** | AI buyer personas for cold call practice. Configurable difficulty. | Decent objections. Still reads as "polite AI playing a character." Lacks human messiness. |
| **Second Nature AI** | Roleplay simulations. Scores on methodology adherence. | Character realism secondary to training structure. |
| **Gong simulate** | Scenarios from real call data. | AI interlocutor still prompt-engineered, not cognitively modeled. |

### Products (Deep Personality Modeling)

| Product | Approach | Key Innovation |
|---------|----------|----------------|
| **Inworld AI** | Cognition (goals, motivations), emotion state machines, memory (short/long-term), relationship tracking, inner monologue | Most architecturally ambitious. Characters have inner states driving behavior. |
| **Character.ai** | Massive RLHF on conversational consistency | Good personality persistence. Optimizes for engagement, not realism. |
| **Convai** | Backstory, knowledge, emotional states for game NPCs | Lighter-weight Inworld alternative. |

## Technical Approaches Beyond Prompt Engineering

### What gets you from 60% to 85% realism:

1. **Emotion state machine:** Mood as a variable that drifts based on conversation events. Affects response length, patience, cooperativeness. Not a static persona trait.

2. **Memory architecture:**
   - Episodic: what happened in this conversation
   - Semantic: beliefs and knowledge WITH gaps and inaccuracies
   - Procedural: habits and patterns
   - Stanford study showed capturing memory structure predicts behavior

3. **Cognitive load modeling:** Attention as a finite resource. When "overloaded," agent forgets earlier points, asks repeated questions, gives inconsistent answers.

4. **Bounded rationality via constrained reasoning:** Deliberately restrict what the agent "notices" to simulate selective attention and confirmation bias. Don't give full context.

### The remaining 15% (unsolved/hard):

- **Genuine inattention:** LLMs are too good at listening. Making one miss or misinterpret points requires adversarial self-prompting.
- **Inconsistency over time:** LLMs seek consistency by training. Real humans contradict themselves. Needs explicit belief uncertainty modeling.
- **Interruption/turn-taking:** Partially solved in voice (Vapi, LiveKit). The DECISION of when to interrupt requires modeling impatience as state.

## Voice Realism

- **Sesame AI (2025):** "Character Voice" model generates hesitations, "um/uh," pace changes, emotional coloring. Specifically designed for realistic speech.
- **ElevenLabs and Cartesia:** Major prosody improvements. Natural enough for production.
- This is a solved-enough problem. Voice realism is no longer the bottleneck; behavioral realism is.

## The Gap

Hyperbound and Second Nature do sales roleplay but their characters are prompt-engineered. Polite AI playing a role. They don't model cognitive states, emotion drift, or bounded rationality.

Inworld has the right architecture (emotion states, memory, goals) but targets gaming NPCs, not professional training simulation.

Nobody combines:
1. Inworld-level cognitive architecture
2. With professional scenario simulation (sales, support, management)
3. With voice (not text)
4. Supply-side (for candidate validation, not employer screening)

## Implication for Cruzar

The founder's existing R&D on realistic human emulation is in genuinely underexplored territory. The architectural patterns are documented (Stanford, CoALA, Inworld) but nobody has shipped them in a professional training/validation product with voice.

**MSP approach:** Start with careful prompt engineering + emotion state tracking (gets to 60-80%). The full cognitive architecture (memory with gaps, cognitive load, bounded rationality) is the 2-week R&D target that brings it to parity or beyond US competitors.

**Competitive moat:** The scenario simulation quality IS the moat. Hyperbound can't easily replicate a system that models cognitive states, because their architecture is prompt-in/response-out. Building the cognitive layer is hard. Once built, it compounds with every scenario, every role, every niche.
