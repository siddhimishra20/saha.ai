import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import Sidebar from './components/Sidebar';
import SettingsModal from './components/SettingsModal';
import Aurora from './components/Aurora';

import HomePage from './pages/HomePage';
import JournalPage from './pages/JournalPage';
import LibraryPage from './pages/LibraryPage';
import DashboardPage from './pages/DashboardPage';
import GrowthPage from './pages/GrowthPage';
import SupportPage from './pages/SupportPage';

export default function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [currentView, setView] = useState('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [streak, setStreak] = useState(0);

  // Check onboarding status
  useEffect(() => {
    // Check onboarding
    const storedOnboarded = localStorage.getItem('saha_onboarded');
    if (storedOnboarded === 'true') {
      setOnboarded(true);
    }

    // Load streak
    updateStreak();
  }, []);

  const updateStreak = () => {
    const entries = JSON.parse(localStorage.getItem('saha_entries') || '[]');
    if (entries.length === 0) {
      setStreak(0);
      return;
    }

    // Extract unique dates in YYYY-MM-DD
    const uniqueDates = entries
      .map(entry => new Date(entry.timestamp).toDateString())
      .filter((value, index, self) => self.indexOf(value) === index)
      .map(dStr => new Date(dStr));

    if (uniqueDates.length === 0) {
      setStreak(0);
      return;
    }

    const todayStr = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    const latestStr = uniqueDates[0].toDateString();

    // If latest check-in is neither today nor yesterday, streak is 0
    if (latestStr !== todayStr && latestStr !== yesterdayStr) {
      setStreak(0);
      return;
    }

    let activeStreak = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const current = uniqueDates[i];
      const next = uniqueDates[i + 1];

      // Time difference in days
      const diffTime = Math.abs(current - next);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        activeStreak++;
      } else if (diffDays > 1) {
        break; // Streak broken
      }
    }
    setStreak(activeStreak);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('saha_onboarded', 'true');
    setOnboarded(true);
  };

  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
        const entriesCount = JSON.parse(localStorage.getItem('saha_entries') || '[]').length;
        return <HomePage setView={setView} entriesCount={entriesCount} />;
      case 'journal':
        return <JournalPage onEntrySaved={updateStreak} setView={setView} />;
      case 'library':
        return <LibraryPage />;
      case 'dashboard':
        return <DashboardPage streak={streak} />;
      case 'growth':
        return <GrowthPage />;
      case 'support':
        return <SupportPage />;
      default:
        return <HomePage setView={setView} entriesCount={0} />;
    }
  };

  // Render Onboarding welcome screen if not finished
  if (!onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-cosmic-dark font-plus-jakarta text-brand-light relative overflow-x-hidden z-0">
      {/* Global Aurora Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden opacity-40 mix-blend-screen pointer-events-none">
        <Aurora
          colorStops={["#7cff67","#B497CF","#5227FF"]}
          blend={0.5}
          amplitude={1.0}
          speed={1.0}
        />
      </div>

      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView} 
        setView={setView} 
        streak={streak} 
        onOpenSettings={() => setIsSettingsOpen(true)} 
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 md:pl-72 pb-24 md:pb-8 max-w-7xl mx-auto w-full transition-all duration-300">
        <div className="relative w-full">
          {renderActiveView()}
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onSave={() => updateStreak()} 
      />
    </div>
  );
}
