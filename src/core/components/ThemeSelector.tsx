import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setColorTheme, ColorTheme, addToast } from '@/shared/uiSlice';
import { Palette, Check } from 'lucide-react';
import { THEMES } from '@/core/constants/themes';

export const ThemeSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.ui.colorTheme);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectTheme = (themeId: ColorTheme, themeName: string) => {
    dispatch(setColorTheme(themeId));
    document.documentElement.setAttribute('data-theme', themeId);
    dispatch(
      addToast({
        type: 'success',
        title: 'Theme Updated',
        message: `Switched color palette to ${themeName}.`,
      })
    );
    setIsOpen(false);
  };

  const activeThemeObj = THEMES.find((t) => t.id === currentTheme) || THEMES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs group"
        title="Change Platform Color Theme"
      >
        <span className={`w-3 h-3 rounded-full ${activeThemeObj.color} ring-2 ring-white shadow-xs shrink-0`} />
        <span className="hidden md:inline">{activeThemeObj.name.split(' ')[0]}</span>
        <Palette className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 animate-slideDown">
          <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-600" /> Color Theme Palette
            </span>
          </div>

          <div className="py-1 space-y-1">
            {THEMES.map((theme) => {
              const isSelected = currentTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleSelectTheme(theme.id, theme.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left group ${
                    isSelected ? 'bg-slate-100 font-bold text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-4 h-4 rounded-full ${theme.color} ring-2 ring-white shadow-xs shrink-0`} />
                    <div>
                      <p className="font-semibold">{theme.name}</p>
                      <p className="text-[10px] text-slate-400 font-normal">{theme.description}</p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

