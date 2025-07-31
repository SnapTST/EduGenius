
import { BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("p-2 rounded-lg bg-primary/20 text-primary", className)}>
      <BrainCircuit className="h-8 w-8" />
    </div>
  );
}
