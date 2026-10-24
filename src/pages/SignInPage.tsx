import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { DemoBanner } from '../components/common/DemoBanner';

export const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('creator@framecraft.studio');
  const [password, setPassword] = useState('••••••••••••');
  const navigate = useNavigate();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-app-bg text-text-primary flex flex-col">
      <DemoBanner />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-app-panel border border-app-border rounded-dialog max-w-md w-full p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-[#6366F1] flex items-center justify-center mx-auto shadow-lg shadow-accent/20">
              <Film className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">Sign in to Framecraft</h1>
            <p className="text-xs text-text-secondary">
              Open your audio-first video production workspace
            </p>
          </div>

          <div className="p-3 rounded bg-accent/10 border border-accent/20 text-xs text-accent flex items-start gap-2">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Demo Quick Access:</strong> Authentication is preconfigured. Click below to enter immediately.
            </span>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4 text-xs">
            <div>
              <label className="text-text-muted block mb-1">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-app-elevated border border-app-border focus:border-accent rounded p-2.5 text-text-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-text-muted block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-app-elevated border border-app-border focus:border-accent rounded p-2.5 text-text-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-editor bg-accent hover:bg-accent-hover text-white font-semibold shadow-md shadow-accent/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <span>Enter Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-app-border text-xs text-text-muted">
            Don’t have an account?{' '}
            <Link to="/sign-up" className="text-accent hover:underline font-medium">
              Create account
            </Link>{' '}
            or{' '}
            <Link to="/demo" className="text-text-primary hover:underline font-medium">
              Try Demo Directly
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SignUpPage: React.FC = () => {
  const [displayName, setDisplayName] = useState('Elena Rostova');
  const [workspaceName, setWorkspaceName] = useState('Documentary Lab');
  const [videoType, setVideoType] = useState('documentary');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const navigate = useNavigate();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-app-bg text-text-primary flex flex-col">
      <DemoBanner />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-app-panel border border-app-border rounded-dialog max-w-md w-full p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-[#6366F1] flex items-center justify-center mx-auto shadow-lg shadow-accent/20">
              <Film className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">Create Your Workspace</h1>
            <p className="text-xs text-text-secondary">
              Configure your default editing profile
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4 text-xs">
            <div>
              <label className="text-text-muted block mb-1">Your Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-app-elevated border border-app-border focus:border-accent rounded p-2.5 text-text-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-text-muted block mb-1">Workspace Name</label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full bg-app-elevated border border-app-border focus:border-accent rounded p-2.5 text-text-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-text-muted block mb-1">Primary Video Type</label>
                <select
                  value={videoType}
                  onChange={(e) => setVideoType(e.target.value)}
                  className="w-full bg-app-elevated border border-app-border focus:border-accent rounded p-2 text-text-primary focus:outline-none"
                >
                  <option value="documentary">Documentary</option>
                  <option value="news_explainer">News Explainer</option>
                  <option value="educational">Educational</option>
                  <option value="technology">Technology</option>
                  <option value="social_short">Social Short</option>
                </select>
              </div>

              <div>
                <label className="text-text-muted block mb-1">Default Aspect</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full bg-app-elevated border border-app-border focus:border-accent rounded p-2 text-text-primary focus:outline-none"
                >
                  <option value="16:9">16:9 Landscape</option>
                  <option value="9:16">9:16 Vertical</option>
                  <option value="1:1">1:1 Square</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-editor bg-accent hover:bg-accent-hover text-white font-semibold shadow-md shadow-accent/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-app-border text-xs text-text-muted">
            Already have an account?{' '}
            <Link to="/sign-in" className="text-accent hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
