import { FolderOpen, Lock, Terminal, type LucideProps } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type QickLink = {
  name: string;
  desc: string;
  href: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  available: boolean;
};

const QUICK_LINKS = [
  {
    name: "File Sharing",
    desc: "Manage SMB/CIFS network shares",
    href: "/file-sharing",
    icon: FolderOpen,
    available: true,
  },
  {
    name: "Terminal",
    desc: "Access system terminal over WebSocket",
    href: "/terminal",
    icon: Terminal,
    available: true,
  },
  // {
  //   name: "Converter",
  //   desc: "Convert files between formats",
  //   href: "/converter",
  //   icon: FileOutput,
  //   available: true,
  // },
] satisfies QickLink[];

export const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-fg">Dashboard</h1>
        <p className="mt-1 text-sm text-dim">Welcome to Homedy</p>
      </div>

      {/* Quick access cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_LINKS.map(({ name, desc, href, icon: Icon, available }, i) => (
          <motion.div key={name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Link
              to={available ? href : "#"}
              onClick={(e) => !available && e.preventDefault()}
              className={cn(
                "group flex items-start gap-4 rounded-lg border border-border bg-[#0f0f0f] p-4 transition-colors",
                available ? "hover:border-border-sub hover:bg-[#141414] cursor-pointer" : "opacity-50 cursor-not-allowed",
              )}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border-sub bg-elevated">
                <Icon className="h-4 w-4 text-subtle" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-fg">{name}</p>
                  {!available && <Lock className="h-3 w-3 text-muted" />}
                </div>
                <p className="mt-0.5 text-xs text-dim">{desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Coming soon notice */}
      {/* TODO: frontend & backend dashboard */}
      <div className="rounded-lg border border-dashed border-border p-6 text-center">
        <p className="text-sm text-muted">More features coming soon</p>
      </div>
    </div>
  );
};
