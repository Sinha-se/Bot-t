import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { DEMO_PROJECT_ID } from '../data/seedData';

export const DemoLauncherPage: React.FC = () => {
  const navigate = useNavigate();
  const { switchProject } = useProject();

  useEffect(() => {
    switchProject(DEMO_PROJECT_ID);
    const timer = setTimeout(() => {
      navigate(`/app/projects/${DEMO_PROJECT_ID}/editor`);
    }, 400);

    return () => clearTimeout(timer);
  }, [switchProject, navigate]);

  return (
    <div className="h-screen w-screen bg-[#0B0D12] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent animate-pulse shadow-xl shadow-accent/20">
        <Sparkles className="w-6 h-6" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-white">Launching Interactive Studio Demo</h2>
        <p className="text-xs text-text-secondary mt-1 max-w-sm">
          Loading “Before the City Wakes” with 12 scenes, time-aligned narration master, and multitrack editor...
        </p>
      </div>
    </div>
  );
};
