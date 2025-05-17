import React, { useState } from 'react';
import { CheckCircle, Copy, Mail, Loader, Send, Download, MessageSquare } from 'lucide-react';
import { Person, OutreachOptions } from '../types';

interface EmailTabProps {
  emailContent: string;
  person: Person;
  outreachOptions: OutreachOptions;
  isGenerating: boolean;
}

export const EmailTab: React.FC<EmailTabProps> = ({ 
  emailContent, 
  person,
  outreachOptions,
  isGenerating 
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMessage = () => {
    const messageType = outreachOptions.messageType === 'email' ? 'email' : 'linkedin-message';
    const purpose = outreachOptions.purpose;
    const blob = new Blob([emailContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${purpose}-${messageType}-${person.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openEmailClient = () => {
    if (outreachOptions.messageType !== 'email') return;
    
    const lines = emailContent.split('\n');
    const subjectLine = lines.find(line => line.toLowerCase().startsWith('subject:'));
    const subject = subjectLine ? subjectLine.replace(/^subject:\s*/i, '') : 'Fluxor Partnership Opportunity';
    
    // Remove the subject line from the body
    const bodyContent = emailContent.replace(/^subject:.*\n?/i, '').trim();
    
    const mailtoLink = `mailto:${person.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyContent)}`;
    window.open(mailtoLink);
  };

  const openLinkedIn = () => {
    if (outreachOptions.messageType !== 'linkedin') return;
    window.open(person.linkedinUrl, '_blank');
  };

  const getMessageTypeLabel = () => {
    return outreachOptions.messageType === 'email' ? 'Email' : 'LinkedIn Message';
  };

  const getPurposeLabel = () => {
    return outreachOptions.purpose === 'partnership' ? 'Partnership' : 'Product Introduction';
  };

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-gray-600 font-medium">Generating personalized {getMessageTypeLabel().toLowerCase()}...</p>
          <p className="text-sm text-gray-500">Creating {getPurposeLabel().toLowerCase()} message based on profile analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          {outreachOptions.messageType === 'email' ? (
            <Mail className="w-5 h-5 text-indigo-600" />
          ) : (
            <MessageSquare className="w-5 h-5 text-indigo-600" />
          )}
          {getPurposeLabel()} {getMessageTypeLabel()} for {person.name}
        </h3>
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
        </div>
      </div>

      {/* Recipient Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">{person.name}</p>
            {person.title && person.company && (
              <p className="text-sm text-gray-600">{person.title} at {person.company}</p>
            )}
            {outreachOptions.messageType === 'email' && person.email && (
              <p className="text-sm text-gray-500">{person.email}</p>
            )}
            {outreachOptions.messageType === 'linkedin' && (
              <p className="text-sm text-gray-500">LinkedIn Profile</p>
            )}
          </div>
          {outreachOptions.messageType === 'email' && person.email ? (
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
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-white p-4 min-h-80 max-h-96 overflow-y-auto">
          <div className="whitespace-pre-line font-sans text-gray-800 leading-relaxed">
            {emailContent}
          </div>
        </div>
      </div>

      {/* Action Tips */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-green-800 mb-2">✅ Before Sending</h4>
          <ul className="space-y-1 text-sm text-green-700">
            {outreachOptions.messageType === 'email' ? (
              <>
                <li>• Review the email for accuracy and tone</li>
                <li>• Add any specific details about your company</li>
                <li>• Verify the recipient's email address</li>
                <li>• Consider the best time to send (Tuesday-Thursday, 10am-2pm)</li>
              </>
            ) : (
              <>
                <li>• Review the message for LinkedIn character limits</li>
                <li>• Consider sending a connection request first</li>
                <li>• Check their recent activity for timing</li>
                <li>• Keep follow-ups casual and professional</li>
              </>
            )}
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">📈 Follow-up Strategy</h4>
          <ul className="space-y-1 text-sm text-blue-700">
            {outreachOptions.messageType === 'email' ? (
              <>
                <li>• Wait 5-7 business days before following up</li>
                <li>• Connect on LinkedIn after sending email</li>
                <li>• Reference specific mutual connections if any</li>
                <li>• Share relevant Fluxor updates or hackathon news</li>
              </>
            ) : (
              <>
                <li>• Follow up after 1-2 weeks if no response</li>
                <li>• Engage with their posts occasionally</li>
                <li>• Share relevant content they might find interesting</li>
                <li>• Consider mentioning mutual connections</li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Message Analysis */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-amber-800 mb-2">📊 Message Analysis</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-amber-700 font-medium">Word Count:</span>
            <span className="ml-1 text-amber-800">{emailContent.split(/\s+/).length} words</span>
          </div>
          <div>
            <span className="text-amber-700 font-medium">Reading Time:</span>
            <span className="ml-1 text-amber-800">~{Math.ceil(emailContent.split(/\s+/).length / 200)} min</span>
          </div>
          <div>
            <span className="text-amber-700 font-medium">Type:</span>
            <span className="ml-1 text-amber-800">{getPurposeLabel()} {getMessageTypeLabel()}</span>
          </div>
        </div>
        <p className="text-xs text-amber-700 mt-2">
          This {getMessageTypeLabel().toLowerCase()} was AI-generated based on {person.name}'s LinkedIn profile analysis. 
          Always review and add personal touches before sending.
        </p>
      </div>
    </div>
  );
};