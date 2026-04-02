import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
  const { loginWithGoogle, login, signup } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async () => {
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      setError("Failed to sign in with Google.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signup(email, password, email.split('@')[0]); 
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
         setError("Incorrect email or password.");
      } else if (error.code === 'auth/email-already-in-use') {
         setError("Email already in use.");
      } else if (error.code === 'auth/weak-password') {
         setError("Password should be at least 6 characters.");
      } else {
         setError("Failed to authenticate. Please check your input.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-slate-900 relative">
      <div className="hidden lg:flex lg:w-1/2 relative bg-brand-950 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=2000" 
          alt="Bridge Inspection" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 via-brand-900/40 to-transparent"></div>
        
        <div className="relative z-20 flex flex-col justify-between p-20 h-full text-white">
          <div className="flex items-center gap-3">
             <span className="font-bold tracking-widest text-lg uppercase text-white drop-shadow-md">Structural Memory Drone</span>
          </div>

          <div>
            <h1 className="text-6xl font-bold tracking-tight mb-6 leading-tight drop-shadow-lg">
              Trend-based<br/>
              <span className="text-[#a3e635]">Structural Memory</span>
            </h1>
            <p className="text-white text-lg font-light max-w-md leading-relaxed drop-shadow-md">
              Human-in-the-loop decision support system for urban infrastructure safety monitoring.
            </p>
          </div>

          <div className="flex gap-8 text-xs font-medium text-white/80 uppercase tracking-widest drop-shadow-md">
            <span>Urban Planning</span>
            <span>Robotics</span>
            <span>AI Analysis</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-24 bg-white">
        <div className="w-full max-w-md space-y-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-brand-950 mb-3">
              {isSignUp ? "Join the Network" : "Control Console"}
            </h2>
            <p className="text-slate-500">
              {isSignUp ? "Register for structural monitoring access." : "Authenticate to access drone telemetry and memory logs."}
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                <AlertCircle size={16} />
                {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full px-4 py-3 bg-slate-50 border-b-2 border-slate-200 focus:border-brand-900 focus:bg-white outline-none transition-colors rounded-t-md" 
                placeholder="engineer@kaist.ac.kr" 
              />
            </div>
            <div>
               <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full px-4 py-3 bg-slate-50 border-b-2 border-slate-200 focus:border-brand-900 focus:bg-white outline-none transition-colors rounded-t-md" 
                placeholder="••••••••" 
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-brand-900 text-white rounded-lg font-medium hover:bg-brand-800 transition-all shadow-lg shadow-brand-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? "Processing..." : (isSignUp ? "Initialize Account" : "Access System")}</span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-medium tracking-wider">Authentication Provider</span>
              </div>
            </div>

            <button
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              <span>Continue with Google</span>
            </button>
            
            <p className="text-center text-sm text-slate-500 mt-6">
              {isSignUp ? "Already authorized?" : "New to the system?"}{" "}
              <button 
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="font-semibold text-brand-900 hover:underline underline-offset-4"
              >
                {isSignUp ? "Log in" : "Request Access"}
              </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;