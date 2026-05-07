import { FileText, MessageSquare, Settings, Database } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { icon: MessageSquare, label: 'Chat', active: true },
    { icon: FileText, label: 'Documents', active: false },
    { icon: Database, label: 'Vector Store', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 hidden md:flex flex-col h-full">
      <div className="p-4 flex-1">
        <div className="space-y-2">
          {navItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                item.active 
                  ? 'bg-gray-800 text-primary-500' 
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-2">Storage Used</p>
          <div className="w-full bg-gray-700 rounded-full h-1.5 mb-2">
            <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <p className="text-xs text-gray-300 text-right">45%</p>
        </div>
      </div>
    </aside>
  );
}
