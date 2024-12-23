import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

// import components
import { EditorToolbar } from './editor/EditorToolbar';
import { CodeArea } from './editor/CodeArea';
import { InputPanel } from './editor/InputPanel';
import { OutputPanel } from './editor/OutputPanel';
import { Language } from '../utils/constants';

interface CodeEditorProps {
  code: string;
  language: Language; // Changed from string to Language
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: Language) => void; // Changed from string to Language
}

export function CodeEditor({
  code,
  language,
  onCodeChange,
  onLanguageChange
}: CodeEditorProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string>();

  const handleRun = async () => {
    try {
      toast('Compiling .... ', {
        icon: '⏳',
      });

      console.log('Running code...');
      console.log('Code:', code);
      console.log('Input:', input);
      console.log('Language:', language);

      // Make API call
      const response = await axios.post('http://localhost:3001/api/compile', {
        code,
        language,
        input,
      });

      const { output: result, error: compileError } = response.data;

      if (compileError) {
        setError(compileError);
        toast.error('Compilation error occurred');
        setOutput('');
      } else {
        setOutput(result || 'No output received');
        toast.success('Code executed successfully');
        setError(undefined);
      }
    } catch (err) {
      console.error('Execution Error:', err);
      toast.error('An error occurred. Try again');
      setError(err instanceof Error ? err.message : 'An error occurred');
      setOutput('');
    }
  };

  const handleReset = () => {
    onCodeChange('// Start coding here');
    setInput('');
    setOutput('');
    setError(undefined);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <EditorToolbar
        language={language}
        onLanguageChange={onLanguageChange}
        onRun={handleRun}
        onReset={handleReset}
      />

      <div className="flex-1 flex min-h-0">
        <div className="flex-1 flex flex-col min-h-0">
          <CodeArea code={code} onChange={onCodeChange} />
          <InputPanel input={input} onInputChange={setInput} />
        </div>

        <div className="w-1/3 border-l border-slate-700">
          <OutputPanel output={output} error={error} />
        </div>
      </div>
    </div>
  );
}