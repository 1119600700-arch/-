import React, { useEffect, useState, useCallback } from 'react';
import { fetchIpData } from './services/ipService';
import { IpData, LoadingState } from './types';
import { IpHeader } from './components/IpHeader';
import { IpDetails } from './components/IpDetails';
import { AiAnalysis } from './components/AiAnalysis';
import { SearchInput } from './components/SearchInput';
import { Activity, MapPin } from 'lucide-react';

const App: React.FC = () => {
  const [ipData, setIpData] = useState<IpData | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadIpData = useCallback(async (ip: string = '') => {
    setLoadingState(LoadingState.LOADING);
    setErrorMsg(null);
    // Reset data if new search
    if (ip) setIpData(null); 
    
    try {
      const data = await fetchIpData(ip);
      setIpData(data);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoadingState(LoadingState.ERROR);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadIpData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background text-slate-100 font-sans selection:bg-primary/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/20 p-2 rounded-lg text-primary">
                <Activity size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Sentient<span className="text-primary">IP</span></span>
            </div>
            <div className="flex items-center space-x-4">
               <a 
                 href="https://ai.google.dev/gemini-api/docs" 
                 target="_blank" 
                 rel="noreferrer"
                 className="text-xs text-slate-400 hover:text-white transition-colors"
               >
                 Powered by Gemini
               </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Discover Your Digital Footprint
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Analyze any IP address with precision geolocation data and get AI-powered security insights instantly.
          </p>
        </div>

        <SearchInput 
            onSearch={loadIpData} 
            isLoading={loadingState === LoadingState.LOADING} 
        />

        {errorMsg && (
            <div className="max-w-xl mx-auto mb-8 p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 text-center">
                {errorMsg}
            </div>
        )}

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: IP Info */}
            <div className="lg:col-span-2 space-y-8">
                <IpHeader 
                    data={ipData} 
                    loading={loadingState === LoadingState.LOADING && !ipData} 
                />
                
                {ipData && (
                    <div className="animate-fade-in-up">
                        <div className="flex items-center space-x-2 mb-4 text-slate-300">
                            <MapPin size={20} className="text-accent" />
                            <h3 className="text-xl font-semibold">Geolocation Details</h3>
                        </div>
                        <IpDetails data={ipData} />
                        
                        {/* Map Fallback / Visual */}
                        <div className="mt-8 p-1 bg-slate-800 rounded-2xl border border-slate-700 h-64 md:h-80 relative overflow-hidden group">
                           {/* Using a static Google Maps Static API type construct or generic placeholder since we don't have a Maps API key in this context. 
                               We will use an iframe embed for simplicity and robustness if possible, or just a cool visual placeholder.
                               Let's use a specialized styled placeholder that encourages using the AI features.
                           */}
                           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity duration-500"></div>
                           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                           <div className="absolute bottom-6 left-6">
                                <p className="text-white font-bold text-lg">Approximate Location</p>
                                <p className="text-slate-300">{ipData.city}, {ipData.region}, {ipData.country}</p>
                           </div>
                           <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs text-white border border-white/10">
                               Lat: {ipData.latitude} • Long: {ipData.longitude}
                           </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column: AI & Extras */}
            <div className="lg:col-span-1">
                 {loadingState === LoadingState.LOADING && !ipData ? (
                     <div className="h-96 w-full bg-slate-800/50 rounded-3xl animate-pulse"></div>
                 ) : (
                     <div className="sticky top-24">
                        <AiAnalysis data={ipData} />
                     </div>
                 )}
            </div>

        </div>
      </main>
      
      <footer className="border-t border-slate-800 mt-20 py-8 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
              <p>&copy; {new Date().getFullYear()} Sentient IP. Built with React, Tailwind & Gemini.</p>
          </div>
      </footer>
    </div>
  );
};

export default App;