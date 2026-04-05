import { useNavigate } from "react-router";
import { ChevronLeft, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router";
import { MobileSidebar } from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { HomedyLogo } from "../ui/logo";
import { api } from "@/utils/server/apiClient";

export function Topbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await api.post("/auth/signout");
    } catch {
      // Best-effort — redirect regardless
    }
    navigate("/signin");
  };

  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : "-";

  return (
    <header className="fixed left-0 right-0 top-0 z-30 h-14 border-b border-border bg-base/80 backdrop-blur-sm lg:left-56">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Left — mobile menu + logo */}
        <div>
          <div className="flex items-center gap-3">
            <MobileSidebar />
            <Link to="/dashboard" className="flex items-center gap-2 lg:hidden">
              <HomedyLogo />
              <span className="text-sm font-semibold text-fg">Homedy</span>
            </Link>
          </div>
          <ChevronLeft
            onClick={() => navigate(-1)}
            aria-label="Previous page"
            className="hover:text-subtle transition-colors duration-200 cursor-pointer"
          />
        </div>

        {/* Right — user menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md px-2 py-1 text-subtle hover:bg-elevated hover:text-fg transition-colors focus:outline-none">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-2xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm sm:inline">{user?.username ?? "..."}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* TODO: add /profile page and api endpoint */}
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-400 focus:bg-red-950/30 focus:text-red-400">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
