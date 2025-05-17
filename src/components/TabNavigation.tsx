import React from 'react';
import { Tab } from '../types';

interface TabNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  optionsSelected: boolean;
  analysisComplete: boolean;
  messageGenerated: boolean;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  optionsSelected,
  analysisComplete, 
  messageGenerated 
}) => {
  const tabs = [
    { 
      id: 'info' as Tab, 
      label: 'Profile Input',
      enabled: true 
    },
    { 
      id: 'options' as Tab, 
      label: 'Outreach Options',
      enabled: true 
    },
    { 
      id: 'analysis' as Tab, 
      label: 'Analysis Results',
      enabled: analysisComplete 
    },
    { 
      id: 'email' as Tab, 
      label: 'Generated Message',
      enabled: messageGenerated 
    }
  ];

  return (
    <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          disabled={!tab.enabled}
          className={`py-2 px-3 font-medium text-sm transition-colors whitespace-nowrap ${
            activeTab === tab.id 
              ? 'text-indigo-600 border-b-2 border-indigo-600' 
              : tab.enabled
                ? 'text-gray-500 hover:text-gray-700'
                : 'text-gray-300 cursor-not-allowed'
          }`}
          onClick={() => tab.enabled && onTabChange(tab.id)}
        >
          {tab.label}
          {tab.id === 'options' && optionsSelected && (
            <span className="ml-1 text-xs bg-green-100 text-green-800 px-1 rounded">✓</span>
          )}
          {tab.id === 'analysis' && analysisComplete && (
            <span className="ml-1 text-xs bg-green-100 text-green-800 px-1 rounded">✓</span>
          )}
          {tab.id === 'email' && messageGenerated && (
            <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1 rounded">✓</span>
          )}
        </button>
      ))}
    </div>
  );
};