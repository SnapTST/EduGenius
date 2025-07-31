
import { cn } from "@/lib/utils";

export function Loader({ className }: { className?: string }) {
  return (
    <div className={cn("flex justify-center items-center py-8", className)}>
      <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary"></div>
    </div>
  );
}
