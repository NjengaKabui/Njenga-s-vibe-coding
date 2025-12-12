import React, { useEffect, useState } from 'react';
import { 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  ArrowRight,
  TrendingUp 
} from 'lucide-react';
import { MOCK_SCHEDULE, MOCK_ANNOUNCEMENTS } from '../constants';
import { EventType, ScheduleEvent } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, isSameDay } from 'date-fns';
import { generateStudyTip } from '../services/geminiService';

const Dashboard: React.FC = () => {
  const [aiTip, setAiTip] = useState<string>("Analyzing your schedule...");
  const today = new Date();
  
  // Filter events
  const todaysEvents = MOCK_SCHEDULE.filter(e => isSameDay(new Date(e.startTime), today)).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  const nextEvent = todaysEvents.find(e => e.startTime > new Date()) || todaysEvents[0]; // Or first of tomorrow if needed
  const upcomingDeadlines = MOCK_SCHEDULE.filter(e => e.type === EventType.DEADLINE || e.type === EventType.CAT).slice(0, 3);
  const unreadAnnouncements = MOCK_ANNOUNCEMENTS.filter(a => !a.isRead).length;

  // Chart Data
  const studyData = [
    { name: 'Mon', hours: 4 },
    { name: 'Tue', hours: 6 },
    { name: 'Wed', hours: 3 },
    { name: 'Thu', hours: 7 },
    { name: 'Fri', hours: 5 },
    { name: 'Sat', hours: 2 },
    { name: 'Sun', hours: 4 },
  ];

  useEffect(() => {
    // Generate an AI tip based on schedule load
    const eventTitles = upcomingDeadlines.map(e => e.title);
    generateStudyTip(eventTitles).then(setAiTip);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* AI Insight Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-white/20 px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider">AI Insight</span>
            <span className="text-indigo-100 text-sm">{format(today, 'EEEE, MMMM do')}</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Hello, John!</h2>
          <p className="text-indigo-100 max-w-2xl text-lg font-light leading-relaxed">
            "{aiTip}"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Next Up Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <Clock size={18} className="mr-2 text-indigo-500" />
              Up Next
            </h3>
            {nextEvent && (
               <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                 nextEvent.type === EventType.CAT ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
               }`}>
                 {nextEvent.type}
               </span>
            )}
          </div>
          
          {nextEvent ? (
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {format(new Date(nextEvent.startTime), 'HH:mm')}
              </div>
              <p className="text-gray-500 text-sm mb-4">
                {format(new Date(nextEvent.endTime), 'HH:mm')} • {((nextEvent.endTime.getTime() - nextEvent.startTime.getTime()) / (1000 * 60))} min
              </p>
              <h4 className="text-xl font-bold text-gray-800 leading-tight mb-2">{nextEvent.title}</h4>
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin size={16} className="mr-1" />
                {nextEvent.location || 'Online'}
              </div>
            </div>
          ) : (
             <div className="flex-1 flex items-center justify-center text-gray-400 italic">
               No more classes today!
             </div>
          )}
        </div>

        {/* Deadlines & Alerts */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 flex items-center mb-4">
            <AlertTriangle size={18} className="mr-2 text-amber-500" />
            Priority Alerts
          </h3>
          <div className="space-y-3">
            {unreadAnnouncements > 0 && (
              <div className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="bg-blue-100 p-1.5 rounded-full mr-3 text-blue-600 mt-0.5">
                  <BookOpen size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">{unreadAnnouncements} Unread Announcements</p>
                  <p className="text-xs text-blue-700 mt-0.5">Check portal updates</p>
                </div>
              </div>
            )}
            
            {upcomingDeadlines.length > 0 ? upcomingDeadlines.map(event => (
              <div key={event.id} className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
                 <div className={`p-1.5 rounded-full mr-3 mt-0.5 ${
                   event.type === EventType.CAT ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                 }`}>
                   {event.type === EventType.CAT ? <AlertTriangle size={14} /> : <Clock size={14} />}
                 </div>
                 <div className="flex-1">
                   <p className="text-sm font-medium text-gray-900">{event.title}</p>
                   <p className="text-xs text-gray-500 mt-0.5">
                     Due {format(new Date(event.startTime), 'MMM d, HH:mm')}
                   </p>
                 </div>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">No upcoming deadlines.</p>
            )}
          </div>
        </div>

        {/* Study Analytics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="font-semibold text-gray-800 flex items-center mb-4">
            <TrendingUp size={18} className="mr-2 text-emerald-500" />
            Weekly Study Focus
          </h3>
          <div className="flex-1 w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyData}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                  {studyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.hours > 5 ? '#4f46e5' : '#c7d2fe'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
             <span>Total: 31 hrs</span>
             <span className="text-emerald-600 font-medium">+12% vs last week</span>
          </div>
        </div>
      </div>

      {/* Today's Timeline Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Today's Timeline</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                View Full Schedule <ArrowRight size={16} className="ml-1" />
            </button>
        </div>
        <div className="p-6">
            <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
                {todaysEvents.map((event, idx) => (
                    <div key={event.id} className="relative pl-8">
                        <span className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white ${
                            event.startTime < new Date() ? 'bg-gray-400' : 'bg-indigo-600'
                        }`}></span>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between group">
                            <div>
                                <h4 className={`text-base font-semibold ${
                                    event.startTime < new Date() ? 'text-gray-500 line-through' : 'text-gray-900'
                                }`}>{event.title}</h4>
                                <p className="text-sm text-gray-500">
                                    {format(event.startTime, 'h:mm a')} - {format(event.endTime, 'h:mm a')} • {event.location}
                                </p>
                            </div>
                            {event.startTime < new Date() && (
                                <div className="hidden sm:flex items-center text-green-600 text-sm font-medium">
                                    <CheckCircle2 size={16} className="mr-1" /> Completed
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {todaysEvents.length === 0 && (
                    <div className="pl-8 text-gray-500">No classes scheduled for today.</div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;