import React from 'react';
import { Terminal } from 'lucide-react';

interface OutputPanelProps {
  output: string;
  error?: string;
}

export function OutputPanel({ output, error }: OutputPanelProps) {
  return (
    <div className="bg-slate-900 text-white p-4 h-full overflow-auto">
      <div className="flex items-center gap-2 mb-2">
        <Terminal className="w-4 h-4" />
        <h3 className="text-sm font-semibold">Output</h3>
      </div>
      {error ? (
        <pre className="text-red-400 text-sm font-mono whitespace-pre-wrap">{error}</pre>
      ) : (
        <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">{output || 'No output yet'}</pre>
      )}
    </div>
  );
}