// components/ReviewStep.tsx
import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  ArrowLeft, 
  ArrowRight, 
  ThumbsUp, 
  ThumbsDown,
  Mail,
  MessageSquare,
  RotateCcw,
  Download
} from 'lucide-react';
import { GeneratedMessage } from '../types';

interface ReviewStepProps {
  messages: GeneratedMessage[];
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onApprove: () => void;
  onReject: () => void;
  onReset: () => void;
  onDownloadApproved: () => void;
  onDownloadRejected: () => void;
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
  canMovePrev: boolean;
  canMoveNext: boolean;
}

export const ReviewStep: React.FC<ReviewStepProps> = React.memo(({
  messages,
  currentIndex,
  onPrevious,
  onNext,
  onApprove,
  onReject,
  onReset,
  onDownloadApproved,
  onDownloadRejected,
  approvedCount,
  rejectedCount,
  pendingCount,
  canMovePrev,
  canMoveNext
}) => {
  const currentMessage = messages[currentIndex];
  
  if (!currentMessage) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">
                Approved: {approvedCount}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-600">
                Rejected: {rejectedCount}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">
                Pending: {pendingCount}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {currentIndex + 1} of {messages.length}
            </span>
            <div className="flex gap-1">
              <button
                onClick={onPrevious}
                disabled={!canMovePrev}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={onNext}
                disabled={!canMoveNext}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Message Review */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Name</label>
              <p className="text-sm font-medium text-gray-900">
                {currentMessage.profileData.name}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">LinkedIn</label>
              <p className="text-sm text-gray-700">
                @{currentMessage.profileData.username}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Title</label>
              <p className="text-sm text-gray-700">
                {currentMessage.profileData.title}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Company</label>
              <p className="text-sm text-gray-700">
                {currentMessage.profileData.company}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Type</label>
              <div className="flex items-center gap-1">
                {currentMessage.messageType === 'email' ? (
                  <Mail className="w-4 h-4 text-blue-600" />
                ) : (
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                )}
                <span className="text-sm text-gray-700 capitalize">
                  {currentMessage.messageType}
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Purpose</label>
              <span className="text-sm text-gray-700 capitalize">
                {currentMessage.purpose}
              </span>
            </div>
          </div>
        </div>

        {/* Message Content */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Generated Message</h3>
            <div className="flex items-center gap-2">
              {currentMessage.status === 'approved' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  Approved
                </span>
              )}
              {currentMessage.status === 'rejected' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                  <XCircle className="w-3 h-3" />
                  Rejected
                </span>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
              {currentMessage.messageContent}
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onReject}
              disabled={currentMessage.status !== 'pending'}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ThumbsDown className="w-5 h-5" />
              Reject
            </button>
            <button
              onClick={onApprove}
              disabled={currentMessage.status !== 'pending'}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ThumbsUp className="w-5 h-5" />
              Approve
            </button>
          </div>
        </div>
      </div>

      {/* Action Panel */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">Review Complete?</h3>
            <p className="text-sm text-gray-600">
              You have {pendingCount} messages pending review
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <RotateCcw className="w-4 h-4" />
              Start Over
            </button>
            {approvedCount > 0 && (
              <button
                onClick={onDownloadApproved}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Download className="w-4 h-4" />
                Download Approved ({approvedCount})
              </button>
            )}
            {rejectedCount > 0 && (
              <button
                onClick={onDownloadRejected}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <Download className="w-4 h-4" />
                Download Rejected ({rejectedCount})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});