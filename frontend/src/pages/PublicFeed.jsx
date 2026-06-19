import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Heart, Share2, Repeat2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PublicFeed() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://sentigov-ai.onrender.com/api/public-feed');
      setFeed(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Feed load karne mein error aaya. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
    // Refresh every 30 seconds
    const interval = setInterval(fetchFeed, 30000);
    return () => clearInterval(interval);
  }, []);

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  return (
    <div className="min-h-screen bg-darkSpace py-8">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* Header */}
        <div className="glass-card p-6 mb-8 flex justify-between items-center sticky top-20 z-40 backdrop-blur-xl">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="text-neonCyan w-6 h-6" />
              Public Feed
            </h1>
            <p className="text-gray-400 text-sm mt-1">Live opinions from citizens across the nation</p>
          </div>
          <button 
            onClick={fetchFeed} 
            className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
            title="Refresh Feed"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-roseGlow/20 border border-roseGlow/50 text-roseGlow px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Feed List */}
        <div className="space-y-4">
          {loading && feed.length === 0 ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-neonPurple border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : feed.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              Koi naya feedback nahi mila. Be the first to share your opinion!
            </div>
          ) : (
            feed.map((post, idx) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-midnight border border-white/10 rounded-2xl p-5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neonPurple to-neonCyan flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-sm">Citizen</span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-gray-200">Anonymous Voice</span>
                        <span className="text-gray-500 text-sm ml-2">· {timeAgo(post.created_at)}</span>
                      </div>
                      
                      {/* Sentiment Badge */}
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${
                        post.sentiment === 'Positive' ? 'bg-emeraldGlow/20 text-emeraldGlow' :
                        post.sentiment === 'Negative' ? 'bg-roseGlow/20 text-roseGlow' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {post.sentiment}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 mt-2 text-[15px] leading-relaxed">
                      {post.text}
                    </p>
                    
                    {/* Twitter-like Actions */}
                    <div className="flex gap-6 mt-4 text-gray-500">
                      <button className="flex items-center gap-2 hover:text-neonCyan transition-colors text-sm group">
                        <div className="p-2 rounded-full group-hover:bg-neonCyan/10 -ml-2 transition-colors">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        {Math.floor(Math.random() * 5)}
                      </button>
                      <button className="flex items-center gap-2 hover:text-emeraldGlow transition-colors text-sm group">
                        <div className="p-2 rounded-full group-hover:bg-emeraldGlow/10 -ml-2 transition-colors">
                          <Repeat2 className="w-4 h-4" />
                        </div>
                        {Math.floor(Math.random() * 10)}
                      </button>
                      <button className="flex items-center gap-2 hover:text-roseGlow transition-colors text-sm group">
                        <div className="p-2 rounded-full group-hover:bg-roseGlow/10 -ml-2 transition-colors">
                          <Heart className="w-4 h-4" />
                        </div>
                        {Math.floor(Math.random() * 50)}
                      </button>
                      <button className="flex items-center gap-2 hover:text-neonPurple transition-colors text-sm group ml-auto">
                        <div className="p-2 rounded-full group-hover:bg-neonPurple/10 -ml-2 transition-colors">
                          <Share2 className="w-4 h-4" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
