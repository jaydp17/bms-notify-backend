export function getEpoch(date: Date) {
  return Math.round(date.getTime() / 1000);
}

export function isYYYYMMDD(dateStr: string) {
  return /^(\d{4})-(\d{2})-(\d{2})$/.test(dateStr);
}

// Copied from https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types
export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
