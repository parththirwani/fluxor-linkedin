// components/SetupStep.tsx
import React, { useState } from 'react';
import { Mail, MessageSquare, Users, Target, User, Upload, Search, FileText, ExternalLink } from 'lucide-react';
import { ProcessingMode, MessageConfig } from '../types';
import { extractUsernameFromLinkedInUrl, validateLinkedInUrl, normalizeLinkedInUrl } from '../services/profileService';

interface SetupStepProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  mode: ProcessingMode;
  onModeChange: (mode: ProcessingMode) => void;
  messageConfig: MessageConfig;
  onMessageConfigChange: (config: Partial<MessageConfig>) => void;
  singleUsername: string;
  onSingleUsernameChange: (username: string) => void;
  personName: string;
  onPersonNameChange: (name: string) => void;
  csvFile: File | null;
  onCsvFileChange: (file: File | null) => void;
  onProcessSingle: () => void;
  onProcessBulk: () => void;
  isProcessing: boolean;
}

export const SetupStep: React.FC<SetupStepProps> = React.memo(({
  apiKey,
  onApiKeyChange,
  mode,
  onModeChange,
  messageConfig,
  onMessageConfigChange,
  singleUsername,
  onSingleUsernameChange,
  personName,
  onPersonNameChange,
  csvFile,
  onCsvFileChange,
  onProcessSingle,
  onProcessBulk,
  isProcessing
}) => {
  const [linkedinInput, setLinkedinInput] = useState('');
  const [inputError, setInputError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onCsvFileChange(file);
  };

  const setPersonName = (name: string) => {
    onPersonNameChange(name);
  };

  const handleLinkedInInputChange = (value: string) => {
    setLinkedinInput(value);
    setInputError('');

    if (!value.trim()) {
      onSingleUsernameChange('');
      return;
    }

    // Check if it's a full LinkedIn URL
    if (value.includes('linkedin.com')) {
      const normalizedUrl = normalizeLinkedInUrl(value);
      
      if (validateLinkedInUrl(normalizedUrl)) {
        const username = extractUsernameFromLinkedInUrl(normalizedUrl);
        if (username) {
          onSingleUsernameChange(username);
          setInputError('');
        } else {
          setInputError('Could not extract username from LinkedIn URL');
          onSingleUsernameChange('');
        }
      } else {
        setInputError('Please enter a valid LinkedIn profile URL');
        onSingleUsernameChange('');
      }
    } else {
      // Treat as username directly
      const cleanUsername = value.trim().replace(/^@/, ''); // Remove @ if someone adds it
      
      // Basic username validation
      if (/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/.test(cleanUsername)) {
        onSingleUsernameChange(cleanUsername);
        setInputError('');
      } else {
        setInputError('Username can only contain letters, numbers, and hyphens');
        onSingleUsernameChange('');
      }
    }
  };

  const canProcessSingle = apiKey && singleUsername && !isProcessing;
  const canProcessBulk = apiKey && csvFile && !isProcessing;

  const getInputPlaceholder = () => {
    return 'Enter LinkedIn URL or username (e.g., https://linkedin.com/in/john-doe or john-doe)';
  };

  const getInputExamples = () => (
    <div className="mt-2 text-xs text-gray-500">
      <p className="font-medium mb-1">Accepted formats:</p>
      <div className="space-y-1">
        <p>• Full URL: https://linkedin.com/in/john-doe</p>
        <p>• Short URL: linkedin.com/in/john-doe</p>
        <p>• Username only: john-doe</p>
      </div>
    </div>
  );

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Configuration Panel */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Configuration</h2>
        
        {/* API Key */}
        <div className="mb-6">
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
            Your API key is used only for generating messages and isn't stored.
          </p>
        </div>

        {/* Message Configuration */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Message Configuration</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onMessageConfigChange({ messageType: 'email' })}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition ${
                  messageConfig.messageType === 'email' 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
              <button
                onClick={() => onMessageConfigChange({ messageType: 'linkedin' })}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition ${
                  messageConfig.messageType === 'linkedin' 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                LinkedIn
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onMessageConfigChange({ purpose: 'partnership' })}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition ${
                  messageConfig.purpose === 'partnership' 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Users className="w-4 h-4" />
                Partnership
              </button>
              <button
                onClick={() => onMessageConfigChange({ purpose: 'product' })}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition ${
                  messageConfig.purpose === 'product' 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Target className="w-4 h-4" />
                Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose Processing Mode</h2>
        
        {/* Mode Selection Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => onModeChange('single')}
            className={`p-4 rounded-lg border transition ${
              mode === 'single' 
                ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500 ring-opacity-20' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <User className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
            <h3 className="font-medium text-gray-900">Single Profile</h3>
            <p className="text-sm text-gray-500 mt-1">Generate message for one LinkedIn profile</p>
          </button>
          <button
            onClick={() => onModeChange('bulk')}
            className={`p-4 rounded-lg border transition ${
              mode === 'bulk' 
                ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500 ring-opacity-20' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
            <h3 className="font-medium text-gray-900">Bulk Upload</h3>
            <p className="text-sm text-gray-500 mt-1">Upload CSV file with multiple profiles</p>
          </button>
        </div>

        {/* Single Profile Input */}
        {mode === 'single' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Person's Full Name
              </label>
              <input
                type="text"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="Enter full name (e.g., Parth Thirwani)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                This will be used in the generated message instead of extracting from URL
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn Profile URL or Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={linkedinInput}
                  onChange={(e) => handleLinkedInInputChange(e.target.value)}
                  placeholder={getInputPlaceholder()}
                  className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    inputError ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              {inputError && (
                <p className="mt-1 text-xs text-red-600">{inputError}</p>
              )}
              
              {singleUsername && !inputError && (
                <div className="mt-1 flex items-center gap-1 text-xs text-green-600">
                  <span>✓ Extracted username: <code className="bg-green-50 px-1 rounded">{singleUsername}</code></span>
                </div>
              )}
              
              {getInputExamples()}
            </div>
            
            <button
              onClick={onProcessSingle}
              disabled={!canProcessSingle || !personName.trim()}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Analyze & Generate Message
            </button>
          </div>
        )}

        {/* Bulk Upload */}
        {mode === 'bulk' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Upload CSV File
                </label>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = 'data:text/csv;charset=utf-8,LinkedIn Profile\nhttps://linkedin.com/in/john-doe\nhttps://linkedin.com/in/jane-smith\nlinkedin.com/in/alex-johnson\nbob-wilson\nsarah-chen';
                    link.download = 'linkedin-profiles-template.csv';
                    link.click();
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-800 underline"
                >
                  Download Sample CSV
                </button>
              </div>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">CSV file with LinkedIn profiles</p>
                </div>
              </div>
              {csvFile && (
                <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                  <FileText className="w-4 h-4" />
                  {csvFile.name}
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <h4 className="text-sm font-medium text-blue-800 mb-1">CSV Format:</h4>
              <div className="text-xs text-blue-700 space-y-1">
                <p>First column can contain:</p>
                <ul className="list-disc list-inside ml-2 space-y-0.5">
                  <li>Full LinkedIn URLs (https://linkedin.com/in/username)</li>
                  <li>Short URLs (linkedin.com/in/username)</li>
                  <li>Just usernames (username)</li>
                </ul>
                <p className="mt-2">Header row is optional and will be automatically detected.</p>
                <p className="mt-1 font-medium">💡 Click "Download Sample CSV" above for a template!</p>
              </div>
            </div>
            
            <button
              onClick={onProcessBulk}
              disabled={!canProcessBulk}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Process CSV File
            </button>
          </div>
        )}
      </div>
    </div>
  );
});