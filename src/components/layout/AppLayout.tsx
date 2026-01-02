import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { BottomNav } from './BottomNav';
import { Background3D } from '@/components/3d/Background3D';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Background3D />
        <div className="animate-pulse text-primary text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen pb-24">
      <Background3D />
      <main className="max-w-lg mx-auto px-4 py-6 relative z-10">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
