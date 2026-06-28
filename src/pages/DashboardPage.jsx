import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, 
  PieChart, Pie, Cell 
} from 'recharts';
import { Flame, Brain, BarChart3, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { callGemini } from '../utils/ai';
import MoodCalendar from '../components/MoodCalendar';

const EMOTION_COLORS = {
  anxious: '#F472B6', // rose/pink
  joy: '#A78BFA',     // violet
  calm: '#6EE7B7',    // emerald
  sadness: '#60A5FA', // blue
  anger: '#F87171',   // red
  hope: '#FCD34D',    // amber
  other: '#9B8EC4'    // lilac
};

const EMOTION_ICONS = {
  anxious: '😟',
  joy: '😊',
  calm: '😐',
  sadness: '😔',
  anger: '😡',
  hope: '🙂',
  other: '✨'
};

export default function DashboardPage({ streak = 0 }) {
  const [entries, setEntries] = useState([]);
  const [weeklySummary, setWeeklySummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('saha_entries') || '[]');
    setEntries(stored);
    
    // Check if we already have a cached weekly summary
    const cachedSummary = localStorage.getItem('saha_cached_weekly_summary');
    if (cachedSummary) {
      setWeeklySummary(cachedSummary);
    }
  }, []);

  // Compute stats
  const totalEntries = entries.length;

  // 1. Emotion Trend Data (Past 14 days)
  const getTrendData = () => {
    if (totalEntries === 0) return [];

    // Group all entries by calendar date (one chart point per day)
    const byDate = {};
    entries.forEach(entry => {
      const date = new Date(entry.timestamp);
      // Use a sortable key (ISO date) so we can sort chronologically
      const isoKey = date.toISOString().slice(0, 10); // "YYYY-MM-DD"
      const label = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      if (!byDate[isoKey]) {
        byDate[isoKey] = { label, emotionTotals: {}, emotionCounts: {} };
      }
      // Accumulate scores for averaging
      entry.emotions.forEach(emo => {
        const key = EMOTION_COLORS.hasOwnProperty(emo.label.toLowerCase())
          ? emo.label.toLowerCase()
          : 'other';
        byDate[isoKey].emotionTotals[key] = (byDate[isoKey].emotionTotals[key] || 0) + emo.score;
        byDate[isoKey].emotionCounts[key] = (byDate[isoKey].emotionCounts[key] || 0) + 1;
      });
    });

    // Sort by date ascending, take most recent 14 unique days
    return Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([, { label, emotionTotals, emotionCounts }]) => {
        const point = { name: label };
        // Average scores and convert to percentage — only include non-zero values
        Object.entries(emotionTotals).forEach(([key, total]) => {
          const avg = parseFloat(((total / emotionCounts[key]) * 100).toFixed(1));
          if (avg > 0) point[key] = avg;
        });
        return point;
      });
  };

  // Custom tooltip that only shows emotions with actual values
  const CustomTrendTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
    const filtered = payload.filter(p => p.value > 0);
    if (filtered.length === 0) return null;
    return (
      <div style={{
        backgroundColor: 'rgba(26, 5, 51, 0.95)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '12px',
        padding: '10px 14px',
        fontSize: '12px',
        color: '#FFF'
      }}>
        <p style={{ marginBottom: '6px', fontWeight: 700, color: '#C4B5FD' }}>{label}</p>
        {filtered.map(p => (
          <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: p.color, display: 'inline-block' }} />
            <span style={{ textTransform: 'capitalize' }}>{p.dataKey}</span>
            <span style={{ marginLeft: 'auto', fontWeight: 600, paddingLeft: '12px' }}>{p.value}%</span>
          </div>
        ))}
      </div>
    );
  };

  // 2. Mood Distribution Data
  const getDistributionData = () => {
    const counts = {};
    entries.forEach(entry => {
      entry.emotions.forEach(emo => {
        const label = emo.label.toLowerCase();
        counts[label] = (counts[label] || 0) + emo.score;
      });
    });

    return Object.entries(counts).map(([label, totalScore]) => ({
      name: label.charAt(0).toUpperCase() + label.slice(1),
      value: parseFloat((totalScore / entries.length).toFixed(2)),
      color: EMOTION_COLORS[label] || EMOTION_COLORS.other
    }));
  };

  // 3. Top Emotions
  const getTopEmotions = () => {
    const totals = {};
    const occurrences = {};
    entries.forEach(entry => {
      entry.emotions.forEach(emo => {
        const label = emo.label.toLowerCase();
        totals[label] = (totals[label] || 0) + emo.score;
        occurrences[label] = (occurrences[label] || 0) + 1;
      });
    });

    return Object.entries(totals)
      .map(([label, scoreSum]) => {
        const avg = Math.round((scoreSum / entries.length) * 100);
        return { label, avg };
      })
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 3);
  };

  // Weekly summary generator using Gemini API
  const generateWeeklySummary = async () => {
    if (entries.length === 0) return;
    setIsLoadingSummary(true);
    setSummaryError('');

    const apiKey = localStorage.getItem('saha_api_key');
    if (!apiKey) {
      setSummaryError('API key not found. Configure in Settings.');
      setIsLoadingSummary(false);
      return;
    }

    // Get last 7 entries
    const recent = entries.slice(0, 7).map(e => ({
      text: e.rawText.substring(0, 150) + '...',
      emotions: e.emotions,
      date: new Date(e.timestamp).toLocaleDateString()
    }));

    const systemPrompt = `You are Saha, a warm and emotionally intelligent wellness companion. Synthesize the user's emotional arc over their last 7 journal entries. Write a warm, compassionate, and synthetic paragraph (3-4 sentences) summarizing the themes, emotional progress, and key trends. Speak directly to the user (use 'you'). Avoid clinical terms. Keep it encouraging but realistic. Do not return any JSON or markdown.`;

    const userPrompt = `Synthesize these recent journal entries: ${JSON.stringify(recent)}`;

    try {
      const text = await callGemini(systemPrompt, userPrompt, apiKey);
      setWeeklySummary(text);
      localStorage.setItem('saha_cached_weekly_summary', text);
    } catch (err) {
      console.error(err);
      setSummaryError('Unable to generate summary. Verify API key and connection.');
    } finally {
      setIsLoadingSummary(false);
    }
  };

  // Automatic trigger on load if entries change
  useEffect(() => {
    if (entries.length > 0 && !weeklySummary && !isLoadingSummary) {
      generateWeeklySummary();
    }
  }, [entries, weeklySummary]);

  // Empty state
  if (totalEntries === 0) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-6">
        <div className="w-24 h-24 bg-brand-glow/10 border border-brand-glow/20 rounded-full flex items-center justify-center mx-auto text-4xl animate-pulse">
          📖
        </div>
        <h2 className="text-2xl font-bold text-white">Your story starts here</h2>
        <p className="text-brand-lavender text-sm max-w-md mx-auto leading-relaxed">
          There are no journal entries recorded yet. Once you submit your first journal entry, your emotional metrics, trend graphs, and custom pattern insights will appear here.
        </p>
      </div>
    );
  }

  const distributionData = getDistributionData();
  const topEmotions = getTopEmotions();
  const trendData = getTrendData();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Your Emotional Landscape</h1>
          <p className="text-brand-lavender text-sm mt-0.5">
            Deep patterns and insights mapped over time.
          </p>
        </div>

        {/* Streak tracker */}
        <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl self-start">
          <Flame className="text-amber-400 fill-amber-400" />
          <div>
            <span className="block text-[9px] font-bold text-amber-500/80 uppercase tracking-widest leading-none">Journal Streak</span>
            <span className="text-sm font-bold text-amber-200">{streak} Days Consistent</span>
          </div>
        </div>
      </div>

      {/* Mood Calendar Section */}
      <MoodCalendar entries={entries} />

      {/* Grid of stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {topEmotions.map((emo, idx) => (
          <div key={idx} className="glass-card p-6 flex items-center justify-between hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" 
                 style={{ backgroundColor: EMOTION_COLORS[emo.label] || '#A78BFA' }}></div>
            <div className="space-y-1 relative z-10">
              <span className="text-[10px] font-bold text-brand-lilac uppercase tracking-widest block">
                #{idx + 1} Emotion
              </span>
              <span className="text-2xl font-extrabold text-white capitalize flex items-center gap-2">
                <span className="drop-shadow-lg">{EMOTION_ICONS[emo.label] || '✨'}</span>
                <span>{emo.label}</span>
              </span>
            </div>
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-base border-2 shadow-[0_0_15px_rgba(0,0,0,0.2)] relative z-10"
              style={{ 
                borderColor: `${EMOTION_COLORS[emo.label] || '#A78BFA'}40`,
                backgroundColor: `${EMOTION_COLORS[emo.label] || '#A78BFA'}15`,
                color: EMOTION_COLORS[emo.label] || '#A78BFA'
              }}
            >
              {emo.avg}%
            </div>
          </div>
        ))}
      </div>

      {/* Weekly synthesis card */}
      <div className="glass-card p-6 md:p-8 space-y-4 border-l-4 border-l-brand-lavender">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Brain className="text-brand-lavender" size={20} /> Saha's Weekly Arc Synthesis
          </h3>
          <button
            onClick={generateWeeklySummary}
            disabled={isLoadingSummary}
            className="text-xs px-3 py-1.5 glass-button font-semibold"
          >
            {isLoadingSummary ? 'Analyzing...' : 'Regenerate'}
          </button>
        </div>

        {isLoadingSummary ? (
          <div className="space-y-2 animate-pulse py-2">
            <div className="h-3 bg-white/10 rounded-full w-full"></div>
            <div className="h-3 bg-white/10 rounded-full w-5/6"></div>
            <div className="h-3 bg-white/10 rounded-full w-4/5"></div>
          </div>
        ) : summaryError ? (
          <div className="text-xs text-red-200/90 flex items-center gap-1.5 bg-red-950/20 p-3 rounded-lg border border-red-500/10">
            <AlertCircle size={14} /> {summaryError}
          </div>
        ) : (
          <p className="text-brand-light leading-relaxed font-medium">
            {weeklySummary || "Write a few journals to synthesize your emotional patterns."}
          </p>
        )}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Line Chart */}
        <div className="glass-card p-6 lg:col-span-2 space-y-4 hover:shadow-[0_0_25px_rgba(167,139,250,0.1)] transition-shadow duration-300">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar size={18} className="text-brand-glow" /> 14-Day Emotional Trend
          </h3>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#9B8EC4" />
                <YAxis stroke="#9B8EC4" domain={[0, 100]} />
                <Tooltip content={<CustomTrendTooltip />} />
                <Legend iconType="circle" />
                {Object.entries(EMOTION_COLORS).map(([key, color]) => (
                  <Line 
                    key={key}
                    type="monotone" 
                    dataKey={key} 
                    stroke={color} 
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 1 }}
                    activeDot={{ r: 5 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="glass-card p-6 space-y-4 hover:shadow-[0_0_25px_rgba(167,139,250,0.1)] transition-shadow duration-300">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 size={18} className="text-brand-glow" /> Mood Distribution Share
          </h3>
          <div className="h-60 w-full relative flex items-center justify-center text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${Math.round(value * 100)}%`, 'Proportion']}
                  contentStyle={{ 
                    backgroundColor: 'rgba(26, 5, 51, 0.9)', 
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    color: '#FFF'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{totalEntries}</span>
              <span className="text-[10px] text-brand-lilac uppercase font-semibold">Entries</span>
            </div>
          </div>

          {/* Custom legend */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {distributionData.map((entry, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-brand-light font-medium truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
