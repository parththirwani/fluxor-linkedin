import { useState } from 'react';
import { OutreachData, OutreachOptions } from '../types';
import { geminiService } from '../services/geminiService';

export const useOutreach = () => {
  const [outreachData, setOutreachData] = useState<OutreachData>({
    person: {
      name: '',
      linkedinUrl: '',
    },
    outreachOptions: {
      messageType: 'email',
      purpose: 'partnership'
    },
    status: 'idle'
  });

  const updatePerson = (field: keyof OutreachData['person'], value: string) => {
    setOutreachData(prev => ({
      ...prev,
      person: { ...prev.person, [field]: value }
    }));
  };

  const updateOutreachOptions = (options: OutreachOptions) => {
    setOutreachData(prev => ({
      ...prev,
      outreachOptions: options
    }));
  };

  const analyzeProfile = async (apiKey: string) => {
    if (!apiKey || !outreachData.person.name || !outreachData.person.linkedinUrl) {
      throw new Error('Name, LinkedIn URL, and API key are required');
    }

    if (!outreachData.person.linkedinUrl.includes('linkedin.com')) {
      throw new Error('Please enter a valid LinkedIn URL');
    }

    setOutreachData(prev => ({
      ...prev,
      status: 'analyzing',
      profileAnalysis: undefined,
      emailContent: undefined,
      error: undefined
    }));

    try {
      const profileAnalysis = await geminiService.analyzeLinkedInProfile(apiKey, outreachData.person);
      
      // Update person with extracted info
      setOutreachData(prev => ({
        ...prev,
        person: {
          ...prev.person,
          title: profileAnalysis.extractedInfo.title,
          company: profileAnalysis.extractedInfo.company,
          bio: profileAnalysis.extractedInfo.bio
        },
        profileAnalysis,
        status: 'analyzed'
      }));
    } catch (error) {
      setOutreachData(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to analyze profile'
      }));
      throw error;
    }
  };

  const generateMessage = async (apiKey: string) => {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    if (!outreachData.profileAnalysis) {
      throw new Error('Profile analysis is required. Please analyze the profile first.');
    }

    setOutreachData(prev => ({
      ...prev,
      status: 'generating',
      emailContent: undefined,
      error: undefined
    }));

    try {
      const messageContent = await geminiService.generatePersonalizedOutreach(apiKey, outreachData);
      
      setOutreachData(prev => ({
        ...prev,
        emailContent: messageContent,
        status: 'success'
      }));
    } catch (error) {
      setOutreachData(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to generate message'
      }));
      throw error;
    }
  };

  const resetData = () => {
    setOutreachData({
      person: {
        name: '',
        linkedinUrl: '',
      },
      outreachOptions: {
        messageType: 'email',
        purpose: 'partnership'
      },
      status: 'idle'
    });
  };

  return {
    outreachData,
    updatePerson,
    updateOutreachOptions,
    analyzeProfile,
    generateMessage,
    resetData
  };
};