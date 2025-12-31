import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { UserRole, StudentProfile } from '../types';
import { analyzeStudentPerformance } from '../services/geminiService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, User, Sparkles, Edit3, Save, X } from 'lucide-react';

const Performance: React.FC = () => {
  const { userRole, students, updateStudent } = useOutletContext<{ 
    userRole: UserRole, 
    students: StudentProfile[],
    updateStudent: (s: StudentProfile) => void
  }>();

  if (userRole === 'TEACHER') {
    return <TeacherPerformance students={students} updateStudent={updateStudent} />;
  }
  return <StudentPerformance />;
};

const StudentPerformance: React.FC = () => {
  const data = [
    { name: 'Wk 1', score: 65 },
    { name: 'Wk 2', score: 70 },
    { name: 'Wk 3', score: 68 },
    { name: 'Wk 4', score: 75 },
    { name: 'Wk 5', score: 82 },
    { name: 'Wk 6', score: 88 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Academic Analytics</h2>
        <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-indigo-200">
          Rank: 12 / 140
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-800 text-xl">Semester Progression</h3>
            <div className="flex items-center space-x-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold">
                <TrendingUp size={14} />
                <span>+12% Improvement</span>
            </div>
        </div>
        <div className="h-72 w-full">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={data}>
               <defs>
                 <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                   <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
               <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" />
               <YAxis domain={[0, 100]} hide />
               <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} />
               <Area type="monotone" dataKey="score" stroke="#6366f1" fillOpacity={1} fill="url(#colorScore)" strokeWidth={4} />
             </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-emerald-500">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Sparkles size={20} /></div>
            <h3 className="font-bold text-gray-800">Predicted Outcome</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed font-medium">
            Based on current progression, your projected final grade is <span className="text-indigo-600 font-black">89% (A-)</span>. Focus on the upcoming "Physics Lab" to push into the 90%+ range.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-amber-500">
          <div className="flex items-center space-x-3 mb-4">
             <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><TrendingUp size={20} /></div>
            <h3 className="font-bold text-gray-800">Engagement Score</h3>
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-4xl font-black text-gray-900">92</span>
            <span className="text-gray-400 font-bold mb-1">/ 100</span>
          </div>
          <p className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-widest">Exceptional Participation</p>
        </div>
      </div>
    </div>
  );
};

const TeacherPerformance: React.FC<{ students: StudentProfile[], updateStudent: (s: StudentProfile) => void }> = ({ students, updateStudent }) => {
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editScore, setEditScore] = useState<number>(0);

  const handleStudentClick = async (student: StudentProfile) => {
    if (selectedStudent?.id === student.id) {
      setSelectedStudent(null);
      setAiAnalysis("");
      return;
    }
    
    setSelectedStudent(student);
    setEditScore(student.averageGrade);
    setIsEditing(false);
    setAnalyzing(true);
    const analysis = await analyzeStudentPerformance(student);
    setAiAnalysis(analysis);
    setAnalyzing(false);
  };

  const saveGrade = () => {
    if (selectedStudent) {
      const updated = { ...selectedStudent, averageGrade: editScore };
      updateStudent(updated);
      setSelectedStudent(updated);
      setIsEditing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 h-[calc(100vh-160px)]">
      <div className="w-full lg:w-80 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest">Student Roster</h3>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {students.map(student => (
            <div 
              key={student.id}
              onClick={() => handleStudentClick(student)}
              className={`p-5 cursor-pointer hover:bg-indigo-50/50 transition-all ${selectedStudent?.id === student.id ? 'bg-indigo-50 border-r-4 border-r-indigo-500' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-gray-900">{student.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                  student.riskLevel === 'HIGH' ? 'bg-rose-100 text-rose-700' : 
                  student.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {student.riskLevel}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>GPA: {student.averageGrade}%</span>
                <span>ATT: {student.attendance}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 overflow-y-auto">
        {selectedStudent ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="h-20 w-20 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                  <User size={40} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 leading-tight">{selectedStudent.name}</h2>
                  <p className="text-gray-500 font-medium">{selectedStudent.email}</p>
                </div>
              </div>
              <div className="text-right">
                {isEditing ? (
                  <div className="flex flex-col items-end space-y-2">
                    <input 
                      type="number" 
                      value={editScore} 
                      onChange={(e) => setEditScore(Number(e.target.value))}
                      className="w-24 text-3xl font-black text-indigo-600 border-b-2 border-indigo-500 outline-none text-right bg-transparent"
                    />
                    <div className="flex space-x-2">
                      <button onClick={saveGrade} className="p-1 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"><Save size={16}/></button>
                      <button onClick={() => setIsEditing(false)} className="p-1 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors"><X size={16}/></button>
                    </div>
                  </div>
                ) : (
                  <div className="group cursor-pointer" onClick={() => setIsEditing(true)}>
                    <div className="text-4xl font-black text-indigo-600 flex items-center justify-end">
                      {selectedStudent.averageGrade}%
                      <Edit3 size={16} className="ml-2 text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Weighted Average</div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-6 border border-indigo-100 shadow-sm">
              <div className="flex items-center text-indigo-700 font-bold text-sm mb-3">
                <Sparkles size={18} className="mr-2" />
                AI Intervention Insight
              </div>
              {analyzing ? (
                <div className="flex items-center text-sm font-medium text-gray-400 italic">
                  <div className="animate-spin h-3 w-3 border-2 border-indigo-600 border-t-transparent rounded-full mr-3"></div>
                  Generating personalized strategy...
                </div>
              ) : (
                <p className="text-gray-800 text-sm leading-relaxed font-medium italic">
                  "{aiAnalysis}"
                </p>
              )}
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-6 text-lg">Performance Heatmap</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedStudent.grades}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} fontStyle="bold" />
                    <YAxis domain={[0, 100]} hide />
                    <Tooltip contentStyle={{ borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="score" stroke="#818cf8" fill="#e0e7ff" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-300">
            <User size={64} className="mb-6 opacity-20" />
            <p className="text-lg font-bold">Select a student profile to begin analysis</p>
            <p className="text-sm font-medium text-gray-400 mt-2">Access metrics, grade editing, and AI intervention tools</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Performance;