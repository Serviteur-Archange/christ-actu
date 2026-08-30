'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, Heart, Menu, X } from 'lucide-react';
import TextFlipper from '@/components/TextFlipper';
import DonationModal from '@/components/DonationModal';
import ContactModal from '@/components/ContactModal';

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
    setIsMobileMenuOpen(false);
  };

  const getSubItemLink = (parentSlug: string, subItemName: string) => {
    if (subItemName === 'À la Une') return '/a-la-une';
    if (subItemName === 'Flash Info') return '/flash-info';
    if (subItemName === 'Vidéos') return '/videos';
    if (subItemName === 'Prédications & Méditations') return '/enseignements';
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
      label: 'Enseignements',
      slug: 'enseignements',
      isClickable: true,
      subItems: ['Prédications & Méditations', 'Études Bibliques', 'Doctrine & Foi']
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
    {
      label: 'Monde',
      slug: 'monde',
      isClickable: true,
      subItems: ['Afrique', 'Europe', 'Amériques', 'Moyen-Orient & Asie']
    },
  ];

  const toggleMobileSubmenu = (slug: string) => {
    setOpenMobileSubmenu(openMobileSubmenu === slug ? null : slug);
  };

  return (
    <header className="bg-red-700 text-white shadow-md relative z-50 font-sans">
      
      {/* LIGNE SUPÉRIEURE : LOGO + TEXTFLIPPER (INTÉGRÉ) + BURGER */}
      <div className="w-full px-3 sm:px-4 lg:px-12 py-2.5 flex items-center justify-between gap-2 overflow-hidden">
        
        {/* LOGO */}
        <Link href="/" className="flex-shrink-0 hover:opacity-90 transition cursor-pointer">
          <Image 
            src="/CA blanc.png" 
            alt="Christ Actu Logo" 
            width={180} 
            height={45} 
            className="h-7 sm:h-9 w-auto object-contain"
            priority
          />
        </Link>

        {/* FLIPPER TEXT INTÉGRÉ (DESKTOP ET MOBILE) */}
        <div className="flex-1 flex justify-center items-center min-w-0 px-2 border-l border-red-500/60 ml-1">
          <div className="w-full truncate text-center text-xs sm:text-sm">
            <TextFlipper />
          </div>
        </div>

        {/* BARRE DE RECHERCHE DESKTOP */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:block relative w-64 flex-shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            className="w-full bg-red-800 text-white placeholder-red-200 text-sm rounded-full py-1.5 pl-4 pr-10 border border-red-600 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button 
            type="submit" 
            aria-label="Rechercher"
            className="absolute right-3 top-2 text-red-200 hover:text-white transition"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* BOUTON BURGER (MOBILE) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-1.5 rounded-lg text-white hover:bg-red-800 transition focus:outline-none flex-shrink-0"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* BARRE DE NAVIGATION DESKTOP */}
      <nav className="hidden lg:block bg-slate-900 border-t border-slate-800 w-full px-6 lg:px-12">
        <div className="w-full flex items-center justify-between text-sm lg:text-base font-semibold text-slate-200">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDonationOpen(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 transition font-bold cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Fais un don</span>
            </button>

            <ContactModal />
          </div>

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

                <div className={`absolute top-full left-0 w-56 bg-slate-900 border border-slate-800 rounded-b-lg shadow-xl py-2 transition-all duration-200 ${
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

      {/* MENU MOBILE DÉROULANT */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 pt-4 pb-6 space-y-4">
          
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une actualité..."
              className="w-full bg-slate-800 text-white placeholder-slate-400 text-sm rounded-full py-2 pl-4 pr-10 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <button 
              type="submit" 
              aria-label="Rechercher"
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white transition"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col gap-2">
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

            <ContactModal />
          </div>

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

      <DonationModal 
        isOpen={isDonationOpen} 
        onClose={() => setIsDonationOpen(false)} 
      />

    </header>
  );
}