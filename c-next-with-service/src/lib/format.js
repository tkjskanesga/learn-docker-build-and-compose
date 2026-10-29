const AVATAR_COLORS = [
  "#0f766e",
  "#1d4ed8",
  "#9a3412",
  "#3f6212",
  "#7e22ce",
  "#0e7490",
  "#b91c1c",
  "#4b5563",
];

export function avatarColor(username) {
  let hash = 0;
  for (let index = 0; index < username.length; index += 1) {
    hash = (hash * 31 + username.charCodeAt(index)) % 997;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function initials(displayName, username) {
  const source = (displayName || username || "?").trim();
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

export function timeAgo(date) {
  const value = date instanceof Date ? date : new Date(date);
  const seconds = Math.max(
    0,
    Math.floor((Date.now() - value.getTime()) / 1000),
  );

  if (seconds < 60) return "baru saja";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} mnt`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} j`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hr`;

  const sameYear = value.getFullYear() === new Date().getFullYear();
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: sameYear ? undefined : "numeric",
  }).format(value);
}

export function joinedAt(date) {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(date instanceof Date ? date : new Date(date));
}

export function formatCount(value) {
  return new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatFullDate(date) {
  const value = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}
