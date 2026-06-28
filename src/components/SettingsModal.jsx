import React, { useState, useEffect } from 'react';
import { X, Key, User } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, onSave }) {
  const [apiKey, setApiKey] = useState('');
  const [userName, setUserName] = useState('');
  const [counselorName, setCounselorName] = useState('');
  const [counselorContact, setCounselorContact] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const storedKey = localStorage.getItem('saha_api_key') || '';
      const storedName = localStorage.getItem('saha_user_name') || '';
      const storedCName = localStorage.getItem('saha_counselor_name') || '';
      const storedCContact = localStorage.getItem('saha_counselor_contact') || '';
      const storedEName = localStorage.getItem('saha_emergency_name') || '';
      const storedEPhone = localStorage.getItem('saha_emergency_phone') || '';

      setApiKey(storedKey);
      setUserName(storedName);
      setCounselorName(storedCName);
      setCounselorContact(storedCContact);
      setEmergencyName(storedEName);
      setEmergencyPhone(storedEPhone);
      setSavedStatus(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('saha_api_key', apiKey.trim());
    localStorage.setItem('saha_user_name', userName.trim());
    localStorage.setItem('saha_counselor_name', counselorName.trim());
    localStorage.setItem('saha_counselor_contact', counselorContact.trim());
    localStorage.setItem('saha_emergency_name', emergencyName.trim());
    localStorage.setItem('saha_emergency_phone', emergencyPhone.trim());
    
    setSavedStatus(true);
    if (onSave) {
      onSave({
        apiKey: apiKey.trim(),
        userName: userName.trim(),
        counselorName: counselorName.trim(),
        counselorContact: counselorContact.trim(),
        emergencyName: emergencyName.trim(),
        emergencyPhone: emergencyPhone.trim(),
      });
    }
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cosmic-dark/80 backdrop-blur-md transition-opacity">
      <div className="glass-card max-w-lg w-full p-6 md:p-8 relative overflow-hidden flex flex-col max-h-[90vh]">
        <div className="absolute top-0 right-0 p-4">
          <button 
            onClick={onClose}
            className="text-brand-lilac hover:text-white transition p-1 hover:bg-white/10 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>⚙️</span> Saha Settings
        </h2>

        <form onSubmit={handleSave} className="space-y-5 overflow-y-auto pr-1 flex-1">
          {/* Gemini API Key */}
          <div>
            <label className="block text-sm font-semibold text-brand-lavender mb-1.5 flex items-center gap-1.5">
              <Key size={16} /> Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your Gemini API key..."
              className="w-full p-3 glass-input text-sm"
              required
            />
            <p className="text-xs text-brand-lilac mt-1">
              Your key stays safely on this device in local storage.
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-brand-lavender mb-1.5 flex items-center gap-1.5">
              <User size={16} /> Your Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="How should Saha address you?"
              className="w-full p-3 glass-input text-sm"
              required
            />
          </div>

          {/* Counselor Details */}
          <div className="border-t border-white/10 pt-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              📍 University Counselor
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-brand-lilac mb-1">Name</label>
                <input
                  type="text"
                  value={counselorName}
                  onChange={(e) => setCounselorName(e.target.value)}
                  placeholder="e.g. Dr. Sarah Lee"
                  className="w-full p-2.5 glass-input text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-lilac mb-1">Contact (Email/Phone)</label>
                <input
                  type="text"
                  value={counselorContact}
                  onChange={(e) => setCounselorContact(e.target.value)}
                  placeholder="e.g. counsel@university.edu"
                  className="w-full p-2.5 glass-input text-xs"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="border-t border-white/10 pt-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              👤 Emergency Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-brand-lilac mb-1">Contact Name</label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="e.g. Parent / Partner"
                  className="w-full p-2.5 glass-input text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-lilac mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="e.g. +971 50..."
                  className="w-full p-2.5 glass-input text-xs"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="border-t border-white/10 pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 glass-button font-semibold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-brand-glow text-brand-deep hover:bg-brand-lavender font-bold text-sm rounded-xl transition duration-200"
            >
              {savedStatus ? 'Saved ✓' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
