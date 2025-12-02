"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

// A helper function to title-case a string.
function toTitleCase(str: string) {
  return str
    .replace(/-/g, " ")
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return null;
  }
  
  // Don't show breadcrumbs on the role selection page
  if (pathname === '/') return null;

  return (
    <nav aria-label="Breadcrumb" className="w-full">
      <ol className="flex items-center gap-1 text-sm text-muted-foreground">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Role Selection</span>
          </Link>
        </li>
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;

          return (
            <React.Fragment key={href}>
              <li className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4" />
                <Link
                  href={href}
                  className={cn(
                    "transition-colors hover:text-foreground",
                    isLast && "font-medium text-foreground pointer-events-none"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {toTitleCase(segment)}
                </Link>
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
