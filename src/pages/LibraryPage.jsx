import React, { useState, useEffect } from 'react';
import { Folder, FolderOpen, ArrowLeft, Calendar, Brain, Clock } from 'lucide-react';

export default function LibraryPage() {
  const [entries, setEntries] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('saha_entries') || '[]');
    // Ensure all entries have a folder, default to 'General'
    const normalized = stored.map(e => ({ ...e, folder: e.folder || 'General' }));
    setEntries(normalized);
  }, []);

  // Group entries by folder
  const folders = entries.reduce((acc, entry) => {
    if (!acc[entry.folder]) {
      acc[entry.folder] = [];
    }
    acc[entry.folder].push(entry);
    return acc;
  }, {});

  const folderNames = Object.keys(folders).sort();

  if (entries.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-6">
        <div className="w-24 h-24 bg-brand-glow/10 border border-brand-glow/20 rounded-full flex items-center justify-center mx-auto text-4xl animate-pulse">
          📚
        </div>
        <h2 className="text-2xl font-bold text-white">Your library is empty</h2>
        <p className="text-brand-lavender text-sm max-w-md mx-auto leading-relaxed">
          Start journaling to build your personal library of thoughts and emotions.
        </p>
      </div>
    );
  }

  // Folder View
  if (!selectedFolder) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Personal Library</h1>
            <p className="text-brand-lavender text-sm mt-0.5">
              Your categorized journal entries and reflections.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {folderNames.map(folderName => {
            const folderEntries = folders[folderName];
            const recentDate = new Date(folderEntries[0].timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
            return (
              <div 
                key={folderName}
                onClick={() => setSelectedFolder(folderName)}
                className="glass-card p-6 cursor-pointer hover:-translate-y-1 transition duration-300 group flex flex-col items-center text-center gap-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-brand-glow/10 border border-brand-glow/20 flex items-center justify-center text-brand-glow group-hover:scale-110 group-hover:bg-brand-glow/20 transition duration-300">
                  <Folder size={32} strokeWidth={1.5} className="group-hover:hidden" />
                  <FolderOpen size={32} strokeWidth={1.5} className="hidden group-hover:block" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-glow transition">{folderName}</h3>
                  <p className="text-xs text-brand-lilac mt-1 font-medium">{folderEntries.length} {folderEntries.length === 1 ? 'entry' : 'entries'}</p>
                </div>
                <div className="w-full pt-4 mt-auto border-t border-white/5 flex items-center justify-center gap-1.5 text-[10px] text-brand-lilac font-semibold uppercase tracking-wider">
                  <Clock size={12} /> Last active {recentDate}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Entry List View for a selected folder
  const currentFolderEntries = folders[selectedFolder];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <button 
          onClick={() => setSelectedFolder(null)}
          className="p-2 rounded-xl glass-button text-brand-lilac hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <span className="text-[10px] uppercase font-bold text-brand-lilac tracking-widest block">
            Folder
          </span>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <FolderOpen size={24} className="text-brand-glow" /> {selectedFolder}
          </h1>
        </div>
      </div>

      <div className="space-y-6">
        {currentFolderEntries.map(entry => (
          <div key={entry.id} className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl">
                  {entry.emoji || '📝'}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Calendar size={14} className="text-brand-glow" />
                    {new Date(entry.timestamp).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h3>
                  <p className="text-xs text-brand-lilac mt-0.5">
                    {new Date(entry.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full border ${
                entry.intensity === 'high' ? 'bg-orange-500/20 border-orange-500/30 text-orange-300' :
                entry.intensity === 'moderate' ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' :
                'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
              }`}>
                {entry.intensity || 'moderate'} intensity
              </span>
            </div>
            
            <p className="text-brand-light text-sm leading-relaxed whitespace-pre-wrap">
              {entry.rawText}
            </p>

            {entry.reflection && (
              <div className="pt-4 mt-4 border-t border-white/5">
                <div className="bg-brand-glow/5 border border-brand-glow/10 rounded-xl p-4 flex gap-3">
                  <Brain size={18} className="text-brand-glow flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-brand-light/90 italic leading-relaxed">
                    "{entry.reflection}"
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
