import React, { useState } from 'react';
import axios from 'axios';
import { Send, Loader2, MessageSquareText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Analyzer() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Pehle box mein apna comment likhein!');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/analyze', { text });
      setResult(res.data);
      setText(''); // clear input after submit
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neonCyan/20 text-neonCyan mb-4">
            <MessageSquareText className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold">Public Feedback Portal</h1>
        <p className="text-gray-400 mt-2 text-lg">Your voice matters. Submit your feedback directly to the SentiGov AI engine.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card flex flex-col"
        >
          <label htmlFor="feedback-input" className="text-xl font-semibold mb-4 text-white cursor-text block">
            Apni Rai De (Submit Comment)
          </label>
          <form onSubmit={handleAnalyze} className="flex-grow flex flex-col">
            <textarea
              id="feedback-input"
              className="w-full flex-grow bg-midnight border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-neonCyan resize-none"
              placeholder="Sarkar ki kisi suvidha ya policy ke baare mein apni shikayat ya suzhav yahan likhein (English ya Hindi-Roman)..."
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if(error) setError('');
              }}
              rows={8}
            />
            <button 
              type="submit" 
              className="btn-primary mt-4 flex items-center justify-center gap-2 w-full"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
          {error && <p className="text-roseGlow text-sm mt-3 text-center font-semibold">{error}</p>}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card"
        >
          <h3 className="text-xl font-semibold mb-4 text-white">Your Feedback Status</h3>
          
          {result ? (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-midnight border border-white/5 text-center relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 ${
                  result.sentiment === 'Positive' ? 'bg-emeraldGlow' :
                  result.sentiment === 'Negative' ? 'bg-roseGlow' :
                  'bg-gray-400'
                }`}></div>
                <p className="text-sm text-gray-400 mb-2">AI has classified your feedback as:</p>
                <p className={`text-3xl font-bold ${
                  result.sentiment === 'Positive' ? 'text-emeraldGlow' :
                  result.sentiment === 'Negative' ? 'text-roseGlow' :
                  'text-gray-300'
                }`}>
                  {result.sentiment}
                </p>
                <p className="text-xs text-gray-500 mt-2">This feedback has been securely sent to the Govt. Dashboard.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-sm text-gray-400">AI Confidence</p>
                  <p className="text-2xl font-semibold mt-1">{(result.confidence * 100).toFixed(1)}%</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-sm text-gray-400">Urgency (Polarity)</p>
                  <p className="text-2xl font-semibold mt-1">{result.polarity}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 min-h-[300px]">
              <div className="p-4 rounded-full bg-white/5 mb-4">
                <Send className="w-8 h-8 opacity-50" />
              </div>
              <p className="text-center px-4">Submit a comment to see how the Govt AI classifies your feedback instantly.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
