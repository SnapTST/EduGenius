
'use client';

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { cn } from "@/lib/utils";

export function PrintButton({ className }: { className?: string }) {
  return (
    <Button
      variant="outline"
      onClick={() => window.print()}
      className={cn("no-print", className)}
    >
      <Printer className="mr-2 h-4 w-4" />
      Export to PDF
    </Button>
  );
}
