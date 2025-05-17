import React from 'react';
import { Mail, MessageSquare, Users, Target } from 'lucide-react';
import { OutreachOptions } from '../types';

interface OutreachOptionsTabProps {
  outreachOptions: OutreachOptions;
  onUpdateOptions: (options: OutreachOptions) => void;
  onContinue: () => void;
}

export const OutreachOptionsTab: React.FC<OutreachOptionsTabProps> = ({
  outreachOptions,
  onUpdateOptions,
  onContinue
}) => {
  const messageTypeOptions = [
    {
      value: 'email' as const,
      label: 'Email',
      icon: <Mail className="w-5 h-5" />,
      description: 'Professional email outreach'
    },
    {
      value: 'linkedin' as const,
      label: 'LinkedIn Message',
      icon: <MessageSquare className="w-5 h-5" />,
      description: 'Direct LinkedIn message'
    }
  ];

  const purposeOptions = [
    {
      value: 'partnership' as const,
      label: 'Partnership',
      icon: <Users className="w-5 h-5" />,
      description: 'Propose strategic partnership and collaboration opportunities'
    },
    {
      value: 'product' as const,
      label: 'Product Introduction',
      icon: <Target className="w-5 h-5" />,
      description: 'Introduce Fluxor platform and encourage them to try it'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Message Type Selection */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Message Type</h3>
        <div className="grid grid-cols-1 gap-3">
          {messageTypeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onUpdateOptions({ ...outreachOptions, messageType: option.value })}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                outreachOptions.messageType === option.value
                  ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500 ring-opacity-20'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className={`mt-0.5 ${
                outreachOptions.messageType === option.value ? 'text-indigo-600' : 'text-gray-400'
              }`}>
                {option.icon}
              </div>
              <div className="text-left">
                <h4 className={`font-medium ${
                  outreachOptions.messageType === option.value ? 'text-indigo-900' : 'text-gray-900'
                }`}>
                  {option.label}
                </h4>
                <p className={`text-sm ${
                  outreachOptions.messageType === option.value ? 'text-indigo-700' : 'text-gray-500'
                }`}>
                  {option.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Purpose Selection */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Outreach Purpose</h3>
        <div className="grid grid-cols-1 gap-3">
          {purposeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onUpdateOptions({ ...outreachOptions, purpose: option.value })}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                outreachOptions.purpose === option.value
                  ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500 ring-opacity-20'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className={`mt-0.5 ${
                outreachOptions.purpose === option.value ? 'text-indigo-600' : 'text-gray-400'
              }`}>
                {option.icon}
              </div>
              <div className="text-left">
                <h4 className={`font-medium ${
                  outreachOptions.purpose === option.value ? 'text-indigo-900' : 'text-gray-900'
                }`}>
                  {option.label}
                </h4>
                <p className={`text-sm ${
                  outreachOptions.purpose === option.value ? 'text-indigo-700' : 'text-gray-500'
                }`}>
                  {option.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Options Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Selected Configuration</h4>
        <div className="space-y-1 text-sm text-blue-700">
          <p>
            <span className="font-medium">Message Type:</span> {
              outreachOptions.messageType === 'email' ? 'Professional Email' : 'LinkedIn Message'
            }
          </p>
          <p>
            <span className="font-medium">Purpose:</span> {
              outreachOptions.purpose === 'partnership' ? 'Partnership Proposal' : 'Product Introduction'
            }
          </p>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition flex items-center justify-center gap-2"
      >
        Continue to Profile Analysis
      </button>
    </div>
  );
};