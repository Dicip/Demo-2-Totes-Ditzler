import { ShieldCheck } from 'lucide-react';

export const Logo = () => {
  return (
    <div className="flex items-center justify-center gap-x-3">
      <ShieldCheck className="h-10 w-10 text-primary" />
      <h1 className="text-3xl font-bold text-foreground">DITZLER</h1>
    </div>
  );
};
