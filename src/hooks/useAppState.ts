// hooks/useAppState.ts - Updated with database integration
import { useState, useCallback, useEffect } from 'react';
import DatabaseService from '../services/databaseService';
import { MessageStatus } from '@prisma/client';

// Updated types to include personName and database integration
export interface AppState {
  apiKey: string;
  mode: 'single' | 'bulk';
  currentStep: 'setup' | 'processing' | 'review' | 'history';
  messageConfig: {
    messageType: 'email' | 'linkedin';
    purpose: 'partnership' | 'product';
  };
  singleUsername: string;
  personName: string;
  csvFile: File | null;
  generatedMessages: any[];
  currentMessageIndex: number;
  isProcessing: boolean;
  processingProgress: {
    current: number;
    total: number;
    percentage: number;
  };
  // New state for database integration
  messageStats: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
  historyMessages: any[];
  historyLoading: boolean;
  historyFilters: {
    status?: 'pending' | 'approved' | 'rejected';
    messageType?: 'email' | 'linkedin';
    purpose?: 'partnership' | 'product';
    search?: string;
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

const initialMessageStats = {
  pending: 0,
  approved: 0,
  rejected: 0,
  total: 0
};

const initialState: AppState = {
  apiKey: '',
  mode: 'single',
  currentStep: 'setup',
  messageConfig: initialMessageConfig,
  singleUsername: '',
  personName: '',
  csvFile: null,
  generatedMessages: [],
  currentMessageIndex: 0,
  isProcessing: false,
  processingProgress: initialProcessingProgress,
  messageStats: initialMessageStats,
  historyMessages: [],
  historyLoading: false,
  historyFilters: {}
};

export const useAppState = () => {
  const [state, setState] = useState<AppState>(initialState);

  // Load message stats on component mount
  useEffect(() => {
    loadMessageStats();
  }, []);

  const updateApiKey = useCallback((apiKey: string) => {
    setState(prev => ({ ...prev, apiKey }));
  }, []);

  const updateMode = useCallback((mode: 'single' | 'bulk') => {
    setState(prev => ({ ...prev, mode }));
  }, []);

  const updateCurrentStep = useCallback((currentStep: 'setup' | 'processing' | 'review' | 'history') => {
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

  const updateMessageStatus = useCallback(async (index: number, status: string) => {
    const message = state.generatedMessages[index];
    if (!message) return;

    try {
      // Update in database
      const dbStatus = status.toUpperCase() as MessageStatus;
      await DatabaseService.updateMessageStatus(message.id, dbStatus);

      // Update local state
      setState(prev => ({
        ...prev,
        generatedMessages: prev.generatedMessages.map((msg, i) => 
          i === index ? { ...msg, status } : msg
        )
      }));

      // Refresh stats
      await loadMessageStats();
    } catch (error) {
      console.error('Error updating message status:', error);
      throw error;
    }
  }, [state.generatedMessages]);

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

  // Load message statistics from database
  const loadMessageStats = useCallback(async () => {
    try {
      const stats = await DatabaseService.getMessageStats();
      setState(prev => ({ ...prev, messageStats: stats }));
    } catch (error) {
      console.error('Error loading message stats:', error);
    }
  }, []);

  // Load message history from database
  const loadMessageHistory = useCallback(async (limit = 50, offset = 0) => {
    setState(prev => ({ ...prev, historyLoading: true }));
    
    try {
      const { historyFilters } = state;
      const statusFilter = historyFilters.status?.toUpperCase() as MessageStatus | undefined;
      const messageTypeFilter = historyFilters.messageType?.toUpperCase() as any;
      const purposeFilter = historyFilters.purpose?.toUpperCase() as any;

      let messages;
      
      if (historyFilters.search) {
        const result = await DatabaseService.searchMessages(historyFilters.search, limit, offset);
        messages = result.messages;
      } else {
        const result = await DatabaseService.getMessages(
          limit, 
          offset, 
          statusFilter, 
          messageTypeFilter, 
          purposeFilter
        );
        messages = result.messages;
      }

      const convertedMessages = messages.map(DatabaseService.convertToGeneratedMessage);
      
      setState(prev => ({ 
        ...prev, 
        historyMessages: offset === 0 ? convertedMessages : [...prev.historyMessages, ...convertedMessages],
        historyLoading: false 
      }));
    } catch (error) {
      console.error('Error loading message history:', error);
      setState(prev => ({ ...prev, historyLoading: false }));
    }
  }, [state.historyFilters]);

  // Update history filters
  const updateHistoryFilters = useCallback((filters: Partial<AppState['historyFilters']>) => {
    setState(prev => ({ 
      ...prev, 
      historyFilters: { ...prev.historyFilters, ...filters },
      historyMessages: [] // Clear existing messages when filters change
    }));
  }, []);

  // Delete a message
  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await DatabaseService.deleteMessage(messageId);
      
      // Remove from local state
      setState(prev => ({
        ...prev,
        generatedMessages: prev.generatedMessages.filter(msg => msg.id !== messageId),
        historyMessages: prev.historyMessages.filter(msg => msg.id !== messageId)
      }));

      // Refresh stats
      await loadMessageStats();
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
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
      personName: '',
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
      updatePersonName,
      updateCsvFile,
      setGeneratedMessages,
      updateMessageStatus,
      setCurrentMessageIndex,
      setProcessing,
      updateProcessingProgress,
      loadMessageStats,
      loadMessageHistory,
      updateHistoryFilters,
      deleteMessage,
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