'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface BannerAd {
  id: string;
  image_url: string;
  alt: string;
  link?: string;
}

// Tes 4 affiches originales haute définition
const LOCAL_ADS: BannerAd[] = [
  {
    id: 'local-1',
    image_url: '/Affiche Gigi copie.jpg',
    alt: 'Affiche Gigi',
    link: '#'
  },
  {
    id: 'local-2',
    image_url: '/Célébration Visual.jpg',
    alt: 'Célébration Visual',
    link: '#'
  },
  {
    id: 'local-3',
    image_url: '/Fleyr Zoe Immobilier.jpg',
    alt: 'Flyer Zoé Immobilier',
    link: '#'
  },
  {
    id: 'local-4',
    image_url: '/KIOSQUE 4.jpg',
    alt: 'Kiosque 4',
    link: '#'
  }
];

export default function AdSidebar() {
  const [ads, setAds] = useState<BannerAd[]>(LOCAL_ADS);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Charger les publicités depuis Supabase (si la table contient des données)
  useEffect(() => {
    async function fetchAds() {
      try {
        const { data, error } = await supabase
          .from('ads')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const validAds = data.filter((ad) => ad.image_url);
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

  // 2. Défilement automatique toutes les 5 secondes
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
      {/* En-tête */}
      <div className="flex items-center justify-between border-b pb-2">
        <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
          PUBLICITÉ
        </span>
      </div>

      {/* Affichage de l'affiche courante optimisée */}
      <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
        <a 
          href={currentAd.link || '#'} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block w-full h-full relative"
        >
          <Image
            src={currentAd.image_url}
            alt={currentAd.alt || 'Publicité'}
            fill
            sizes="(max-width: 768px) 100vw, 350px"
            quality={95}
            priority
            className="object-contain hover:opacity-95 transition duration-300"
          />
        </a>
      </div>

      {/* Indicateurs du carrousel */}
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