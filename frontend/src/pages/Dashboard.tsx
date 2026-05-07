import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, File as FileIcon, X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import ReactMarkdown from 'react-markdown';
import { uploadFile, askQuestion } from '../services/api';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';
import { CitationCard } from '../components/CitationCard';

export default function Dashboard() {
  const { messages, addMessage, updateLastMessage, isUploading, setIsUploading, addDocument, documents } = useStore();
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    const toastId = toast.loading('Extracting and indexing document...');
    try {
      const res = await uploadFile(file);
      addDocument({ id: res.id, filename: res.filename });
      toast.success('Document indexed successfully!', { id: toastId });
      addMessage({ id: Date.now().toString(), role: 'assistant', content: `I've successfully indexed **${file.name}**. What would you like to know about it?` });
      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to process document.', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const simulateStreaming = async (fullText: string, sources: any[]) => {
    setIsLoading(false);
    const msgId = Date.now().toString();
    addMessage({ id: msgId, role: 'assistant', content: '', sources });
    
    let currentText = '';
    const chunk_size = 3;
    
    for (let i = 0; i < fullText.length; i += chunk_size) {
      currentText += fullText.slice(i, i + chunk_size);
      updateLastMessage(currentText, sources);
      await new Promise(r => setTimeout(r, 10)); // 10ms delay per chunk for typing effect
    }
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setQuery('');
    addMessage({ id: Date.now().toString(), role: 'user', content: userMsg });
    setIsLoading(true);

    try {
      const response = await askQuestion(userMsg);
      // Simulate real-time streaming for a premium feel
      await simulateStreaming(response.answer, response.sources);
    } catch (error) {
      setIsLoading(false);
      addMessage({ id: Date.now().toString(), role: 'assistant', content: '⚠️ Error connecting to the AI service. Please check the backend.' });
    }
  };

  return (
    <div className="h-full flex flex-col xl:flex-row gap-6 max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
      
      {/* Left Column: Upload */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6 shrink-0">
        <GlassCard className="flex-none p-6">
          <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Knowledge Base
          </h3>
          <p className="text-sm text-gray-400 mb-6">Drop a document to index it into the vector store.</p>
          
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="relative bg-black/40 border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-black/60 transition-colors"
            >
              {!file ? (
                <>
                  <UploadCloud className="w-10 h-10 text-purple-400 mb-4" />
                  <p className="text-sm font-medium text-white mb-1">Click or drag file to upload</p>
                  <p className="text-xs text-gray-500 mb-4">PDF, TXT (Max 10MB)</p>
                  <label className="bg-white/10 hover:bg-white/20 text-white text-xs px-4 py-2 rounded-lg transition cursor-pointer border border-white/5">
                    Select File
                    <input type="file" className="hidden" accept=".pdf,.txt" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
                  </label>
                </>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <FileIcon className="w-10 h-10 text-blue-400 mb-3" />
                  <p className="text-sm font-medium text-white truncate max-w-[200px] mb-1">{file.name}</p>
                  <p className="text-xs text-gray-400 mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <div className="flex gap-2 w-full">
                    <button onClick={() => setFile(null)} className="flex-1 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition border border-red-500/20">Remove</button>
                    <button onClick={handleUpload} disabled={isUploading} className="flex-1 py-2 rounded-lg bg-purple-500 text-white text-xs hover:bg-purple-600 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20">
                      {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Index Data'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex-1 overflow-hidden flex flex-col p-0 hidden xl:flex">
           <div className="p-4 border-b border-white/10 bg-white/5">
             <h3 className="text-sm font-medium text-white">Indexed Sources</h3>
           </div>
           <div className="p-4 flex-1 overflow-y-auto space-y-2">
             {documents.map((doc, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 p-2 rounded-lg border border-white/5">
                  <FileIcon size={14} className="text-blue-400 shrink-0"/>
                  <span className="truncate">{doc.filename}</span>
                </div>
             ))}
             {documents.length === 0 && <p className="text-sm text-gray-600 text-center mt-4">Empty Vector Store</p>}
           </div>
        </GlassCard>
      </div>

      {/* Right Column: AI Chat */}
      <GlassCard className="w-full xl:w-2/3 h-[600px] xl:h-[calc(100vh-4rem)] flex flex-col p-0 overflow-hidden relative">
        <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-md z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
            <span className="text-sm font-medium text-gray-200">RAGify AI Pro Engine</span>
          </div>
          <span className="text-xs text-gray-500">{documents.length} docs loaded</span>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-8 scroll-smooth">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-col'}`}
              >
                <div className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                    msg.role === 'user' 
                      ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' 
                      : 'bg-[#1e1e2d] border-white/10 text-blue-400'
                  }`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-tr-none' 
                      : 'bg-transparent text-gray-200 prose prose-invert max-w-none'
                  }`}>
                    {msg.role === 'user' ? (
                      msg.content
                    ) : (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    )}
                  </div>
                </div>

                {/* Citations block for assistant messages */}
                {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-12 pr-4 grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {msg.sources.map((src, i) => (
                      <CitationCard key={i} citation={src} index={i} />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#1e1e2d] border border-white/10 text-blue-400 flex items-center justify-center shrink-0">
                  <Bot size={14} />
                </div>
                <div className="bg-[#1a1a24] border border-white/5 rounded-2xl rounded-tl-none px-5 py-4 flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="shrink-0 p-4 bg-white/[0.02] border-t border-white/10">
          <form onSubmit={handleChat} className="relative max-w-4xl mx-auto">
            <div className="relative flex items-end gap-2 bg-[#1a1a24] border border-white/10 rounded-2xl p-1.5 shadow-xl focus-within:border-purple-500/50 transition-all">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Message RAGify..."
                className="w-full bg-transparent text-white pl-4 pr-2 py-3 focus:outline-none text-sm placeholder-gray-500"
              />
              <button 
                type="submit"
                disabled={!query.trim() || isLoading}
                className="p-3 m-1 bg-white/5 hover:bg-purple-500 text-gray-400 hover:text-white rounded-xl disabled:opacity-50 transition-colors shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[10px] text-gray-500 text-center mt-3 font-medium">RAGify AI can make mistakes. Verify important information from citations.</p>
          </form>
        </div>
      </GlassCard>

    </div>
  );
}
