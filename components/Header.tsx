'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ChevronDown, Heart } from 'lucide-react';
import TextFlipper from '@/components/TextFlipper';
import DonationModal from '@/components/DonationModal';

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  // Redirection corrigée vers les routes directes (sans /categorie/)
  const getSubItemLink = (parentSlug: string, subItemName: string) => {
    if (subItemName === 'À la Une') return '/a-la-une';
    if (subItemName === 'Flash Info') return '/flash-info';
    if (subItemName === 'Vidéos') return '/videos';
    
    // Si tu veux aussi enlever /categorie/ pour Monde, Églises, etc. :
    return `/${parentSlug}`;
  };

  const navItems = [
    {
      label: 'Actualités',
      slug: 'actualites',
      isClickable: false,
      subItems: ['À la Une', 'Flash Info', 'Vidéos']
    },
    {
      label: 'Monde',
      slug: 'monde',
      isClickable: true,
      subItems: ['Afrique', 'Europe', 'Amériques', 'Moyen-Orient & Asie']
    },
    {
      label: 'Églises',
      slug: 'eglises',
      isClickable: true,
      subItems: ['Vie des communautés', 'Missions & Évangélisation', 'Témoignages', 'Événements']
    },
    {
      label: 'Société & Culture',
      slug: 'societe-culture',
      isClickable: true,
      subItems: ['Musique & Louange', 'Livres & Médias', 'Économie & Éthique', 'Famille']
    },
  ];

  return (
    <header className="bg-red-700 text-white shadow-md relative z-50 font-sans">
      
      {/* LIGNE SUPÉRIEURE : LOGO + BANNIÈRE + RECHERCHE */}
      <div className="w-full px-6 md:px-12 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6 flex-1">
          <Link href="/" className="flex-shrink-0 hover:opacity-90 transition cursor-pointer">
            <Image 
              src="/CA blanc.png" 
              alt="Christ Actu Logo" 
              width={200} 
              height={50} 
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          <div className="hidden sm:flex flex-1 justify-center border-l-2 border-red-400 pl-6">
            <TextFlipper />
          </div>
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Rechercher une actualité..."
            className="w-full bg-red-800 text-white placeholder-red-200 text-sm rounded-full py-2 pl-4 pr-10 border border-red-600 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <Search className="absolute right-3 top-2.5 text-red-200 w-4 h-4" />
        </div>
      </div>

      {/* BARRE DE NAVIGATION */}
      <nav className="bg-slate-900 border-t border-slate-800 w-full px-6 md:px-12">
        <div className="w-full flex items-center justify-between text-sm md:text-base font-semibold text-slate-200">
          
          {/* BOUTON FAIS UN DON */}
          <button 
            onClick={() => setIsDonationOpen(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 transition font-bold cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Fais un don</span>
          </button>

          {/* RUBRIQUES AVEC BOUCLE MAP */}
          <div className="flex-1 flex items-center justify-around pl-8">
            {navItems.map((item) => (
              <div 
                key={item.slug}
                className="relative group py-3 cursor-default"
                onMouseEnter={() => setActiveDropdown(item.slug)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {!item.isClickable ? (
                  <div className="flex items-center gap-1.5 text-slate-200 hover:text-red-400 transition whitespace-nowrap cursor-default">
                    <span>{item.label}</span>
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180 text-slate-400" />
                  </div>
                ) : (
                  <Link 
                    href={`/${item.slug}`}
                    className="flex items-center gap-1.5 hover:text-red-400 transition whitespace-nowrap"
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180 text-slate-400" />
                  </Link>
                )}

                {/* MENU DÉROULANT */}
                <div className={`absolute top-full left-0 w-52 bg-slate-900 border border-slate-800 rounded-b-lg shadow-xl py-2 transition-all duration-200 ${
                  activeDropdown === item.slug ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                }`}>
                  {item.subItems.map((sub, idx) => (
                    <Link
                      key={idx}
                      href={getSubItemLink(item.slug, sub)}
                      className="block px-4 py-2.5 text-xs text-slate-300 hover:bg-red-600 hover:text-white transition"
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* BOUTON ANNONCES / PUB */}
            <Link 
              href="/annonces" 
              className="py-3 hover:text-red-400 transition whitespace-nowrap"
            >
              Annonces / Pub
            </Link>
          </div>

        </div>
      </nav>

      {/* MODALE DE DON */}
      <DonationModal 
        isOpen={isDonationOpen} 
        onClose={() => setIsDonationOpen(false)} 
      />

    </header>
  );
}