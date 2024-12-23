import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { Languages } from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  type Language
} from '../../utils/constants';

interface LanguageSelectorProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSelector({
  language,
  onLanguageChange
}: LanguageSelectorProps) {

  const changeLanguage = useCallback((lang: Language) => {
    onLanguageChange(lang);
    toast.success(`Language changed to ${lang}`);
  }, []);

  return (

    <div className="flex items-center space-x-2">

      <Languages className="w-5 h-5 text-slate-300" />

      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value as Language)}
        className="bg-slate-600 text-white px-3 py-1 rounded-md text-sm"
      >
        {SUPPORTED_LANGUAGES.map(lang => (
          <option key={lang} value={lang}>
            {lang.charAt(0).toUpperCase() + lang.slice(1)}
          </option>
        ))}
      </select>

    </div>

  );
}