import { BrainCircuit } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="h-16 border-b border-gray-800 bg-gray-900 flex items-center px-6 sticky top-0 z-10">
      <div className="flex items-center gap-2 text-primary-500">
        <BrainCircuit size={28} />
        <span className="text-xl font-bold text-white tracking-wide">RAGify</span>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <button className="text-sm text-gray-400 hover:text-white transition-colors">Documentation</button>
        <button className="bg-primary-600 hover:bg-primary-500 text-white text-sm px-4 py-2 rounded-md font-medium transition-colors">
          Settings
        </button>
      </div>
    </nav>
  );
}
