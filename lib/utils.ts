import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getConvexSiteUrl() {
  let convexSiteUrl;
  if (process.env.NEXT_PUBLIC_CONVEX_URL?.includes(".cloud")) {
    convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_URL.replace(
      /\.cloud$/,
      ".site",
    );
  } else {
    const url = new URL(
      process.env.NEXT_PUBLIC_CONVEX_URL || "http://localhost:3000",
    );
    url.port = String(Number(url.port) + 1);
    convexSiteUrl = url.toString();
  }
  return convexSiteUrl;
}
