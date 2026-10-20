'use client';

import React, { useState, useEffect } from 'react';

interface IranianPlateInputProps {
  value?: string;
  onChange: (plateStr: string) => void;
  disabled?: boolean;
}

const PERSIAN_LETTERS = [
  'الف', 'ب', 'پ', 'ت', 'ث', 'ج', 'د', 'ز', 'س', 'ش', 'ص', 'ط', 'ع', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و', 'ه', 'ی', 'معلولین'
];

export default function IranianPlateInput({ value = '', onChange, disabled }: IranianPlateInputProps) {
  // فرمت رشته پلاک: مثلا "12-ب-345-Iran68"
  const parsePlate = (str: string) => {
    const parts = str.split('-');
    return {
      part1: parts[0] || '', // ۲ رقم
      letter: parts[1] || 'ب', // حرف فارسی
      part2: parts[2] || '', // ۳ رقم
      cityCode: parts[3] || '۱۱', // ۲ رقم کد ایران
    };
  };

  const [plate, setPlate] = useState(parsePlate(value));

  const currentPlateString = `${plate.part1}-${plate.letter}-${plate.part2}-${plate.cityCode}`;

  useEffect(() => {
    if (value && value !== currentPlateString) {
      setPlate(parsePlate(value));
    }
  }, [value, currentPlateString]);

  const updatePart = (field: 'part1' | 'letter' | 'part2' | 'cityCode', val: string) => {
    const next = { ...plate, [field]: val };
    setPlate(next);
    onChange(`${next.part1}-${next.letter}-${next.part2}-${next.cityCode}`);
  };

  return (
    <div className="w-full max-w-md mx-auto" dir="ltr">
      <div className="relative flex items-center justify-between bg-white border-3 border-slate-900 rounded-2xl shadow-md p-1.5 overflow-hidden select-none">
        
        {/* سمت چپ: پرچم جمهوری اسلامی ایران و I.R. IRAN */}
        <div className="bg-blue-800 text-white flex flex-col items-center justify-between px-2.5 py-2 rounded-xl h-14 w-14 shrink-0 shadow-inner">
          <div className="w-8 h-4 rounded overflow-hidden flex flex-col border border-white/20">
            <div className="h-1/3 bg-emerald-600"></div>
            <div className="h-1/3 bg-white flex items-center justify-center">
              <span className="text-[7px] text-red-600 font-bold leading-none">☀️</span>
            </div>
            <div className="h-1/3 bg-red-600"></div>
          </div>
          <span className="text-[9px] font-black tracking-tighter uppercase font-mono mt-0.5">I.R.</span>
          <span className="text-[8px] font-bold tracking-widest uppercase font-mono">IRAN</span>
        </div>

        {/* بخش ۲ رقم اول */}
        <div className="flex-1 flex justify-center px-1">
          <input
            type="text"
            maxLength={2}
            value={plate.part1}
            disabled={disabled}
            onChange={(e) => {
              const v = e.target.value.replace(/[^\d]/g, '');
              updatePart('part1', v);
              if (v.length === 2) {
                // Focus next
              }
            }}
            placeholder="۲۲"
            className="w-12 h-12 text-center text-2xl font-black text-slate-900 font-mono tracking-widest bg-transparent outline-none focus:bg-slate-50 rounded-lg border border-transparent focus:border-blue-400"
          />
        </div>

        {/* حرف وسط پلاک (سلکتور حروف) */}
        <div className="px-1" dir="rtl">
          <select
            value={plate.letter}
            disabled={disabled}
            onChange={(e) => updatePart('letter', e.target.value)}
            className="h-11 px-2.5 text-center text-xl font-black text-slate-900 bg-amber-50 hover:bg-amber-100/70 border border-amber-300 rounded-xl cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            {PERSIAN_LETTERS.map((char) => (
              <option key={char} value={char} className="font-bold text-slate-900">
                {char}
              </option>
            ))}
          </select>
        </div>

        {/* بخش ۳ رقم */}
        <div className="flex-1 flex justify-center px-1">
          <input
            type="text"
            maxLength={3}
            value={plate.part2}
            disabled={disabled}
            onChange={(e) => {
              const v = e.target.value.replace(/[^\d]/g, '');
              updatePart('part2', v);
            }}
            placeholder="۳۶۵"
            className="w-16 h-12 text-center text-2xl font-black text-slate-900 font-mono tracking-widest bg-transparent outline-none focus:bg-slate-50 rounded-lg border border-transparent focus:border-blue-400"
          />
        </div>

        {/* خط جداکننده ستون ایران */}
        <div className="h-10 w-0.5 bg-slate-300 mx-1"></div>

        {/* کادر کد شهر (ایران) */}
        <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 h-14 w-16 shrink-0">
          <span className="text-[10px] font-bold text-slate-500 leading-tight">ایران</span>
          <input
            type="text"
            maxLength={2}
            value={plate.cityCode}
            disabled={disabled}
            onChange={(e) => {
              const v = e.target.value.replace(/[^\d]/g, '');
              updatePart('cityCode', v);
            }}
            placeholder="۷۷"
            className="w-10 h-7 text-center text-lg font-black text-slate-900 font-mono tracking-widest bg-transparent outline-none focus:bg-white rounded border border-transparent focus:border-blue-400"
          />
        </div>

      </div>

      <div className="flex items-center justify-between px-2 pt-2 text-[11px] text-slate-500 font-medium" dir="rtl">
        <span>پلاک استاندارد ملی خودرو</span>
        <span className="font-mono text-slate-600 font-bold" dir="ltr">
          {plate.part1 || '••'} {plate.letter} {plate.part2 || '•••'} | ایران {plate.cityCode || '••'}
        </span>
      </div>
    </div>
  );
}
