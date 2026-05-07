import { useState } from 'react';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { uploadFile } from '../services/api';

export default function UploadBox() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      await uploadFile(file);
      alert('File uploaded successfully!');
      setFile(null);
    } catch (error) {
      console.error(error);
      alert('Failed to upload file.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 w-full max-w-md mx-auto">
      <h3 className="text-lg font-medium text-white mb-4">Upload Document</h3>
      
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-primary-500 bg-primary-500/10' : 'border-gray-600 hover:border-gray-500 bg-gray-900/50'
          }`}
        >
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-sm text-gray-300 mb-1">Drag and drop your file here</p>
          <p className="text-xs text-gray-500 mb-4">Supports PDF, TXT up to 10MB</p>
          
          <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-md font-medium transition-colors">
            Browse Files
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf,.txt"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
            />
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-gray-900 p-3 rounded-lg border border-gray-700">
            <FileIcon className="text-primary-500" size={24} />
            <div className="flex-1 truncate">
              <p className="text-sm text-white font-medium truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button onClick={() => setFile(null)} className="text-gray-500 hover:text-white p-1">
              <X size={18} />
            </button>
          </div>
          <button 
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white py-2 rounded-md font-medium transition-colors"
          >
            {isUploading ? 'Uploading & Processing...' : 'Process Document'}
          </button>
        </div>
      )}
    </div>
  );
}
