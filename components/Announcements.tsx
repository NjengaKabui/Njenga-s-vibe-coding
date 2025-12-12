import React, { useState } from 'react';
import { MOCK_ANNOUNCEMENTS } from '../constants';
import { summarizeAnnouncement } from '../services/geminiService';
import { Sparkles, MessageSquare, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

const Announcements: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingSummary, setLoadingSummary] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSummarize = async (e: React.MouseEvent, id: string, text: string) => {
    e.stopPropagation(); // Prevent toggling the card
    if (summaries[id]) return; // Already summarized

    setLoadingSummary(id);
    const summary = await summarizeAnnouncement(text);
    setSummaries(prev => ({ ...prev, [id]: summary }));
    setLoadingSummary(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Announcements</h2>
        <p className="text-gray-500">Updates from your department and university admin.</p>
      </div>

      <div className="space-y-4">
        {MOCK_ANNOUNCEMENTS.map((announcement) => (
          <div 
            key={announcement.id} 
            className={`bg-white rounded-xl shadow-sm border transition-all duration-200 overflow-hidden ${
              expandedId === announcement.id ? 'ring-2 ring-indigo-500 border-transparent' : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            {/* Header / Teaser */}
            <div 
              className="p-5 cursor-pointer flex items-start gap-4"
              onClick={() => toggleExpand(announcement.id)}
            >
              <div className={`mt-1 h-3 w-3 rounded-full flex-shrink-0 ${
                announcement.priority === 'HIGH' ? 'bg-red-500' : 
                announcement.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-blue-400'
              }`}></div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                    {format(announcement.date, 'MMM d, h:mm a')}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1 mb-2">{announcement.sender}</p>
                
                {/* Summary Preview if available and collapsed */}
                {summaries[announcement.id] && expandedId !== announcement.id && (
                   <div className="mt-2 text-sm text-indigo-700 bg-indigo-50 p-2 rounded-lg flex items-start">
                      <Sparkles size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                      <span className="italic line-clamp-1">{summaries[announcement.id]}</span>
                   </div>
                )}
              </div>

              <div className="text-gray-400">
                {expandedId === announcement.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedId === announcement.id && (
              <div className="px-5 pb-5 pt-0 border-t border-gray-100">
                <div className="py-4">
                  {/* AI Summary Section */}
                  <div className="mb-4">
                    {summaries[announcement.id] ? (
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg p-4">
                        <div className="flex items-center text-indigo-700 mb-2 font-medium text-sm">
                          <Sparkles size={16} className="mr-2" />
                          AI Summary
                        </div>
                        <p className="text-gray-800 text-sm leading-relaxed">
                          {summaries[announcement.id]}
                        </p>
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => handleSummarize(e, announcement.id, announcement.content)}
                        disabled={loadingSummary === announcement.id}
                        className="flex items-center text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors"
                      >
                        {loadingSummary === announcement.id ? (
                           <>
                             <div className="animate-spin h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full mr-2"></div>
                             Summarizing...
                           </>
                        ) : (
                           <>
                             <Sparkles size={16} className="mr-2" />
                             Summarize with AI
                           </>
                        )}
                      </button>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Message</h4>
                  <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
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