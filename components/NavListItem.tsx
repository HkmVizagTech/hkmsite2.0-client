"use client";

import React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface NavListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  href: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
}

const NavListItem = React.forwardRef<HTMLAnchorElement, NavListItemProps>(
  ({ className, href, title, description, icon: Icon, children, ...props }, ref) => {
    return (
      <li>
        <Link
          ref={ref}
          href={href}
          className={cn(
            "group/item block select-none rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-vk-50 focus:bg-vk-50",
            className,
          )}
          {...props}
        >
          <div className="flex items-start gap-3">
            {Icon && (
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-vk-100 text-vk-700 transition-colors group-hover/item:bg-vk-700 group-hover/item:text-white">
                <Icon className="h-4 w-4" />
              </div>
            )}
            <div className="flex-1">
              <div className="text-sm font-semibold leading-none text-ink group-hover/item:text-vk-700">{title}</div>
              {description && (
                <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          </div>
        </Link>
      </li>
    );
  },
);
NavListItem.displayName = "NavListItem";

export { NavListItem };
