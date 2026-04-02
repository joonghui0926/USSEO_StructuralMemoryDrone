import React from 'react';
import Layout from '../components/Layout';
import { Battery, Signal, Wifi, Radio, Wind, Thermometer, MapPin, Zap, Activity } from 'lucide-react';

const DroneStatus = () => {
  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-brand-950 tracking-tight">Fleet Telemetry</h2>
          <p className="text-slate-500 mt-2">Real-time operational status & environmental sensors.</p>
        </div>
        <div className="flex gap-3">
             <div className="px-4 py-2 bg-emerald-50 rounded-full text-sm font-medium text-emerald-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Network Nominal
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <DroneCard 
            id="SMD-alpha-01"
            status="Docked"
            subStatus="Charging"
            battery={98}
            signal={100}
            location="Sector 4 Base"
            color="emerald"
        />
         <DroneCard 
            id="SMD-beta-02"
            status="In Flight"
            subStatus="Waypoint C"
            battery={45}
            signal={85}
            location="Coastal Highway Overpass"
            inFlight
            color="blue"
        />
         <DroneCard 
            id="SMD-gamma-03"
            status="Maintenance"
            subStatus="Repair Bay"
            battery={12}
            signal={0}
            location="HQ Repair Bay"
            isOffline
            color="slate"
        />
      </div>
    </Layout>
  );
};

const DroneCard = ({ id, status, subStatus, battery, signal, location, inFlight, isOffline, color }) => {
    const statusColors = {
        emerald: "bg-emerald-500",
        blue: "bg-blue-500",
        slate: "bg-slate-400"
    };
    const bgColors = {
        emerald: "from-emerald-500/10 to-emerald-500/5",
        blue: "from-blue-500/10 to-blue-500/5",
        slate: "from-slate-100 to-slate-50"
    };

    return (
    <div className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${isOffline ? 'bg-slate-50 opacity-80' : 'bg-white shadow-xl shadow-slate-200 hover:-translate-y-1'}`}>
        
        {!isOffline && <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${bgColors[color]} rounded-bl-full -mr-8 -mt-8`}></div>}

        <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Radio size={16} className={inFlight ? "text-blue-500 animate-pulse" : "text-slate-400"} />
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">{id}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${statusColors[color]}`}></span>
                        <p className="text-sm font-medium text-slate-500">{status} <span className="text-slate-300">|</span> {subStatus}</p>
                    </div>
                </div>
                {inFlight && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-bold">
                        <Activity size={12} /> Live
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Battery size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Battery</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className={`text-2xl font-bold ${battery < 30 ? 'text-red-500' : 'text-slate-700'}`}>{battery}</span>
                        <span className="text-xs text-slate-400 font-bold">%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <div className={`h-full rounded-full ${battery < 30 ? 'bg-red-500' : 'bg-slate-800'}`} style={{ width: `${battery}%` }}></div>
                    </div>
                </div>
                <div>
                     <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Zap size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Signal</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className={`text-2xl font-bold ${signal < 50 ? 'text-orange-600' : 'text-slate-700'}`}>{signal}</span>
                        <span className="text-xs text-slate-400 font-bold">%</span>
                    </div>
                     <div className="w-full h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <div className={`h-full rounded-full ${signal < 50 ? 'bg-orange-500' : 'bg-slate-800'}`} style={{ width: `${signal}%` }}></div>
                    </div>
                </div>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                    <MapPin size={14} />
                    <span className="truncate max-w-[120px]">{location}</span>
                </div>
                {!isOffline && (
                    <div className="flex gap-3 text-slate-400">
                        <Wifi size={14} />
                        <Wind size={14} />
                        <Thermometer size={14} />
                    </div>
                )}
            </div>
        </div>
    </div>
)};

export default DroneStatus;