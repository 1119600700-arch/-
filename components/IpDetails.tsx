import React from 'react';
import { IpData } from '../types';
import { Map, Server, Clock, Flag, Network, Globe2 } from 'lucide-react';

interface IpDetailsProps {
  data: IpData | null;
}

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="flex items-start space-x-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
    <div className="p-2 bg-slate-700/50 rounded-lg text-slate-300">
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="text-slate-100 font-semibold mt-0.5 break-words">{value}</p>
    </div>
  </div>
);

export const IpDetails: React.FC<IpDetailsProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DetailItem 
        icon={<Globe2 size={20} />} 
        label="Region" 
        value={`${data.region} (${data.region_code})`} 
      />
      <DetailItem 
        icon={<Flag size={20} />} 
        label="Country" 
        value={`${data.flag.emoji} ${data.country}`} 
      />
       <DetailItem 
        icon={<Map size={20} />} 
        label="Coordinates" 
        value={`${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}`} 
      />
      <DetailItem 
        icon={<Server size={20} />} 
        label="ISP / Organization" 
        value={data.connection.org || data.connection.isp} 
      />
      <DetailItem 
        icon={<Network size={20} />} 
        label="ASN" 
        value={`AS${data.connection.asn}`} 
      />
      <DetailItem 
        icon={<Clock size={20} />} 
        label="Timezone" 
        value={`${data.timezone.id} (UTC ${data.timezone.utc})`} 
      />
    </div>
  );
};