import React from 'react';
import { X } from 'lucide-react';
import { ContentItem } from '../types';

interface ContentItemInputProps {
  item: ContentItem;
  onChange: (item: ContentItem) => void;
  onDelete: () => void;
}

export const ContentItemInput: React.FC<ContentItemInputProps> = ({ item, onChange, onDelete }) => {
  return (
    <div className="flex gap-2 items-start mb-2">
      <select 
        value={item.type}
        onChange={(e) => onChange({ ...item, type: e.target.value as ContentItem['type'] })}
        className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="post">Post</option>
        <option value="article">Article</option>
        <option value="project">Project</option>
        <option value="achievement">Achievement</option>
        <option value="interest">Interest</option>
      </select>
      <textarea
        value={item.content}
        onChange={(e) => onChange({ ...item, content: e.target.value })}
        placeholder="Enter content details..."
        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-8"
        rows={1}
      />
      <button
        onClick={onDelete}
        className="text-red-500 hover:text-red-700"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};