'use client';

import { useState } from 'react';
import DonationModal from '@/components/DonationModal';

export default function DonationBanner() {
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  return (
    <>
      <div className="bg-pink-50/50 border border-pink-100 rounded-2xl p-6 text-center space-y-4">
        <span className="inline-block bg-red-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
          SOUTENIR CHRIST ACTU
        </span>

        <h3 className="text-gray-900 font-extrabold text-base leading-snug">
          Faites un don pour soutenir la presse chrétienne
        </h3>

        <p className="text-gray-500 text-xs leading-relaxed">
          Permettez-nous de continuer à diffuser l'actualité chrétienne à travers le monde.
        </p>

        <button
          type="button"
          onClick={() => setIsDonationOpen(true)}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition shadow-sm active:scale-95 cursor-pointer"
        >
          Faire un don maintenant
        </button>
      </div>

      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
      />
    </>
  );
}