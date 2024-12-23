import { 
  Play, 
  RotateCcw 
} from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { Language } from '../../utils/constants';

interface EditorToolbarProps {
  language: string;
  onLanguageChange: (language: Language) => void;
  onRun: () => void;
  onReset: () => void;
}

export function EditorToolbar({ 
  language, 
  onLanguageChange, 
  onRun, 
  onReset 
}: EditorToolbarProps) {

  return (

    <div className="bg-slate-700 p-2 flex items-center justify-between">
      
      <div className="flex items-center space-x-4">
        <LanguageSelector language={language as any} onLanguageChange={onLanguageChange} />
      </div>


      <div className="flex items-center space-x-2">

        <button
          onClick={onReset}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-600 rounded-lg transition-colors"
          title="Reset Code"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={onRun}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Play className="w-4 h-4" />
          <span>
            Run
          </span>
        </button>

      </div>


    </div>

  );
}