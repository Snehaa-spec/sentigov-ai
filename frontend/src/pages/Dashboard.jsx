import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MessageSquare, TrendingUp, AlertTriangle, ShieldAlert, CheckCircle2, MinusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = {
  Positive: '#06B6D4',
  Neutral: '#94A3B8',
  Negative: '#7C3AED'
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    positive_percent: 0,
    neutral_percent: 0,
    negative_percent: 0,
    accuracy_score: 0,
    recent: []
  });

  const [loading, setLoading] = useState(true);

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsRefreshing(true);
    try {
      const res = await axios.get('https://sentigov-ai.onrender.com/api/dashboard-stats');
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRefreshing(false), 500); // Small delay for visual feedback
    }
  };

  const pieData = [
    { name: 'Positive', value: stats.positive_percent },
    { name: 'Neutral', value: stats.neutral_percent },
    { name: 'Negative', value: stats.negative_percent },
  ];

  const statCards = [
    { title: 'Total Comments', value: stats.total, icon: MessageSquare, color: 'text-white' },
    { title: 'Positive', value: `${stats.positive_percent}%`, icon: CheckCircle2, color: 'text-cyan' },
    { title: 'Neutral', value: `${stats.neutral_percent}%`, icon: MinusCircle, color: 'text-gray-400' },
    { title: 'Negative', value: `${stats.negative_percent}%`, icon: AlertTriangle, color: 'text-purple' },
    { title: 'AI Accuracy', value: `${stats.accuracy_score}%`, icon: TrendingUp, color: 'text-green-400' },
  ];

  if (loading && !stats.total) {
    return <div className="flex h-[80vh] items-center justify-center">Loading Dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-400 mt-1">Real-time overview of citizen sentiment.</p>
        </div>
        <button 
          onClick={fetchStats} 
          disabled={isRefreshing}
          className="btn-secondary text-sm py-2 px-4 flex items-center gap-2 disabled:opacity-50"
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((card, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-400">{card.title}</p>
              <p className="text-2xl font-bold mt-1">{card.value}</p>
            </div>
            <div className={`p-3 rounded-lg bg-white/5 ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Sentiment Distribution */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card col-span-1"
        >
          <h3 className="text-lg font-semibold mb-4">Sentiment Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bar Chart (mock data for now to show trends) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card col-span-1 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold mb-4">Daily Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Mon', Positive: 40, Neutral: 24, Negative: 20 },
                { name: 'Tue', Positive: 30, Neutral: 13, Negative: 22 },
                { name: 'Wed', Positive: 20, Neutral: 50, Negative: 10 },
                { name: 'Thu', Positive: 27, Neutral: 39, Negative: 15 },
                { name: 'Fri', Positive: 18, Neutral: 48, Negative: 25 },
                { name: 'Sat', Positive: 23, Neutral: 38, Negative: 21 },
                { name: 'Sun', Positive: 34, Neutral: 43, Negative: 10 },
              ]}>
                <XAxis dataKey="name" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155' }}
                />
                <Legend />
                <Bar dataKey="Positive" fill={COLORS.Positive} />
                <Bar dataKey="Neutral" fill={COLORS.Neutral} />
                <Bar dataKey="Negative" fill={COLORS.Negative} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Categorized Comments */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <h3 className="text-xl font-bold mb-6">Categorized Feedback Tracker</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Positive Section */}
          <div className="glass-card flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-4 border-b border-emeraldGlow/20 pb-3">
              <h4 className="text-lg font-semibold text-emeraldGlow flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Positive
              </h4>
              <span className="bg-emeraldGlow/20 text-emeraldGlow px-3 py-1 rounded-full font-bold">
                {stats.recent.filter(c => c.sentiment === 'Positive').length}
              </span>
            </div>
            <div className="space-y-3 overflow-y-auto flex-grow pr-2">
              {stats.recent.filter(c => c.sentiment === 'Positive').map(comment => (
                <div key={comment.id} className="p-3 bg-white/5 rounded-xl border border-white/5 text-sm text-gray-300 hover:bg-white/10 transition-colors">
                  "{comment.text}"
                </div>
              ))}
              {stats.recent.filter(c => c.sentiment === 'Positive').length === 0 && (
                <div className="flex h-full items-center justify-center text-gray-500 text-sm">No positive comments found.</div>
              )}
            </div>
          </div>

          {/* Neutral Section */}
          <div className="glass-card flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-4 border-b border-gray-400/20 pb-3">
              <h4 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
                <MinusCircle className="w-5 h-5" />
                Neutral
              </h4>
              <span className="bg-gray-500/20 text-gray-300 px-3 py-1 rounded-full font-bold">
                {stats.recent.filter(c => c.sentiment === 'Neutral').length}
              </span>
            </div>
            <div className="space-y-3 overflow-y-auto flex-grow pr-2">
              {stats.recent.filter(c => c.sentiment === 'Neutral').map(comment => (
                <div key={comment.id} className="p-3 bg-white/5 rounded-xl border border-white/5 text-sm text-gray-300 hover:bg-white/10 transition-colors">
                  "{comment.text}"
                </div>
              ))}
              {stats.recent.filter(c => c.sentiment === 'Neutral').length === 0 && (
                <div className="flex h-full items-center justify-center text-gray-500 text-sm">No neutral comments found.</div>
              )}
            </div>
          </div>

          {/* Negative Section */}
          <div className="glass-card flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-4 border-b border-roseGlow/20 pb-3">
              <h4 className="text-lg font-semibold text-roseGlow flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Negative
              </h4>
              <span className="bg-roseGlow/20 text-roseGlow px-3 py-1 rounded-full font-bold">
                {stats.recent.filter(c => c.sentiment === 'Negative').length}
              </span>
            </div>
            <div className="space-y-3 overflow-y-auto flex-grow pr-2">
              {stats.recent.filter(c => c.sentiment === 'Negative').map(comment => (
                <div key={comment.id} className="p-3 bg-white/5 rounded-xl border border-white/5 text-sm text-gray-300 hover:bg-white/10 transition-colors">
                  "{comment.text}"
                </div>
              ))}
              {stats.recent.filter(c => c.sentiment === 'Negative').length === 0 && (
                <div className="flex h-full items-center justify-center text-gray-500 text-sm">No negative comments found.</div>
              )}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
