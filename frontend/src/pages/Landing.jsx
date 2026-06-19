import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, BarChart3, FileSpreadsheet, ShieldCheck, Zap, Globe, TrendingUp, MessageSquare, Activity, MapPin } from 'lucide-react';

const features = [
  { icon: Brain, title: 'AI Comment Classification', desc: 'Automatically classify feedback using advanced NLP models in milliseconds.' },
  { icon: Globe, title: 'Multilingual Voice & Text', desc: 'Accept feedback via WhatsApp or Voice Notes in Hindi and English.' },
  { icon: MapPin, title: 'Interactive Sentiment Map', desc: 'View hyper-local sentiment trends across different cities and regions.' },
  { icon: Zap, title: 'Live Public Feed', desc: 'Real-time ticker showing exactly what the public is talking about right now.' },
  { icon: FileSpreadsheet, title: 'Bulk CSV Uploads', desc: 'Analyze thousands of survey comments securely in seconds.' },
  { icon: ShieldCheck, title: 'Toxicity Filter', desc: 'Automatically moderates and removes hate-speech or spam comments.' },
];

const liveFeed = [
  { text: "BMC roads me gaddhe barish ke baad aur badh gaye hain.", sentiment: "Negative", score: -0.8 },
  { text: "Nayi Vande Bharat train ka experience bahut shandaar tha!", sentiment: "Positive", score: 0.9 },
  { text: "GST portal par naye update ke baare mein clarity chahiye.", sentiment: "Neutral", score: 0.1 },
  { text: "Govt hospital ki line me 4 ghante lag gaye, system kharab hai.", sentiment: "Negative", score: -0.7 },
  { text: "UPI digital payment ne life bohot aasan kar di hai.", sentiment: "Positive", score: 0.8 },
];

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="overflow-hidden bg-darkSpace relative">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-neonPurple/20 blur-[120px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neonCyan/20 blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-emeraldGlow/10 blur-[150px] animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Live Public Feed Ticker */}
      <div className="bg-midnight border-b border-white/10 py-2 flex items-center overflow-hidden relative">
        <div className="absolute left-0 bg-gradient-to-r from-midnight to-transparent w-20 h-full z-10"></div>
        <div className="flex items-center gap-2 px-4 border-r border-white/10 z-20 bg-midnight shrink-0">
          <Activity className="w-4 h-4 text-roseGlow animate-pulse" />
          <span className="text-xs font-bold tracking-wider text-roseGlow uppercase">Live Feed</span>
        </div>
        <div className="flex whitespace-nowrap animate-marquee items-center pl-4">
          {liveFeed.concat(liveFeed).map((item, idx) => (
            <span key={idx} className="mx-8 text-sm flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                item.sentiment === 'Positive' ? 'bg-emeraldGlow' : 
                item.sentiment === 'Negative' ? 'bg-roseGlow' : 'bg-gray-400'
              }`}></span>
              <span className="text-gray-300">"{item.text}"</span>
            </span>
          ))}
        </div>
        <div className="absolute right-0 bg-gradient-to-l from-midnight to-transparent w-20 h-full z-10"></div>
      </div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neonCyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neonCyan"></span>
            </span>
            <span className="text-sm font-medium text-neonCyan">SentiGov AI 2.0 is Live</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-8xl font-extrabold tracking-tight"
          >
            Amplify The <br className="hidden md:block" />
            <span className="text-gradient">Voice of the People</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-2xl mx-auto text-xl text-gray-400 leading-relaxed"
          >
            The ultimate AI platform for government and citizens. Upload bulk data, speak via WhatsApp, and instantly visualize public sentiment across the nation.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/analyzer" className="btn-primary flex justify-center items-center">
              Submit Your Feedback
            </Link>
            <a href="#features" className="btn-secondary flex justify-center items-center">
              Learn How It Works
            </a>
          </motion.div>
        </div>

        {/* AI Summary Section - New Feature */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-24 mx-auto max-w-4xl"
        >
          <div className="glass-card p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-neonPurple/20 rounded-xl">
                <Brain className="w-8 h-8 text-neonPurple" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">AI Weekly Summary</h3>
                <p className="text-gray-400">Auto-generated insight from 10,000+ public comments</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-midnight rounded-xl border border-white/5 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-emeraldGlow/20 flex items-center justify-center shrink-0 mt-1">
                  <TrendingUp className="w-4 h-4 text-emeraldGlow" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Top Positive Trend</h4>
                  <p className="text-gray-400 text-sm mt-1">Citizens are highly appreciative of the Vande Bharat trains and UPI integration (85% positive).</p>
                </div>
              </div>

              <div className="p-4 bg-midnight rounded-xl border border-white/5 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-roseGlow/20 flex items-center justify-center shrink-0 mt-1">
                  <TrendingUp className="w-4 h-4 text-roseGlow rotate-180" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Major Concern</h4>
                  <p className="text-gray-400 text-sm mt-1">Significant frustration observed regarding potholes on BMC roads and delays in Govt Hospitals (72% negative).</p>
                </div>
              </div>
              
              <div className="p-4 bg-midnight rounded-xl border border-white/5 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-neonCyan/20 flex items-center justify-center shrink-0 mt-1">
                  <MessageSquare className="w-4 h-4 text-neonCyan" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">AI Recommendation</h4>
                  <p className="text-gray-400 text-sm mt-1">Deploy an interactive tracking portal for road repair updates to reduce frustration and improve transparency.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-midnight relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">Powerful AI Capabilities</h2>
            <p className="mt-4 text-gray-400 text-lg">Bridging the gap between the government and the public.</p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="glass-card hover:bg-white/10 transition-colors group cursor-pointer"
              >
                <div className="p-3 bg-white/5 rounded-xl inline-block mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-neonCyan group-hover:text-neonPurple transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
