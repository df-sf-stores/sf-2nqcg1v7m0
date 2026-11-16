/**
 * The store's name as it reads in a sentence: a one-word name kept in capitals in Site settings ("ARYOBO") reads
 * "Aryobo", as the brand writes it in running text. Any other name is shown as the store wrote it.
 */
export const storeName = (name: string) => (/^\p{Lu}{2,}$/u.test(name) ? name.charAt(0) + name.slice(1).toLowerCase() : name)
