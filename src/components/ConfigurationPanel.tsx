import React from 'react';
import { Building } from 'lucide-react';
import { Tab, Person, ProfileAnalysis, OutreachOptions } from '../types';
import { TabNavigation } from './TabNavigation';

import { OutreachOptionsTab } from './OutreachOptionsTab';
import { AnalysisResultsTab } from './AnalysisResultsTab';
import { EmailTab } from './EmailTab';
import { ProfileInputTab } from './ProfileInfoTab';

interface ConfigurationPanelProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  person: Person;
  onUpdatePerson: (field: keyof Person, value: string) => void;
  outreachOptions: OutreachOptions;
  onUpdateOutreachOptions: (options: OutreachOptions) => void;
  profileAnalysis?: ProfileAnalysis;
  onAnalyzeProfile: () => void;
  onGenerateMessage: () => void;
  emailContent?: string;
  status: string;
  isAnalyzing: boolean;
  isGenerating: boolean;
  onResetData: () => void;
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  apiKey,
  onApiKeyChange,
  activeTab,
  onTabChange,
  person,
  onUpdatePerson,
  outreachOptions,
  onUpdateOutreachOptions,
  profileAnalysis,
  onAnalyzeProfile,
  onGenerateMessage,
  emailContent,
  status,
  isAnalyzing,
  isGenerating,
  onResetData
}) => {
  const optionsSelected = true; // Options are always configured
  const analysisComplete = status === 'analyzed' || status === 'generating' || status === 'success';
  const messageGenerated = status === 'success' && emailContent;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Building className="w-5 h-5 text-indigo-500" />
          AI Partnership Outreach
        </h2>
        {(analysisComplete || messageGenerated) && (
          <button
            onClick={onResetData}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Start New Analysis
          </button>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gemini API Key
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="Enter your Gemini API key"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Your API key is used only for profile analysis and message generation.
        </p>
      </div>

      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={onTabChange}
        optionsSelected={optionsSelected}
        analysisComplete={analysisComplete}
        messageGenerated={!!messageGenerated}
      />

      {activeTab === 'info' && (
        <ProfileInputTab
          person={person}
          onUpdatePerson={onUpdatePerson}
          onAnalyzeProfile={onAnalyzeProfile}
          apiKey={apiKey}
          isAnalyzing={isAnalyzing}
        />
      )}

      {activeTab === 'options' && (
        <OutreachOptionsTab
          outreachOptions={outreachOptions}
          onUpdateOptions={onUpdateOutreachOptions}
          onContinue={() => onTabChange('analysis')}
        />
      )}

      {activeTab === 'analysis' && profileAnalysis && (
        <AnalysisResultsTab
          person={person}
          profileAnalysis={profileAnalysis}
          outreachOptions={outreachOptions}
          onContinue={onGenerateMessage}
        />
      )}

      {activeTab === 'email' && emailContent && (
        <EmailTab
          emailContent={emailContent}
          person={person}
          outreachOptions={outreachOptions}
          isGenerating={isGenerating}
        />
      )}
    </div>
  );
};