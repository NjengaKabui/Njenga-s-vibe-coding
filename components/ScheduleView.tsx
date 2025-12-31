import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { format, addDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Download, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { MOCK_SCHEDULE } from '../constants';
import { EventType, UserRole, ScheduleEvent } from '../types';

const ScheduleView: React.FC = () => {
  const { userRole } = useOutletContext<{ userRole: UserRole }>();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSyncing, setIsSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [events, setEvents] = useState<ScheduleEvent[]>(MOCK_SCHEDULE);
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 5 }).map((_, i) => addDays(startOfCurrentWeek, i));

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSynced(true);
      setTimeout(() => setSynced(false), 3000);
    }, 1500);
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      format(new Date(event.startTime), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    ).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  };

  const addAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newEvent: ScheduleEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.get('title') as string,
      courseCode: formData.get('courseCode') as string,
      type: formData.get('type') as EventType,
      startTime: new Date(formData.get('date') as string + 'T' + formData.get('startTime') as string),
      endTime: new Date(formData.get('date') as string + 'T' + formData.get('endTime') as string),
      location: formData.get('location') as string,
    };
    setEvents([...events, newEvent]);
    setIsAddingEvent(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button onClick={() => setCurrentDate(subWeeks(currentDate, 1))} className="p-1 hover:bg-white rounded-md transition-shadow">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-indigo-600">
              Today
            </button>
            <button onClick={() => setCurrentDate(addWeeks(currentDate, 1))} className="p-1 hover:bg-white rounded-md transition-shadow">
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
          <h2 className="text-lg font-bold text-gray-800">
            {format(startOfCurrentWeek, 'MMM d')} - {format(addDays(startOfCurrentWeek, 4), 'MMM d, yyyy')}
          </h2>
        </div>

        <div className="flex space-x-3">
          {userRole === 'TEACHER' ? (
            <button 
              onClick={() => setIsAddingEvent(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm"
            >
              <Plus size={16} className="mr-2" />
              Schedule Assessment
            </button>
          ) : (
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                synced ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <RefreshCw size={16} className={`mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {synced ? 'Synced to Calendar!' : isSyncing ? 'Syncing...' : 'Sync to Device'}
            </button>
          )}
          <button className="flex items-center px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download size={16} className="mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      {isAddingEvent && (
        <div className="bg-white rounded-xl shadow-lg border border-indigo-200 p-6 animate-in zoom-in duration-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">New Assessment / Event</h3>
          <form onSubmit={addAssessment} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
              <input required name="title" className="w-full border rounded-lg px-3 py-2" placeholder="CAT 2, Midterm Exam, etc." />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Course Code</label>
              <input required name="courseCode" className="w-full border rounded-lg px-3 py-2" placeholder="e.g. CSC301" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
              <select name="type" className="w-full border rounded-lg px-3 py-2">
                <option value={EventType.CAT}>CAT</option>
                <option value={EventType.EXAM}>Exam</option>
                <option value={EventType.DEADLINE}>Deadline</option>
                <option value={EventType.CLASS}>Class</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
              <input required name="date" type="date" className="w-full border rounded-lg px-3 py-2" defaultValue={format(currentDate, 'yyyy-MM-dd')} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Start Time</label>
              <input required name="startTime" type="time" className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">End Time</label>
              <input required name="endTime" type="time" className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
              <input name="location" className="w-full border rounded-lg px-3 py-2" placeholder="Lab 4, Hall B..." />
            </div>
            <div className="md:col-span-2 lg:col-span-4 flex justify-end space-x-3 mt-2">
              <button type="button" onClick={() => setIsAddingEvent(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700">Add to Schedule</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {weekDays.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

          return (
            <div key={day.toString()} className={`flex flex-col rounded-xl overflow-hidden border ${isToday ? 'border-indigo-300 ring-1 ring-indigo-100 shadow-md' : 'border-gray-200 bg-white'}`}>
              <div className={`p-3 text-center border-b ${isToday ? 'bg-indigo-50' : 'bg-gray-50'}`}>
                <p className={`text-xs font-semibold uppercase ${isToday ? 'text-indigo-600' : 'text-gray-500'}`}>
                  {format(day, 'EEE')}
                </p>
                <p className={`text-xl font-bold ${isToday ? 'text-indigo-700' : 'text-gray-800'}`}>
                  {format(day, 'd')}
                </p>
              </div>

              <div className="flex-1 p-2 space-y-2 min-h-[350px] bg-white">
                {dayEvents.length > 0 ? (
                  dayEvents.map(event => (
                    <div 
                      key={event.id} 
                      className={`p-3 rounded-lg border-l-4 shadow-sm text-sm transition-transform hover:-translate-y-0.5 cursor-pointer relative group ${
                        event.type === EventType.CAT || event.type === EventType.EXAM 
                          ? 'bg-red-50 border-red-500 hover:bg-red-100'
                          : event.type === EventType.DEADLINE
                          ? 'bg-amber-50 border-amber-500 hover:bg-amber-100'
                          : 'bg-indigo-50 border-indigo-500 hover:bg-indigo-100'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-gray-800 truncate block w-full">{event.courseCode}</span>
                        {userRole === 'TEACHER' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEvents(events.filter(ev => ev.id !== event.id));
                            }}
                            className="hidden group-hover:block text-red-500 hover:text-red-700 p-0.5"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <p className="font-medium text-gray-900 mb-1 leading-tight line-clamp-2">{event.title}</p>
                      <p className="text-xs text-gray-500 mb-1 font-mono">
                        {format(new Date(event.startTime), 'HH:mm')} - {format(new Date(event.endTime), 'HH:mm')}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <CalendarIcon size={10} className="mr-1" />
                        {event.location || 'TBA'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-300 text-sm italic">
                    Free Day
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