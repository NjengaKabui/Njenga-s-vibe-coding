import React, { useState } from 'react';
import { MOCK_PORTALS } from '../constants';
import { Check, Loader2, Link as LinkIcon, AlertCircle } from 'lucide-react';

const Settings: React.FC = () => {
  const [portals, setPortals] = useState(MOCK_PORTALS);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const handleConnect = (id: string) => {
    setConnectingId(id);
    // Simulate connection delay
    setTimeout(() => {
      setPortals(prev => prev.map(p => 
        p.id === id ? { ...p, isConnected: !p.isConnected } : p
      ));
      setConnectingId(null);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Integrations</h2>
        <p className="text-gray-500">Manage your connections to school portals and LMS.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-800">Learning Management Systems</h3>
          <p className="text-sm text-gray-500 mt-1">
             Sync your classes, assignments, and announcements automatically.
          </p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {portals.map((portal) => (
            <div key={portal.id} className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                    <img src={portal.logo} alt={portal.name} className="h-full w-full object-cover opacity-80" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{portal.name}</h4>
                  {portal.isConnected ? (
                    <div className="flex items-center text-green-600 text-xs mt-1">
                      <Check size={12} className="mr-1" />
                      Connected • Last synced Just now
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">Not connected</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleConnect(portal.id)}
                disabled={connectingId === portal.id}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  portal.isConnected
                    ? 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-200'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
                }`}
              >
                {connectingId === portal.id ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : portal.isConnected ? (
                  'Disconnect'
                ) : (
                  'Connect'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reminder Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
           <div className="flex items-center justify-between">
               <div>
                   <p className="text-sm font-medium text-gray-900">Class Reminders</p>
                   <p className="text-xs text-gray-500">Get notified before class starts</p>
               </div>
               <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                   <option>15 minutes before</option>
                   <option>30 minutes before</option>
                   <option>1 hour before</option>
               </select>
           </div>
           <div className="flex items-center justify-between">
               <div>
                   <p className="text-sm font-medium text-gray-900">Exam Alerts</p>
                   <p className="text-xs text-gray-500">Daily summaries for upcoming exams</p>
               </div>
               <div className="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in">
                   <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer translate-x-4 bg-indigo-600 border-indigo-600"/>
                   <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-indigo-600 cursor-pointer"></label>
               </div>
           </div>
        </div>
      </div>
      
      <div className="flex items-start p-4 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 text-sm">
        <AlertCircle size={20} className="mr-3 flex-shrink-0 mt-0.5" />
        <p>
            Note: This is a demo application. Connecting to real portals requires OAuth 2.0 credentials and backend proxy setup which is simulated here.
        </p>
      </div>

    </div>
  );
};

export default Settings;