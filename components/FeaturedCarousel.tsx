'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
  image_url: string;
  created_at: string;
}

export default function FeaturedCarousel({ articles }: { articles: Article[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  if (!articles || articles.length === 0) return null;

  const currentArticle = articles[selectedIndex] || articles[0];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % articles.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  // Défilement automatique avec pause au survol
  useEffect(() => {
    if (isHovered || articles.length <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [selectedIndex, isHovered, articles.length]);

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6 mb-8 transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ENTÊTE AVEC BADGE URGENT + BOUTONS DE NAVIGATION */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="bg-red-600 text-white text-xs font-bold uppercase px-2.5 py-1 rounded animate-pulse shadow-[0_0_12px_rgba(220,38,38,0.5)]">
            Urgent / À la Une
          </span>
          <span className="text-xs font-semibold text-gray-400">
            {new Date(currentArticle.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
        </div>

        {/* FLÈCHES ET PUCES DE NAVIGATION */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {articles.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  selectedIndex === idx ? 'w-6 bg-red-600' : 'w-2 bg-gray-200 hover:bg-gray-300'
                }`}
                title={`Article ${idx + 1}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-1 border-l pl-3 border-gray-200">
            <button
              onClick={handlePrev}
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
              title="Précédent"
            >
              ◀
            </button>
            <button
              onClick={handleNext}
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
              title="Suivant"
            >
              ▶
            </button>
          </div>
        </div>
      </div>

      {/* TITRE DE L'ARTICLE */}
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-4 hover:text-red-600 transition">
        <Link href={`/article/${currentArticle.id}`}>
          {currentArticle.title}
        </Link>
      </h2>

      {/* BLOC IMAGE ET EXTRAIT D'ARTICLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <Link 
          href={`/article/${currentArticle.id}`} 
          className="relative h-64 md:h-72 w-full rounded-lg border border-gray-100 bg-gray-100 overflow-hidden flex items-center justify-center block group"
        >
          {currentArticle.image_url ? (
            <img 
              key={currentArticle.id}
              src={currentArticle.image_url} 
              alt={currentArticle.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <span className="text-gray-400 text-sm font-semibold">Pas d'image</span>
          )}
        </Link>

        <div className="space-y-4 flex flex-col justify-between h-full">
          <div>
            <span className="inline-block text-[10px] font-bold uppercase bg-red-50 text-red-600 px-2.5 py-1 rounded mb-2">
              {currentArticle.category}
            </span>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-6">
              {currentArticle.content}
            </p>
          </div>

          <div>
            <Link 
              href={`/article/${currentArticle.id}`} 
              className="inline-flex items-center gap-2 text-red-600 font-bold text-sm hover:underline"
            >
              <span>Lire la suite</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}