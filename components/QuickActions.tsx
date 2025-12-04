import React from 'react';
import { QuickAction } from '../types';
import { HeartPulse, Stethoscope, Building2, Brain, Bone, Baby, ChevronLeft, Activity, Ambulance, FileText } from 'lucide-react';

interface QuickActionsProps {
  onActionSelect: (query: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onActionSelect, isOpen, setIsOpen }) => {
  const actions: QuickAction[] = [
    { label: "Emergency Help (1122)", query: "I have a medical emergency. What should I do and where is the nearest emergency ward?", icon: <Ambulance size={20} className="text-red-500" /> },
    { label: "Disease Information", query: "I want to know about a disease or symptoms.", icon: <FileText size={20} /> },
    { label: "Heart Specialist (Cardiologist)", query: "Find best Cardiologists near me with phone numbers and address.", icon: <HeartPulse size={20} /> },
    { label: "Skin Specialist (Dermatologist)", query: "Find best Dermatologists (Skin Specialists) near me with location and contact.", icon: <Stethoscope size={20} /> },
    { label: "Bone Specialist (Orthopedic)", query: "Find Orthopedic surgeons (Bone Doctors) near me.", icon: <Bone size={20} /> },
    { label: "Child Specialist (Pediatrician)", query: "Find best Child Specialists (Pediatricians) in my area.", icon: <Baby size={20} /> },
    { label: "Brain Specialist (Neurologist)", query: "List best Neurologists (Brain Doctors) and hospital details.", icon: <Brain size={20} /> },
    { label: "Find Nearby Hospitals", query: "List famous hospitals in my city with facilities.", icon: <Building2 size={20} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-40 w-80 bg-black/95 border-r border-zinc-800 transform transition-transform duration-300 ease-out flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/30 backdrop-blur-md">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-lg shadow-red-500/20">
                <Activity className="text-white" size={18} />
             </div>
             <div>
                <h1 className="text-xl font-bold text-white tracking-tight leading-none">
                  Hania
                </h1>
                <p className="text-[10px] text-red-400 font-semibold tracking-widest uppercase">Medical Emergency</p>
             </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 px-2 pt-2">Quick Services</p>
          <div className="space-y-3">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onActionSelect(action.query);
                  if (window.innerWidth < 768) setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-4 p-4 rounded-xl text-left text-sm font-medium transition-all group border
                  ${idx === 0 
                    ? 'bg-red-900/10 border-red-900/30 text-red-200 hover:bg-red-900/20 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                    : 'bg-zinc-900/30 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 hover:shadow-lg'}
                `}
              >
                <div className={`
                  p-2 rounded-lg transition-all
                  ${idx === 0 ? 'bg-red-500/20 text-red-500' : 'bg-black text-teal-500 group-hover:text-teal-400'}
                `}>
                  {action.icon}
                </div>
                <span>{action.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 mx-2 p-5 bg-gradient-to-br from-teal-900/20 to-zinc-900 rounded-2xl border border-teal-500/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            
            <h3 className="text-base font-bold text-white mb-2 relative z-10">Ask Hania AI</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4 relative z-10">
              Doctors, Fees, Locations & Treatments. <br/> (All Local Languages)
            </p>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">System Online</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};