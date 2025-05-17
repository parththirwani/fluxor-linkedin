import React from 'react';
import { Loader, Search } from 'lucide-react';
import { Person } from '../types';

interface ProfileInputTabProps {
  person: Person;
  onUpdatePerson: (field: keyof Person, value: string) => void;
  onAnalyzeProfile: () => void;
  apiKey: string;
  isAnalyzing: boolean;
}

export const ProfileInputTab: React.FC<ProfileInputTabProps> = ({
  person,
  onUpdatePerson,
  onAnalyzeProfile,
  apiKey,
  isAnalyzing
}) => {
  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          value={person.name}
          onChange={(e) => onUpdatePerson('name', e.target.value)}
          placeholder="Enter the person's full name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          LinkedIn Profile URL
        </label>
        <input
          type="url"
          value={person.linkedinUrl}
          onChange={(e) => onUpdatePerson('linkedinUrl', e.target.value)}
          placeholder="https://linkedin.com/in/username"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <h4 className="text-sm font-medium text-blue-800 mb-1">How it works:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• AI will analyze their LinkedIn profile automatically</li>
            <li>• Extract professional information, recent posts, and projects</li>
            <li>• Identify partnership opportunities with Fluxor</li>
            <li>• Generate a personalized outreach email</li>
          </ul>
        </div>
      </div>
      
      <button
        onClick={onAnalyzeProfile}
        disabled={!apiKey || !person.name || !person.linkedinUrl || isAnalyzing}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isAnalyzing ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Analyzing LinkedIn Profile...
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            Analyze Profile & Generate Insights
          </>
        )}
      </button>
    </div>
  );
};