
import React, { useState } from 'react';
import { ArrowLeft, Key, UserPlus, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface TeamRegistrationProps {
  onRegister: (code: string, name: string, members: string[]) => boolean;
  onBack: () => void;
}

const TeamRegistration: React.FC<TeamRegistrationProps> = ({ onRegister, onBack }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [members, setMembers] = useState('');
  const [error, setError] = useState('');

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('ACCESS CODE REQUIRED.');
      return;
    }
    setStep(2);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const memberArray = members.split(',').map(m => m.trim()).filter(m => m !== '');
    if (!name.trim() || memberArray.length === 0) {
      setError('ALL FIELDS ARE MANDATORY.');
      return;
    }

    const success = onRegister(code, name, memberArray);
    if (success) {
      setStep(1);
      setCode('');
      setName('');
      setMembers('');
      alert("TEAM REGISTERED SUCCESSFULLY. HUB ACCESS GRANTED.");
      onBack();
    } else {
      setError('CODE INVALID OR ALREADY CLAIMED.');
      setStep(1);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> BACK TO HUB
      </button>

      <div className="glass rounded-[2.5rem] p-10 md:p-14 border-emerald-500/20 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px]" />
        
        <header className="text-center space-y-4 mb-12 relative z-10">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6">
            <UserPlus className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-syncopate font-bold uppercase tracking-tight">TEAM_CLAIM</h1>
          <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">Authorize your identity token</p>
        </header>

        {step === 1 ? (
          <form onSubmit={handleValidate} className="space-y-8 relative z-10">
            <div className="space-y-4">
              <label className="block text-center text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em]">Enter Authentication Token</label>
              <div className="relative">
                <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500/30" />
                <input 
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="CODE_XXXX"
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-16 py-6 outline-none focus:border-emerald-500 transition text-center text-3xl font-black font-mono tracking-widest uppercase"
                />
              </div>
              {error && <p className="text-red-500 text-[10px] font-mono text-center uppercase animate-pulse">{error}</p>}
            </div>
            <button 
              type="submit"
              className="w-full py-6 bg-emerald-600 rounded-2xl font-syncopate font-black text-sm tracking-widest hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/20 group"
            >
              VALIDATE_TOKEN <ArrowRight className="inline-block w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">TOKEN: {code} ACTIVE</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase mb-2 tracking-widest">Official Team Name</label>
                <input 
                  type="text"
                  value={name}
                  autoFocus
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Protocol Breakers"
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 transition font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase mb-2 tracking-widest">Personnel Names (Comma Separated)</label>
                <textarea 
                  value={members}
                  onChange={(e) => setMembers(e.target.value)}
                  placeholder="Alice, Bob, Charlie"
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 transition h-32 resize-none"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-[10px] font-mono text-center uppercase">{error}</p>}

            <div className="grid grid-cols-2 gap-4 pt-4">
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="py-5 border border-white/10 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition"
              >
                BACK
              </button>
              <button 
                type="submit"
                className="py-5 bg-emerald-600 rounded-2xl font-syncopate font-black text-xs tracking-widest hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/20"
              >
                INITIALIZE_IDENTITY
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TeamRegistration;
