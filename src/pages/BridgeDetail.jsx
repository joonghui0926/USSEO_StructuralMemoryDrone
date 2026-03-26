import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import { Activity, Camera, ArrowRightCircle, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

const BridgeDetail = () => {
  const { id } = useParams();
  const { userRole } = useAuth(); 

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-100">
         <div>
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <span>Infrastructure</span>
                <span>/</span>
                <span>Beta Overpass</span>
            </div>
            <h1 className="text-2xl font-bold text-brand-950">Structural Memory Inspector</h1>
         </div>
         <div className="flex gap-3 mt-4 md:mt-0">
             <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                 Export Report
             </button>
             <button className="px-4 py-2 bg-brand-900 text-white rounded-lg text-sm font-medium hover:bg-brand-800 transition-colors shadow-lg shadow-brand-900/10 flex items-center gap-2">
                 <Camera size={16} />
                 Request Drone Scan
             </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        
        <div className="lg:col-span-8 space-y-8">
            <div className="bg-slate-900 rounded-xl aspect-video relative overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <Layers className="mx-auto text-slate-700 mb-2" size={48} />
                        <p className="text-slate-500 font-medium">Interactive 3D Point Cloud</p>
                        <p className="text-slate-600 text-sm">Visualizing surface cracks & sensor nodes</p>
                    </div>
                </div>
                <div className="absolute top-1/2 left-1/3 group/marker cursor-pointer">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full ring-4 ring-emerald-900/50 animate-pulse"></div>
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-opacity">
                        Node A: Stable
                    </div>
                </div>
                <div className="absolute top-1/3 left-2/3 group/marker cursor-pointer">
                    <div className="w-4 h-4 bg-orange-500 rounded-full ring-4 ring-orange-900/50"></div>
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-opacity">
                        Node F: Deviation Detected
                    </div>
                </div>
                
                <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur px-3 py-1.5 rounded border border-white/10">
                    <div className="flex items-center gap-2 text-xs text-white/80">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Live Drone Feed: Signal Strong
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Sensor Trend Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MetricCard 
                        label="Vibration (Acceleration)" 
                        value="+15%" 
                        context="vs. Baseline" 
                        status="warning"
                        detail="RMS increased at Point B"
                    />
                    <MetricCard 
                        label="Tilt Deviation (IMU)" 
                        value="0.02°" 
                        context="Cumulative Shift" 
                        status="stable"
                        detail="Within tolerance (Point D)"
                    />
                </div>
            </div>
        </div>

        <div className="lg:col-span-4 flex flex-col h-full">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-brand-950">Decision Queue</h2>
                <p className="text-sm text-slate-500 mt-1">AI-detected anomalies requiring human verification.</p>
            </div>
            
            <div className="space-y-4">
                <DecisionItem 
                    point="Point B"
                    title="Vibration Anomaly"
                    description="Vibration RMS increased by 15% compared to previous memory log."
                    severity="medium"
                    isAdmin={userRole === 'admin'}
                />
                <DecisionItem 
                    point="Point F"
                    title="Crack Expansion"
                    description="Visual memory comparison indicates 12% growth in crack width."
                    severity="high"
                    isAdmin={userRole === 'admin'}
                />
            </div>
        </div>

      </div>
    </Layout>
  );
};

const MetricCard = ({ label, value, context, status, detail }) => (
    <div className="bg-white p-5 rounded-lg border border-slate-100 hover:border-brand-100 transition-colors">
        <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-500">{label}</span>
            <span className={`w-2 h-2 rounded-full ${status === 'warning' ? 'bg-orange-500' : 'bg-emerald-500'}`}></span>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold text-slate-900">{value}</span>
            <span className="text-xs text-slate-400 font-medium">{context}</span>
        </div>
        <p className="text-xs text-slate-500">{detail}</p>
    </div>
);

const DecisionItem = ({ point, title, description, severity, isAdmin }) => (
    <div className="group bg-white p-5 rounded-xl border border-slate-100 hover:shadow-soft transition-all duration-300">
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded tracking-wide">{point}</span>
                {severity === 'high' && <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded"><AlertTriangle size={10}/> Critical</span>}
            </div>
        </div>
        
        <h4 className="font-bold text-slate-800 text-sm mb-1">{title}</h4>
        <p className="text-xs text-slate-500 leading-relaxed mb-5">{description}</p>

        {isAdmin ? (
            <div className="flex gap-2">
                <button className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-50 rounded hover:bg-slate-100 transition-colors">
                    Ignore
                </button>
                <button className="flex-1 py-2 text-xs font-semibold text-white bg-brand-900 rounded hover:bg-brand-800 shadow-lg shadow-brand-900/10 transition-colors flex items-center justify-center gap-1">
                    <CheckCircle2 size={12} />
                    Verify
                </button>
            </div>
        ) : (
            <div className="w-full py-2 bg-slate-50 rounded border border-dashed border-slate-200 text-center">
                <span className="text-xs text-slate-400 font-medium">Waiting for Admin Review</span>
            </div>
        )}
    </div>
);

export default BridgeDetail;