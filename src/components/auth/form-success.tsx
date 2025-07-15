import { CheckCircle2 } from 'lucide-react';

export const FormSuccess = ({ message }: { message?: string }) => {
  if (!message) {
    return null;
  }
  return (
    <div className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-500 p-3 rounded-md flex items-center gap-x-2 text-sm">
      <CheckCircle2 className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
