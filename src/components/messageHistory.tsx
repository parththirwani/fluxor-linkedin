// components/MessageHistory.tsx
import React, { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  MessageSquare,
  Users,
  Target,
  Trash2,
  Eye,
  Download,
  ArrowLeft,
  Calendar
} from 'lucide-react';
import { GeneratedMessage } from '../types';

interface MessageHistoryProps {
  messages: GeneratedMessage[];
  loading: boolean;
  messageStats: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
  filters: {
    status?: 'pending' | 'approved' | 'rejected';
    messageType?: 'email' | 'linkedin';
    purpose?: 'partnership' | 'product';
    search?: string;
  };
  onFiltersChange: (filters: any) => void;
  onLoadMore: () => void;
  onDeleteMessage: (messageId: string) => void;
  onViewMessage: (message: GeneratedMessage) => void;
  onGoBack: () => void;
}

export const MessageHistory: React.FC<MessageHistoryProps> = ({
  messages,
  loading,
  messageStats,
  filters,
  onFiltersChange,
  onLoadMore,
  onDeleteMessage,
  onViewMessage,
  onGoBack
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== filters.search) {
        onFiltersChange({ ...filters, search: searchTerm });
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, filters, onFiltersChange]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
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

  const getMessageTypeIcon = (type: string) => {
    return type === 'email' ? (
      <Mail className="w-4 h-4 text-blue-600" />
    ) : (
      <MessageSquare className="w-4 h-4 text-blue-600" />
    );
  };

  const getPurposeIcon = (purpose: string) => {
    return purpose === 'partnership' ? (
      <Users className="w-4 h-4 text-purple-600" />
    ) : (
      <Target className="w-4 h-4 text-orange-600" />
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteClick = async (messageId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      try {
        await onDeleteMessage(messageId);
      } catch (error) {
        alert('Failed to delete message. Please try again.');
      }
    }
  };

  const downloadMessage = (message: GeneratedMessage, event: React.MouseEvent) => {
    event.stopPropagation();
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onGoBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Setup
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Message History</h2>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-gray-600">Pending</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{messageStats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Approved</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{messageStats.approved}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-gray-600">Rejected</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{messageStats.rejected}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Total</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{messageStats.total}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, company, or message content..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => onFiltersChange({ ...filters, status: e.target.value || undefined })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Message Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message Type</label>
                <select
                  value={filters.messageType || ''}
                  onChange={(e) => onFiltersChange({ ...filters, messageType: e.target.value || undefined })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Types</option>
                  <option value="email">Email</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>

              {/* Purpose Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <select
                  value={filters.purpose || ''}
                  onChange={(e) => onFiltersChange({ ...filters, purpose: e.target.value || undefined })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Purposes</option>
                  <option value="partnership">Partnership</option>
                  <option value="product">Product</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading && messages.length === 0 ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No messages found</p>
            <p className="text-sm mt-1">Try adjusting your filters or generate some messages first</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {messages.map((message) => (
              <div
                key={message.id}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onViewMessage(message)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {message.profileData.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(message.status)}`}>
                          {getStatusIcon(message.status)}
                          {message.status}
                        </span>
                        <div className="flex items-center gap-1 text-gray-500">
                          {getMessageTypeIcon(message.messageType)}
                          <span className="text-xs">{message.messageType}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          {getPurposeIcon(message.purpose)}
                          <span className="text-xs">{message.purpose}</span>
                        </div>
                      </div>
                    </div>

                    {/* Profile Info */}
                    <div className="text-sm text-gray-600 mb-2">
                      {message.profileData.title && message.profileData.company && (
                        <p>{message.profileData.title} at {message.profileData.company}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Generated {formatDate(message.generatedAt)}
                      </p>
                    </div>

                    {/* Message Preview */}
                    <div className="text-sm text-gray-700">
                      <p className="line-clamp-2">
                        {message.messageContent.substring(0, 150)}...
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={(e) => downloadMessage(message, e)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Download message"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onViewMessage(message)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="View message"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(message.id, e)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {messages.length > 0 && (
          <div className="p-4 border-t border-gray-200 text-center">
            <button
              onClick={onLoadMore}
              disabled={loading}
              className="px-6 py-2 text-indigo-600 hover:text-indigo-800 disabled:text-gray-400"
            >
              {loading ? 'Loading...' : 'Load More Messages'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};