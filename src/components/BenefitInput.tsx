import React from 'react';
import { X } from 'lucide-react';
import { PartnershipBenefit } from '../types';

interface BenefitInputProps {
  benefit: PartnershipBenefit;
  onChange: (benefit: PartnershipBenefit) => void;
  onDelete: () => void;
  index: number;
}

export const BenefitInput: React.FC<BenefitInputProps> = ({ benefit, onChange, onDelete, index }) => {
  return (
    <div className="border border-gray-200 p-2 rounded-md mb-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-700">Partnership Benefit {index + 1}</span>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="mb-2">
        <label className="block text-xs text-gray-600 mb-1">For them:</label>
        <textarea
          value={benefit.forThem}
          onChange={(e) => onChange({ ...benefit, forThem: e.target.value })}
          placeholder="What they gain from partnering with Fluxor..."
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          rows={2}
        />
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1">For Fluxor:</label>
        <textarea
          value={benefit.forFluxor}
          onChange={(e) => onChange({ ...benefit, forFluxor: e.target.value })}
          placeholder="What Fluxor gains from this partnership..."
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          rows={2}
        />
      </div>
    </div>
  );
};