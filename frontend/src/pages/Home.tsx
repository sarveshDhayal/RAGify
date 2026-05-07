import UploadBox from '../components/UploadBox';
import ChatBox from '../components/ChatBox';

export default function Home() {
  return (
    <div className="h-full flex flex-col xl:flex-row gap-6 max-w-7xl mx-auto">
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Knowledge Base</h1>
          <p className="text-gray-400 text-sm mb-6">Upload your PDFs or text documents to generate embeddings and chat with your data.</p>
          <UploadBox />
        </div>
        
        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 mt-auto">
          <h4 className="text-sm font-medium text-gray-300 mb-2">System Status</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Vector Store</span>
              <span className="text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Online</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Embedding Model</span>
              <span className="text-gray-300">BGE-Small</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full xl:w-2/3 h-[600px] xl:h-full">
        <ChatBox />
      </div>
    </div>
  );
}
