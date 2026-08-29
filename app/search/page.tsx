'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import AdSidebar from '@/components/AdSidebar';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  image_url?: string;
  category?: string;
  created_at: string;
}

function SearchComponent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSearchResults() {
      setLoading(true);
      const cleanQuery = query.trim().toLowerCase();
      
      if (!cleanQuery) {
        setArticles([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          // Mots vides à ignorer lors du découpage
          const stopWords = ['de', 'du', 'des', 'le', 'la', 'les', 'un', 'une', 'et', 'en', 'au', 'aux', 'a', 'pour', 'sur', 'dans'];
          
          // Extraction des mots significatifs uniquement
          const significantWords = cleanQuery
            .split(' ')
            .map(w => w.trim())
            .filter(w => w.length > 2 && !stopWords.includes(w));

          const filtered = data.filter((article) => {
            const title = article.title?.toLowerCase() || '';
            const excerpt = article.excerpt?.toLowerCase() || '';
            const content = article.content?.toLowerCase() || '';
            const category = article.category?.toLowerCase() || '';

            // 1. Vérifie si la recherche exacte est présente
            const fullMatch = title.includes(cleanQuery) || excerpt.includes(cleanQuery) || content.includes(cleanQuery);
            if (fullMatch) return true;

            // 2. Sinon, tous les mots importants doivent être présents dans l'article
            if (significantWords.length > 0) {
              const matchesAllSignificant = significantWords.every(word =>
                title.includes(word) || excerpt.includes(word) || content.includes(word) || category.includes(word)
              );
              return matchesAllSignificant;
            }

            return false;
          });

          setArticles(filtered);
        } else {
          setArticles([]);
        }
      } catch (err) {
        console.error('Erreur recherche:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gray-100 border border-dashed border-gray-300 rounded-lg p-6 text-center text-xs text-gray-400 mb-8">
        PUBLICITÉ / SPONSOR
      </div>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-gray-900">
          Résultats pour : <span className="text-red-600">"{query}"</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <p className="text-gray-500 py-8">Recherche en cours...</p>
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Link 
                  key={article.id} 
                  href={`/article/${article.slug}`} 
                  className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
                >
                  <div className="relative h-48 w-full bg-gray-100">
                    <img
                      src={article.image_url || '/placeholder.png'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-4">
                    {article.category && (
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                        {article.category}
                      </span>
                    )}
                    <h2 className="text-base font-bold text-gray-900 group-hover:text-red-600 transition line-clamp-2 mt-1">
                      {article.title}
                    </h2>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-600">
              Aucun article ne correspond à votre recherche pour "<span className="font-semibold">{query}</span>".
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <AdSidebar />
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8">Chargement...</div>}>
      <SearchComponent />
    </Suspense>
  );
}