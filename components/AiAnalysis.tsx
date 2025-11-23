import React, { useState } from 'react';
import { Sparkles, AlertTriangle, Info, Bot, Send } from 'lucide-react';
import { IpData, AiReport } from '../types';
import { generateIpReport, askAiQuestion } from '../services/geminiService';

interface AiAnalysisProps {
  data: IpData | null;
}

export const AiAnalysis: React.FC<AiAnalysisProps> = ({ data }) => {
  const [report, setReport] = useState<AiReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  const handleGenerateReport = async () => {
    if (!data) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateIpReport(data);
      setReport(result);
    } catch (e) {
      setError("Failed to generate AI report. Check API Key configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !chatInput.trim()) return;

    setChatLoading(true);
    setChatResponse(null);
    try {
        const answer = await askAiQuestion(chatInput, data);
        setChatResponse(answer);
    } catch(e) {
        setChatResponse("Something went wrong.");
    } finally {
        setChatLoading(false);
    }
  };

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Analysis Card */}
      <div className="bg-slate-800 rounded-3xl p-1 shadow-xl border border-slate-700 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        {!report && !loading && !error && (
            <div className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="text-purple-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Unlock AI Insights</h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                    Use Gemini to analyze the reputation, network type, and geographical context of this IP address.
                </p>
                <button 
                    onClick={handleGenerateReport}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-full transition-all shadow-lg shadow-purple-900/20 flex items-center mx-auto space-x-2"
                >
                    <Sparkles size={18} />
                    <span>Generate Analysis</span>
                </button>
            </div>
        )}

        {loading && (
            <div className="p-12 flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-purple-300 animate-pulse">Gemini is thinking...</p>
            </div>
        )}

        {report && (
          <div className="p-6 md:p-8 space-y-6 bg-slate-900/50">
            <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="text-purple-400" size={24} />
                <h3 className="text-2xl font-bold text-white">AI Intelligence Report</h3>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
                    <div className="flex items-center space-x-2 mb-3 text-blue-300">
                        <Info size={20} />
                        <h4 className="font-semibold">Network Summary</h4>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{report.summary}</p>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
                     <div className="flex items-center space-x-2 mb-3 text-amber-300">
                        <AlertTriangle size={20} />
                        <h4 className="font-semibold">Risk Assessment</h4>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{report.securityRisk}</p>
                </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-5 rounded-2xl border border-indigo-500/30">
                 <div className="flex items-center space-x-2 mb-2 text-indigo-300">
                    <Bot size={20} />
                    <h4 className="font-semibold">Did you know?</h4>
                </div>
                <p className="text-indigo-100 italic">"{report.funFact}"</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Chat */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg">
          <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Bot size={20} className="text-emerald-400"/>
            Ask Gemini about this Location
          </h4>
          
          <div className="space-y-4">
             {chatResponse && (
                 <div className="p-4 bg-slate-700/50 rounded-lg text-slate-200 text-sm border-l-4 border-emerald-500 animate-fade-in">
                     {chatResponse}
                 </div>
             )}

             <form onSubmit={handleChatSubmit} className="relative">
                 <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="e.g. Is this ISP known for fast speeds?"
                    className="w-full bg-slate-900 border border-slate-600 rounded-xl py-3 px-4 pr-12 text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-500"
                    disabled={chatLoading}
                 />
                 <button 
                    type="submit" 
                    disabled={chatLoading || !chatInput.trim()}
                    className="absolute right-2 top-2 p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 >
                     {chatLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={18} />}
                 </button>
             </form>
          </div>
      </div>
    </div>
  );
};