/**
 * A collection's name as shoppers read it: a stray space before a joining hyphen goes ("T -Shirts" → "T-Shirts"),
 * so a typo in the store's data doesn't show in the menu. Spaced dashes ("Kids - Summer") are left as they are.
 */
export const tidyName = (name: string) => name.replace(/\s+-(?=\S)/g, '-')
