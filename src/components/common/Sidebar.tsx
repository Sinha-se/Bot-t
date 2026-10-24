import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  FolderKanban,
  Image as ImageIcon,
  LayoutTemplate,
  Palette,
  Activity,
  Settings,
  PlusCircle,
  PlaySquare,
  Sparkles,
  Compass,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/app/projects', label: 'Projects', icon: FolderKanban },
    { to: '/app/media', label: 'Media Library', icon: ImageIcon },
    { to: '/app/templates', label: 'Graphics & Titles', icon: LayoutTemplate },
    { to: '/app/brand-kits', label: 'Brand Kits', icon: Palette },
    { to: '/app/jobs', label: 'Processing Jobs', icon: Activity },
    { to: '/app/settings', label: 'Studio Settings', icon: Settings },
  ];

  return (
    <aside className="w-60 bg-app-panel border-r border-app-border flex flex-col justify-between shrink-0 select-none">
      <div className="p-4 space-y-4">
        {/* Quick New Project CTA */}
        <Link
          to="/app/projects/new"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-editor bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-md shadow-accent/20 transition-all hover:scale-[1.01]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Video Project</span>
        </Link>

        {/* Primary Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-editor text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-app-elevated text-accent border border-app-border/80'
                      : 'text-text-secondary hover:text-text-primary hover:bg-app-hover'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Demo Project Quick Access & System status */}
      <div className="p-4 border-t border-app-border space-y-3">
        <Link
          to="/demo"
          className="p-3 rounded-editor bg-app-elevated/70 border border-accent/20 hover:border-accent/50 block group transition-all"
        >
          <div className="flex items-center gap-2 text-accent text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Demo</span>
          </div>
          <p className="text-[11px] text-text-muted line-clamp-2">
            Load “Before the City Wakes” with rich 12-scene plan & audio alignment.
          </p>
        </Link>

        <div className="text-[11px] text-text-muted flex items-center justify-between px-1">
          <span>Framecraft Studio v1.0</span>
          <span className="flex items-center gap-1.5 text-status-success font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
            Local Ready
          </span>
        </div>
      </div>
    </aside>
  );
};
