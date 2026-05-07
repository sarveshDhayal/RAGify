import React, { useEffect } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, FileText, MessageSquare, Database, Trash2, LogOut, Settings, Menu, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { getDocuments, deleteDocument } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { documents, setDocuments, currentDocumentId, setCurrentDocumentId } = useStore();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (e) {
      console.error("Failed to load docs");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id);
      setDocuments(documents.filter(d => d.id !== id));
      if (currentDocumentId === id) setCurrentDocumentId(null);
      toast.success('Document deleted');
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate('/auth');
  };

  const navItems = [
    { icon: MessageSquare, label: 'Chat', path: '/dashboard' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="flex h-screen w-full bg-[#0B0F19] text-white overflow-hidden font-sans selection:bg-purple-500/30">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e1e2d', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
      
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]" />
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/10 shadow-lg">
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:relative inset-y-0 left-0 w-72 border-r border-white/10 bg-white/[0.02] backdrop-blur-3xl flex flex-col z-40 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
          <Link to="/" className="flex items-center gap-2 group">
            <BrainCircuit className="text-purple-500 w-8 h-8 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xl tracking-tight text-white">RAGify</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-2 mb-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive ? 'text-white bg-white/10 shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={20} className={isActive ? 'text-purple-400' : 'group-hover:text-purple-400'} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div>
            <div className="flex items-center justify-between px-2 mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Documents</h3>
              <button onClick={fetchDocs} className="text-gray-500 hover:text-white transition-colors">
                <Database size={14} />
              </button>
            </div>
            
            <div className="space-y-1">
              {documents.length === 0 ? (
                <div className="px-2 py-3 text-xs text-gray-500 italic">No documents indexed.</div>
              ) : (
                documents.map(doc => (
                  <div key={doc.id} className="group flex items-center justify-between px-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText size={14} className="text-blue-400 shrink-0" />
                      <span className="text-sm text-gray-300 truncate">{doc.filename}</span>
                    </div>
                    <button onClick={() => handleDelete(doc.id)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 shrink-0 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-3">
            {user?.picture ? (
              <img src={user.picture} alt="Profile" className="w-9 h-9 rounded-full border border-white/20 shadow-lg" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center border border-white/20 shadow-lg">
                <span className="text-sm font-bold text-white">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
              </div>
            )}
            <div className="flex flex-col w-[120px]">
              <span className="text-sm font-medium text-white truncate">{user?.name || 'User'}</span>
              <span className="text-xs text-gray-500 truncate">{user?.email}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-400 transition-colors bg-white/5 hover:bg-white/10 rounded-lg" title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
