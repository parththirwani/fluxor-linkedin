// hooks/useAppState.ts
import { useState, useCallback } from 'react';
import { AppState, GeneratedMessage, ProcessingMode, ApplicationStep, MessageConfig, ProcessingProgress } from '../types';

const initialMessageConfig: MessageConfig = {
  messageType: 'email',
  purpose: 'partnership'
};

const initialProcessingProgress: ProcessingProgress = {
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

  const updateMode = useCallback((mode: ProcessingMode) => {
    setState(prev => ({ ...prev, mode }));
  }, []);

  const updateCurrentStep = useCallback((currentStep: ApplicationStep) => {
    setState(prev => ({ ...prev, currentStep }));
  }, []);

  const updateMessageConfig = useCallback((messageConfig: Partial<MessageConfig>) => {
    setState(prev => ({ 
      ...prev, 
      messageConfig: { ...prev.messageConfig, ...messageConfig }
    }));
  }, []);

  const updateSingleUsername = useCallback((singleUsername: string) => {
    setState(prev => ({ ...prev, singleUsername }));
  }, []);

  const updateCsvFile = useCallback((csvFile: File | null) => {
    setState(prev => ({ ...prev, csvFile }));
  }, []);

  const setGeneratedMessages = useCallback((generatedMessages: GeneratedMessage[]) => {
    setState(prev => ({ ...prev, generatedMessages }));
  }, []);

  const updateMessageStatus = useCallback((index: number, status: GeneratedMessage['status']) => {
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

  const updateProcessingProgress = useCallback((progress: Partial<ProcessingProgress>) => {
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