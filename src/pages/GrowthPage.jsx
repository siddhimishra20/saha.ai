import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Award, Heart, CheckCircle2, RotateCw, AlertCircle } from 'lucide-react';
import { callGemini } from '../utils/ai';

export default function GrowthPage() {
  const [entries, setEntries] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('saha_entries') || '[]');
    setEntries(stored);
    
    const cachedRecs = localStorage.getItem('saha_cached_recommendations');
    if (cachedRecs) {
      try {
        setRecommendations(JSON.parse(cachedRecs));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const fetchRecommendations = async () => {
    if (entries.length === 0) return;
    setIsLoading(true);
    setErrorMsg('');

    const apiKey = localStorage.getItem('saha_api_key');
    if (!apiKey) {
      setErrorMsg('Please configure your Gemini API Key in Settings to get growth insights.');
      setIsLoading(false);
      return;
    }

    // Get last 5 entries
    const recent = entries.slice(0, 5).map(e => ({
      text: e.rawText,
      emotions: e.emotions,
      date: e.timestamp
    }));

    const systemPrompt = `You are Saha, a warm and emotionally intelligent wellness companion. You analyze the user's recent journal entries and generate a personalized growth roadmap.
You MUST respond with raw JSON only, matching this structure exactly (no markdown backticks, no markdown formatting):
{
  "patterns": [
    "Observation 1 about your emotional triggers or states.",
    "Observation 2 about how your moods fluctuate.",
    "Observation 3 about how you are managing stress."
  ],
  "focusAreas": [
    {
      "domain": "Domain Name (e.g. Sleep / Social Connection)",
      "reason": "Why this domain is flagged based on what you wrote."
    },
    {
      "domain": "Domain Name 2",
      "reason": "Why this domain is flagged."
    }
  ],
  "habits": [
    "Micro-habit 1 (small, under 5 minutes)",
    "Micro-habit 2",
    "Micro-habit 3",
    "Micro-habit 4",
    "Micro-habit 5"
  ],
  "affirmations": [
    "Affirmation 1 connected to their themes",
    "Affirmation 2",
    "Affirmation 3"
  ]
}`;

    const userPrompt = `Generate a growth plan based on these journal entries: ${JSON.stringify(recent)}`;

    try {
      const textResponse = await callGemini(systemPrompt, userPrompt, apiKey);
      
      // Clean markdown code blocks
      const cleanedText = textResponse.replace(/```json/gi, '').replace(/```/g, '').trim();

      const result = JSON.parse(cleanedText);
      setRecommendations(result);
      localStorage.setItem('saha_cached_recommendations', JSON.stringify(result));
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to generate roadmap. Please check your connection or API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (entries.length > 0 && !recommendations && !isLoading) {
      fetchRecommendations();
    }
  }, [entries, recommendations]);

  if (entries.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-6">
        <div className="w-24 h-24 bg-brand-glow/10 border border-brand-glow/20 rounded-full flex items-center justify-center mx-auto text-4xl animate-pulse">
          🌱
        </div>
        <h2 className="text-2xl font-bold text-white">Cultivate your path</h2>
        <p className="text-brand-lavender text-sm max-w-md mx-auto leading-relaxed">
          Your personalized recommendations, daily micro-habits, and reflections require at least one journal entry to start identifying patterns.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-16 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter drop-shadow-xl">
            Growth Space
          </h1>
          <p className="text-brand-lilac text-base font-medium max-w-md">
            Compassionate roadmaps built from the patterns in your writing history.
          </p>
        </div>

        <button
          onClick={fetchRecommendations}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition duration-300 self-start text-sm border border-white/10 backdrop-blur-md shadow-lg"
        >
          <RotateCw size={16} className={isLoading ? 'animate-spin text-brand-glow' : 'text-brand-glow'} />
          {isLoading ? 'Regenerating...' : 'Refresh Roadmap'}
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-950/20 border border-red-500/20 text-red-200 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="glass-card p-6 space-y-3 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-1/3 mb-4"></div>
              <div className="h-3 bg-white/10 rounded w-full"></div>
              <div className="h-3 bg-white/10 rounded w-5/6"></div>
              <div className="h-3 bg-white/10 rounded w-4/5"></div>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations Content */}
      {!isLoading && recommendations && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Patterns Card */}
          <div className="glass-card glass-card-hover p-8 sm:p-10 space-y-8 group">
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-glow/10 border border-brand-glow/20 flex items-center justify-center text-brand-glow">
                <Brain size={24} />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Emotional Patterns</h3>
            </div>
            <ul className="space-y-6">
              {recommendations.patterns?.map((pattern, idx) => (
                <li key={idx} className="flex gap-4 text-brand-light leading-relaxed font-medium">
                  <span className="text-brand-glow/70 mt-1">✦</span>
                  <span className="text-sm sm:text-base">{pattern}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Focus Areas Card */}
          <div className="glass-card glass-card-hover p-8 sm:p-10 space-y-8 group">
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Focus Areas</h3>
            </div>
            <div className="space-y-6">
              {recommendations.focusAreas?.map((area, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="text-base font-bold text-blue-300 capitalize flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    {area.domain}
                  </h4>
                  <p className="text-sm text-brand-lilac/80 leading-relaxed pl-3.5 border-l-2 border-white/5">
                    {area.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Micro Habits Card */}
          <div className="glass-card glass-card-hover p-8 sm:p-10 space-y-8 group">
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Micro-habits</h3>
            </div>
            <ul className="space-y-5">
              {recommendations.habits?.map((habit, idx) => (
                <li key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                  <span className="text-xs w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-brand-light font-medium leading-relaxed">{habit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Affirmations Card */}
          <div className="glass-card glass-card-hover p-8 sm:p-10 space-y-8 group">
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Affirmations</h3>
            </div>
            <div className="space-y-4">
              {recommendations.affirmations?.map((aff, idx) => (
                <div key={idx} className="p-6 bg-gradient-to-r from-pink-500/5 to-transparent border-l-4 border-pink-500/30 rounded-r-2xl text-base text-white font-medium italic shadow-sm">
                  "{aff}"
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
