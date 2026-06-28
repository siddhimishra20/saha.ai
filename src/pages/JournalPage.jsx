import React, { useState } from 'react';
import {
  Sparkles, HeartHandshake, AlertTriangle, AlertCircle,
  Brain, Target, Zap, Shield, TrendingUp, Activity, ChevronRight, Folder
} from 'lucide-react';
import { callGemini } from '../utils/ai';

const EMOJIS = [
  { char: '😔', label: 'sad' },
  { char: '😟', label: 'anxious' },
  { char: '😐', label: 'calm' },
  { char: '🙂', label: 'hopeful' },
  { char: '😊', label: 'joy' }
];

const EMOTION_COLORS = {
  anxious:  { bg: 'bg-rose-500/15',   border: 'border-rose-500/30',   text: 'text-rose-300',   bar: 'bg-rose-400' },
  sadness:  { bg: 'bg-blue-500/15',   border: 'border-blue-500/30',   text: 'text-blue-300',   bar: 'bg-blue-400' },
  anger:    { bg: 'bg-red-500/15',    border: 'border-red-500/30',    text: 'text-red-300',    bar: 'bg-red-400' },
  joy:      { bg: 'bg-violet-500/15', border: 'border-violet-500/30', text: 'text-violet-300', bar: 'bg-violet-400' },
  hope:     { bg: 'bg-amber-500/15',  border: 'border-amber-500/30',  text: 'text-amber-300',  bar: 'bg-amber-400' },
  calm:     { bg: 'bg-emerald-500/15',border: 'border-emerald-500/30',text: 'text-emerald-300',bar: 'bg-emerald-400' },
  other:    { bg: 'bg-purple-500/15', border: 'border-purple-500/30', text: 'text-purple-300', bar: 'bg-purple-400' },
};

function getEmotionStyle(label) {
  return EMOTION_COLORS[label?.toLowerCase()] || EMOTION_COLORS.other;
}

function WellbeingMeter({ score }) {
  const pct = Math.max(0, Math.min(100, score));
  let color = 'bg-emerald-400';
  let label = 'Positive';
  if (pct < 35) { color = 'bg-red-400'; label = 'Needs Care'; }
  else if (pct < 55) { color = 'bg-amber-400'; label = 'Moderate'; }
  else if (pct < 75) { color = 'bg-teal-400'; label = 'Good'; }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-brand-lilac uppercase tracking-wider">Wellbeing Score</span>
        <span className="font-extrabold text-white text-base">{pct}<span className="text-brand-lilac text-xs font-normal">/100</span></span>
      </div>
      <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-semibold ${
        pct < 35 ? 'text-red-300' : pct < 55 ? 'text-amber-300' : pct < 75 ? 'text-teal-300' : 'text-emerald-300'
      }`}>{label}</span>
    </div>
  );
}

function EmotionBar({ emotion }) {
  const style = getEmotionStyle(emotion.label);
  const pct = Math.round((emotion.score || 0) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className={`font-semibold capitalize ${style.text}`}>{emotion.label}</span>
        <span className="text-brand-lilac font-mono">{pct}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${style.bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function JournalPage({ onEntrySaved, setView }) {
  const [inputText, setInputText]       = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [folderName, setFolderName]     = useState('');
  const [existingFolders, setExistingFolders] = useState([]);
  const [isLoading, setIsLoading]       = useState(false);
  const [errorMsg, setErrorMsg]         = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  React.useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('saha_entries') || '[]');
    const folders = [...new Set(stored.map(e => e.folder).filter(Boolean))];
    setExistingFolders(folders);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setErrorMsg('');
    setAnalysisResult(null);

    const apiKey   = localStorage.getItem('saha_api_key');
    const userName = localStorage.getItem('saha_user_name') || 'Friend';

    if (!apiKey) {
      setErrorMsg('Please configure your Gemini API Key in Settings to submit journal entries.');
      setIsLoading(false);
      return;
    }

    const systemPrompt = `You are Saha, a deeply empathetic and emotionally intelligent wellness companion. You are not a therapist, but a compassionate guide who helps people understand their emotional landscape with nuance, warmth, and psychological insight.

Analyze the user's journal entry comprehensively and return ONLY raw, valid JSON with NO markdown, NO backticks, NO explanatory text outside the JSON — just the JSON object itself.

The JSON must follow this exact schema:
{
  "emotions": [
    {"label": "anxious", "score": 0.78},
    {"label": "hopeful", "score": 0.34}
  ],
  "wellbeing_score": 52,
  "intensity": "moderate",
  "reflection": "A warm, personal, 3-4 sentence empathetic response that truly speaks to what the person shared. Address them directly. Validate before advising. Show genuine understanding of the specifics they mentioned.",
  "patterns": [
    "One observed emotional or behavioral pattern from this entry",
    "A second distinct pattern if present"
  ],
  "triggers": [
    "Specific identified trigger for the emotional state",
    "Second trigger if present"
  ],
  "coping_strategies": [
    {
      "strategy": "Name of strategy",
      "description": "Clear, actionable description of how to apply it right now",
      "type": "physiological | cognitive | behavioral | social | mindfulness"
    }
  ],
  "tips": [
    "Highly specific, actionable tip for today based on what they shared",
    "Second tip",
    "Third tip"
  ],
  "focus": "One powerful, resonant sentence as their focus for today",
  "distress_flag": false
}

Rules:
- emotions: 1 to 4 emotions, labels from: anxious, joy, sadness, calm, anger, hope. Scores between 0.0 and 1.0. Sort by score descending.
- wellbeing_score: integer 0–100 reflecting overall emotional state (higher = better). Be accurate, not optimistic.
- intensity: one of "low", "moderate", "high", "high — crisis indicators present"
- reflection: must be specific to their entry, NOT generic. Reference what they actually said.
- patterns: 1–3 patterns. Be observational and insightful, not judgmental.
- triggers: 1–3 specific triggers identified from the text.
- coping_strategies: 2–3 strategies tailored to the emotions detected. Make them immediately actionable.
- tips: exactly 3 practical, same-day actions. Be specific to their situation.
- focus: one sentence, direct, affirming, and specific to their emotional state.
- distress_flag: true ONLY if explicit self-harm, suicidal ideation, or severe crisis language is present.`;

    const userPrompt = `User's Name: ${userName}
Mood emoji they selected: ${selectedEmoji || 'Not selected'}
Journal entry (analyze this carefully):

"${inputText}"`;

    try {
      const textResponse = await callGemini(systemPrompt, userPrompt, apiKey);

      // Strip any markdown code fences
      const cleaned = textResponse.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
      const result  = JSON.parse(cleaned);

      const newEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        rawText: inputText,
        emoji: selectedEmoji,
        emotions:          result.emotions         || [],
        wellbeing_score:   result.wellbeing_score  ?? 60,
        intensity:         result.intensity        || 'moderate',
        reflection:        result.reflection       || '',
        patterns:          result.patterns         || [],
        triggers:          result.triggers         || [],
        coping_strategies: result.coping_strategies || [],
        tips:              result.tips             || [],
        focus:             result.focus            || '',
        distress_flag:     result.distress_flag    || false,
        folder:            folderName.trim()       || 'General',
      };

      const stored = JSON.parse(localStorage.getItem('saha_entries') || '[]');
      stored.unshift(newEntry);
      localStorage.setItem('saha_entries', JSON.stringify(stored));

      setAnalysisResult(newEntry);
      setInputText('');
      setSelectedEmoji('');
      setFolderName('');
      onEntrySaved();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to analyze entry. Please verify your API Key or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Daily Journal</h1>
        <p className="text-brand-lavender text-sm mt-1">
          Take a moment to check in with yourself. Your thoughts are completely private.
        </p>
      </div>

      {/* Distress Banner */}
      {analysisResult?.distress_flag && (
        <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-red-200">Saha noticed you might be going through something heavy.</h4>
            <p className="text-xs text-red-300/80 mt-1">
              You don't have to face it alone. Dedicated professional helplines and resources are on our Support page.
            </p>
            <button
              onClick={() => setView('support')}
              className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-xl text-xs font-bold text-red-200 transition"
            >
              Get Crisis Support <HeartHandshake size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-6">
        <div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="How are you feeling today? Tell me anything — the more you share, the more detailed and personal your analysis will be..."
            rows={6}
            className="w-full p-4 glass-input text-base placeholder-brand-lilac/50 focus:ring-1 focus:ring-brand-glow"
            maxLength={2500}
            required
          />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 gap-3">
            <div className="flex items-center gap-2">
              <Folder size={14} className="text-brand-lilac" />
              <input
                type="text"
                list="folder-options"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Save to folder (e.g., Personal, Work)"
                className="bg-transparent border-none text-sm text-white placeholder-brand-lilac/50 focus:outline-none w-48"
              />
              <datalist id="folder-options">
                {existingFolders.map(f => (
                  <option key={f} value={f} />
                ))}
              </datalist>
            </div>
            <div className="flex justify-between items-center text-xs text-brand-lilac">
              <span>All entries are saved locally.</span>
              <span className="ml-2">{inputText.length}/2500</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-5">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-brand-lilac">Mood Indicator:</span>
            <div className="flex gap-2">
              {EMOJIS.map((emoji) => (
                <button
                  type="button"
                  key={emoji.char}
                  onClick={() => setSelectedEmoji(emoji.char)}
                  className={`text-2xl p-1.5 rounded-xl transition-all duration-200 hover:scale-125 ${
                    selectedEmoji === emoji.char
                      ? 'bg-brand-glow/20 border border-brand-glow/40 scale-110'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                  title={emoji.label}
                >
                  {emoji.char}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="w-full sm:w-auto px-6 py-3.5 bg-brand-glow disabled:bg-white/10 disabled:text-brand-lilac hover:bg-brand-lavender text-brand-deep font-bold rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(167,139,250,0.2)]"
          >
            <Sparkles size={16} />
            Analyze My Entry
          </button>
        </div>
      </form>

      {/* Loading */}
      {isLoading && (
        <div className="glass-card p-10 flex flex-col items-center justify-center space-y-5">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-4 border-brand-glow border-t-transparent animate-spin" />
            <span className="absolute inset-0 flex items-center justify-center text-xl">✨</span>
          </div>
          <div className="text-center space-y-1">
            <p className="text-brand-light font-semibold text-sm">Saha is reading between the lines...</p>
            <p className="text-brand-lilac text-xs">Building your personalised emotional analysis report</p>
          </div>
        </div>
      )}

      {/* Error */}
      {errorMsg && (
        <div className="p-4 bg-red-950/20 border border-red-500/20 text-red-200 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      {/* ─── ANALYSIS REPORT ─────────────────────────────────────────────── */}
      {analysisResult && (
        <div className="space-y-5 animate-slide-up">

          {/* Report Header */}
          <div className="glass-card p-6 md:p-8 border-l-4 border-l-brand-glow space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-lilac tracking-widest">
                  Emotional Analysis Report
                </span>
                <h3 className="text-xl font-extrabold text-white mt-0.5 flex items-center gap-2">
                  <Brain size={20} className="text-brand-glow" /> Saha's Deep Analysis
                </h3>
                <p className="text-xs text-brand-lilac mt-1">
                  {new Date(analysisResult.timestamp).toLocaleString(undefined, {
                    weekday: 'long', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
              {/* Intensity badge */}
              {analysisResult.intensity && (
                <span className={`self-start px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${
                  analysisResult.intensity.includes('crisis')
                    ? 'bg-red-500/20 border-red-500/40 text-red-200'
                    : analysisResult.intensity === 'high'
                    ? 'bg-orange-500/20 border-orange-500/40 text-orange-200'
                    : analysisResult.intensity === 'moderate'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-200'
                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
                }`}>
                  {analysisResult.intensity} intensity
                </span>
              )}
            </div>

            {/* Wellbeing meter */}
            <WellbeingMeter score={analysisResult.wellbeing_score ?? 60} />
          </div>

          {/* Emotion Breakdown */}
          {analysisResult.emotions?.length > 0 && (
            <div className="glass-card p-6 space-y-4">
              <h4 className="text-xs uppercase font-extrabold text-brand-lilac tracking-widest flex items-center gap-2">
                <Activity size={14} /> Detected Emotions
              </h4>
              <div className="space-y-3">
                {analysisResult.emotions.map((emo, i) => (
                  <EmotionBar key={i} emotion={emo} />
                ))}
              </div>
            </div>
          )}

          {/* Empathetic Reflection */}
          <div className="glass-card p-6 space-y-3 border-l-4 border-l-brand-lavender">
            <h4 className="text-xs uppercase font-extrabold text-brand-lilac tracking-widest flex items-center gap-2">
              <HeartHandshake size={14} /> Saha's Personal Reflection
            </h4>
            <p className="text-brand-light leading-loose text-sm font-medium">
              "{analysisResult.reflection}"
            </p>
          </div>

          {/* Patterns & Triggers — side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Identified Patterns */}
            {analysisResult.patterns?.length > 0 && (
              <div className="glass-card p-6 space-y-3">
                <h4 className="text-xs uppercase font-extrabold text-brand-lilac tracking-widest flex items-center gap-2">
                  <TrendingUp size={14} /> Emotional Patterns
                </h4>
                <ul className="space-y-2.5">
                  {analysisResult.patterns.map((p, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-brand-light/90 leading-relaxed">
                      <span className="text-brand-lavender mt-0.5 flex-shrink-0">◆</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Identified Triggers */}
            {analysisResult.triggers?.length > 0 && (
              <div className="glass-card p-6 space-y-3">
                <h4 className="text-xs uppercase font-extrabold text-brand-lilac tracking-widest flex items-center gap-2">
                  <Zap size={14} /> Identified Triggers
                </h4>
                <ul className="space-y-2.5">
                  {analysisResult.triggers.map((t, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-brand-light/90 leading-relaxed">
                      <span className="text-amber-400 mt-0.5 flex-shrink-0">⚡</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Coping Strategies */}
          {analysisResult.coping_strategies?.length > 0 && (
            <div className="glass-card p-6 space-y-4">
              <h4 className="text-xs uppercase font-extrabold text-brand-lilac tracking-widest flex items-center gap-2">
                <Shield size={14} /> Personalised Coping Strategies
              </h4>
              <div className="space-y-3">
                {analysisResult.coping_strategies.map((cs, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 bg-white/3 rounded-xl border border-white/5">
                    <div className="flex-shrink-0 mt-0.5">
                      <span className={`inline-block px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest rounded-full border ${
                        cs.type === 'physiological' ? 'bg-teal-500/20 border-teal-500/30 text-teal-300' :
                        cs.type === 'cognitive'     ? 'bg-violet-500/20 border-violet-500/30 text-violet-300' :
                        cs.type === 'behavioral'    ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' :
                        cs.type === 'social'        ? 'bg-pink-500/20 border-pink-500/30 text-pink-300' :
                                                      'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                      }`}>
                        {cs.type || 'general'}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-white">{cs.strategy}</p>
                      <p className="text-xs text-brand-light/80 leading-relaxed">{cs.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Tips */}
          {analysisResult.tips?.length > 0 && (
            <div className="glass-card p-6 space-y-4">
              <h4 className="text-xs uppercase font-extrabold text-brand-lilac tracking-widest flex items-center gap-2">
                <Target size={14} /> Today's Action Plan
              </h4>
              <ol className="space-y-3">
                {analysisResult.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-brand-light/90 leading-relaxed">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-glow/15 border border-brand-glow/30 text-brand-glow text-[11px] font-extrabold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Focus for Today */}
          {analysisResult.focus && (
            <div className="p-5 md:p-6 bg-gradient-to-br from-brand-glow/10 to-brand-lavender/5 border border-brand-glow/20 rounded-2xl text-center space-y-1.5 shadow-[0_0_20px_rgba(167,139,250,0.08)]">
              <span className="text-[10px] uppercase font-extrabold text-brand-glow tracking-widest block">
                ✦ Your Focus for Today ✦
              </span>
              <p className="text-white font-bold text-base leading-snug">
                "{analysisResult.focus}"
              </p>
            </div>
          )}

          {/* Support CTA (non-crisis) */}
          {!analysisResult.distress_flag && (
            <button
              onClick={() => setView('support')}
              className="w-full p-4 glass-card hover:border-brand-glow/20 text-left flex items-center justify-between group transition"
            >
              <div className="flex items-center gap-3">
                <HeartHandshake size={18} className="text-brand-glow" />
                <div>
                  <p className="text-sm font-bold text-white">Need a grounding exercise?</p>
                  <p className="text-xs text-brand-lilac">Visit the Support page for breathing exercises and crisis resources.</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-brand-lilac group-hover:text-brand-glow transition" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
