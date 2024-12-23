export const SUPPORTED_LANGUAGES = [
  'javascript', 
  'python', 
  'java', 
  'cpp', 
  'typescript'
] as const;

export type Language = typeof SUPPORTED_LANGUAGES[number];

export const DEFAULT_CODE = `// Example: Simple program to calculate sum of numbers
// Input: One number per line
// First line: number of elements (n)
// Next n lines: numbers to sum

const n = parseInt(readline());
let sum = 0;

for (let i = 0; i < n; i++) {
  const num = parseInt(readline());
  sum += num;
}

console.log('Sum:', sum);`;