import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Clock, MapPin, AlertTriangle, CheckCircle2, BookOpen, ArrowRight, TrendingUp, Users, Calendar, AlertCircle
} from 'lucide-react';
import { MOCK_SCHEDULE, MOCK_COURSES } from '../constants';
import { EventType, UserRole, StudentProfile, Announcement } from '../types';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { format, isSameDay } from 'date-fns';
import { generateStudyTip } from '../services/geminiService';

const Dashboard: React.FC = () => {
  const { userRole, students, announcements } = useOutletContext<{ 
    userRole: UserRole, 
    students: StudentProfile[],
    announcements: Announcement[]
  }>();

  if (userRole === 'TEACHER') {
    return <TeacherDashboard students={students} />;
  }
  return <StudentDashboard announcements={announcements} />;
};

const StudentDashboard: React.FC<{ announcements: Announcement[] }>= ({ announcements }) => {
  const [aiTip, setAiTip] = useState<string>("Analyzing your schedule...");
  const today = new Date();
  
  const todaysEvents = MOCK_SCHEDULE.filter(e => isSameDay(new Date(e.startTime), today)).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  const nextEvent = todaysEvents.find(e => e.startTime > new Date()) || todaysEvents[0];
  const upcomingDeadlines = MOCK_SCHEDULE.filter(e => e.type === EventType.DEADLINE || e.type === EventType.CAT).slice(0, 3);
  const unreadAnnouncements = announcements.filter(a => !a.isRead).length;

  const trajectoryData = [
    { month: 'Jan', grade: 82, target: 85 },
    { month: 'Feb', grade: 85, target: 85 },
    { month: 'Mar', grade: 84, target: 86 },
    { month: 'Apr', grade: 88, target: 86 },
    { month: 'May', grade: 91, target: 87 },
  ];

  useEffect(() => {
    const eventTitles = upcomingDeadlines.map(e => e.title);
    generateStudyTip(eventTitles).then(setAiTip);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-3">
            <span className="bg-indigo-400/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20">AI Academic Assistant</span>
          </div>
          <h2 className="text-3xl font-extrabold mb-3">Welcome back, John</h2>
          <p className="text-indigo-100 max-w-2xl text-lg font-medium italic opacity-90">
            "{aiTip}"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800 flex items-center text-lg">
              <Clock size={20} className="mr-2 text-indigo-500" />
              Up Next
            </h3>
            {nextEvent && (
               <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                 nextEvent.type === EventType.CAT ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
               }`}>
                 {nextEvent.type}
               </span>
            )}
          </div>
          {nextEvent ? (
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-4xl font-black text-gray-900 mb-1">
                {format(new Date(nextEvent.startTime), 'HH:mm')}
              </div>
              <p className="text-gray-400 text-sm mb-6 font-medium">
                {format(new Date(nextEvent.startTime), 'EEEE')} • Room {nextEvent.location || '302'}
              </p>
              <h4 className="text-xl font-bold text-gray-800 leading-tight mb-3">{nextEvent.title}</h4>
              <div className="flex items-center text-gray-500 text-sm font-medium">
                <MapPin size={16} className="mr-2" />
                {nextEvent.location || 'Online Campus'}
              </div>
            </div>
          ) : (
             <div className="flex-1 flex items-center justify-center text-gray-400 italic">No classes today.</div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="font-bold text-gray-800 flex items-center mb-6 text-lg">
            <AlertTriangle size={20} className="mr-2 text-amber-500" />
            Alerts & Tasks
          </h3>
          <div className="space-y-4">
            {unreadAnnouncements > 0 && (
              <div className="flex items-start p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="bg-indigo-100 p-2 rounded-lg mr-4 text-indigo-600">
                  <BookOpen size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-indigo-900">{unreadAnnouncements} New Updates</p>
                  <p className="text-xs text-indigo-700 mt-1">Check the announcements tab</p>
                </div>
              </div>
            )}
            {upcomingDeadlines.map(event => (
              <div key={event.id} className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:border-indigo-200 transition-all cursor-pointer">
                 <div className={`p-2 rounded-lg mr-4 ${
                   event.type === EventType.CAT ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                 }`}>
                   <AlertCircle size={18} />
                 </div>
                 <div className="flex-1">
                   <p className="text-sm font-bold text-gray-900">{event.title}</p>
                   <p className="text-xs text-gray-500 mt-1 font-medium">
                     {format(new Date(event.startTime), 'MMM d, HH:mm')}
                   </p>
                 </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
          <h3 className="font-bold text-gray-800 flex items-center mb-6 text-lg">
            <TrendingUp size={20} className="mr-2 text-emerald-500" />
            Performance
          </h3>
          <div className="flex-1 w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trajectoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={11} axisLine={false} tickLine={false} dy={10} stroke="#94a3b8" />
                <YAxis domain={[60, 100]} hide />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                <Line type="monotone" dataKey="grade" stroke="#6366f1" strokeWidth={4} dot={{r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-between">
             <div className="text-sm font-medium text-gray-500">GPA: <span className="font-bold text-gray-900">3.8</span></div>
             <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded">Top 5%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeacherDashboard: React.FC<{ students: StudentProfile[] }> = ({ students }) => {
  const atRiskStudents = students.filter(s => s.riskLevel !== 'LOW');
  
  // Simulated engagement heatmap data
  const EngagementHeatmap = () => (
    <div className="grid grid-cols-7 gap-2 mt-4">
      {Array.from({ length: 28 }).map((_, i) => {
        const intensity = Math.random();
        let bgColor = 'bg-gray-100';
        if (intensity > 0.8) bgColor = 'bg-indigo-600';
        else if (intensity > 0.5) bgColor = 'bg-indigo-400';
        else if (intensity > 0.3) bgColor = 'bg-indigo-200';
        
        return (
          <div 
            key={i} 
            className={`h-8 w-full rounded-sm ${bgColor} transition-opacity hover:opacity-80 cursor-help`}
            title={`Activity index: ${Math.round(intensity * 100)}%`}
          ></div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Users size={24} /></div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase">Active</span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Class Enrollment</p>
          <h3 className="text-3xl font-black text-gray-900">{students.length} Total</h3>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
             <div className="bg-purple-50 p-3 rounded-xl text-purple-600"><Calendar size={24} /></div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Sessions Scheduled</p>
          <h3 className="text-3xl font-black text-gray-900">{MOCK_COURSES.length}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between mb-4">
             <div className="bg-rose-50 p-3 rounded-xl text-rose-600"><AlertCircle size={24} /></div>
             <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded uppercase">Priority</span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Intervention Needed</p>
          <h3 className="text-3xl font-black text-gray-900">{atRiskStudents.length} Students</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 text-lg">Class Performance Heatmap</h3>
            <span className="text-xs text-gray-400 font-medium">Last 28 Days</span>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-2 font-medium">Global Student Activity Intensity</p>
            <EngagementHeatmap />
            <div className="mt-4 flex items-center space-x-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <div className="flex items-center"><div className="w-2 h-2 bg-gray-100 mr-1 rounded-sm"></div> Low</div>
              <div className="flex items-center"><div className="w-2 h-2 bg-indigo-600 mr-1 rounded-sm"></div> High</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 text-lg">Risk Assessment</h3>
            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800">Intervene All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-black tracking-widest">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Attendance</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {atRiskStudents.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{student.name}</div>
                      <div className="text-[10px] text-gray-400">{student.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-100 h-1.5 rounded-full mr-2 overflow-hidden">
                          <div className={`h-full ${student.attendance < 80 ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${student.attendance}%` }}></div>
                        </div>
                        <span className="font-bold text-gray-700">{student.attendance}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        student.riskLevel === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {student.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;