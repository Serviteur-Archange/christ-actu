'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ChevronDown, Heart, Menu, X } from 'lucide-react';
import TextFlipper from '@/components/TextFlipper';
import DonationModal from '@/components/DonationModal';

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);

  const getSubItemLink = (parentSlug: string, subItemName: string) => {
    if (subItemName === 'À la Une') return '/a-la-une';
    if (subItemName === 'Flash Info') return '/flash-info';
    if (subItemName === 'Vidéos') return '/videos';
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

  const toggleMobileSubmenu = (slug: string) => {
    setOpenMobileSubmenu(openMobileSubmenu === slug ? null : slug);
  };

  return (
    <header className="bg-red-700 text-white shadow-md relative z-50 font-sans">
      
      {/* LIGNE SUPÉRIEURE : LOGO + RECHERCHE DESKTOP + BURGER MOBILE */}
      <div className="w-full px-4 lg:px-12 py-3 flex items-center justify-between gap-2">
        
        {/* LOGO */}
        <Link href="/" className="flex-shrink-0 hover:opacity-90 transition cursor-pointer">
          <Image 
            src="/CA blanc.png" 
            alt="Christ Actu Logo" 
            width={180} 
            height={45} 
            className="h-8 sm:h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* FLIPPER TEXT (DESKTOP SEULEMENT) */}
        <div className="hidden lg:flex flex-1 justify-center border-l-2 border-red-400 pl-6">
          <TextFlipper />
        </div>

        {/* BARRE DE RECHERCHE DESKTOP */}
        <div className="hidden lg:block relative w-72">
          <input
            type="text"
            placeholder="Rechercher une actualité..."
            className="w-full bg-red-800 text-white placeholder-red-200 text-sm rounded-full py-2 pl-4 pr-10 border border-red-600 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <Search className="absolute right-3 top-2.5 text-red-200 w-4 h-4" />
        </div>

        {/* BOUTON BURGER (VISIBLE SUR TOUT ÉCRAN < 1024px) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-white hover:bg-red-800 transition focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* BARRE DE NAVIGATION DESKTOP (CACHE EN DESSOUS DE 1024px) */}
      <nav className="hidden lg:block bg-slate-900 border-t border-slate-800 w-full px-6 lg:px-12">
        <div className="w-full flex items-center justify-between text-sm lg:text-base font-semibold text-slate-200">
          
          <button 
            onClick={() => setIsDonationOpen(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 transition font-bold cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Fais un don</span>
          </button>

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

            <Link 
              href="/annonces" 
              className="py-3 hover:text-red-400 transition whitespace-nowrap"
            >
              Annonces / Pub
            </Link>
          </div>

        </div>
      </nav>

      {/* MENU MOBILE DÉROULANT (S'AFFICHE SOUS 1024px) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 pt-4 pb-6 space-y-4">
          
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Rechercher une actualité..."
              className="w-full bg-slate-800 text-white placeholder-slate-400 text-sm rounded-full py-2 pl-4 pr-10 border border-slate-700 focus:outline-none"
            />
            <Search className="absolute right-3 top-2.5 text-slate-400 w-4 h-4" />
          </div>

          <button 
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsDonationOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Fais un don</span>
          </button>

          <div className="space-y-1 divide-y divide-slate-800">
            {navItems.map((item) => (
              <div key={item.slug} className="pt-2">
                <div className="flex items-center justify-between py-2 text-slate-200 font-medium">
                  {item.isClickable ? (
                    <Link 
                      href={`/${item.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="hover:text-red-400 transition"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-slate-400">{item.label}</span>
                  )}

                  <button 
                    onClick={() => toggleMobileSubmenu(item.slug)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform ${openMobileSubmenu === item.slug ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {openMobileSubmenu === item.slug && (
                  <div className="pl-4 pb-2 space-y-2 bg-slate-950/50 rounded-lg py-2 mt-1">
                    {item.subItems.map((sub, idx) => (
                      <Link
                        key={idx}
                        href={getSubItemLink(item.slug, sub)}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-sm text-slate-300 hover:text-red-400 py-1"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-3">
              <Link 
                href="/annonces" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-slate-200 font-medium hover:text-red-400"
              >
                Annonces / Pub
              </Link>
            </div>
          </div>

        </div>
      )}

      {/* MODALE DE DON */}
      <DonationModal 
        isOpen={isDonationOpen} 
        onClose={() => setIsDonationOpen(false)} 
      />

    </header>
  );
}