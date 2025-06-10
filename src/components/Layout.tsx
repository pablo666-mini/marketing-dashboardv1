
// Main layout component that wraps all pages
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';

export const Layout = () => {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-none p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
