'use client';

export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import AdSidebar from '@/components/AdSidebar';

export default function CategoryPage() {
  const params = useParams();
  
  // Récupère dynamiquement le paramètre depuis l'URL peu importe le nom du dossier
  const rawCategory = (params?.categorie || params?.category || params?.slug) as string;
  const categorySlug = decodeURIComponent(rawCategory || '').toLowerCase().trim();

  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour afficher le bon titre dans la page
  const getDisplayTitle = (slug: string) => {
    const titles: Record<string, string> = {
      'a-la-une': 'À la Une',
      'monde': 'Monde',
      'eglises': 'Églises',
      'actualites': 'Actualités',
      'societe-culture': 'Société & Culture',
      'flash-info': 'Flash Info',
      'videos': 'Vidéos'
    };
    return titles[slug] || slug.replace(/-/g, ' ');
  };

  useEffect(() => {
    // Sécurité : stoppe le chargement si aucun slug n'est détecté
    if (!categorySlug) {
      setLoading(false);
      return;
    }

    const fetchArticles = async () => {
      setLoading(true);
      let query = supabase.from('articles').select('*');

      // Filtrage selon le slug récupéré dans l'URL
      if (categorySlug === 'a-la-une') {
        // Filtre élargi pour cumuler tous les articles de la Une
        query = query.or('category.eq.À la Une,sub_category.eq.À la Une,is_urgent.eq.true');
      } else if (categorySlug === 'flash-info') {
        query = query.eq('sub_category', 'Flash Info');
      } else if (categorySlug === 'videos') {
        query = query.eq('sub_category', 'Vidéos');
      } else if (categorySlug === 'societe-culture') {
        query = query.eq('category', 'Société & Culture');
      } else if (categorySlug === 'eglises') {
        query = query.eq('category', 'Églises');
      } else if (categorySlug === 'actualites') {
        query = query.eq('category', 'Actualités');
      } else if (categorySlug === 'monde') {
        query = query.eq('category', 'Monde');
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (!error && data) {
        setArticles(data);
      } else {
        console.error('Erreur Supabase:', error);
      }

      setLoading(false);
    };

    fetchArticles();
  }, [categorySlug]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans">
      
      {/* BANNIÈRE PUBLICITAIRE HORIZONTALE */}
      <div className="w-full mb-8 bg-gray-100 border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center min-h-[90px] text-center">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
          PUBLICITÉ / SPONSOR
        </span>
        <div className="text-xs text-gray-500 font-semibold">
          Espace réservé pour la bannière publicitaire (728x90)
        </div>
      </div>

      {/* TITRE DE LA RUBRIQUE */}
      <div className="mb-6">
        <h1 className="text-3xl font-black uppercase text-gray-900 border-l-4 border-red-600 pl-4">
          {getDisplayTitle(categorySlug)}
        </h1>
      </div>

      {/* DISPOSITION : ARTICLES + SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LISTE DES ARTICLES */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-sm font-bold text-gray-500 py-10 animate-pulse">
              Chargement des articles...
            </div>
          ) : articles.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500 font-semibold">
              Aucun article n'a encore été publié dans la catégorie "{getDisplayTitle(categorySlug)}".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((item) => (
                <article key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition">
                  <Link href={`/article/${item.id}`} className="block relative h-48 w-full bg-gray-100 overflow-hidden">
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-semibold">
                        Sans image
                      </div>
                    )}
                  </Link>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {item.category && (
                        <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                      )}
                      {item.sub_category && item.sub_category !== 'Toutes les actus' && (
                        <span className="text-[10px] font-bold uppercase bg-red-50 text-red-600 px-2 py-0.5 rounded">
                          {item.sub_category}
                        </span>
                      )}
                    </div>

                    <h2 className="font-bold text-base text-gray-900 leading-tight mb-2 hover:text-red-600 transition">
                      <Link href={`/article/${item.id}`}>
                        {item.title}
                      </Link>
                    </h2>

                    <p className="text-xs text-gray-600 line-clamp-3 mt-auto">
                      {item.content?.split('\n')[0]}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* SIDEBAR PUBLICITÉ */}
        <aside className="lg:col-span-1">
          <AdSidebar />
        </aside>

      </div>
    </div>
  );
}