export const SUPPORTED_LANGUAGES = [
  'javascript', 
  'python', 
  'java', 
  'cpp'
] as const;

export type Language = typeof SUPPORTED_LANGUAGES[number];

export const DEFAULT_CODE = `
let n = 10;
let sum = 0;

for (let i = 0; i < n; i++) {
  sum += i;
}

console.log('Sum:', sum);`;