import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export default function MoodCalendar({ entries }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Map entries to days in the current month
  // We'll just grab the most recent entry for a given day
  const entriesByDay = {};
  entries.forEach(entry => {
    const entryDate = new Date(entry.timestamp);
    if (entryDate.getFullYear() === year && entryDate.getMonth() === month) {
      const day = entryDate.getDate();
      if (!entriesByDay[day]) {
        entriesByDay[day] = entry; // First one encountered is the most recent because entries are sorted newest first
      }
    }
  });

  const calendarDays = [];
  
  // Padding for start of month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-12 sm:h-16"></div>);
  }

  // Days of month
  for (let d = 1; d <= daysInMonth; d++) {
    const entry = entriesByDay[d];
    const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();
    
    calendarDays.push(
      <div 
        key={`day-${d}`} 
        className={`h-12 sm:h-16 rounded-xl flex items-center justify-center relative border transition-all duration-300 overflow-hidden ${
          isToday ? 'border-brand-glow bg-brand-glow/10 shadow-[0_0_15px_rgba(167,139,250,0.25)]' : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'
        }`}
      >
        <span className={`absolute top-1.5 left-2 text-[10px] font-bold ${isToday ? 'text-brand-glow drop-shadow-md' : 'text-brand-lilac/70'}`}>
          {d}
        </span>
        {entry && entry.emoji && (
          <span className="text-xl sm:text-2xl mt-2 drop-shadow-lg transform group-hover:scale-110 transition-transform" title={entry.intensity}>
            {entry.emoji}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="glass-card p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <CalendarIcon size={18} className="text-brand-glow" /> Mood Calendar
        </h3>
        <div className="flex items-center gap-2 bg-white/5 rounded-full p-1 border border-white/10">
          <button onClick={prevMonth} className="p-1.5 rounded-full hover:bg-white/10 text-brand-lilac hover:text-white transition">
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-bold text-white px-2 w-24 text-center">
            {monthNames[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-1.5 rounded-full hover:bg-white/10 text-brand-lilac hover:text-white transition">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-[10px] font-bold text-brand-lilac uppercase tracking-wider mb-2">
            {day}
          </div>
        ))}
        {calendarDays}
      </div>
    </div>
  );
}
