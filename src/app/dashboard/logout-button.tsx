'use client';

import { LogOut } from 'lucide-react';
import { logout } from '@/lib/actions/auth.actions';
import { Button } from '@/components/ui/button';

export const LogoutButton = () => {
  return (
    <form action={logout}>
      <Button type="submit" variant="secondary">
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </form>
  );
};
