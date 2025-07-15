
'use client';

import { redirect, usePathname } from 'next/navigation';
import { LayoutGrid, Users, Package, Briefcase, LogOut, Settings, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/actions/auth.actions';

const navItems = [
  { href: '/dashboard', label: 'Panel de control', icon: LayoutGrid },
  { href: '/dashboard/totes', label: 'Totes', icon: Package },
  { href: '/dashboard/users', label: 'Usuarios', icon: Users },
  { href: '/dashboard/clients', label: 'Clientes', icon: Briefcase },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const authToken = document.cookie.split('; ').find(row => row.startsWith('auth_token='))
      if (!authToken) {
        redirect('/login');
      }
    }
  }, [pathname]);

  return (
    <div className="flex min-h-screen w-full">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-card text-card-foreground sm:flex">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <span className="text-xl">DITZLER</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                pathname === item.href && 'bg-primary text-primary-foreground hover:text-primary-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <nav className="mt-auto space-y-2 p-4">
          <form action={logout}>
            <Button type="submit" variant="ghost" className="w-full justify-start gap-3 px-3">
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </form>
           <Link
              href="#"
              className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
            >
              <Settings className="h-4 w-4" />
              Configuración
            </Link>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col sm:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
           <h1 className="text-xl font-semibold">Panel de Administrador</h1>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
