import React, { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Download, RefreshCw } from 'lucide-react';
import { MOCK_SCHEDULE } from '../constants';
import { EventType } from '../types';

const ScheduleView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSyncing, setIsSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 5 }).map((_, i) => addDays(startOfCurrentWeek, i));

  const handleSync = () => {
    setIsSyncing(true);
    // Simulate API call
    setTimeout(() => {
      setIsSyncing(false);
      setSynced(true);
      setTimeout(() => setSynced(false), 3000);
    }, 1500);
  };

  const getEventsForDay = (date: Date) => {
    return MOCK_SCHEDULE.filter(event => 
      format(new Date(event.startTime), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    ).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
              className="p-1 hover:bg-white rounded-md transition-shadow hover:shadow-sm"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <button 
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-indigo-600"
            >
              Today
            </button>
            <button 
              onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
              className="p-1 hover:bg-white rounded-md transition-shadow hover:shadow-sm"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
          <h2 className="text-lg font-bold text-gray-800">
            {format(startOfCurrentWeek, 'MMM d')} - {format(addDays(startOfCurrentWeek, 4), 'MMM d, yyyy')}
          </h2>
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              synced 
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <RefreshCw size={16} className={`mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {synced ? 'Synced!' : isSyncing ? 'Syncing...' : 'Sync to Calendar'}
          </button>
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            <Download size={16} className="mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {weekDays.map((day) => {
          const events = getEventsForDay(day);
          const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

          return (
            <div key={day.toString()} className={`flex flex-col rounded-xl overflow-hidden border ${isToday ? 'border-indigo-300 ring-1 ring-indigo-100' : 'border-gray-200 bg-white'}`}>
              <div className={`p-3 text-center border-b ${isToday ? 'bg-indigo-50' : 'bg-gray-50'}`}>
                <p className={`text-xs font-semibold uppercase ${isToday ? 'text-indigo-600' : 'text-gray-500'}`}>
                  {format(day, 'EEE')}
                </p>
                <p className={`text-xl font-bold ${isToday ? 'text-indigo-700' : 'text-gray-800'}`}>
                  {format(day, 'd')}
                </p>
              </div>

              <div className="flex-1 p-2 space-y-2 min-h-[300px] bg-white">
                {events.length > 0 ? (
                  events.map(event => (
                    <div 
                      key={event.id} 
                      className={`p-3 rounded-lg border-l-4 shadow-sm text-sm transition-transform hover:-translate-y-0.5 cursor-pointer ${
                        event.type === EventType.CAT || event.type === EventType.EXAM 
                          ? 'bg-red-50 border-red-500 hover:bg-red-100'
                          : event.type === EventType.DEADLINE
                          ? 'bg-amber-50 border-amber-500 hover:bg-amber-100'
                          : 'bg-indigo-50 border-indigo-500 hover:bg-indigo-100'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-gray-800 truncate block w-full">{event.courseCode}</span>
                      </div>
                      <p className="font-medium text-gray-900 mb-1 leading-tight line-clamp-2">{event.title}</p>
                      <p className="text-xs text-gray-500 mb-1">
                        {format(event.startTime, 'HH:mm')} - {format(event.endTime, 'HH:mm')}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <CalendarIcon size={10} className="mr-1" />
                        {event.location || 'Online'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-300 text-sm">
                    No Classes
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleView;