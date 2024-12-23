import React from 'react';
import { Type } from 'lucide-react'; // Using Type icon instead of Input which doesn't exist

interface InputPanelProps {
  input: string;
  onInputChange: (input: string) => void;
}

export function InputPanel({ input, onInputChange }: InputPanelProps) {
  return (
    <div className="bg-slate-800 p-4 border-t border-slate-700">
      <div className="flex items-center gap-2 mb-2">
        <Type className="w-4 h-4 text-slate-300" />
        <h3 className="text-sm font-semibold text-slate-300">Input</h3>
      </div>
      <textarea
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Enter your input here (one value per line)"
        className="w-full h-24 bg-slate-900 text-slate-100 p-2 text-sm font-mono rounded border border-slate-700 focus:outline-none focus:border-blue-500 resize-none"
      />
    </div>
  );
}