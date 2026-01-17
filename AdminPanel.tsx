
import React, { useState } from 'react';
import { Team } from '../types';
import { 
  Plus, 
  Users, 
  ArrowLeft, 
  ShieldCheck, 
  Key, 
  CheckCircle, 
  AlertCircle, 
  Edit2, 
  Check, 
  X as CloseIcon, 
  Trash2, 
  ArrowRight,
  UserPlus,
  Terminal,
  Activity
} from 'lucide-react';

interface AdminPanelProps {
  teams: Team[];
  createTeamCode: (code: string) => void;
  deleteTeam: (id: string) => void;
  updateTeamDetails: (id: string, name: string, members: string[]) => void;
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ teams, createTeamCode, deleteTeam, updateTeamDetails, onBack }) => {
  const [newCode, setNewCode] = useState('');
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editName, setEditName] = useState('');
  const [editMembers, setEditMembers] = useState('');

  const handleCreateCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) {
      alert("PLEASE ENTER A VALID ACCESS TOKEN.");
      return;
    }
    createTeamCode(newCode.trim());
    setNewCode('');
  };

  const startEditing = (team: Team) => {
    setEditingTeam(team);
    setEditName(team.name === 'Unclaimed Token' ? '' : team.name);
    setEditMembers(team.members.join(', '));
  };

  const saveTeamEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;
    const memberArray = editMembers.split(',').map(m => m.trim()).filter(m => m !== '');
    updateTeamDetails(editingTeam.id, editName || 'Manual Override Team', memberArray);
    setEditingTeam(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition group mb-2 font-mono text-xs uppercase tracking-widest">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> TERMINATE SESSION / HUB
          </button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-600/20 rounded-xl border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
              <ShieldCheck className="text-purple-400 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-syncopate font-black uppercase tracking-tight">Coordinator Console</h1>
              <p className="text-purple-400 font-mono text-[10px] uppercase tracking-[0.3em]">Global Registry Management</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Creation Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border-purple-500/20 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-3xl pointer-events-none" />
            
            <h2 className="text-xl font-syncopate font-bold mb-8 flex items-center gap-3">
              <UserPlus className="w-5 h-5 text-purple-400" /> CREATE_TOKEN
            </h2>
            
            <form onSubmit={handleCreateCode} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest">Manual Authorization Code</label>
                <div className="relative">
                  <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-purple-500/30 w-5 h-5" />
                  <input 
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    placeholder="E.G. TEAM-ALPHA-01"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-5 outline-none focus:border-purple-500 transition text-lg font-mono font-bold tracking-widest uppercase"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-purple-600 rounded-2xl font-syncopate font-black text-xs tracking-[0.2em] hover:bg-purple-500 transition shadow-lg shadow-purple-600/20 group"
              >
                AUTHORIZE TOKEN <ArrowRight className="inline-block w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
            <h3 className="text-[10px] font-mono font-bold text-gray-500 uppercase mb-6 tracking-widest flex items-center gap-2">
              <Activity className="w-3 h-3 text-emerald-400" /> System Metrics
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-mono uppercase text-gray-500">Registry Count</span>
                <span className="text-2xl font-syncopate font-bold">{teams.length}</span>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-mono uppercase text-gray-500">Active Claimants</span>
                <span className="text-2xl font-syncopate font-bold text-emerald-400">{teams.filter(t => t.isRegistered).length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Registry Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-syncopate font-bold flex items-center gap-3">
              <Terminal className="w-5 h-5 text-purple-400" /> GLOBAL_LEDGER
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {teams.length === 0 ? (
              <div className="glass p-24 rounded-[3rem] border-dashed border-2 border-white/5 flex flex-col items-center justify-center text-center gap-6">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
                  <AlertCircle className="w-8 h-8 text-gray-700" />
                </div>
                <p className="text-gray-600 font-mono text-xs uppercase tracking-[0.3em]">No Authorization Tokens in Ledger</p>
              </div>
            ) : (
              teams.map((team) => (
                <div 
                  key={team.id} 
                  className={`group relative glass p-6 rounded-[2rem] border-white/5 hover:border-purple-500/30 transition-all duration-500 ${team.isRegistered ? 'bg-purple-500/[0.03]' : ''}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${team.isRegistered ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/5'}`}>
                        {team.isRegistered ? (
                          <CheckCircle className="w-6 h-6 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                        ) : (
                          <Key className="w-6 h-6 text-gray-700" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className={`text-xl font-bold tracking-tight ${team.isRegistered ? 'text-white' : 'text-gray-600 italic'}`}>
                            {team.isRegistered ? team.name : 'Awaiting Claimant Entry...'}
                          </h3>
                          <span className={`px-2 py-0.5 text-[8px] font-mono rounded uppercase tracking-widest border ${team.isRegistered ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-gray-500 border-white/10'}`}>
                            {team.isRegistered ? 'IDENTITY_VERIFIED' : 'PENDING_CLAIM'}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-purple-400 mt-1 flex items-center gap-2">
                          <span className="opacity-50">AUTH_TOKEN:</span> {team.accessCode}
                        </p>
                        {team.members.length > 0 && (
                          <p className="text-[10px] text-gray-500 mt-3 font-medium uppercase tracking-wider">{team.members.join(' • ')}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => startEditing(team)}
                        className="p-3 bg-white/5 hover:bg-purple-600/20 border border-white/10 rounded-xl transition-all duration-300 text-gray-500 hover:text-purple-400"
                        title="Manual Detail Override"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteTeam(team.id)}
                        className="p-3 bg-white/5 hover:bg-red-600/20 border border-white/10 rounded-xl transition-all duration-300 text-gray-500 hover:text-red-400"
                        title="Terminate Token Access"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Direct Override Modal */}
      {editingTeam && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-[#0a0a0c] border border-purple-500/40 rounded-[2.5rem] p-10 relative shadow-[0_0_100px_rgba(168,85,247,0.1)]">
            <button onClick={() => setEditingTeam(null)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition"><CloseIcon /></button>
            
            <div className="mb-8">
              <h2 className="text-2xl font-syncopate font-black mb-2 uppercase tracking-tight flex items-center gap-3">
                <Terminal className="w-6 h-6 text-purple-400" /> Registry Override
              </h2>
              <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Token Auth ID: {editingTeam.accessCode}</p>
            </div>
            
            <form onSubmit={saveTeamEdit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2 block">Assigned Team Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-purple-500 transition font-bold"
                  placeholder="E.G. THE OVERRIDERS"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2 block">Personnel Roster (Comma Separated)</label>
                <textarea 
                  value={editMembers}
                  onChange={(e) => setEditMembers(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-purple-500 transition h-32 resize-none"
                  placeholder="MEMBER 1, MEMBER 2, ..."
                />
              </div>
              <div className="pt-4 flex gap-4">
                <button type="submit" className="flex-1 py-5 bg-purple-600 rounded-2xl font-syncopate font-black text-xs tracking-widest hover:bg-purple-500 transition shadow-lg shadow-purple-600/20">
                  COMMIT_CHANGES
                </button>
                <button type="button" onClick={() => setEditingTeam(null)} className="px-8 py-5 border border-white/10 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition">
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
