import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export const Loading = ({ className, fullScreen, ...rest }: React.ComponentProps<"div"> & { fullScreen?: boolean }) => {
  return (
    <div className={cn("flex items-center justify-center size-5", fullScreen && "min-h-screen w-auto", className)} {...rest}>
      <Loader2 className="size-max animate-spin text-muted-strong" />
    </div>
  );
};
