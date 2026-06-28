// Shared utility for calling Gemini API with mock fallbacks when keys are exhausted/rate-limited

export async function callGemini(systemPrompt, userPrompt, apiKey) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: { temperature: 0.85, maxOutputTokens: 1500 }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.warn("Gemini API call failed or rate-limited. Falling back to local smart companion simulation...", error);
    return simulateResponse(systemPrompt, userPrompt);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Smart local fallback — produces genuinely varied, content-aware responses
// ─────────────────────────────────────────────────────────────────────────────

function simulateResponse(systemPrompt, userPrompt) {
  const promptLower = userPrompt.toLowerCase();

  // ── 1. Support page grounding exercise ──────────────────────────────────
  if (systemPrompt.includes("grounding exercise")) {
    return generateGroundingExercise(promptLower);
  }

  // ── 2. Growth Page personalized roadmap ─────────────────────────────────
  if (systemPrompt.includes("personalized growth roadmap")) {
    return generateGrowthRoadmap(promptLower);
  }

  // ── 3. Weekly Synthesis Summary ─────────────────────────────────────────
  if (systemPrompt.includes("synthesize the user's emotional arc") || systemPrompt.includes("Synthesize")) {
    return generateWeeklySynthesis(promptLower);
  }

  // ── 4. Journal Entry Deep Analysis (default) ────────────────────────────
  return generateJournalAnalysis(promptLower, userPrompt);
}

// ─────────────────────────────────────────────────────────────────────────────
// Grounding exercise generator
// ─────────────────────────────────────────────────────────────────────────────

function generateGroundingExercise(promptLower) {
  const isPanic = promptLower.includes("panic") || promptLower.includes("attack") || promptLower.includes("heart racing") || promptLower.includes("can't breathe");
  const isAnxious = promptLower.includes("anxious") || promptLower.includes("anxiety") || promptLower.includes("scared") || promptLower.includes("nervous") || promptLower.includes("worried");
  const isOverwhelmed = promptLower.includes("overwhelm") || promptLower.includes("too much") || promptLower.includes("can't cope") || promptLower.includes("stressed");
  const isSad = promptLower.includes("sad") || promptLower.includes("cry") || promptLower.includes("lonely") || promptLower.includes("depress");

  if (isPanic) {
    return `Right now, in this moment, you are safe. Your body is reacting strongly, but it will pass — I promise. Let's bring you back to solid ground, one breath at a time.

### 🫁 Phase 1: Emergency Breath Reset (Do this first)
Your nervous system needs a signal that you're safe. Try this:
1. **Breathe IN** through your nose for **4 counts** — feel your belly expand
2. **Hold** gently for **4 counts**
3. **Breathe OUT** slowly through your mouth for **6 counts** — longer than the inhale
4. Pause and wait **2 counts**
*Repeat this 5 times. The extended exhale activates your parasympathetic system.*

### 🔍 Phase 2: 5-4-3-2-1 Sensory Anchor
Gently scan your environment and name out loud (or in your mind):
- **5 things** you can **see** right now (e.g., a lamp, a window, your hands)
- **4 things** you can **physically feel** (e.g., the chair beneath you, your feet on the floor)
- **3 sounds** you can **hear** (even quiet ones — a fan, distant traffic, your own breathing)
- **2 things** you can **smell** (even just the air)
- **1 thing** you can **taste**

### 💧 Phase 3: Physical Reset
- Press both feet flat and firm on the floor. Feel the ground holding you.
- Splash cold water on your wrists or face if available.
- Drink a slow sip of water.

You are doing incredibly well. This wave will pass.`;
  }

  if (isAnxious) {
    return `I hear you, and what you're feeling is completely real. Anxiety is your brain trying to protect you — even when it overdoes it. Let's work through this together.

### 🌬️ Box Breathing (4-4-4-4)
This technique is used by first responders to regulate the nervous system quickly:
1. **Inhale** through your nose for **4 counts**
2. **Hold** your breath for **4 counts**
3. **Exhale** fully through your mouth for **4 counts**
4. **Hold** empty for **4 counts**
*Complete 4-6 full cycles. Set a gentle timer if it helps.*

### 🧠 Cognitive Redirect — Name the Worry
Grab a piece of paper (or just think through this):
- Write down the **specific thing** you are anxious about in one sentence.
- Ask: *"What is the worst realistic outcome?"*
- Ask: *"What is the most likely outcome?"*
- Ask: *"What is one small action I can take right now?"*

### 🌿 Body Scan Release
Starting from your forehead — consciously **tense each muscle group for 5 seconds, then release**. Work down to your jaw, shoulders, hands, and feet. Notice the contrast between tension and relief.

You don't have to solve everything today. Just this moment.`;
  }

  if (isOverwhelmed) {
    return `When everything feels like too much at once, your mind needs permission to focus on just one thing. I'm here with you.

### ✋ The 5-Minute Containment Technique
Sometimes overwhelm comes from holding too many open loops. Try this:

1. **Brain dump**: Spend 2 minutes writing down *every single thing* weighing on your mind — big and small. Get it all out.
2. **Categorize**: Look at your list. Mark each item:
   - 🔴 Urgent + Important
   - 🟡 Important but not urgent  
   - ⚪ Can wait or delegate
3. **Choose ONE**: Pick only the single 🔴 item. Everything else gets mental permission to wait.

### 🫧 Physiological Sigh (Fastest Stress Reset Known)
Research shows this is the fastest way to calm your nervous system:
- Take a **deep inhale** through your nose
- At the top, take a **second short inhale** to fully expand your lungs
- Release in one long, slow **exhale** through your mouth

Do this **2-3 times**. You'll feel the shift almost immediately.

### 🌊 Permission Phrase
Repeat slowly: *"I do not have to do everything right now. I am allowed to take this one step at a time."*

One breath. One moment. One step.`;
  }

  if (isSad) {
    return `I'm so glad you reached out. Sadness is heavy, and carrying it alone makes it heavier. Let's sit with this together.

### 💙 Validate Before You Navigate
Before any technique — just notice: *you are allowed to feel sad.* It doesn't mean you're weak. It means you're human and something matters to you.

### 🌱 Gentle Movement Grounding
When sadness weighs us down physically:
1. Stand up slowly and shake your hands loose for 10 seconds
2. Roll your shoulders back 5 times
3. Take 3 slow, deep breaths with your eyes closed
4. Place one hand on your heart and one on your belly — feel them rise and fall

### ✍️ Compassionate Journaling Prompt
Write (even just a few words) in response to this:
- *"The thing I most need someone to understand about how I'm feeling right now is..."*
- *"One small thing that might bring me a little comfort in the next hour is..."*

### 🤝 Connection Invitation
Sadness shrinks when shared. Is there one person — a friend, a family member — you could send a simple message to right now? Even just: *"Hey, thinking of you."*

You are not alone in this. And this feeling, as real as it is, will shift.`;
  }

  // Default grounding
  return `Whatever brought you here, I'm glad you reached out. Let's create a moment of peace together.

### 🌬️ Box Breathing Technique
A simple, powerful way to reset your nervous system:
1. **Breathe In** slowly through your nose — **4 counts**
2. **Hold** still — **4 counts**  
3. **Breathe Out** fully through your mouth — **4 counts**
4. **Rest** before the next breath — **4 counts**
*Repeat 4-6 times. Focus only on counting.*

### 🔍 Quick Sensory Check-In
Name (out loud or silently):
- **3 things you can see** right now
- **2 things you can physically feel**
- **1 thing you can hear**

This brings your awareness back to the present moment.

### 🌿 A Moment of Self-Compassion
Place your hand over your heart. Take one slow breath. Say gently to yourself: *"This is a moment of difficulty. Difficulty is part of life. May I be kind to myself in this moment."*

You showed up for yourself today. That matters.`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Growth roadmap generator
// ─────────────────────────────────────────────────────────────────────────────

function generateGrowthRoadmap(promptLower) {
  const hasAnxiety = promptLower.includes("anxious") || promptLower.includes("anxiety") || promptLower.includes("stress") || promptLower.includes("worry");
  const hasSadness = promptLower.includes("sad") || promptLower.includes("depress") || promptLower.includes("lonely");
  const hasJoy = promptLower.includes("happy") || promptLower.includes("joy") || promptLower.includes("good") || promptLower.includes("well");

  if (hasAnxiety) {
    return JSON.stringify({
      "patterns": [
        "Anxiety appears to spike around tasks with high-stakes outcomes like exams or deadlines.",
        "Your writing shows a tendency to catastrophize — jumping to worst-case scenarios.",
        "You recover faster when you break challenges into smaller, concrete steps."
      ],
      "focusAreas": [
        { "domain": "Nervous System Regulation", "reason": "Daily breathwork can physically lower cortisol and reduce baseline anxiety over 4-6 weeks." },
        { "domain": "Sleep Hygiene", "reason": "Anxiety significantly disrupts sleep quality, which in turn amplifies anxiety — breaking this cycle is key." },
        { "domain": "Cognitive Reframing", "reason": "Practicing realistic thinking counters the catastrophizing patterns visible in your entries." }
      ],
      "habits": [
        "Practice 5 minutes of box breathing each morning before checking your phone.",
        "Keep a 'worry window' — a 15-minute slot each day dedicated to listing concerns, then close the notebook.",
        "Set a consistent sleep and wake time, even on weekends.",
        "Take a 10-minute walk outside daily — natural light regulates the circadian rhythm.",
        "Before any stressful task, write down the single next action (not the whole plan)."
      ],
      "affirmations": [
        "I can handle uncertainty — I have done it before.",
        "My anxiety is information, not truth.",
        "One step at a time is enough."
      ]
    });
  }

  if (hasSadness) {
    return JSON.stringify({
      "patterns": [
        "Sadness tends to intensify during periods of isolation or reduced social contact.",
        "You show resilience — even in difficult entries, there are moments of perspective and self-awareness.",
        "Your mood lifts noticeably after acts of connection or small moments of joy."
      ],
      "focusAreas": [
        { "domain": "Social Connection", "reason": "Even brief, low-effort connection (a text, a shared meal) measurably improves mood." },
        { "domain": "Behavioral Activation", "reason": "Depression reduces motivation, but small pleasurable activities rebuild the reward system." },
        { "domain": "Physical Movement", "reason": "Exercise is one of the most evidence-backed tools for improving mood and reducing depressive symptoms." }
      ],
      "habits": [
        "Send one check-in message to someone you care about each day.",
        "Schedule one enjoyable activity per week — no matter how small.",
        "Go outside for at least 10 minutes of natural light daily.",
        "Write down 3 things you noticed today — not 'grateful for', just noticed.",
        "Reduce social media scrolling — replace 10 minutes of scroll time with a walk or stretch."
      ],
      "affirmations": [
        "I am allowed to take things at my own pace.",
        "Reaching out for support is an act of courage.",
        "Small moments of joy are valid and meaningful."
      ]
    });
  }

  return JSON.stringify({
    "patterns": [
      "You show a capacity for emotional self-awareness that is genuinely valuable.",
      "Your mood is positively influenced by social interactions, movement, and periods of reflection.",
      "Consistency in habits — journaling, rest, connection — appears to anchor your wellbeing."
    ],
    "focusAreas": [
      { "domain": "Mindful Rest", "reason": "Quality rest is foundational to emotional resilience and cognitive clarity." },
      { "domain": "Social Depth", "reason": "Deeper, meaningful conversations tend to be more restorative than surface-level interaction." },
      { "domain": "Purpose & Meaning", "reason": "Connecting daily actions to larger values and goals sustains motivation and wellbeing." }
    ],
    "habits": [
      "Begin each morning with 2 minutes of silence before any screen time.",
      "Identify one 'anchor habit' — something you do every day that feels good.",
      "Write a brief end-of-day reflection: what went well, what you'd do differently.",
      "Schedule one 'deep conversation' per week with a friend or mentor.",
      "Move your body for at least 20 minutes — in any form you enjoy."
    ],
    "affirmations": [
      "I am capable of navigating whatever comes.",
      "My wellbeing is worth investing in, daily.",
      "I am growing, even on the days it doesn't feel like it."
    ]
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Weekly synthesis generator
// ─────────────────────────────────────────────────────────────────────────────

function generateWeeklySynthesis(promptLower) {
  const hasAnxiety = promptLower.includes("anxious") || promptLower.includes("anxiety") || promptLower.includes("stress");
  const hasSadness = promptLower.includes("sad") || promptLower.includes("depress") || promptLower.includes("lonely");
  const hasJoy = promptLower.includes("happy") || promptLower.includes("joy") || promptLower.includes("good");
  const hasProgress = promptLower.includes("better") || promptLower.includes("progress") || promptLower.includes("improv");

  if (hasAnxiety && hasProgress) {
    return "Looking at this week's arc, you've been carrying a real weight — anxiety has shown up frequently, especially around pressure-filled situations. What's meaningful is the pattern of self-awareness in your writing: you're noticing when anxiety arises, which is the first step to shifting it. There's a quiet resilience in your entries that deserves recognition. As you move into the coming days, the most powerful thing you can do is continue showing up — for yourself, just as you did this week.";
  }
  if (hasAnxiety) {
    return "This week has held a lot of tension for you. Anxiety has been a recurring thread — around responsibilities, uncertainty, and the pressure of what's ahead. Even so, you've kept showing up, which speaks to a deep underlying strength. Your emotional vocabulary is sharp, and that self-awareness is your greatest tool right now. Try to carve out even five minutes a day that belong only to you — no tasks, no pressure — just presence.";
  }
  if (hasSadness) {
    return "This week's entries carry a quiet heaviness — a kind of longing or disconnection that has been visiting you in waves. Sadness like this often signals that something important to you needs attention, whether it's connection, rest, or simply being heard. What stands out is your honesty with yourself, which takes genuine courage. Even in the difficult days, you are still reaching inward. That matters more than you may realize right now.";
  }
  if (hasJoy) {
    return "What a genuinely bright week you've had. Joy and hope have been real, tangible presences in your entries, and it shows. Whether it came from connection, accomplishment, or simply a good moment, you've been attuned to the positive — and that's a skill. Savor this period. Notice what specifically brought lightness and energy, because those are clues about what nourishes you most deeply.";
  }
  return "This week reflects the natural complexity of being human — a mixture of calm, challenge, and quiet moments of reflection. What stands out across your entries is a consistent effort to understand yourself and process what you're experiencing. That ongoing conversation with yourself is one of the most important investments you can make. As you move forward, carry the curiosity you've shown this week — it will continue to serve you well.";
}

// ─────────────────────────────────────────────────────────────────────────────
// Journal Deep Analysis — the richest, most dynamic simulation
// ─────────────────────────────────────────────────────────────────────────────

function generateJournalAnalysis(promptLower, rawPrompt) {
  // ── Detect emotional signals ─────────────────────────────────────────────
  const signals = {
    sadness:     /sad|depress|cry|crying|tears|hopeless|empty|numb|lost|lonely|alone|missing|grief|devastat/i.test(rawPrompt),
    anxiety:     /anxious|anxiety|panic|scared|fear|nervous|worry|worrying|overthink|overwhelm|stress|exam|test|deadline|pressure|dread/i.test(rawPrompt),
    anger:       /angry|anger|furious|frustrated|rage|annoy|irritat|mad|upset|resentment/i.test(rawPrompt),
    joy:         /happy|happiness|joy|excited|great|amazing|wonderful|good day|love|blessed|grateful|thankful|euphoric|elated|proud/i.test(rawPrompt),
    calm:        /calm|peaceful|serene|okay|fine|neutral|steady|grounded|balanced|content|quiet/i.test(rawPrompt),
    hope:        /hope|hopeful|optimistic|looking forward|better|improve|progres|future|goal|dream|believe|can do/i.test(rawPrompt),
    distress:    /hopeless|self-harm|hurt myself|end it|die|kill myself|suicide|can't go on|no point|give up on life/i.test(rawPrompt),
    exhaustion:  /tired|exhaust|burnout|drained|no energy|sleep deprived|fatigue|collapse|can't continue/i.test(rawPrompt),
    loneliness:  /lonely|alone|no one|isolated|ignored|invisible|not seen|misunderstood|disconnected/i.test(rawPrompt),
    pressure:    /exam|test|assignment|deadline|project|grade|result|fail|performance|expectation/i.test(rawPrompt),
  };

  // Count active signals
  const activeSignals = Object.entries(signals).filter(([k, v]) => v && k !== 'distress');

  // ── Build emotion array ──────────────────────────────────────────────────
  const emotions = [];
  if (signals.anxiety)    emotions.push({ label: "anxious",  score: signals.pressure ? 0.85 : 0.72 });
  if (signals.sadness)    emotions.push({ label: "sadness",  score: signals.loneliness ? 0.88 : 0.76 });
  if (signals.anger)      emotions.push({ label: "anger",    score: 0.68 });
  if (signals.joy)        emotions.push({ label: "joy",      score: signals.hope ? 0.90 : 0.78 });
  if (signals.hope)       emotions.push({ label: "hope",     score: signals.joy ? 0.75 : 0.65 });
  if (signals.calm)       emotions.push({ label: "calm",     score: 0.70 });
  if (signals.exhaustion) emotions.push({ label: "anxious",  score: 0.60 }); // exhaustion often tagged as anxious
  if (emotions.length === 0) emotions.push({ label: "calm",  score: 0.65 });

  // Sort by score descending, limit to top 4
  emotions.sort((a, b) => b.score - a.score);
  const topEmotions = emotions.slice(0, 4);

  // ── Compute wellbeing score (0–100) ─────────────────────────────────────
  let wellbeing = 60;
  if (signals.joy)        wellbeing += 20;
  if (signals.hope)       wellbeing += 15;
  if (signals.calm)       wellbeing += 10;
  if (signals.anxiety)    wellbeing -= 18;
  if (signals.sadness)    wellbeing -= 20;
  if (signals.anger)      wellbeing -= 12;
  if (signals.exhaustion) wellbeing -= 15;
  if (signals.loneliness) wellbeing -= 15;
  if (signals.distress)   wellbeing -= 30;
  wellbeing = Math.max(5, Math.min(95, Math.round(wellbeing)));

  // ── Identify emotional intensity ─────────────────────────────────────────
  let intensity = "moderate";
  if (signals.distress || wellbeing < 25) intensity = "high — crisis indicators present";
  else if (wellbeing < 40) intensity = "high";
  else if (wellbeing > 70) intensity = "low — predominantly positive";

  // ── Build triggers list ─────────────────────────────────────────────────
  const triggers = [];
  if (signals.pressure)   triggers.push("Academic or performance-related pressure");
  if (signals.loneliness) triggers.push("Social disconnection or feeling unseen");
  if (signals.exhaustion) triggers.push("Physical or emotional fatigue / burnout");
  if (signals.anger)      triggers.push("Unmet expectations or perceived injustice");
  if (signals.sadness && !triggers.length) triggers.push("Loss, disappointment, or internal heaviness");
  if (signals.anxiety && !triggers.find(t => t.includes("pressure"))) triggers.push("Uncertainty or anticipatory worry");
  if (triggers.length === 0) triggers.push("No acute external trigger detected — introspective reflection");

  // ── Build reflection ─────────────────────────────────────────────────────
  let reflection;
  if (signals.distress) {
    reflection = "Reading your words carefully, I can sense a deep and real pain right now — a kind of weight that feels immovable. Please know that what you're feeling is real, and so is the possibility of things shifting. You reached out, which took courage. I want to gently and urgently encourage you to speak with someone who can truly hold space for this — a counselor, a helpline, or someone you trust. You matter, and you deserve support beyond what I can offer here.";
  } else if (signals.anxiety && signals.sadness) {
    reflection = "Your entry reveals a complex emotional landscape — anxiety and sadness intertwined, each feeding the other. What you're navigating sounds genuinely exhausting, and I want to acknowledge how much mental energy that takes. Anxiety often shows up when something we care deeply about feels threatened, and sadness often appears when we feel disconnected — from others, from ourselves, or from what we hoped things would be. You're not falling apart; you're feeling something real. And feeling it is the first step through it.";
  } else if (signals.anxiety) {
    reflection = "Anxiety is speaking loudly in this entry — that familiar surge of what-ifs and worst-cases. It sounds like there are real pressures bearing down on you, and your nervous system is responding in the only way it knows how. I want you to know: your anxiety is not you. It's a signal, not a verdict. The very fact that you care so much is also the reason you're feeling this way. Let's work with that care, rather than fight against it.";
  } else if (signals.sadness) {
    reflection = "There's a quiet, heavy tenderness in your words today — the kind of sadness that settles in when things don't feel right, or when you feel out of reach from something or someone important. I want to hold space for that without rushing past it. Sadness isn't a problem to fix immediately; it's often a signal that something meaningful in your life needs attention. You showed incredible self-awareness in expressing this. That matters.";
  } else if (signals.joy && signals.hope) {
    reflection = "Your entry radiates something genuinely warm — there's a lightness and an openness here that is beautiful to witness. Days like this, where joy and hope are present together, are worth fully inhabiting. Notice what's working. Notice what made this possible. These aren't accidents — they're the result of conditions and choices that you can return to again and again. Savor this, and let it be a reference point.";
  } else if (signals.joy) {
    reflection = "There's a real brightness in what you've written today, and that deserves to be fully acknowledged. Joy is not a small thing — in a world that can be heavy, moments of genuine happiness are worth pausing for. Let yourself actually feel this without immediately qualifying or shrinking it. You are allowed to be happy, and that happiness is valid exactly as it is.";
  } else if (signals.anger) {
    reflection = "I can feel the frustration and intensity in your words — something has pushed up against something important to you, and you're feeling it fully. Anger is often one of the most misunderstood emotions; underneath it is almost always something deeply human: hurt, unmet expectations, or a value being violated. Your anger is valid. What matters now is understanding what it's protecting.";
  } else if (signals.calm) {
    reflection = "Today's entry carries a steadiness — a grounded, quieter energy that suggests you're in a more balanced place right now. These calm periods are incredibly valuable; they're not just nice to have, they're when your emotional reserves rebuild and your perspective clears. Notice and appreciate this steadiness, even as you remain gentle with the harder days that also come.";
  } else {
    reflection = "Sitting with your words, I notice someone who is genuinely trying to understand their inner world. There's real thoughtfulness and self-awareness in your reflection. Even when entries feel 'ordinary', the practice of pausing to check in with yourself is building something meaningful — emotional fluency, self-compassion, and resilience. You're doing this work, and it matters.";
  }

  // ── Build patterns ───────────────────────────────────────────────────────
  const patterns = [];
  if (signals.pressure && signals.anxiety) patterns.push("Performance-related anxiety: worry intensifies around tasks with external evaluation or high stakes.");
  if (signals.loneliness && signals.sadness) patterns.push("Social disconnection is amplifying emotional heaviness — connection may be a key lever for you.");
  if (signals.exhaustion) patterns.push("Fatigue is present — emotional regulation is significantly harder when physically drained.");
  if (signals.joy && signals.hope) patterns.push("Positive emotional states co-occur with forward-looking thinking — optimism is protective for you.");
  if (signals.anger) patterns.push("Frustration may be signaling an unmet need or a boundary that hasn't been expressed yet.");
  if (patterns.length === 0) {
    if (signals.calm) patterns.push("Emotional equilibrium is stable — a good moment to build new habits and consolidate wellbeing practices.");
    else patterns.push("Entry reflects a mix of everyday emotional textures — continue paying attention to subtle patterns over time.");
  }

  // ── Build tips ───────────────────────────────────────────────────────────
  const tips = [];
  if (signals.distress) {
    tips.push("⚠️ Please reach out to the Support page — professional resources and helplines are available there.");
    tips.push("Text or call one trusted person in your life right now, even just to say 'I'm having a hard time.'");
    tips.push("Do not be alone with these feelings if you can help it — human connection is the most powerful support.");
  } else {
    if (signals.anxiety) {
      tips.push("Try 5 minutes of box breathing (4-4-4-4) before the next anxiety-triggering task.");
      tips.push("Write down your top worry in one sentence, then ask: 'What is one concrete action I can take about this today?'");
    }
    if (signals.sadness) {
      tips.push("Reach out to one person you trust today — even a simple message can break isolation.");
      tips.push("Give yourself full permission to rest without guilt for the next 30 minutes.");
    }
    if (signals.exhaustion) {
      tips.push("Prioritize sleep tonight above all else — emotional resilience is deeply tied to rest quality.");
      tips.push("Reduce your task list to the absolute minimum for today. Permission granted to do less.");
    }
    if (signals.anger) {
      tips.push("Write down what specifically triggered the frustration — naming it concretely can reduce its intensity.");
      tips.push("After identifying the trigger, ask: 'What do I actually need here?' — anger often protects a need.");
    }
    if (signals.pressure) {
      tips.push("Break the overwhelming task into the smallest possible next action — just one thing, not the whole plan.");
      tips.push("Take a 5-minute physical break every 45 minutes of study or work to reset focus.");
    }
    if (signals.joy || signals.hope) {
      tips.push("Notice and name exactly what contributed to how you're feeling — these are clues to replicate.");
      tips.push("Share something positive with someone you care about today — it compounds the feeling.");
    }
    if (signals.loneliness) {
      tips.push("Reach out to someone — even a casual message — to gently re-establish connection.");
      tips.push("Consider joining a group activity or shared space; proximity to others can ease loneliness even without deep conversation.");
    }

    // Pad to at least 3 tips
    const fallbackTips = [
      "Take a 10-minute walk outside — natural light and movement reset emotional tone.",
      "Drink a full glass of water and notice one physical sensation in your body.",
      "Write down one thing that went well today, no matter how small.",
      "Practice a 2-minute self-compassion pause: place your hand on your heart and breathe slowly.",
      "Limit screen consumption for the next hour and let your mind rest quietly."
    ];
    let ti = 0;
    while (tips.length < 3 && ti < fallbackTips.length) {
      tips.push(fallbackTips[ti++]);
    }
  }

  // ── Build coping strategies ──────────────────────────────────────────────
  const coping = [];
  if (signals.anxiety || signals.pressure) {
    coping.push({ strategy: "Box Breathing", description: "4-count inhale, hold, exhale, hold — activates your parasympathetic nervous system within 2 minutes.", type: "physiological" });
    coping.push({ strategy: "Task Decomposition", description: "Break the overwhelming item into the smallest possible next action. Remove everything else from view.", type: "cognitive" });
  }
  if (signals.sadness || signals.loneliness) {
    coping.push({ strategy: "Behavioral Activation", description: "Schedule one small, enjoyable activity within the next 24 hours — even just a walk or a favourite show.", type: "behavioral" });
    coping.push({ strategy: "Social Micro-Connection", description: "Send one low-pressure message to someone you feel safe with. A single 'hey, thinking of you' counts.", type: "social" });
  }
  if (signals.anger) {
    coping.push({ strategy: "Expressive Writing", description: "Write uncensored for 5 minutes about what you're feeling — don't edit, just release onto the page.", type: "cognitive" });
    coping.push({ strategy: "Physical Reset", description: "Brief intense movement (brisk walk, jumping jacks) metabolizes stress hormones quickly.", type: "physiological" });
  }
  if (signals.exhaustion) {
    coping.push({ strategy: "Recovery Rest", description: "A 20-minute nap or eyes-closed rest with no phone can meaningfully restore cognitive and emotional function.", type: "physiological" });
  }
  if (coping.length === 0) {
    coping.push({ strategy: "Mindful Observation", description: "Spend 3 minutes simply observing your thoughts without judgment — like clouds passing.", type: "mindfulness" });
    coping.push({ strategy: "Gratitude Anchor", description: "Name three specific, concrete things that brought even a small moment of goodness today.", type: "cognitive" });
  }

  // ── Build focus line ─────────────────────────────────────────────────────
  let focus;
  if (signals.distress)   focus = "Your safety and wellbeing are the absolute priority — please reach out for support now.";
  else if (signals.anxiety && signals.pressure) focus = "One task at a time. One breath at a time. You don't have to solve it all today.";
  else if (signals.anxiety) focus = "Notice the anxiety, breathe through it, and take the one next small step.";
  else if (signals.sadness) focus = "Be extraordinarily gentle with yourself today — rest, connect, and let yourself feel.";
  else if (signals.anger)   focus = "Find the need beneath the frustration, and honor it with one honest action.";
  else if (signals.joy)     focus = "Savor this fully — notice every detail of what's making today feel good.";
  else if (signals.hope)    focus = "Lean into that forward momentum — take one step today toward what you're hoping for.";
  else if (signals.calm)    focus = "Use this steadiness wisely — build, reflect, and restore.";
  else                      focus = "Stay curious about yourself. Self-awareness is how everything changes.";

  return JSON.stringify({
    emotions: topEmotions,
    wellbeing_score: wellbeing,
    intensity: intensity,
    reflection: reflection,
    patterns: patterns,
    triggers: triggers,
    coping_strategies: coping,
    tips: tips.slice(0, 4),
    focus: focus,
    distress_flag: signals.distress
  });
}
