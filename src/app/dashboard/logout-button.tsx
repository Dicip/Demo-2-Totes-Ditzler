
'use client';

import { LogOut } from 'lucide-react';
import { logout } from '@/lib/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export const LogoutButton = () => {
  const pathname = usePathname();
  const isMobile = pathname.startsWith('/dashboard/users') || pathname.startsWith('/dashboard/totes') || pathname.startsWith('/dashboard/clients') || pathname === '/dashboard';
  
  if (isMobile && typeof window !== 'undefined' && window.innerWidth < 640) {
      return (
        <form action={logout}>
          <Button type="submit" variant="ghost" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </form>
      )
  }
  
  return (
    <form action={logout}>
        <Button type="submit" variant="outline" size="icon" className="h-9 w-9">
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Sign Out</span>
        </Button>
    </form>
  );
};
