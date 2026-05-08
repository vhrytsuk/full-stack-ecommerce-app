const DURATION_UNITS_IN_MS = {
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
} as const;

type DurationUnit = keyof typeof DURATION_UNITS_IN_MS;

export const calculateExpirationDate = (duration: `${number}${DurationUnit}`) => {
  const value = Number.parseInt(duration.slice(0, -1), 10);
  const unit = duration.slice(-1) as DurationUnit;

  return new Date(Date.now() + value * DURATION_UNITS_IN_MS[unit]);
};
