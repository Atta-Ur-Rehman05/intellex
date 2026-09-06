import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AppLayout } from './components/mvp/AppLayout.jsx';
import { LandingPage } from './components/mvp/LandingPage.jsx';
import { LoginPage, RegisterPage } from './components/mvp/AuthPages.jsx';
import { DashboardPage } from './components/mvp/DashboardPage.jsx';
import { DocumentsPage } from './components/mvp/DocumentsPage.jsx';
import { DocumentDetailPage } from './components/mvp/DocumentDetailPage.jsx';
import { ChatPage } from './components/mvp/ChatPage.jsx';
import { SettingsPage } from './components/mvp/SettingsPage.jsx';
import { ErrorScreen } from './components/ui/ErrorScreen.jsx';

/* ---------- Full-screen bootstrap spinner ---------- */
const BootSplash = () => (
  <div className="min-h-screen bg-canvas flex items-center justify-center" role="status" aria-busy="true">
    <div className="flex flex-col items-center gap-3">
      <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 animate-pulse" />
      <p className="text-xs text-muted font-mono">Loading Knowva…</p>
    </div>
  </div>
);

/* ---------- Protected route wrapper ---------- */
const RequireAuth = ({ children }) => {
  const { user, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) return <BootSplash />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
};

/* ---------- Redirect signed-in users away from auth pages ---------- */
const RedirectIfAuth = ({ children }) => {
  const { user, isBootstrapping } = useAuth();
  if (isBootstrapping) return <BootSplash />;
  if (user) return <Navigate to="/app/dashboard" replace />;
  return children;
};

/* ---------- 404 ---------- */
const NotFoundPage = () => (
  <div className="min-h-screen bg-canvas">
    <ErrorScreen
      code={404}
      onPrimaryAction={() => window.location.href = '/'}
      onSecondaryAction={() => window.location.href = '/app/dashboard'}
    />
  </div>
);

const NotFoundInline = () => (
  <ErrorScreen
    code={404}
    onPrimaryAction={() => window.location.href = '/app/dashboard'}
    onSecondaryAction={() => window.location.href = '/'}
  />
);

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<RedirectIfAuth><LoginPage /></RedirectIfAuth>} />
            <Route path="/register" element={<RedirectIfAuth><RegisterPage /></RedirectIfAuth>} />

            {/* Protected app */}
            <Route path="/app" element={<RequireAuth><AppLayout /></RequireAuth>}>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="documents/:documentId" element={<DocumentDetailPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="chat/:conversationId" element={<ChatPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundInline />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
