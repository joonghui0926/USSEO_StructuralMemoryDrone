import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { Activity, Wind, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const initialBridges = [
  { id: 1, name: "Alpha Bridge", location: "Sector 4, Urban District", status: "Active", riskTrend: "Stable", riskScore: 12, lastScan: "4h ago", droneStatus: "Docked", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop" },
  { id: 2, name: "Beta Overpass", location: "Coastal Highway", status: "Review", riskTrend: "Increasing", riskScore: 78, lastScan: "20m ago", droneStatus: "In Flight", image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=2070&auto=format&fit=crop" },
  { id: 3, name: "Gamma Railway", location: "Industrial Zone", status: "Attention", riskTrend: "Slight Shift", riskScore: 45, lastScan: "1d ago", droneStatus: "Maintenance", image: "https://cdn.railmarket.com/cdn-cgi/image/format=auto/hub/news/431F593F8B563EEB.jpg" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [bridges, setBridges] = useState(initialBridges);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBridge, setNewBridge] = useState({ name: '', location: '' });

  const handleAddBridge = (e) => {
    e.preventDefault();
    const id = bridges.length + 1;
    const bridgeToAdd = {
      id,
      name: newBridge.name,
      location: newBridge.location,
      status: "Active",
      riskTrend: "Stable",
      riskScore: 0,
      lastScan: "Just now",
      droneStatus: "Docked",
      image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?q=80&w=2071&auto=format&fit=crop"
    };
    setBridges([...bridges, bridgeToAdd]);
    setIsModalOpen(false);
    setNewBridge({ name: '', location: '' });
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-brand-950 tracking-tight">Infrastructure Status</h2>
          <p className="text-slate-500 mt-2">Real-time memory logs & drone telemetry.</p>
        </div>
        <div className="flex gap-3">
             <div className="px-4 py-2 bg-white rounded-full border border-slate-200 text-sm font-medium text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                System Operational
             </div>
             {userRole === 'admin' && (
               <button 
                 onClick={() => setIsModalOpen(true)}
                 className="px-4 py-2 bg-brand-900 text-white rounded-full text-sm font-medium hover:bg-brand-800 transition-colors flex items-center gap-2 shadow-lg shadow-brand-900/10"
               >
                 <Plus size={16} />
                 Add Infrastructure
               </button>
             )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {bridges.map((bridge) => (
          <div 
            key={bridge.id}
            onClick={() => navigate(`/bridge/${bridge.id}`)}
            className="group bg-white rounded-xl p-0 hover:shadow-soft transition-all duration-300 cursor-pointer border border-slate-100 hover:border-brand-100 overflow-hidden"
          >
            <div className="h-48 relative overflow-hidden">
                <img 
                  src={bridge.image} 
                  alt={bridge.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-5 text-white">
                    <h3 className="text-xl font-bold">{bridge.name}</h3>
                    <p className="text-xs opacity-80 font-medium uppercase tracking-wider">{bridge.location}</p>
                </div>
                <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded text-xs font-bold backdrop-blur-md border border-white/10 ${
                        bridge.riskTrend === 'Increasing' ? 'bg-red-500/20 text-red-50' : 
                        bridge.riskTrend === 'Stable' ? 'bg-emerald-500/20 text-emerald-50' : 'bg-orange-500/20 text-orange-50'
                    }`}>
                        {bridge.status}
                    </span>
                </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Risk Index</p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-bold ${bridge.riskScore > 50 ? 'text-red-600' : 'text-brand-900'}`}>
                        {bridge.riskScore}
                    </span>
                    <span className="text-xs text-slate-400">/ 100</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Trend</p>
                  <div className="flex items-center gap-1.5">
                    {bridge.riskTrend === 'Increasing' ? <Activity size={14} className="text-red-500"/> : <Activity size={14} className="text-emerald-500"/>}
                    <span className="text-sm font-medium text-slate-700">{bridge.riskTrend}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                 <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Wind size={14} />
                    <span>Drone: {bridge.droneStatus}</span>
                 </div>
                 <span className="text-xs text-slate-400 font-mono">Last: {bridge.lastScan}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-brand-950">Add New Infrastructure</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddBridge} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Structure Name</label>
                <input 
                  required
                  type="text" 
                  value={newBridge.name}
                  onChange={(e) => setNewBridge({...newBridge, name: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. Omega Tunnel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location / Zone</label>
                <input 
                  required
                  type="text" 
                  value={newBridge.location}
                  onChange={(e) => setNewBridge({...newBridge, location: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. District 9"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-brand-900 text-white rounded-lg font-bold hover:bg-brand-800 transition-colors mt-4"
              >
                Register Structure
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;