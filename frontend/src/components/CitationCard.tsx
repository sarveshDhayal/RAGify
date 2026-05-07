import React from 'react';
import { Citation } from '../store/useStore';
import { FileText, ChevronRight } from 'lucide-react';

interface CitationCardProps {
  citation: Citation;
  index: number;
}

export const CitationCard: React.FC<CitationCardProps> = ({ citation, index }) => {
  return (
    <div className="bg-[#1e1e2d] border border-white/5 rounded-xl p-3 text-sm flex gap-3 items-start group hover:bg-[#252538] transition-colors cursor-pointer shadow-sm">
      <div className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold border border-purple-500/30">
        {index + 1}
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center gap-1 text-gray-300 font-medium text-xs mb-1">
          <FileText size={12} className="text-blue-400" />
          <span className="truncate">{citation.document}</span>
          {citation.page !== undefined && (
            <>
              <ChevronRight size={12} className="text-gray-500" />
              <span className="text-gray-500">Page {citation.page}</span>
            </>
          )}
        </div>
        <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">"{citation.text}"</p>
      </div>
    </div>
  );
};
