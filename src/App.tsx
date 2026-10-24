import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProjectProvider } from './context/ProjectContext';

// Pages
import { LandingPage } from './pages/LandingPage';
import { SignInPage, SignUpPage } from './pages/SignInPage';
import { DemoLauncherPage } from './pages/DemoLauncherPage';
import { DashboardPage } from './pages/DashboardPage';
import { NewProjectWizard } from './pages/NewProjectWizard';
import { TranscriptReviewPage } from './pages/TranscriptReviewPage';
import { StoryboardPage } from './pages/StoryboardPage';
import { AgentProcessingPage } from './pages/AgentProcessingPage';
import { EditorPage } from './pages/EditorPage';
import { ReviewPage } from './pages/ReviewPage';
import { ExportSetupPage } from './pages/ExportSetupPage';
import { RenderProgressPage } from './pages/RenderProgressPage';
import { MediaLibraryPage } from './pages/MediaLibraryPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { BrandKitsPage } from './pages/BrandKitsPage';
import { JobsPage } from './pages/JobsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <ProjectProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/demo" element={<DemoLauncherPage />} />

          {/* Workspace Routes */}
          <Route path="/app" element={<DashboardPage />} />
          <Route path="/app/projects" element={<DashboardPage />} />
          <Route path="/app/projects/new" element={<NewProjectWizard />} />
          <Route path="/app/projects/:projectId/setup" element={<NewProjectWizard />} />
          <Route path="/app/projects/:projectId/transcript" element={<TranscriptReviewPage />} />
          <Route path="/app/projects/:projectId/storyboard" element={<StoryboardPage />} />
          <Route path="/app/projects/:projectId/generation" element={<AgentProcessingPage />} />
          <Route path="/app/projects/:projectId/editor" element={<EditorPage />} />
          <Route path="/app/projects/:projectId/review" element={<ReviewPage />} />
          <Route path="/app/projects/:projectId/export" element={<ExportSetupPage />} />
          <Route path="/app/projects/:projectId/exports/:exportId" element={<RenderProgressPage />} />

          {/* Library & Management */}
          <Route path="/app/media" element={<MediaLibraryPage />} />
          <Route path="/app/templates" element={<TemplatesPage />} />
          <Route path="/app/brand-kits" element={<BrandKitsPage />} />
          <Route path="/app/jobs" element={<JobsPage />} />
          <Route path="/app/settings" element={<SettingsPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ProjectProvider>
  );
};
