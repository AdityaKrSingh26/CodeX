interface CodeAreaProps {
  code: string;
  onChange: (code: string) => void;
}

export function CodeArea({ 
  code, 
  onChange 
}: CodeAreaProps) {

  return (

    <div className="relative flex-1 min-h-0">

      <div className="absolute inset-0">

        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full bg-slate-800 text-slate-100 p-4 font-mono text-sm resize-none focus:outline-none"
          placeholder="Start coding here..."
          spellCheck={false}
        />

      </div>
      
    </div>

  );
}