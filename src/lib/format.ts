export function formatCents(cents?: number | null, currency = "EUR"): string {
  if (cents === undefined || cents === null || Number.isNaN(cents)) return "—";
  const value = cents / 100;
  try {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

export function formatOwners(range?: string): string {
  if (!range) return "Inconnu";
  return range.replace(/\.\.\./g, "–").replace(/,/g, " ");
}

export function timeAgo(): string {
  return new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}
