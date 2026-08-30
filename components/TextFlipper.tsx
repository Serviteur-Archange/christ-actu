'use client';

import { useEffect, useState } from 'react';

const WORDS = [
  'Évangélisation',
  'Églises',
  'Jeunesse',
  'Politique',
  'Société',
  'International',
  'Économie',
  'Faits divers',
  'Justice',
  'Culture',
  'Sport',
  "L'essentiel de l'info chrétienne" // Slogan final
];

export default function TextFlipper() {
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState<'enter' | 'exit'>('enter');

  useEffect(() => {
    // Temps d'affichage : 2.5s pour le slogan, 1s pour les mots simples
    const displayDuration = index === WORDS.length - 1 ? 2500 : 1000;

    const holdTimer = setTimeout(() => {
      setStep('exit');

      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % WORDS.length);
        setStep('enter');
      }, 250);
    }, displayDuration);

    return () => clearTimeout(holdTimer);
  }, [index]);

  return (
    <div className="h-8 sm:h-10 overflow-hidden relative flex items-center justify-center w-full">
      <span
        className={`inline-block text-[11px] sm:text-base md:text-2xl italic font-extrabold text-white tracking-wide transition-all duration-300 ease-out transform whitespace-nowrap ${
          step === 'enter'
            ? 'opacity-100 translate-y-0 blur-0'
            : 'opacity-0 -translate-y-6 blur-md'
        }`}
        style={{
          filter: step === 'exit' ? 'blur(8px)' : 'blur(0px)',
        }}
      >
        {WORDS[index]}
      </span>
    </div>
  );
}