export function formatRaceTime(date, time, timezone) {
  if (!date || !time || !timezone) return null;

  const utcDate = new Date(
    `${date}T${time.replace("Z", "")}Z`
  );

  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  }).format(utcDate);
}