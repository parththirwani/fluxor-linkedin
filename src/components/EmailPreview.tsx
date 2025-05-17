import React from 'react';
import { AlertCircle, CheckCircle, Copy, Loader, Mail, Search } from 'lucide-react';

interface EmailPreviewProps {
  emailContent?: string;
  status: 'idle' | 'analyzing' | 'analyzed' | 'generating' | 'success' | 'error';
  error?: string;
  onCopy: () => void;
  copied: boolean;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({ 
  emailContent, 
  status, 
  error, 
  onCopy, 
  copied 
}) => {
  const getContent = () => {
    switch (status) {
      case 'analyzing':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2">
              <Search className="w-8 h-8 text-indigo-500 animate-pulse" />
              <p className="text-gray-600">Analyzing LinkedIn profile...</p>
              <p className="text-sm text-gray-500">This may take a few moments</p>
            </div>
          </div>
        );

      case 'analyzed':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2 text-green-600">
              <CheckCircle className="w-8 h-8" />
              <p className="text-gray-600">Profile analysis complete!</p>
              <p className="text-sm text-gray-500">Ready to generate partnership email</p>
            </div>
          </div>
        );

      case 'generating':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2">
              <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
              <p className="text-gray-600">Generating personalized email...</p>
              <p className="text-sm text-gray-500">Creating partnership outreach based on profile analysis</p>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2 text-red-500">
              <AlertCircle className="w-8 h-8" />
              <p className="text-center font-medium">Error occurred</p>
              <p className="text-center text-sm">{error}</p>
            </div>
          </div>
        );

      case 'success':
        if (emailContent) {
          return (
            <div className="whitespace-pre-line font-sans text-gray-800">
              {emailContent}
            </div>
          );
        }
        return (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2 text-green-600">
              <CheckCircle className="w-8 h-8" />
              <p className="text-gray-600">Email generated successfully!</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Mail className="w-12 h-12 mb-2" />
            <p>Your personalized partnership email will appear here</p>
            <p className="text-sm mt-1">Enter name and LinkedIn URL to get started</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Mail className="w-5 h-5 text-indigo-500" />
          Generated Message
        </h2>
        {emailContent && status === 'success' && (
          <button
            onClick={onCopy}
            className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        )}
      </div>
      
      <div className="border border-gray-200 rounded-lg p-4 min-h-96 bg-gray-50 relative overflow-auto">
        {getContent()}
      </div>
      
      {emailContent && status === 'success' && (
        <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-md">
          <h3 className="text-sm font-medium text-indigo-800 mb-1">Outreach Success Tips</h3>
          <ul className="space-y-1">
            <li className="text-sm text-indigo-700 flex items-start gap-1">
              <div className="min-w-4 mt-0.5">•</div>
              <div>Review and personalize the email further if needed</div>
            </li>
            <li className="text-sm text-indigo-700 flex items-start gap-1">
              <div className="min-w-4 mt-0.5">•</div>
              <div>Send from your professional email for better credibility</div>
            </li>
            <li className="text-sm text-indigo-700 flex items-start gap-1">
              <div className="min-w-4 mt-0.5">•</div>
              <div>Follow up within 5-7 days if you don't receive a response</div>
            </li>
            <li className="text-sm text-indigo-700 flex items-start gap-1">
              <div className="min-w-4 mt-0.5">•</div>
              <div>Connect on LinkedIn shortly after sending</div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};