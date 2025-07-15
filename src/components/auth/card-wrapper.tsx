'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Logo } from '@/components/auth/logo';
import { BackButton } from '@/components/auth/back-button';
import { Separator } from '@/components/ui/separator';

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
}: CardWrapperProps) => {
  return (
    <Card className="w-full max-w-md shadow-xl animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-500">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
            <Logo />
        </div>
        <p className="text-muted-foreground">{headerLabel}</p>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <Separator className="my-0" />
      <CardFooter className="py-4">
        <BackButton href={backButtonHref} label={backButtonLabel} />
      </CardFooter>
    </Card>
  );
};
