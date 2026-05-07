import { create } from 'zustand';

export interface Document {
  id: string;
  filename: string;
  status?: string;
  metadata?: any;
}

export interface Citation {
  page?: number;
  text: string;
  document: string;
  chunk_id?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Citation[];
  id: string;
}

interface AppState {
  documents: Document[];
  messages: Message[];
  isUploading: boolean;
  isTyping: boolean;
  currentDocumentId: string | null;
  
  setDocuments: (docs: Document[]) => void;
  addDocument: (doc: Document) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateLastMessage: (content: string, sources?: Citation[]) => void;
  setIsUploading: (status: boolean) => void;
  setIsTyping: (status: boolean) => void;
  setCurrentDocumentId: (id: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  documents: [],
  messages: [
    {
      id: 'init-msg',
      role: 'assistant',
      content: 'Hello! Upload a document to get started. I can extract insights, summarize, and answer questions based on your files.'
    }
  ],
  isUploading: false,
  isTyping: false,
  currentDocumentId: null,

  setDocuments: (docs) => set({ documents: docs }),
  addDocument: (doc) => set((state) => ({ documents: [...state.documents, doc] })),
  
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateLastMessage: (content, sources) => set((state) => {
    const newMessages = [...state.messages];
    const lastIdx = newMessages.length - 1;
    if (lastIdx >= 0 && newMessages[lastIdx].role === 'assistant') {
      newMessages[lastIdx] = { ...newMessages[lastIdx], content, sources: sources || newMessages[lastIdx].sources };
    }
    return { messages: newMessages };
  }),
  
  setIsUploading: (status) => set({ isUploading: status }),
  setIsTyping: (status) => set({ isTyping: status }),
  setCurrentDocumentId: (id) => set({ currentDocumentId: id }),
}));
