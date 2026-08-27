'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface BannerAd {
  id: string;
  image_url: string;
  alt: string;
  link?: string;
}

const FALLBACK_AD: BannerAd = {
  id: 'fallback-1',
  image_url: 'https://images.unsplash.com/photo-1542744094-3a3172720177?w=600&auto=format&fit=crop',
  alt: 'Publicité Sponsorisée',
  link: '#'
};

export default function AdSidebar() {
  const [ads, setAds] = useState<BannerAd[]>([FALLBACK_AD]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Charger les publicités depuis Supabase
  useEffect(() => {
    async function fetchAds() {
      try {
        const { data, error } = await supabase
          .from('ads')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const validAds = data.filter((ad) => ad.image_url && ad.image_url.startsWith('http'));
          if (validAds.length > 0) {
            setAds(validAds);
          }
        }
      } catch (err) {
        console.error('Erreur Supabase Ads:', err);
      }
    }

    fetchAds();
  }, []);

  // 2. Defilement automatique toutes les 5 secondes
  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [ads]);

  const currentAd = ads[currentIndex] || ads[0];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
      {/* En-tête sans le bouton public */}
      <div className="flex items-center justify-between border-b pb-2">
        <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
          PUBLICITÉ
        </span>
      </div>

      {/* Affichage de la publicité courante */}
      <div className="relative rounded-lg overflow-hidden bg-gray-100 border border-gray-100 transition-all duration-500">
        <a href={currentAd.link || '#'} target="_blank" rel="noopener noreferrer" className="block">
          <img
            src={currentAd.image_url}
            alt={currentAd.alt || 'Publicité'}
            className="w-full h-auto object-cover hover:opacity-95 transition duration-300"
          />
        </a>
      </div>

      {/* Indicateurs de carrousel si plusieurs publicités */}
      {ads.length > 1 && (
        <div className="flex justify-center gap-1.5 pt-1">
          {ads.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-5 bg-red-600' : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}