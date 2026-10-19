"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../ui/utils";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";

interface PageHeaderProps {
  breadcrumbs?: string[]; // Kept optional for backward compatibility
  title?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  hideIdBreadcrumb?: boolean;
}

interface BreadcrumbItemInfo {
  label: string;
  path: string | null;
}

const findMenuPath = (
  menuItems: any[] = [],
  targetHref: string,
  currentPath: BreadcrumbItemInfo[] = [],
): BreadcrumbItemInfo[] | null => {
  if (!menuItems || !Array.isArray(menuItems)) return null;
  for (const item of menuItems) {
    if (!item || !item.title) continue;
    const currentItemInfo: BreadcrumbItemInfo = {
      label: item.title.toUpperCase(),
      path: item.href || null,
    };

    if (item.href && item.href.toLowerCase() === targetHref.toLowerCase()) {
      return [...currentPath, currentItemInfo];
    }

    if (item.children && item.children.length > 0) {
      const found = findMenuPath(item.children, targetHref, [
        ...currentPath,
        currentItemInfo,
      ]);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

const isIdSegment = (seg: string) => {
  if (!seg) return false;

  if (/^\d+$/.test(seg)) return true;

  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(seg)
  )
    return true;

  if (/^[0-9a-f]{24}$/i.test(seg)) return true;

  if (/^(cm|c)[a-z0-9]{15,}$/i.test(seg)) return true;

  if (seg.length >= 16 && /\d/.test(seg) && /[a-zA-Z]/.test(seg)) return true;
  return false;
};

const getBreadcrumbs = (
  pathname: string,
  hideIdBreadcrumb: boolean = true,
  menu: any[] = [],
): BreadcrumbItemInfo[] => {
  if (!pathname || pathname === "/") {
    return [];
  }

  // Iteratively search for the longest matching prefix in the menu
  const pathSegments = pathname.split("/").filter(Boolean);
  let matchedPath: BreadcrumbItemInfo[] | null = null;
  let unmatchedSegments: string[] = [];

  while (pathSegments.length > 0) {
    const currentHref = "/" + pathSegments.join("/");
    matchedPath = findMenuPath(menu, currentHref);
    if (matchedPath) {
      break;
    }
    const lastSeg = pathSegments.pop();
    if (lastSeg) {
      unmatchedSegments.unshift(lastSeg);
    }
  }

  if (!matchedPath) {
    matchedPath = [];
    const segments = pathname.split("/").filter(Boolean);
    unmatchedSegments = segments;
  }

  const extraBreadcrumbs = unmatchedSegments
    .filter((seg) => (hideIdBreadcrumb ? !isIdSegment(seg) : true))
    .map((seg) => {
      return {
        label: decodeURIComponent(seg).replace(/[-_]/g, " ").toUpperCase(),
        path: null,
      };
    });

  return [...matchedPath, ...extraBreadcrumbs];
};

const toTitleCase = (str: string) => {
  return str
    .replace(/[-_]/g, " ")
    .replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase(),
    );
};

export function PageHeader({
  actions,
  className,
  breadcrumbs,
  hideIdBreadcrumb = true,
}: PageHeaderProps) {
  const pathname = usePathname();

  const derivedBreadcrumbs = React.useMemo(() => {
    if (breadcrumbs && breadcrumbs.length > 0) {
      const filtered = hideIdBreadcrumb
        ? breadcrumbs.filter((b) => !isIdSegment(b))
        : breadcrumbs;
      return filtered.map((b, idx) => ({
        label: b,
        path: idx === 0 && b.toLowerCase() === "home" ? "/dashboard" : null,
      }));
    }
    const breadcrumbsResult = getBreadcrumbs(pathname || "", hideIdBreadcrumb);
    return [{ label: "Home", path: "/" }, ...breadcrumbsResult];
  }, [pathname, breadcrumbs, hideIdBreadcrumb]);

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-3 px-1 py-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        className,
      )}
    >
      {/* Left side: Breadcrumb Route */}
      {derivedBreadcrumbs.length > 0 && (
        <Breadcrumb className="min-w-0 text-xs font-medium text-slate-500 select-none">
          <BreadcrumbList className="flex flex-wrap items-center gap-1 text-xs font-medium text-slate-500 sm:gap-1.5">
            {derivedBreadcrumbs.map((crumb, idx) => {
              const isLast = idx === derivedBreadcrumbs.length - 1;
              const displayLabel = toTitleCase(crumb.label);
              return (
                <React.Fragment key={crumb.label + idx}>
                  {idx > 0 && (
                    <BreadcrumbSeparator className="shrink-0 text-slate-400 [&>svg]:size-3" />
                  )}
                  <BreadcrumbItem className="shrink-0 whitespace-nowrap">
                    {isLast ? (
                      <BreadcrumbPage className="whitespace-nowrap text-xs font-semibold text-slate-800 dark:text-slate-100">
                        {displayLabel}
                      </BreadcrumbPage>
                    ) : crumb.path ? (
                      <BreadcrumbLink
                        asChild
                        className="whitespace-nowrap text-xs font-medium text-slate-500 transition-colors duration-200 hover:text-slate-800 dark:hover:text-slate-200"
                      >
                        <Link href={crumb.path}>{displayLabel}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <span className="cursor-default whitespace-nowrap text-xs font-medium text-slate-500">
                        {displayLabel}
                      </span>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* Right side: Actions */}
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:ml-auto sm:gap-2.5">
          {actions}
        </div>
      )}
    </div>
  );
}
