import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogoutButton } from './logout-button';
import { ShieldCheck } from 'lucide-react';

const DashboardPage = () => {
  const cookieStore = cookies();
  const authToken = cookieStore.get('auth_token');

  if (!authToken) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40">
      <Card className="w-full max-w-2xl animate-in fade-in-0 zoom-in-95 duration-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <span>Dashboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">Welcome to your secure dashboard!</p>
          <p className="text-muted-foreground">
            You have successfully logged in. Your session is active and protected by AuthFlow.
          </p>
          <div className="pt-4">
            <LogoutButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
