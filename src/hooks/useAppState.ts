// hooks/useAppState.ts - Updated with person name support
import { useState, useCallback } from 'react';

// Updated types to include personName
export interface AppState {
  apiKey: string;
  mode: 'single' | 'bulk';
  currentStep: 'setup' | 'processing' | 'review';
  messageConfig: {
    messageType: 'email' | 'linkedin';
    purpose: 'partnership' | 'product';
  };
  singleUsername: string;
  personName: string;  // Added person name field
  csvFile: File | null;
  generatedMessages: any[];
  currentMessageIndex: number;
  isProcessing: boolean;
  processingProgress: {
    current: number;
    total: number;
    percentage: number;
  };
}

const initialMessageConfig = {
  messageType: 'email' as const,
  purpose: 'partnership' as const
};

const initialProcessingProgress = {
  current: 0,
  total: 0,
  percentage: 0
};

const initialState: AppState = {
  apiKey: '',
  mode: 'single',
  currentStep: 'setup',
  messageConfig: initialMessageConfig,
  singleUsername: '',
  personName: '',  // Added person name field
  csvFile: null,
  generatedMessages: [],
  currentMessageIndex: 0,
  isProcessing: false,
  processingProgress: initialProcessingProgress
};

export const useAppState = () => {
  const [state, setState] = useState<AppState>(initialState);

  const updateApiKey = useCallback((apiKey: string) => {
    setState(prev => ({ ...prev, apiKey }));
  }, []);

  const updateMode = useCallback((mode: 'single' | 'bulk') => {
    setState(prev => ({ ...prev, mode }));
  }, []);

  const updateCurrentStep = useCallback((currentStep: 'setup' | 'processing' | 'review') => {
    setState(prev => ({ ...prev, currentStep }));
  }, []);

  const updateMessageConfig = useCallback((messageConfig: Partial<AppState['messageConfig']>) => {
    setState(prev => ({ 
      ...prev, 
      messageConfig: { ...prev.messageConfig, ...messageConfig }
    }));
  }, []);

  const updateSingleUsername = useCallback((singleUsername: string) => {
    setState(prev => ({ ...prev, singleUsername }));
  }, []);

  const updatePersonName = useCallback((personName: string) => {
    setState(prev => ({ ...prev, personName }));
  }, []);

  const updateCsvFile = useCallback((csvFile: File | null) => {
    setState(prev => ({ ...prev, csvFile }));
  }, []);

  const setGeneratedMessages = useCallback((generatedMessages: any[]) => {
    setState(prev => ({ ...prev, generatedMessages }));
  }, []);

  const updateMessageStatus = useCallback((index: number, status: string) => {
    setState(prev => ({
      ...prev,
      generatedMessages: prev.generatedMessages.map((msg, i) => 
        i === index ? { ...msg, status } : msg
      )
    }));
  }, []);

  const setCurrentMessageIndex = useCallback((currentMessageIndex: number) => {
    setState(prev => ({ ...prev, currentMessageIndex }));
  }, []);

  const setProcessing = useCallback((isProcessing: boolean) => {
    setState(prev => ({ ...prev, isProcessing }));
  }, []);

  const updateProcessingProgress = useCallback((progress: Partial<AppState['processingProgress']>) => {
    setState(prev => ({
      ...prev,
      processingProgress: { ...prev.processingProgress, ...progress }
    }));
  }, []);

  const resetState = useCallback(() => {
    setState(initialState);
  }, []);

  const resetToSetup = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: 'setup',
      generatedMessages: [],
      currentMessageIndex: 0,
      singleUsername: '',
      personName: '',  // Reset person name
      csvFile: null,
      processingProgress: initialProcessingProgress
    }));
  }, []);

  // Computed values
  const approvedCount = state.generatedMessages.filter(msg => msg.status === 'approved').length;
  const rejectedCount = state.generatedMessages.filter(msg => msg.status === 'rejected').length;
  const pendingCount = state.generatedMessages.filter(msg => msg.status === 'pending').length;

  const currentMessage = state.generatedMessages[state.currentMessageIndex];

  const canMoveNext = state.currentMessageIndex < state.generatedMessages.length - 1;
  const canMovePrev = state.currentMessageIndex > 0;

  return {
    state,
    actions: {
      updateApiKey,
      updateMode,
      updateCurrentStep,
      updateMessageConfig,
      updateSingleUsername,
      updatePersonName,  // Added person name action
      updateCsvFile,
      setGeneratedMessages,
      updateMessageStatus,
      setCurrentMessageIndex,
      setProcessing,
      updateProcessingProgress,
      resetState,
      resetToSetup
    },
    computed: {
      approvedCount,
      rejectedCount,
      pendingCount,
      currentMessage,
      canMoveNext,
      canMovePrev
    }
  };
};