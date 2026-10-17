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

export function formatRelativeTime(value: string | null | undefined): string {
  if (!value) return "Yeni";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "Yeni";
  const now = Date.now();
  const diffMinutes = Math.floor((now - date.getTime()) / 60000);
  if (diffMinutes < 1) return "Az önce";
  if (diffMinutes < 60) return `${diffMinutes} dakika önce`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} saat önce`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} gün önce`;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Istanbul",
  }).format(date);
}

export function formatFullDateTime(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  }).format(date);
}

export function estimateReadTime(text: string | null | undefined): string {
  if (!text) return "2 dk okuma";
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 150));
  return `${minutes} dk okuma`;
}

export function turkishSlugify(text: string): string {
  if (!text) return "";
  const charMap: Record<string, string> = {
    ç: "c", Ç: "c",
    ğ: "g", Ğ: "g",
    ı: "i", I: "i", İ: "i",
    ö: "o", Ö: "o",
    ş: "s", Ş: "s",
    ü: "u", Ü: "u",
    â: "a", Â: "a",
    î: "i", Î: "i",
    û: "u", Û: "u",
  };

  let str = text;
  for (const [key, val] of Object.entries(charMap)) {
    str = str.replaceAll(key, val);
  }

  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 85);
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
