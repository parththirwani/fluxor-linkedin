import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Tab } from './types';

import { ConfigurationPanel } from './components/ConfigurationPanel';
import { EmailPreview } from './components/EmailPreview';
import { useOutreach } from './hooks/useOutReach';

const FluxorPartnershipOutreach: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('info');

  const {
    outreachData,
    updatePerson,
    updateOutreachOptions,
    analyzeProfile,
    generateMessage,
    resetData
  } = useOutreach();

  const handleAnalyzeProfile = async () => {
    try {
      await analyzeProfile(apiKey);
      setActiveTab('options');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to analyze profile');
    }
  };

  const handleGenerateMessage = async () => {
    try {
      await generateMessage(apiKey);
      setActiveTab('email');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to generate message');
    }
  };

  const handleResetData = () => {
    resetData();
    setActiveTab('info');
  };

  const copyToClipboard = () => {
    if (outreachData.emailContent) {
      navigator.clipboard.writeText(outreachData.emailContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">AI Partnership Outreach</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Automatically analyze LinkedIn profiles and generate personalized partnership emails or LinkedIn messages for Fluxor
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <ConfigurationPanel
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            person={outreachData.person}
            onUpdatePerson={updatePerson}
            outreachOptions={outreachData.outreachOptions}
            onUpdateOutreachOptions={updateOutreachOptions}
            profileAnalysis={outreachData.profileAnalysis}
            onAnalyzeProfile={handleAnalyzeProfile}
            onGenerateMessage={handleGenerateMessage}
            emailContent={outreachData.emailContent}
            status={outreachData.status}
            isAnalyzing={outreachData.status === 'analyzing'}
            isGenerating={outreachData.status === 'generating'}
            onResetData={handleResetData}
          />

          <EmailPreview
            emailContent={outreachData.emailContent}
            status={outreachData.status}
            error={outreachData.error}
            onCopy={copyToClipboard}
            copied={copied}
          />
        </div>
        
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 Fluxor | AI-Powered Partnership Outreach</p>
        </footer>
      </div>
    </div>
  );
};

export default FluxorPartnershipOutreach;