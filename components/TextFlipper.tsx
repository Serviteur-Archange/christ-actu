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
  "L'essentiel de l'info chrétienne" // Le slogan est intégré à la fin de la boucle
];

export default function TextFlipper() {
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState<'enter' | 'exit'>('enter');

  useEffect(() => {
    // 1. Temps d'affichage du mot (1 seconde, ou 2.5 secondes si c'est le slogan final)
    const displayDuration = index === WORDS.length - 1 ? 2500 : 1000;

    const holdTimer = setTimeout(() => {
      setStep('exit'); // Effet de flou et sortie vers le haut

      // 2. Changement de mot après l'animation de sortie (250ms)
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % WORDS.length); // Boucle infinie
        setStep('enter');
      }, 250);
    }, displayDuration);

    return () => clearTimeout(holdTimer);
  }, [index]);

  return (
    <div className="h-10 overflow-hidden relative flex items-center justify-center">
      <span
        className={`inline-block text-xl md:text-2xl italic font-extrabold text-white tracking-wide transition-all duration-300 ease-out transform ${
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