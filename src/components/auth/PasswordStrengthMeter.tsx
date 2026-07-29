'use client';

import React from 'react';

export interface PasswordStrengthMeterProps {
  password?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password = '' }) => {
  const getScore = (pass: string) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const score = getScore(password);

  const getLabel = (s: number) => {
    if (s <= 1) return { text: 'Weak', color: 'bg-rose-500 text-rose-400', pct: '25%' };
    if (s <= 3) return { text: 'Medium', color: 'bg-amber-500 text-amber-400', pct: '50%' };
    if (s === 4) return { text: 'Strong', color: 'bg-blue-500 text-blue-400', pct: '75%' };
    return { text: 'Very Strong', color: 'bg-emerald-500 text-emerald-400', pct: '100%' };
  };

  const info = getLabel(score);

  if (!password) return null;

  return (
    <div className="space-y-1.5 pt-1">
      <div className="flex justify-between items-center text-[10px] font-mono">
        <span className="text-slate-400">Password Strength</span>
        <span className={`font-bold ${info.color.split(' ')[1]}`}>{info.text}</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${info.color.split(' ')[0]}`}
          style={{ width: info.pct }}
        />
      </div>
    </div>
  );
};
