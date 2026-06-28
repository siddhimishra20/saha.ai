import React, { useState, useEffect } from 'react';
import { HeartHandshake, AlertCircle, Phone, Globe, User, Edit3, MessageCircle, Sparkles } from 'lucide-react';
import { callGemini } from '../utils/ai';

export default function SupportPage() {
  const [sosExpanded, setSosExpanded] = useState(false);
  const [counselorName, setCounselorName] = useState('');
  const [counselorContact, setCounselorContact] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  
  // Grounding playground state
  const [concern, setConcern] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [groundingExercise, setGroundingExercise] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setCounselorName(localStorage.getItem('saha_counselor_name') || '');
    setCounselorContact(localStorage.getItem('saha_counselor_contact') || '');
    setEmergencyName(localStorage.getItem('saha_emergency_name') || '');
    setEmergencyPhone(localStorage.getItem('saha_emergency_phone') || '');
  }, []);

  const handleUpdateContact = (key, value) => {
    localStorage.setItem(key, value);
    if (key === 'saha_counselor_name') setCounselorName(value);
    if (key === 'saha_counselor_contact') setCounselorContact(value);
    if (key === 'saha_emergency_name') setEmergencyName(value);
    if (key === 'saha_emergency_phone') setEmergencyPhone(value);
  };

  const handleGetGrounding = async (e) => {
    e.preventDefault();
    if (!concern.trim()) return;

    setIsAnalyzing(true);
    setGroundingExercise('');
    setErrorMsg('');

    const apiKey = localStorage.getItem('saha_api_key');
    if (!apiKey) {
      setErrorMsg('Please configure your Gemini API Key in Settings to get support responses.');
      setIsAnalyzing(false);
      return;
    }

    const systemPrompt = `You are Saha, a warm and emotionally intelligent wellness companion. The user is feeling overwhelmed or distressed.
Validate their feelings warmly and briefly (1-2 sentences), then guide them through an interactive, step-by-step grounding exercise (such as box breathing, 5-4-3-2-1 sensory technique, progressive muscle relaxation, or cognitive redirection).
Format your response clearly using headers and list bullet points so it is easy to read while anxious. Keep it focused, practical, and deeply calming.`;

    try {
      const text = await callGemini(systemPrompt, `I am struggling with: "${concern}"`, apiKey);
      setGroundingExercise(text);
    } catch (err) {
      setErrorMsg('Unable to retrieve grounding exercise. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">You are never alone</h1>
        <p className="text-brand-lavender text-sm mt-0.5">
          Reach out, center your breath, or connect with resources when things get heavy.
        </p>
      </div>

      {/* SOS Banner */}
      <div className="p-1 rounded-2xl bg-gradient-to-r from-red-600 via-purple-700 to-brand-deep shadow-[0_0_20px_rgba(239,68,68,0.2)]">
        <div className="bg-cosmic-dark/90 backdrop-blur-md p-6 rounded-[15px] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="text-lg font-bold text-red-200">Need immediate support?</h3>
                <p className="text-xs text-brand-lavender">
                  If you are in immediate danger or distress, contact a helpline right away.
                </p>
              </div>
            </div>
            <button
              onClick={() => setSosExpanded(!sosExpanded)}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl transition duration-200"
            >
              {sosExpanded ? 'Hide Helplines' : 'Expand Helplines'}
            </button>
          </div>

          {/* Expanded SOS Resources */}
          {sosExpanded && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 animate-slide-down">
              <div className="glass-card p-4 flex gap-3 items-start">
                <Phone className="text-red-400 mt-0.5 flex-shrink-0" size={18} />
                <div>
                  <h4 className="font-bold text-white text-sm">UAE Mental Health Helpline</h4>
                  <p className="text-xs text-brand-lilac mt-0.5">24/7 Government Helpline</p>
                  <a href="tel:8004673" className="block text-brand-glow font-bold mt-2 text-sm">
                    800-HOPE (4673)
                  </a>
                </div>
              </div>

              <div className="glass-card p-4 flex gap-3 items-start">
                <Phone className="text-red-400 mt-0.5 flex-shrink-0" size={18} />
                <div>
                  <h4 className="font-bold text-white text-sm">Dubai Wellbeing Line</h4>
                  <p className="text-xs text-brand-lilac mt-0.5">Helpline for Dubai Residents</p>
                  <a href="tel:8004673" className="block text-brand-glow font-bold mt-2 text-sm">
                    800-4673
                  </a>
                </div>
              </div>

              <div className="glass-card p-4 sm:col-span-2 flex gap-3 items-start">
                <Globe className="text-red-400 mt-0.5 flex-shrink-0" size={18} />
                <div>
                  <h4 className="font-bold text-white text-sm">International Directories</h4>
                  <p className="text-xs text-brand-lilac mt-0.5">
                    Find crisis centers outside the UAE via the International Association for Suicide Prevention (IASP).
                  </p>
                  <a 
                    href="https://www.iasp.info/resources/Crisis_Centres/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="block text-brand-glow font-bold mt-2 text-sm underline"
                  >
                    iasp.info/resources/Crisis_Centres/
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editable Contact Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Counselor */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <User size={18} className="text-brand-glow" /> My University Counselor
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-brand-lilac mb-1">Name</label>
              <input
                type="text"
                value={counselorName}
                onChange={(e) => handleUpdateContact('saha_counselor_name', e.target.value)}
                placeholder="Name of your counselor..."
                className="w-full p-2.5 glass-input text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-brand-lilac mb-1">Contact Email / Phone</label>
              <input
                type="text"
                value={counselorContact}
                onChange={(e) => handleUpdateContact('saha_counselor_contact', e.target.value)}
                placeholder="How to reach them..."
                className="w-full p-2.5 glass-input text-xs"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Phone size={18} className="text-brand-glow" /> My Emergency Contact
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-brand-lilac mb-1">Contact Name</label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => handleUpdateContact('saha_emergency_name', e.target.value)}
                placeholder="Parent, partner, friend..."
                className="w-full p-2.5 glass-input text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-brand-lilac mb-1">Phone Number</label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => handleUpdateContact('saha_emergency_phone', e.target.value)}
                placeholder="Phone number..."
                className="w-full p-2.5 glass-input text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grounding playground */}
      <div className="glass-card p-6 md:p-8 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <MessageCircle size={20} className="text-brand-glow" /> Journal with Grounding
        </h3>
        <p className="text-brand-lavender text-xs">
          Describe exactly what you are feeling or the anxiety you are currently facing. Saha will guide you through a custom grounding exercise.
        </p>

        <form onSubmit={handleGetGrounding} className="space-y-4">
          <textarea
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            disabled={isAnalyzing}
            placeholder="e.g. I am having a panic attack about my upcoming presentation..."
            rows={3}
            className="w-full p-3.5 glass-input text-sm focus:ring-1 focus:ring-brand-glow"
            required
          />

          <button
            type="submit"
            disabled={isAnalyzing || !concern.trim()}
            className="w-full py-3 bg-brand-glow hover:bg-brand-lavender text-brand-deep disabled:bg-white/10 disabled:text-brand-lilac font-bold text-sm rounded-xl transition duration-200 flex items-center justify-center gap-2"
          >
            <Sparkles size={16} />
            {isAnalyzing ? 'Crafting exercise...' : 'Begin Grounding Exercise'}
          </button>
        </form>

        {errorMsg && (
          <div className="text-xs text-red-200/90 flex items-center gap-1.5 bg-red-950/20 p-3 rounded-lg border border-red-500/10">
            <AlertCircle size={14} /> {errorMsg}
          </div>
        )}

        {/* Display Grounding Output */}
        {groundingExercise && (
          <div className="p-5 md:p-6 bg-brand-glow/5 border border-brand-glow/10 rounded-xl space-y-4 animate-slide-up">
            <h4 className="text-xs font-bold text-brand-glow uppercase tracking-wider">Grounding Guidance</h4>
            <div className="text-sm text-brand-light leading-relaxed whitespace-pre-line space-y-3">
              {groundingExercise}
            </div>
          </div>
        )}
      </div>

      {/* Soft Disclaimer */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center text-xs text-brand-lilac leading-relaxed">
        <strong>⚠️ Clinical Disclaimer:</strong> Saha.ai is a wellness companion and self-reflection tool, not a clinical diagnostic resource, therapist, or medical service. If you are struggling with chronic or severe mental health conditions, please reach out to licensed professional counselors or healthcare systems.
      </div>
    </div>
  );
}
