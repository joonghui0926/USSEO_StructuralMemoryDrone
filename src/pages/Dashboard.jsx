import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { Activity, Wind, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const initialBridges = [
  { id: 1, name: "Alpha Bridge", location: "Sector 4, Urban District", status: "Active", riskTrend: "Stable", riskScore: 12, lastScan: "4h ago", droneStatus: "Docked", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop" },
  { id: 2, name: "Beta Bridge", location: "Coastal Highway", status: "Review", riskTrend: "Increasing", riskScore: 78, lastScan: "20m ago", droneStatus: "In Flight", image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=2070&auto=format&fit=crop" },
  { id: 3, name: "Gamma Bridge", location: "Industrial Zone", status: "Attention", riskTrend: "Slight Shift", riskScore: 45, lastScan: "1d ago", droneStatus: "Maintenance", image: "https://img.sbs.co.kr/newimg/news/20230501/201779329_500.jpg" },
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
          <h2 className="text-3xl font-bold text-brand-950 tracking-tight">Infrastructure Overview</h2>
          <p className="text-slate-500 mt-2">Trend-based Structural Memory drone monitoring system.</p>
        </div>
        <div className="flex gap-3">
             <div className="px-4 py-2 bg-emerald-50 rounded-full text-sm font-medium text-emerald-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Network Nominal
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {bridges.map((bridge) => (
          <div 
            key={bridge.id}
            onClick={() => navigate(`/bridge/${bridge.id}`)}
            className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="h-48 overflow-hidden relative">
              <img src={bridge.image} alt={bridge.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-4 right-4">
                 <span className={`
                    px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md
                    ${bridge.status === 'Active' ? 'bg-emerald-500/20 text-emerald-800' : ''}
                    ${bridge.status === 'Review' ? 'bg-orange-500/20 text-orange-800' : ''}
                    ${bridge.status === 'Attention' ? 'bg-red-500/20 text-red-800' : ''}
                 `}>
                    {bridge.status}
                 </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">{bridge.name}</h3>
                  <p className="text-sm text-slate-500">{bridge.location}</p>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Risk Index</span>
                  <span className={`text-xl font-bold tracking-tight ${bridge.riskScore > 50 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {bridge.riskScore}<span className="text-sm text-slate-400 font-normal">/100</span>
                  </span>
                </div>
                <div className="h-8 w-[1px] bg-slate-100 mx-2"></div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Drone Status</span>
                  <span className="text-sm font-medium text-slate-700">{bridge.droneStatus}</span>
                </div>
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
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Omega Tunnel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location / Zone</label>
                <input 
                  required
                  type="text" 
                  value={newBridge.location}
                  onChange={(e) => setNewBridge({...newBridge, location: e.target.value})}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="District 9"
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