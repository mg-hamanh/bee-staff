"use client";

import { usePathname } from "next/navigation";

import { findTitleFromNav } from "@/utils/formatters";

export default function BeeTitle() {
  const pathname = usePathname();
  const title = findTitleFromNav(pathname);

  return <h1 className="text-xl font-bold">{title}</h1>;
}
