import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface TouchControllerProps {
  onDirectionPress: (dir: 'up' | 'down' | 'left' | 'right', isPressed: boolean) => void;
}

export const TouchController: React.FC<TouchControllerProps> = ({ onDirectionPress }) => {
  return (
    <div className="flex md:hidden items-center justify-center gap-2 mt-1 select-none">
      <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800">
        <div />
        <button
          onPointerDown={() => onDirectionPress('up', true)}
          onPointerUp={() => onDirectionPress('up', false)}
          onPointerLeave={() => onDirectionPress('up', false)}
          className="w-11 h-11 bg-slate-800 active:bg-cyan-500 active:text-slate-950 text-slate-200 rounded-xl flex items-center justify-center border border-slate-700 shadow transition-colors"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
        <div />

        <button
          onPointerDown={() => onDirectionPress('left', true)}
          onPointerUp={() => onDirectionPress('left', false)}
          onPointerLeave={() => onDirectionPress('left', false)}
          className="w-11 h-11 bg-slate-800 active:bg-cyan-500 active:text-slate-950 text-slate-200 rounded-xl flex items-center justify-center border border-slate-700 shadow transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onPointerDown={() => onDirectionPress('down', true)}
          onPointerUp={() => onDirectionPress('down', false)}
          onPointerLeave={() => onDirectionPress('down', false)}
          className="w-11 h-11 bg-slate-800 active:bg-cyan-500 active:text-slate-950 text-slate-200 rounded-xl flex items-center justify-center border border-slate-700 shadow transition-colors"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <button
          onPointerDown={() => onDirectionPress('right', true)}
          onPointerUp={() => onDirectionPress('right', false)}
          onPointerLeave={() => onDirectionPress('right', false)}
          className="w-11 h-11 bg-slate-800 active:bg-cyan-500 active:text-slate-950 text-slate-200 rounded-xl flex items-center justify-center border border-slate-700 shadow transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
