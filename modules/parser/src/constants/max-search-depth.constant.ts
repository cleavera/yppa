export const MAX_SEARCH_DEPTH: () => number = (): number => Number.parseInt(process.env.max_depth || '', 10) || 10;
