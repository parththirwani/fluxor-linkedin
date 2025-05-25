import React, { useState } from 'react';
import { Sparkles, History } from 'lucide-react';
import { useAppState } from './hooks/useAppState';
import { useProcessing } from './hooks/useProcessing';
import { downloadAsJson } from './utils/csvUtils';
import { SetupStep } from './components/SetupStep';
import { ProcessingStep } from './components/ProcessingStep';
import { ReviewStep } from './components/ReviewSteps';

import { GeneratedMessage } from './types';
import { MessageHistory } from './components/messageHistory';
import { MessageViewer } from './components/messageViewer';

const FluxorOutreachApp: React.FC = () => {
  const { state, actions, computed } = useAppState();
  const [selectedMessage, setSelectedMessage] = useState<GeneratedMessage | null>(null);

  const handleProcessingStart = () => {
    actions.setProcessing(true);
    actions.updateCurrentStep('processing');
  };

  const handleProcessingComplete = () => {
    actions.setProcessing(false);
    actions.updateCurrentStep('review');
    actions.setCurrentMessageIndex(0);
    // Refresh message stats after processing
    actions.loadMessageStats();
  };

  const handleProgressUpdate = (current: number, total: number) => {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    actions.updateProcessingProgress({ current, total, percentage });
  };

  const handleError = (error: string) => {
    actions.setProcessing(false);
    alert(error);
  };

  const { processSingleProfile, processBulkProfiles } = useProcessing({
    apiKey: state.apiKey,
    messageConfig: state.messageConfig,
    onMessagesGenerated: actions.setGeneratedMessages,
    onProgressUpdate: handleProgressUpdate,
    onProcessingStart: handleProcessingStart,
    onProcessingComplete: handleProcessingComplete,
    onError: handleError
  });

  // Navigation handlers
  const handlePrevious = () => {
    if (computed.canMovePrev) {
      actions.setCurrentMessageIndex(state.currentMessageIndex - 1);
    }
  };

  const handleNext = () => {
    if (computed.canMoveNext) {
      actions.setCurrentMessageIndex(state.currentMessageIndex + 1);
    }
  };

  // Message approval handlers
  const handleApprove = async () => {
    try {
      await actions.updateMessageStatus(state.currentMessageIndex, 'approved');
      if (computed.canMoveNext) {
        handleNext();
      }
    } catch (error) {
      console.error('Error approving message:', error);
    }
  };

  const handleReject = async () => {
    try {
      await actions.updateMessageStatus(state.currentMessageIndex, 'rejected');
      if (computed.canMoveNext) {
        handleNext();
      }
    } catch (error) {
      console.error('Error rejecting message:', error);
    }
  };

  // Download handlers
  const handleDownloadApproved = () => {
    const approvedMessages = state.generatedMessages.filter(msg => msg.status === 'approved');
    downloadAsJson(approvedMessages, `approved-messages-${Date.now()}.json`);
  };

  const handleDownloadRejected = () => {
    const rejectedMessages = state.generatedMessages.filter(msg => msg.status === 'rejected');
    downloadAsJson(rejectedMessages, `rejected-messages-${Date.now()}.json`);
  };

  // Processing handlers
  const handleProcessSingle = () => {
    if (state.personName.trim()) {
      processSingleProfile(state.singleUsername, state.personName.trim());
    } else {
      processSingleProfile(state.singleUsername);
    }
  };

  const handleProcessBulk = () => {
    if (state.csvFile) {
      processBulkProfiles(state.csvFile);
    }
  };

  // History handlers
  const handleShowHistory = () => {
    actions.updateCurrentStep('history');
    actions.loadMessageHistory();
  };

  const handleLoadMoreHistory = () => {
    const offset = state.historyMessages.length;
    actions.loadMessageHistory(50, offset);
  };

  const handleViewMessage = (message: GeneratedMessage) => {
    setSelectedMessage(message);
  };

  const handleUpdateMessageStatus = async (messageId: string, status: 'approved' | 'rejected') => {
    try {
      // Find the message in history
      const messageIndex = state.historyMessages.findIndex(msg => msg.id === messageId);
      if (messageIndex !== -1) {
        // Update the message status (this will update the database)
        await actions.updateMessageStatus(messageIndex, status);
        
        // Update the selected message if it's the same one
        if (selectedMessage && selectedMessage.id === messageId) {
          setSelectedMessage({ ...selectedMessage, status });
        }
      }
    } catch (error) {
      console.error('Error updating message status:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Fluxor AI Outreach Generator</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Generate personalized outreach messages for LinkedIn profiles with AI-powered analysis and approval workflow
          </p>
          
          {/* Navigation */}
          {(state.currentStep === 'setup' || state.currentStep === 'review') && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={handleShowHistory}
                className="flex items-center gap-2 px-4 py-2 text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition"
              >
                <History className="w-4 h-4" />
                View Message History ({state.messageStats.total})
              </button>
            </div>
          )}
        </header>

        {/* Step Content */}
        {state.currentStep === 'setup' && (
          <SetupStep
            apiKey={state.apiKey}
            onApiKeyChange={actions.updateApiKey}
            mode={state.mode}
            onModeChange={actions.updateMode}
            messageConfig={state.messageConfig}
            onMessageConfigChange={actions.updateMessageConfig}
            singleUsername={state.singleUsername}
            onSingleUsernameChange={actions.updateSingleUsername}
            personName={state.personName}
            onPersonNameChange={actions.updatePersonName}
            csvFile={state.csvFile}
            onCsvFileChange={actions.updateCsvFile}
            onProcessSingle={handleProcessSingle}
            onProcessBulk={handleProcessBulk}
            isProcessing={state.isProcessing}
          />
        )}

        {state.currentStep === 'processing' && (
          <ProcessingStep 
            mode={state.mode} 
            progress={state.processingProgress}
          />
        )}

        {state.currentStep === 'review' && state.generatedMessages.length > 0 && (
          <ReviewStep
            messages={state.generatedMessages}
            currentIndex={state.currentMessageIndex}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onApprove={handleApprove}
            onReject={handleReject}
            onReset={actions.resetToSetup}
            onDownloadApproved={handleDownloadApproved}
            onDownloadRejected={handleDownloadRejected}
            approvedCount={computed.approvedCount}
            rejectedCount={computed.rejectedCount}
            pendingCount={computed.pendingCount}
            canMovePrev={computed.canMovePrev}
            canMoveNext={computed.canMoveNext}
          />
        )}

        {state.currentStep === 'history' && !selectedMessage && (
          <MessageHistory
            messages={state.historyMessages}
            loading={state.historyLoading}
            messageStats={state.messageStats}
            filters={state.historyFilters}
            onFiltersChange={actions.updateHistoryFilters}
            onLoadMore={handleLoadMoreHistory}
            onDeleteMessage={actions.deleteMessage}
            onViewMessage={handleViewMessage}
            onGoBack={() => actions.updateCurrentStep('setup')}
          />
        )}

        {selectedMessage && (
          <MessageViewer
            message={selectedMessage}
            onGoBack={() => setSelectedMessage(null)}
            onUpdateStatus={handleUpdateMessageStatus}
          />
        )}

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 Fluxor | AI-Powered Partnership Outreach</p>
        </footer>
      </div>
    </div>
  );
};

export default FluxorOutreachApp;