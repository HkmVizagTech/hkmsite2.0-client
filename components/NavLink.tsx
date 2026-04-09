"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  activeClassName?: string;
  inactiveClassName?: string;
}

const NavLink = ({
  href,
  children,
  className,
  onClick,
  activeClassName = "text-primary",
  inactiveClassName = "text-muted-foreground hover:text-foreground",
}: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "transition-colors",
        isActive ? activeClassName : inactiveClassName,
        className
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
