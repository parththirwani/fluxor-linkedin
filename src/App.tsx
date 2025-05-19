import React from 'react';
import { Sparkles } from 'lucide-react';
import { useAppState } from './hooks/useAppState';
import { useProcessing } from './hooks/useProcessing';
import { downloadAsJson } from './utils/csvUtils';
import { SetupStep } from './components/SetupStep';
import { ProcessingStep } from './components/ProcessingStep';
import { ReviewStep } from './components/ReviewSteps';


const FluxorOutreachApp: React.FC = () => {
  const { state, actions, computed } = useAppState();

  const handleProcessingStart = () => {
    actions.setProcessing(true);
    actions.updateCurrentStep('processing');
  };

  const handleProcessingComplete = () => {
    actions.setProcessing(false);
    actions.updateCurrentStep('review');
    actions.setCurrentMessageIndex(0);
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
  const handleApprove = () => {
    actions.updateMessageStatus(state.currentMessageIndex, 'approved');
    if (computed.canMoveNext) {
      handleNext();
    }
  };

  const handleReject = () => {
    actions.updateMessageStatus(state.currentMessageIndex, 'rejected');
    if (computed.canMoveNext) {
      handleNext();
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
    processSingleProfile(state.singleUsername);
  };

  const handleProcessBulk = () => {
    if (state.csvFile) {
      processBulkProfiles(state.csvFile);
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

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 Fluxor | AI-Powered Partnership Outreach</p>
        </footer>
      </div>
    </div>
  );
};

export default FluxorOutreachApp;