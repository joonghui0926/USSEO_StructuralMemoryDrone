import React from 'react';
import Layout from '../components/Layout';
import { Battery, Signal, Wifi, Radio, Wind, Thermometer, MapPin } from 'lucide-react';

const DroneStatus = () => {
  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-brand-950 tracking-tight">Fleet Telemetry</h2>
          <p className="text-slate-500 mt-2">Real-time drone status, connectivity, and environmental conditions.</p>
        </div>
        <div className="flex gap-3">
             <div className="px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100 text-sm font-medium text-emerald-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                All Systems Nominal
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <DroneCard 
            id="SMD-alpha-01"
            status="Docked - Charging"
            battery={98}
            signal={100}
            location="Sector 4 Base"
        />
         <DroneCard 
            id="SMD-beta-02"
            status="In Flight - Waypoint C"
            battery={45}
            signal={85}
            location="Coastal Highway Overpass"
            inFlight
        />
         <DroneCard 
            id="SMD-gamma-03"
            status="Maintenance"
            battery={12}
            signal={0}
            location="HQ Repair Bay"
            isOffline
        />
      </div>
    </Layout>
  );
};

const DroneCard = ({ id, status, battery, signal, location, inFlight, isOffline }) => (
    <div className={`bg-white rounded-xl p-6 shadow-soft border ${isOffline ? 'border-slate-100 opacity-60' : 'border-slate-100'} hover:border-brand-100 transition-all`}>
        <div className="flex justify-between items-start mb-6">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Radio size={18} className={inFlight ? "text-brand-500 animate-pulse" : isOffline ? "text-slate-300" : "text-slate-400"} />
                    <h3 className="text-lg font-bold text-brand-950">{id}</h3>
                </div>
                <p className="text-sm font-medium text-slate-500">{status}</p>
            </div>
            {inFlight && (
                <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-full border border-brand-100 animate-pulse">
                    Live
                </span>
            )}
             {isOffline && (
                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full border border-slate-200">
                    Offline
                </span>
            )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-slate-50">
            <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <Battery size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Battery</span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold ${battery < 30 ? 'text-red-600' : 'text-brand-950'}`}>{battery}</span>
                    <span className="text-xs text-slate-400 font-bold">%</span>
                </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
                 <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <Signal size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Link Quality</span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold ${signal < 50 ? 'text-orange-600' : 'text-brand-950'}`}>{signal}</span>
                    <span className="text-xs text-slate-400 font-bold">%</span>
                </div>
            </div>
        </div>
        
        <div className="flex justify-between items-center text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
                <MapPin size={14} />
                <span>{location}</span>
            </div>
            {!isOffline && (
                <div className="flex gap-3">
                    <Wifi size={14} title="GPS Locked" className="text-brand-600" />
                    <Wind size={14} title="Wind Stable" />
                    <Thermometer size={14} title="Temps Normal" />
                </div>
            )}
        </div>
    </div>
);

export default DroneStatus;