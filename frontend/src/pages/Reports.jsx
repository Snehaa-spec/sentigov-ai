import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, FileType, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Reports() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage('');
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/upload-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(res.data.message);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload and process file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Data Upload & Reports</h1>
        <p className="text-gray-400 mt-2">Upload bulk consultation comments via CSV for AI processing.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card max-w-2xl mx-auto"
      >
        <div className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center hover:bg-white/5 transition-colors duration-300 relative">
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={loading}
          />
          
          <UploadCloud className="w-16 h-16 mx-auto text-cyan mb-4" />
          <h3 className="text-xl font-semibold mb-2">Drag and drop your CSV file here</h3>
          <p className="text-gray-400 mb-6">or click to browse from your computer</p>
          
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-darkBlue px-4 py-2 rounded-full border border-white/10">
            <FileType className="w-4 h-4" />
            Supports .csv files with a 'text' or 'comment' column
          </div>
        </div>

        {file && (
          <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileType className="w-6 h-6 text-purple" />
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button 
              onClick={handleUpload}
              disabled={loading}
              className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              {loading ? 'Processing...' : 'Process File'}
            </button>
          </div>
        )}

        {message && (
          <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-3 text-green-400">
            <CheckCircle2 className="w-5 h-5" />
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
