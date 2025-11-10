'use client';

import { useAuth } from '../../../infrastructure/auth/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  current?: boolean;
}

// Iconos SVG profesionales
const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const UserGroupIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
  </svg>
);

const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
  </svg>
);

const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);

export function AuthenticatedSidebar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Buscar Doctores', href: '/doctors/search', icon: UserGroupIcon },
    { name: 'Mis Citas', href: '/appointments', icon: CalendarIcon },
    { name: 'Pacientes', href: '/patients', icon: UsersIcon },
  ];

  const isActive = (href: string) => pathname === href;

  if (loading) {
    return (
      <>
        {/* Header mobile con loading */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
          <div className="flex items-center gap-x-4">
            <div className="w-8 h-8 bg-[#0066ff] rounded-lg flex items-center justify-center text-white font-bold text-sm">
              D
            </div>
            <span className="text-lg font-semibold text-gray-900">Doctoc</span>
            <div className="ml-4 animate-spin rounded-full h-5 w-5 border-b-2 border-[#0066ff]"></div>
          </div>
        </div>
        {/* Sidebar desktop con loading */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0066ff]"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Header mobile con botón hamburguesa */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <span className="sr-only">Abrir sidebar</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Logo en header mobile */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#0066ff] rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
            D
          </div>
          <span className="text-lg font-semibold text-gray-900">Doctoc</span>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="relative z-50 lg:hidden" role="dialog" aria-modal="true">
          {/* Background backdrop */}
          <div 
            className="fixed inset-0 bg-gray-900/80"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Sidebar panel */}
          <div className="fixed inset-0 flex">
            <div className="relative mr-16 flex w-full max-w-xs flex-1">
              {/* Close button */}
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button 
                  type="button" 
                  className="-m-2.5 p-2.5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="sr-only">Cerrar sidebar</span>
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Sidebar content */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-[#0066ff] rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      D
                    </div>
                    <span className="ml-3 text-xl font-bold text-gray-900">
                      Doctoc
                    </span>
                  </div>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-200 ${
                                isActive(item.href)
                                  ? 'bg-[#0066ff] text-white shadow-md'
                                  : 'text-gray-700 hover:text-[#0066ff] hover:bg-[#0066ff]/5'
                              }`}
                            >
                              <item.icon
                                className={`h-6 w-6 shrink-0 ${
                                  isActive(item.href) ? 'text-white' : 'text-gray-400 group-hover:text-[#0066ff]'
                                }`}
                                aria-hidden="true"
                              />
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li className="mt-auto">
                      <div className="border-t border-gray-200 pt-4">
                        {/* User info */}
                        <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-900">
                          <div className="h-8 w-8 rounded-full bg-[#0052cc] flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {user.email?.[0]?.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.displayName || 'Usuario'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        {/* Logout button */}
                        <button
                          onClick={handleLogout}
                          className="group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                        >
                          <svg 
                            className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-red-600" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth="1.5" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V16.5M12 9l3 3m0 0-3 3m3-3H9" />
                          </svg>
                          Cerrar sesión
                        </button>
                      </div>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#0066ff] rounded-lg flex items-center justify-center text-white font-bold text-lg">
                D
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">
                Doctoc
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-200 ${
                          isActive(item.href)
                            ? 'bg-[#0066ff] text-white shadow-md'
                            : 'text-gray-700 hover:text-[#0066ff] hover:bg-[#0066ff]/5'
                        }`}
                      >
                        <item.icon
                          className={`h-6 w-6 shrink-0 ${
                            isActive(item.href) ? 'text-white' : 'text-gray-400 group-hover:text-[#0066ff]'
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* User section */}
              <li className="mt-auto">
                <div className="border-t border-gray-200 pt-4">
                  {/* User info */}
                  <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-900">
                    <div className="h-8 w-8 rounded-full bg-[#0052cc] flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user.email?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.displayName || 'Usuario'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Logout button */}
                  <button
                    onClick={handleLogout}
                    className="group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <svg 
                      className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-red-600" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth="1.5" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V16.5M12 9l3 3m0 0-3 3m3-3H9" />
                    </svg>
                    Cerrar sesión
                  </button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}