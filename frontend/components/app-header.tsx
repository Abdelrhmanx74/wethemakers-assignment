"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GalleryVerticalEnd,
  Home,
  Briefcase,
  FileText,
  Users,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { UserMenu } from "@/components/user-menu";
import { MobileNav } from "@/components/mobile-nav";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/app/(auth)/_actions/signOut";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

interface AppHeaderProps {
  navItems: NavItem[];
  user: {
    fullName: string;
    email: string;
    role: string;
  };
  homeHref: string;
  isAdmin?: boolean;
}

export function AppHeader({
  navItems,
  user,
  homeHref,
  isAdmin = false,
}: AppHeaderProps) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOutAction();
  };

  const getIconComponent = (iconName: string) => {
    const icons = {
      Home,
      Briefcase,
      FileText,
      Users,
      Settings,
      LayoutDashboard,
    };
    return icons[iconName as keyof typeof icons] || Home;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <MobileNav
            navItems={navItems}
            user={user}
            onSignOut={handleSignOut}
          />

          {/* Logo */}
          <Link
            href={homeHref}
            className="flex items-center gap-2 font-semibold"
          >
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <span className="hidden sm:inline-block font-bold">Acme Jobs</span>
            {isAdmin && (
              <span className="hidden sm:inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                Admin
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = getIconComponent(item.icon);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  <IconComponent className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
