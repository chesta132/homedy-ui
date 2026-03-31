import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

export type SwitchProps = Parameters<typeof Switch>[0];

const Switch = React.forwardRef<React.ComponentRef<typeof SwitchPrimitive.Root>, React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>>(
  ({ className, ...props }, ref) => (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=unchecked]:bg-border-sub data-[state=checked]:bg-white",
        className,
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full shadow-lg ring-0 transition-transform",
          "data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-4",
          "data-[state=unchecked]:bg-dim data-[state=checked]:bg-black",
        )}
      />
    </SwitchPrimitive.Root>
  ),
);
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };

// import * as React from "react";
// import { Switch as SwitchPrimitive } from "radix-ui";
// import { cn } from "@/lib/utils";

// export type SwitchProps = Parameters<typeof Switch>[0];

// const Switch = React.forwardRef<
//   React.ComponentRef<typeof SwitchPrimitive.Root>,
//   React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> & { boolTransform?: { true: any; false: any } }
// >(({ className, boolTransform, checked, ...props }, ref) => {
//   const bool = boolTransform || { true: true, false: false };
//   return (
//     <SwitchPrimitive.Root
//       className={cn(
//         "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
//         "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white",
//         "disabled:cursor-not-allowed disabled:opacity-50",
//         "data-[state=unchecked]:bg-border-sub data-[state=checked]:bg-white",
//         className,
//       )}
//       checked={checked ? bool.true : bool.false}
//       {...props}
//       ref={ref}
//     >
//       <SwitchPrimitive.Thumb
//         className={cn(
//           "pointer-events-none block h-4 w-4 rounded-full shadow-lg ring-0 transition-transform",
//           "data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-4",
//           "data-[state=unchecked]:bg-dim data-[state=checked]:bg-black",
//         )}
//       />
//     </SwitchPrimitive.Root>
//   );
// });
// Switch.displayName = SwitchPrimitive.Root.displayName;

// export { Switch };
