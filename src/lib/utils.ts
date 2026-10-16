import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MONTH_MAP: Record<string, string> = {
  january: "Ocak",
  february: "Şubat",
  march: "Mart",
  april: "Nisan",
  may: "Mayıs",
  june: "Haziran",
  july: "Temmuz",
  august: "Ağustos",
  september: "Eylül",
  october: "Ekim",
  november: "Kasım",
  december: "Aralık",
};

export function formatTimeLabel(label: string): string {
  if (!label) return "";
  let res = label.trim();

  // "April 17, 2023" -> "17 Nisan 2023"
  const dateMatch = res.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
  if (dateMatch) {
    const month = MONTH_MAP[dateMatch[1].toLowerCase()] || dateMatch[1];
    return `${dateMatch[2]} ${month} ${dateMatch[3]}`;
  }

  // Relative times
  res = res
    .replace(/(\d+)\s*minutes?\s*ago/gi, "$1 dakika önce")
    .replace(/(\d+)\s*hours?\s*ago/gi, "$1 saat önce")
    .replace(/(\d+)\s*days?\s*ago/gi, "$1 gün önce")
    .replace(/(\d+)\s*weeks?\s*ago/gi, "$1 hafta önce")
    .replace(/(\d+)\s*months?\s*ago/gi, "$1 ay önce")
    .replace(/(\d+)\s*years?\s*ago/gi, "$1 yıl önce")
    .replace(/just now/gi, "Az önce");

  return res;
}

export function formatReadTime(readTime: string): string {
  if (!readTime) return "";
  let res = readTime.trim();

  res = res
    .replace(/(\d+)\s*(?:mins?|minutes?)\s*read/gi, "$1 dk okuma")
    .replace(/(\d+)\s*min/gi, "$1 dk okuma")
    .replace(/(\d+)\s*dk(?:\s*okuma)?/gi, "$1 dk okuma");

  if (/^\d+$/.test(res)) {
    return `${res} dk okuma`;
  }

  return res;
}
