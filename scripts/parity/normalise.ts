export const normalise = (s: string): string => s.split('#')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
