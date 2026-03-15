"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    title: string;
    href: string;
    icon: React.ReactNode;
  }[];
}

export function Sidebar({ className, items }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "pb-12 w-64 border-r border-slate-200 bg-white hidden md:block shrink-0 h-[calc(100vh-3.5rem)] sticky top-14",
        className,
      )}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-slate-500 uppercase">
            Navigation
          </h2>
          <div className="space-y-1">
            {items.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === item.href
                    ? "font-medium"
                    : "font-normal text-slate-600",
                )}
                asChild
              >
                <Link href={item.href}>
                  <span className="mr-2">{item.icon}</span>
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
