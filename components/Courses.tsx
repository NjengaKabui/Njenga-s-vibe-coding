import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MOCK_COURSES } from '../constants';
import { UserRole, CourseMaterial } from '../types';
import { FileText, Download, Upload, Video, File, Search, MessageSquare, Send, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { suggestLessonAdjustments } from '../services/geminiService';

const Courses: React.FC = () => {
  const { userRole, materials, setMaterials } = useOutletContext<{ 
    userRole: UserRole, 
    materials: CourseMaterial[],
    setMaterials: (m: CourseMaterial) => void
  }>();
  
  const [selectedCourse, setSelectedCourse] = useState(MOCK_COURSES[0].code);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbacks, setFeedbacks] = useState<Record<string, string[]>>({
    'MAT202': ['Calculus slides are great but need more solved examples.', 'The last lecture was a bit too fast.'],
    'CSC301': ['The project guidelines are clear.', 'Can we have more lab time for subnetting?']
  });
  const [aiInsights, setAiInsights] = useState<string>('');
  const [analyzingInsights, setAnalyzingInsights] = useState(false);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newMaterial: CourseMaterial = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.get('title') as string || 'New Material',
      type: 'PDF',
      courseCode: selectedCourse,
      uploadDate: new Date(),
      size: '1.2 MB'
    };
    setMaterials(newMaterial);
    setIsUploadModalOpen(false);
  };

  const submitFeedback = () => {
    if (!feedback.trim()) return;
    setFeedbacks(prev => ({
      ...prev,
      [selectedCourse]: [...(prev[selectedCourse] || []), feedback]
    }));
    setFeedback('');
    alert('Academic feedback received. The faculty will be notified.');
  };

  const getAiInsights = async () => {
    const courseFeedbacks = feedbacks[selectedCourse] || [];
    if (courseFeedbacks.length === 0) return;
    
    setAnalyzingInsights(true);
    const insights = await suggestLessonAdjustments(selectedCourse, courseFeedbacks);
    setAiInsights(insights);
    setAnalyzingInsights(false);
  };

  useEffect(() => {
    setAiInsights('');
  }, [selectedCourse]);

  const filteredMaterials = materials.filter(m => m.courseCode === selectedCourse);

  const getIcon = (type: CourseMaterial['type']) => {
    switch(type) {
      case 'VIDEO': return <Video size={20} className="text-rose-500" />;
      case 'SLIDE': return <FileText size={20} className="text-amber-500" />;
      default: return <File size={20} className="text-indigo-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
           <h2 className="text-3xl font-black text-gray-900 tracking-tight">{userRole === 'TEACHER' ? 'Faculty Hub' : 'Digital Classroom'}</h2>
           <p className="text-gray-500 font-medium">{userRole === 'TEACHER' ? 'Manage curriculum assets and pedagogical feedback.' : 'Access materials and communicate with instructors.'}</p>
        </div>
        {userRole === 'TEACHER' && (
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="mt-4 md:mt-0 flex items-center px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Upload size={18} className="mr-2" />
            Upload Asset
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-72 space-y-4">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-50 bg-gray-50/50">
              <h3 className="font-black text-gray-400 uppercase text-[10px] tracking-widest">Active Modules</h3>
            </div>
            <div className="p-3 space-y-2">
              {MOCK_COURSES.map(course => (
                <button
                  key={course.code}
                  onClick={() => setSelectedCourse(course.code)}
                  className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                    selectedCourse === course.code 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span>{course.code}</span>
                  </div>
                  <div className={`text-[10px] uppercase tracking-widest font-black truncate ${selectedCourse === course.code ? 'text-indigo-100 opacity-80' : 'text-gray-400'}`}>
                    {course.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
               <h3 className="font-bold text-gray-800 text-lg">Curriculum Files</h3>
               <div className="relative w-full sm:max-w-xs">
                 <Search size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                 <input 
                   type="text" 
                   placeholder="Search assets..." 
                   className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                 />
               </div>
             </div>
             <div className="min-h-[300px]">
               <table className="w-full text-left border-collapse">
                 <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                   <tr>
                     <th className="px-8 py-4">Title</th>
                     <th className="px-8 py-4">Release Date</th>
                     <th className="px-8 py-4 text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50 text-sm">
                   {filteredMaterials.map(material => (
                     <tr key={material.id} className="hover:bg-gray-50 group transition-colors">
                       <td className="px-8 py-5 flex items-center">
                         <div className="p-3 rounded-xl bg-gray-100 mr-4 group-hover:bg-white transition-colors">{getIcon(material.type)}</div>
                         <span className="font-bold text-gray-800">{material.title}</span>
                       </td>
                       <td className="px-8 py-5 text-gray-500 font-medium">{format(material.uploadDate, 'MMMM d, yyyy')}</td>
                       <td className="px-8 py-5 text-right">
                         <button className="text-indigo-600 hover:text-indigo-800 transition-colors p-2 hover:bg-indigo-50 rounded-xl"><Download size={20} /></button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               {filteredMaterials.length === 0 && (
                 <div className="py-20 text-center">
                   <File size={48} className="mx-auto text-gray-200 mb-4" />
                   <p className="text-gray-400 font-bold italic text-sm">No assets available for this module.</p>
                 </div>
               )}
             </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center text-lg">
              <MessageSquare size={20} className="mr-3 text-indigo-500" />
              {userRole === 'TEACHER' ? 'Pedagogical Insights' : 'Session Feedback'}
            </h3>
            
            {userRole === 'STUDENT' ? (
              <div className="space-y-6">
                <textarea 
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your thoughts on recent lectures or materials..."
                  className="w-full border border-gray-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                  rows={4}
                ></textarea>
                <div className="flex justify-end">
                  <button 
                    onClick={submitFeedback}
                    className="flex items-center px-8 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                  >
                    <Send size={16} className="mr-3" />
                    Submit Feedback
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3 mb-6">
                  {(feedbacks[selectedCourse] || []).map((f, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-2xl text-xs text-gray-600 font-medium italic border border-gray-100 max-w-sm">
                      "{f}"
                    </div>
                  ))}
                  {(feedbacks[selectedCourse]?.length === 0) && <p className="text-gray-400 text-sm italic font-medium">Awaiting student submissions for this module.</p>}
                </div>
                
                {aiInsights ? (
                  <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-3xl p-8 animate-in fade-in zoom-in duration-500 shadow-sm">
                    <div className="flex items-center text-indigo-700 mb-4 font-black text-xs uppercase tracking-widest">
                      <Sparkles size={18} className="mr-3" />
                      AI Curriculum Optimization
                    </div>
                    <div className="text-gray-800 text-sm whitespace-pre-line leading-relaxed font-medium">
                      {aiInsights}
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={getAiInsights}
                    disabled={analyzingInsights || (feedbacks[selectedCourse]?.length === 0)}
                    className="flex items-center px-8 py-4 bg-indigo-50 text-indigo-700 rounded-2xl text-sm font-black hover:bg-indigo-100 disabled:opacity-50 transition-all border border-indigo-100"
                  >
                    {analyzingInsights ? (
                      <div className="animate-spin h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full mr-3"></div>
                    ) : <Sparkles size={18} className="mr-3" />}
                    Generate Pedagogical Insights
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 bg-indigo-600 text-white">
                <h3 className="text-xl font-black">Distribute Asset</h3>
                <p className="text-indigo-100 text-xs font-medium mt-1">Files will be instantly available to enrolled students.</p>
            </div>
            <form onSubmit={handleUpload} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Display Title</label>
                <input required name="title" type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Module</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white font-medium" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                  {MOCK_COURSES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                </select>
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-indigo-400 transition-colors cursor-pointer group">
                 <Upload size={32} className="mx-auto text-gray-300 mb-4 group-hover:text-indigo-500 transition-colors" />
                 <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Tap to Browse</p>
                 <p className="text-[10px] text-gray-400 mt-2">Support: PDF, ZIP, MP4</p>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsUploadModalOpen(false)} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
                <button type="submit" className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;