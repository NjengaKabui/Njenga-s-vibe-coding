import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { summarizeAnnouncement } from '../services/geminiService';
import { Sparkles, ChevronDown, ChevronUp, Plus, Send, X } from 'lucide-react';
import { format } from 'date-fns';
import { UserRole, Announcement } from '../types';

const Announcements: React.FC = () => {
  const { userRole, announcements, setAnnouncements } = useOutletContext<{ 
    userRole: UserRole, 
    announcements: Announcement[],
    setAnnouncements: (a: Announcement) => void 
  }>();
  
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingSummary, setLoadingSummary] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSummarize = async (e: React.MouseEvent, id: string, text: string) => {
    e.stopPropagation();
    if (summaries[id]) return;

    setLoadingSummary(id);
    const summary = await summarizeAnnouncement(text);
    setSummaries(prev => ({ ...prev, [id]: summary }));
    setLoadingSummary(null);
  };

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    const announcement: Announcement = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      content: newContent,
      sender: 'Prof. Anderson',
      date: new Date(),
      isRead: false,
      priority: 'MEDIUM'
    };
    setAnnouncements(announcement);
    setIsPosting(false);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">University Feed</h2>
          <p className="text-gray-500 font-medium">Official updates from faculty and administration.</p>
        </div>
        {userRole === 'TEACHER' && (
          <button 
            onClick={() => setIsPosting(true)}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Plus size={18} className="mr-2" />
            New Broadcast
          </button>
        )}
      </div>

      {isPosting && (
        <div className="bg-white rounded-3xl shadow-xl border border-indigo-100 overflow-hidden animate-in zoom-in duration-300">
          <div className="p-6 bg-indigo-50/50 border-b border-indigo-50 flex justify-between items-center">
            <h3 className="font-black text-indigo-900 uppercase text-xs tracking-widest">Broadcast Message</h3>
            <button onClick={() => setIsPosting(false)} className="text-indigo-400 hover:text-indigo-600 transition-colors">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handlePost} className="p-8 space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Announcement Title</label>
              <input 
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                type="text" 
                placeholder="e.g. Schedule Change: Advanced Data Structures"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Full Content</label>
              <textarea 
                required
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={4}
                placeholder="Provide detailed information here..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button 
                type="submit"
                className="flex items-center px-8 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                <Send size={16} className="mr-3" />
                Push Update
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div 
            key={announcement.id} 
            className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${
              expandedId === announcement.id ? 'ring-2 ring-indigo-500 border-transparent shadow-xl' : 'border-gray-100 hover:border-indigo-200'
            }`}
          >
            <div 
              className="p-6 cursor-pointer flex items-start gap-6"
              onClick={() => toggleExpand(announcement.id)}
            >
              <div className={`mt-1.5 h-3 w-3 rounded-full flex-shrink-0 shadow-sm ${
                announcement.priority === 'HIGH' ? 'bg-rose-500 shadow-rose-200' : 
                announcement.priority === 'MEDIUM' ? 'bg-amber-500 shadow-amber-200' : 'bg-indigo-400 shadow-indigo-200'
              }`}></div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">{announcement.title}</h3>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap ml-4 mt-1">
                    {format(new Date(announcement.date), 'MMM d, h:mm a')}
                  </span>
                </div>
                <p className="text-sm font-bold text-indigo-600 mt-1">{announcement.sender}</p>
                
                {summaries[announcement.id] && expandedId !== announcement.id && (
                   <div className="mt-4 text-xs font-medium text-indigo-700 bg-indigo-50/50 p-3 rounded-xl flex items-start border border-indigo-50 animate-in slide-in-from-bottom-2">
                      <Sparkles size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                      <span className="italic line-clamp-1">{summaries[announcement.id]}</span>
                   </div>
                )}
              </div>

              <div className="text-gray-300 mt-1">
                {expandedId === announcement.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </div>
            </div>

            {expandedId === announcement.id && (
              <div className="px-6 pb-6 pt-0 border-t border-gray-50 bg-gray-50/30">
                <div className="py-6">
                  <div className="mb-8">
                    {summaries[announcement.id] ? (
                      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white shadow-lg shadow-indigo-100">
                        <div className="flex items-center text-indigo-100 mb-3 font-bold text-xs uppercase tracking-widest">
                          <Sparkles size={16} className="mr-2" />
                          AI Intelligence Summary
                        </div>
                        <p className="text-lg font-medium leading-relaxed italic">
                          "{summaries[announcement.id]}"
                        </p>
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => handleSummarize(e, announcement.id, announcement.content)}
                        disabled={loadingSummary === announcement.id}
                        className="flex items-center text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-6 py-3 rounded-2xl transition-all border border-indigo-100"
                      >
                        {loadingSummary === announcement.id ? (
                           <>
                             <div className="animate-spin h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full mr-3"></div>
                             Processing text...
                           </>
                        ) : (
                           <>
                             <Sparkles size={18} className="mr-3" />
                             Analyze with AI
                           </>
                        )}
                      </button>
                    )}
                  </div>

                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Original Transmission</h4>
                  <p className="text-gray-700 text-base whitespace-pre-line leading-relaxed font-medium">
                    {announcement.content}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;