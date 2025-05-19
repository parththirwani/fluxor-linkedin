// components/SetupStep.tsx
import React from 'react';
import { Mail, MessageSquare, Users, Target, User, Upload, Search, FileText } from 'lucide-react';
import { ProcessingMode, MessageConfig } from '../types';

interface SetupStepProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  mode: ProcessingMode;
  onModeChange: (mode: ProcessingMode) => void;
  messageConfig: MessageConfig;
  onMessageConfigChange: (config: Partial<MessageConfig>) => void;
  singleUsername: string;
  onSingleUsernameChange: (username: string) => void;
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
  csvFile,
  onCsvFileChange,
  onProcessSingle,
  onProcessBulk,
  isProcessing
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onCsvFileChange(file);
  };

  const canProcessSingle = apiKey && singleUsername && !isProcessing;
  const canProcessBulk = apiKey && csvFile && !isProcessing;

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
                LinkedIn Username
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                  linkedin.com/in/
                </span>
                <input
                  type="text"
                  value={singleUsername}
                  onChange={(e) => onSingleUsernameChange(e.target.value)}
                  placeholder="username"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Just enter the username part (e.g., "john-doe" from linkedin.com/in/john-doe)
              </p>
            </div>
            <button
              onClick={onProcessSingle}
              disabled={!canProcessSingle}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload CSV File
              </label>
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
                  <p className="text-xs text-gray-500">CSV file with LinkedIn usernames</p>
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
              <p className="text-xs text-blue-700">
                First column should contain LinkedIn usernames (e.g., "john-doe", "jane-smith")
              </p>
              <p className="text-xs text-blue-700">
                Header row is optional and will be skipped
              </p>
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