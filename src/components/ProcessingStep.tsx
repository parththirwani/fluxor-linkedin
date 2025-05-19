// components/ProcessingStep.tsx
import React from 'react';
import { Loader } from 'lucide-react';
import { ProcessingMode, ProcessingProgress } from '../types';

interface ProcessingStepProps {
  mode: ProcessingMode;
  progress: ProcessingProgress;
}

export const ProcessingStep: React.FC<ProcessingStepProps> = React.memo(({ mode, progress }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center">
        <Loader className="w-16 h-16 mx-auto text-indigo-600 animate-spin mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {mode === 'single' ? 'Analyzing Profile & Generating Message' : 'Processing LinkedIn Profiles'}
        </h2>
        <p className="text-gray-600 mb-6">
          {mode === 'single' 
            ? 'Please wait while we analyze the profile and generate your personalized message'
            : 'This may take a few minutes depending on the number of profiles'
          }
        </p>
        {mode === 'bulk' && progress.total > 0 && (
          <div className="max-w-md mx-auto">
            <div className="bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">
              Processing {progress.current} of {progress.total} profiles ({Math.round(progress.percentage)}% complete)
            </p>
          </div>
        )}
      </div>
    </div>
  );
});