import React, { useState } from 'react';
import { Copy, Check, Globe, ShieldCheck, MapPin } from 'lucide-react';
import { IpData } from '../types';

interface IpHeaderProps {
  data: IpData | null;
  loading: boolean;
}

export const IpHeader: React.FC<IpHeaderProps> = ({ data, loading }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (data?.ip) {
      navigator.clipboard.writeText(data.ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse flex flex-col items-center justify-center p-12 space-y-4">
        <div className="h-16 w-64 bg-slate-700 rounded-lg"></div>
        <div className="h-6 w-32 bg-slate-800 rounded"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-700/50">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Globe size={200} />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2 text-primary mb-2">
            <ShieldCheck size={20} />
            <span className="text-sm font-semibold tracking-wider uppercase">Public IP Address</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-mono font-bold text-white tracking-tighter drop-shadow-lg">
            {data.ip}
          </h1>
          <div className="flex items-center justify-center md:justify-start mt-4 text-slate-400 space-x-4">
             <div className="flex items-center space-x-1">
                <MapPin size={16} />
                <span>{data.city}, {data.country}</span>
             </div>
             <span className="h-1 w-1 bg-slate-500 rounded-full"></span>
             <span>{data.connection.isp}</span>
          </div>
        </div>

        <button
          onClick={copyToClipboard}
          className="group flex items-center justify-center h-16 w-16 md:h-20 md:w-20 bg-slate-700/50 hover:bg-primary/20 rounded-2xl border border-slate-600 transition-all duration-300 backdrop-blur-sm"
          title="Copy IP"
        >
          {copied ? (
            <Check className="text-emerald-400" size={32} />
          ) : (
            <Copy className="text-slate-300 group-hover:text-primary transition-colors" size={32} />
          )}
        </button>
      </div>
    </div>
  );
};