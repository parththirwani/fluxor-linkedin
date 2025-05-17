import React from 'react';
import { User, Building, Briefcase, CheckCircle, TrendingUp, Award, FileText, Target, Mail, MessageSquare } from 'lucide-react';
import { ProfileAnalysis, Person, OutreachOptions } from '../types';

interface AnalysisResultsTabProps {
  person: Person;
  profileAnalysis: ProfileAnalysis;
  outreachOptions: OutreachOptions;
  onContinue: () => void;
}

export const AnalysisResultsTab: React.FC<AnalysisResultsTabProps> = ({
  person,
  profileAnalysis,
  outreachOptions,
  onContinue
}) => {
  const { extractedInfo, contentItems, partnershipBenefits } = profileAnalysis;

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'post': return <TrendingUp className="w-4 h-4" />;
      case 'article': return <FileText className="w-4 h-4" />;
      case 'project': return <Building className="w-4 h-4" />;
      case 'achievement': return <Award className="w-4 h-4" />;
      case 'interest': return <Target className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getMessageTypeDisplay = () => {
    return outreachOptions.messageType === 'email' ? 'Email' : 'LinkedIn Message';
  };

  const getPurposeDisplay = () => {
    return outreachOptions.purpose === 'partnership' ? 'Partnership' : 'Product Introduction';
  };

  return (
    <div className="space-y-4">
      {/* Extracted Profile Information */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <h3 className="font-medium text-green-800">Profile Analysis Complete</h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{person.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gray-500" />
            <span>{extractedInfo.title} at {extractedInfo.company}</span>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-600">{extractedInfo.bio}</p>
          </div>
        </div>
      </div>

      {/* Outreach Configuration */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-3">Outreach Configuration</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            {outreachOptions.messageType === 'email' ? (
              <Mail className="w-4 h-4 text-blue-600" />
            ) : (
              <MessageSquare className="w-4 h-4 text-blue-600" />
            )}
            <span className="text-sm text-blue-700">
              <span className="font-medium">Type:</span> {getMessageTypeDisplay()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-700">
              <span className="font-medium">Purpose:</span> {getPurposeDisplay()}
            </span>
          </div>
        </div>
      </div>

      {/* Content Items */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-3">Key Activities & Content</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {contentItems.map((item, index) => (
            <div key={index} className="flex items-start gap-2 p-2 bg-white rounded border">
              <div className="text-indigo-600 mt-0.5">
                {getContentIcon(item.type)}
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">
                  {item.type}
                </span>
                <p className="text-sm text-gray-700">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Partnership Benefits - Only show for partnership purpose */}
      {outreachOptions.purpose === 'partnership' && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h4 className="font-medium text-indigo-800 mb-3">Partnership Opportunities</h4>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {partnershipBenefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded border p-3">
                <div className="mb-2">
                  <span className="text-xs font-medium text-green-600">For them:</span>
                  <p className="text-sm text-gray-700">{benefit.forThem}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-blue-600">For Fluxor:</span>
                  <p className="text-sm text-gray-700">{benefit.forFluxor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onContinue}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition flex items-center justify-center gap-2"
      >
        Generate {getMessageTypeDisplay()}
      </button>
    </div>
  );
};