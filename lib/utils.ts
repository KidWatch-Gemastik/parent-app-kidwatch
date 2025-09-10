import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function isInSafeZone(
  lat: number,
  lng: number,
  zoneLat: number,
  zoneLng: number,
  radius: number
) {
  const R = 6371e3; // metres
  const dLat = toRad(zoneLat - lat);
  const dLng = toRad(zoneLng - lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat)) * Math.cos(toRad(zoneLat)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c <= radius;
}

export async function fetchWithTimeout(
  input: RequestInfo,
  init: RequestInit = {},
  timeout = 15000
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}
