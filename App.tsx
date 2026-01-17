
import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  Home as HomeIcon, 
  Menu, 
  X, 
  Lock,
  Unlock,
  Users as UsersIcon,
  Settings,
  ArrowRight,
  ShieldCheck,
  Fingerprint
} from 'lucide-react';
import { UserRole, Team, GameID } from './types';
import { INITIAL_TEAMS } from './constants';
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import Mindclans from './views/Mindclans';
import SellProduct from './views/SellProduct';
import PitchProduct from './views/PitchProduct';
import AdminPanel from './views/AdminPanel';
import TeamRegistration from './views/TeamRegistration';

const ADMIN_SECRET = "ADMIN2026";

const App: React.FC = () => {
  const [isAdminAuth, setIsAdminAuth] = useState(() => {
    return localStorage.getItem('zerone_admin_auth') === 'true';
  });
  const [adminCode, setAdminCode] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'dashboard' | 'admin' | GameID>('home');
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('zerone_teams');
    return saved ? JSON.parse(saved) : INITIAL_TEAMS;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('zerone_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('zerone_admin_auth', isAdminAuth.toString());
  }, [isAdminAuth]);

  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (adminCode === ADMIN_SECRET) {
      setIsAdminAuth(true);
      setAdminCode('');
      setShowAdminModal(false);
      if (currentPage === 'home') setCurrentPage('dashboard');
    } else {
      alert("INVALID CLEARANCE CODE. ACCESS DENIED.");
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuth(false);
    if (currentPage === 'admin') setCurrentPage('dashboard');
  };

  const createTeamCode = (customCode: string) => {
    const upperCode = customCode.toUpperCase().trim();
    if (!upperCode) return;
    if (teams.find(t => t.accessCode === upperCode)) {
      alert("THIS CODE IS ALREADY ASSIGNED TO ANOTHER ENTRY.");
      return;
    }
    const newTeam: Team = {
      id: 't_' + Math.random().toString(36).substr(2, 9),
      name: `Unclaimed Token`,
      members: [],
      mindclansScore: 0,
      sellProductEarnings: 0,
      pitchProductMarks: 0,
      totalScore: 0,
      accessCode: upperCode,
      isRegistered: false
    };
    setTeams(prev => [...prev, newTeam]);
  };

  const deleteTeam = (id: string) => {
    if (confirm("ARE YOU SURE YOU WANT TO TERMINATE THIS ENTRY?")) {
      setTeams(prev => prev.filter(t => t.id !== id));
    }
  };

  const updateTeamDetails = (id: string, name: string, members: string[]) => {
    setTeams(prev => prev.map(t => 
      t.id === id ? { ...t, name, members, isRegistered: true } : t
    ));
  };

  const registerTeamDetails = (code: string, name: string, members: string[]) => {
    const upperCode = code.toUpperCase().trim();
    const teamIndex = teams.findIndex(t => t.accessCode === upperCode && !t.isRegistered);
    if (teamIndex === -1) return false;

    setTeams(prev => prev.map((t, idx) => {
      if (idx === teamIndex) {
        return { ...t, name, members, isRegistered: true };
      }
      return t;
    }));
    return true;
  };

  const updateTeamScore = (teamId: string, field: keyof Team, value: number) => {
    if (!isAdminAuth) {
      setShowAdminModal(true);
      return;
    }
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        const updated = { ...t, [field]: value };
        updated.totalScore = updated.mindclansScore + (updated.sellProductEarnings / 100) + updated.pitchProductMarks;
        return updated;
      }
      return t;
    }));
  };

  const currentRole = isAdminAuth ? UserRole.COORDINATOR : UserRole.GUEST;

  const renderPage = () => {
    const registeredTeams = teams.filter(t => t.isRegistered);
    
    switch (currentPage) {
      case 'home': return (
        <Home 
          onStart={() => setCurrentPage('dashboard')} 
          onAdminAccess={() => setShowAdminModal(true)}
        />
      );
      case 'dashboard': return <Dashboard role={currentRole} setPage={setCurrentPage} onBackToHome={() => setCurrentPage('home')} />;
      case 'admin': return (
        <AdminPanel 
          teams={teams} 
          createTeamCode={createTeamCode}
          deleteTeam={deleteTeam}
          updateTeamDetails={updateTeamDetails}
          onBack={() => setCurrentPage('dashboard')} 
        />
      );
      case 'register': return (
        <TeamRegistration 
          onRegister={registerTeamDetails} 
          onBack={() => setCurrentPage('dashboard')} 
        />
      );
      case 'mindclans': return (
        <Mindclans 
          role={currentRole} 
          teams={registeredTeams} 
          updateScore={(id, val) => updateTeamScore(id, 'mindclansScore', val)} 
          onBack={() => setCurrentPage('dashboard')}
        />
      );
      case 'sell': return (
        <SellProduct 
          role={currentRole} 
          teams={registeredTeams} 
          updateEarnings={(id, val) => updateTeamScore(id, 'sellProductEarnings', val)}
          onBack={() => setCurrentPage('dashboard')}
        />
      );
      case 'pitch': return (
        <PitchProduct 
          role={currentRole} 
          teams={registeredTeams} 
          updateMarks={(id, val) => updateTeamScore(id, 'pitchProductMarks', val)}
          onBack={() => setCurrentPage('dashboard')}
        />
      );
      default: return <Dashboard role={currentRole} setPage={setCurrentPage} onBackToHome={() => setCurrentPage('home')} />;
    }
  };

  return (
    <div className={`min-h-screen grid-bg selection:bg-purple-500/30 font-rajdhani transition-all duration-500`}>
      {/* Admin Login Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#0a0a0c] border border-purple-500/30 rounded-[2.5rem] p-10 shadow-[0_0_100px_rgba(168,85,247,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
            <button 
              onClick={() => setShowAdminModal(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-purple-600/10 border border-purple-500/30 flex items-center justify-center mb-2">
                <Fingerprint className="w-10 h-10 text-purple-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-syncopate font-bold uppercase tracking-tight">Access Protocol</h2>
                <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Enter restricted area clearance code</p>
              </div>

              <form onSubmit={handleAdminLogin} className="w-full space-y-6">
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500/50" />
                  <input 
                    type="password"
                    autoFocus
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    placeholder="CLEARANCE_CODE"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-14 py-5 outline-none focus:border-purple-500 transition text-center text-xl tracking-[0.4em] font-mono"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-5 bg-purple-600 rounded-2xl font-syncopate font-black text-sm tracking-[0.2em] hover:bg-purple-500 transition shadow-lg shadow-purple-600/20 flex items-center justify-center gap-3"
                >
                  INITIALIZE SESSION <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed top-0 left-0 right-0 z-[70] glass border-b border-white/10 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-6 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="flex items-center gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/21/IEEE_logo.svg" alt="IEEE" className="h-6 md:h-10 brightness-0 invert opacity-90" />
              <div className="h-8 w-[1px] bg-white/20 hidden sm:block mx-2" />
              <div className="flex flex-col">
                <span className="font-syncopate font-black text-xl tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400">ZERONE</span>
                <span className="text-[10px] font-mono tracking-[0.3em] text-purple-500 font-bold -mt-1">EDITION 2026</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <nav className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10">
              <button onClick={() => setCurrentPage('home')} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${currentPage === 'home' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>Home</button>
              <button onClick={() => setCurrentPage('dashboard')} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${currentPage === 'dashboard' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>Portal</button>
              {isAdminAuth && (
                <button onClick={() => setCurrentPage('admin')} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${currentPage === 'admin' ? 'bg-purple-600 text-white shadow-lg' : 'text-purple-400/60 hover:text-purple-400'}`}>Admin</button>
              )}
            </nav>
            <div className="flex items-center gap-4">
              {!isAdminAuth ? (
                <button onClick={() => setShowAdminModal(true)} className="flex items-center gap-2 bg-black/40 border border-white/10 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest text-purple-400 hover:bg-purple-500/10 transition"><Lock className="w-3 h-3" /> Admin Auth</button>
              ) : (
                <div className="flex items-center gap-4 bg-purple-600/10 border border-purple-500/30 px-4 py-1.5 rounded-lg">
                  <Unlock className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Admin Access</span>
                  <button onClick={logoutAdmin} className="text-white/20 hover:text-white transition ml-2"><X className="w-3 h-3" /></button>
                </div>
              )}
            </div>
          </div>

          <button className="lg:hidden text-white p-2 glass rounded-lg" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-2xl p-8 lg:hidden flex flex-col justify-center gap-8 animate-in fade-in zoom-in duration-300">
          <button className="absolute top-8 right-8 p-2" onClick={() => setIsMenuOpen(false)}><X className="w-8 h-8" /></button>
          <div className="flex flex-col gap-6">
            <button onClick={() => { setCurrentPage('home'); setIsMenuOpen(false); }} className="text-4xl font-syncopate font-bold flex items-center gap-6 text-white"><HomeIcon className="w-10 h-10 text-purple-500" /> HOME</button>
            <button onClick={() => { setCurrentPage('dashboard'); setIsMenuOpen(false); }} className="text-4xl font-syncopate font-bold flex items-center gap-6 text-white"><LayoutDashboard className="w-10 h-10 text-purple-500" /> HUB</button>
            {isAdminAuth && (
              <button onClick={() => { setCurrentPage('admin'); setIsMenuOpen(false); }} className="text-4xl font-syncopate font-bold flex items-center gap-6 text-purple-400"><UsersIcon className="w-10 h-10" /> TEAMS</button>
            )}
          </div>
          <div className="border-t border-white/10 pt-8 mt-4">
            {!isAdminAuth ? (
              <button onClick={() => { setShowAdminModal(true); setIsMenuOpen(false); }} className="w-full py-4 bg-purple-600 rounded-xl font-bold uppercase tracking-widest">Initialize Admin</button>
            ) : (
              <button onClick={logoutAdmin} className="w-full py-4 border border-white/10 rounded-xl font-bold text-red-400 uppercase tracking-widest">Terminate Session</button>
            )}
          </div>
        </div>
      )}

      <main className={`pt-32 pb-20 px-6 min-h-screen transition-all duration-500 ${isMenuOpen ? 'blur-xl scale-[0.98] opacity-50' : ''}`}>
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>

      <footer className="py-16 border-t border-white/5 bg-black/80 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/21/IEEE_logo.svg" alt="IEEE" className="h-8 brightness-0 invert opacity-50" />
              <div className="flex flex-col">
                <span className="font-syncopate text-lg font-bold opacity-50 tracking-tighter">ZERONE 2026</span>
                <span className="text-[10px] font-mono text-gray-600 uppercase">Engineering the Unknown</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
