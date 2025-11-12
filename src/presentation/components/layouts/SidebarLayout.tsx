import { ReactNode } from 'react';
import { AuthenticatedSidebar } from './AuthenticatedSidebar';

interface SidebarLayoutProps {
  children: ReactNode;
}

// Server Component
export default function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar con header mobile incluido */}
      <AuthenticatedSidebar />
      
      {/* Main content area - ajustado para desktop sidebar */}
      <div className="lg:pl-72">
        {/* Main content */}
        <main className="min-h-screen">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}