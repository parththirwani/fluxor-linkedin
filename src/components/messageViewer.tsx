// components/MessageViewer.tsx
import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  MessageSquare,
  Users,
  Target,
  Copy,
  Download,
  Send,
  ThumbsUp,
  ThumbsDown,
  User,
  Building,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { GeneratedMessage } from '../types';

interface MessageViewerProps {
  message: GeneratedMessage;
  onGoBack: () => void;
  onUpdateStatus: (messageId: string, status: 'approved' | 'rejected') => Promise<void>;
}

export const MessageViewer: React.FC<MessageViewerProps> = ({
  message,
  onGoBack,
  onUpdateStatus
}) => {
  const [copied, setCopied] = useState(false);
  const [updating, setUpdating] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.messageContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMessage = () => {
    const content = `Name: ${message.profileData.name}
Company: ${message.profileData.company || 'N/A'}
Title: ${message.profileData.title || 'N/A'}
LinkedIn: ${message.profileData.linkedinUrl}
Message Type: ${message.messageType}
Purpose: ${message.purpose}
Status: ${message.status}
Generated: ${formatDate(message.generatedAt)}

Message Content:
${message.messageContent}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${message.profileData.name.replace(/\s+/g, '-')}-${message.messageType}-${message.purpose}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openEmailClient = () => {
    if (message.messageType !== 'email') return;
    
    const lines = message.messageContent.split('\n');
    const subjectLine = lines.find(line => line.toLowerCase().startsWith('subject:'));
    const subject = subjectLine ? subjectLine.replace(/^subject:\s*/i, '') : 'Fluxor Partnership Opportunity';
    
    const bodyContent = message.messageContent.replace(/^subject:.*\n?/i, '').trim();
    
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyContent)}`;
    window.open(mailtoLink);
  };

  const openLinkedIn = () => {
    if (message.messageType !== 'linkedin') return;
    window.open(message.profileData.linkedinUrl, '_blank');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdate = async (status: 'approved' | 'rejected') => {
    if (updating) return;
    
    setUpdating(true);
    try {
      await onUpdateStatus(message.id, status);
    } catch (error) {
      alert('Failed to update message status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onGoBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to History
        </button>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(message.status)}`}>
            {getStatusIcon(message.status)}
            {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Profile Information
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Name</label>
                <p className="text-sm font-medium text-gray-900">{message.profileData.name}</p>
              </div>
              
              {message.profileData.title && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Title</label>
                  <p className="text-sm text-gray-700">{message.profileData.title}</p>
                </div>
              )}
              
              {message.profileData.company && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Company</label>
                  <p className="text-sm text-gray-700 flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    {message.profileData.company}
                  </p>
                </div>
              )}
              
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">LinkedIn</label>
                <a
                  href={message.profileData.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  @{message.profileData.username}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              
              {message.profileData.bio && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Bio</label>
                  <p className="text-sm text-gray-700">{message.profileData.bio}</p>
                </div>
              )}

              {message.profileData.skills && message.profileData.skills.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Skills</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {message.profileData.skills.slice(0, 5).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Message Metadata */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <h4 className="text-sm font-medium text-gray-800">Message Details</h4>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Type</label>
                  <div className="flex items-center gap-1">
                    {message.messageType === 'email' ? (
                      <Mail className="w-4 h-4 text-blue-600" />
                    ) : (
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                    )}
                    <span className="text-gray-700 capitalize">{message.messageType}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Purpose</label>
                  <div className="flex items-center gap-1">
                    {message.purpose === 'partnership' ? (
                      <Users className="w-4 h-4 text-purple-600" />
                    ) : (
                      <Target className="w-4 h-4 text-orange-600" />
                    )}
                    <span className="text-gray-700 capitalize">{message.purpose}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Generated</label>
                <p className="text-sm text-gray-700 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(message.generatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Generated Message</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={downloadMessage}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 px-2 py-1 rounded border border-gray-300 hover:border-gray-400 transition"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded border border-indigo-300 hover:border-indigo-400 transition"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
                {message.messageType === 'email' ? (
                  <button
                    onClick={openEmailClient}
                    className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition text-sm"
                  >
                    <Send className="w-4 h-4" />
                    Open in Email
                  </button>
                ) : (
                  <button
                    onClick={openLinkedIn}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition text-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Open LinkedIn
                  </button>
                )}
              </div>
            </div>

            {/* Message Content */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
              <div className="bg-white p-6 max-h-80 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed text-sm">
                  {message.messageContent}
                </pre>
              </div>
            </div>

            {/* Status Update Actions */}
            {message.status === 'pending' && (
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={updating}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ThumbsDown className="w-5 h-5" />
                  {updating ? 'Updating...' : 'Reject Message'}
                </button>
                <button
                  onClick={() => handleStatusUpdate('approved')}
                  disabled={updating}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ThumbsUp className="w-5 h-5" />
                  {updating ? 'Updating...' : 'Approve Message'}
                </button>
              </div>
            )}

            {/* Message Analysis */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Message Analysis</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 font-medium">Word Count:</span>
                  <span className="ml-2 text-gray-800">{message.messageContent.split(/\s+/).length} words</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Reading Time:</span>
                  <span className="ml-2 text-gray-800">~{Math.ceil(message.messageContent.split(/\s+/).length / 200)} min</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Character Count:</span>
                  <span className="ml-2 text-gray-800">{message.messageContent.length} chars</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                This {message.messageType} was AI-generated for {message.purpose} outreach based on LinkedIn profile analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};