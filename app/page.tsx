'use client';

export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import AdSidebar from '@/components/AdSidebar';

interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
  image_url: string;
  is_urgent?: boolean;
  created_at: string;
}

const DEMO_ARTICLES: Article[] = [
  {
    id: 'demo-1',
    title: 'Évangélisation massive : Des milliers de vies transformées lors du grand rassemblement',
    category: 'Monde',
    content: 'Un grand rassemblement s’est tenu ce week-end, rassemblant des fidèles venus de diverses régions pour des temps forts de prière et d’enseignement.',
    image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop',
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-2',
    title: 'Nouveau chant de louange : L’album qui inspire la communauté cette saison',
    category: 'Société & Culture',
    content: 'La musique sacrée s’enrichit d’un tout nouvel opus qui touche déjà de nombreux cœurs à travers le continent.',
    image_url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop',
    created_at: new Date().toISOString()
  }
];

export default function HomeJournal() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  // État pour simuler/gérer la présence d'une pub chargée (met à true pour tester l'affichage)
  const [hasAdLoaded, setHasAdLoaded] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        setArticles(DEMO_ARTICLES);
      } else {
        setArticles(data);
      }
    } catch {
      setArticles(DEMO_ARTICLES);
    } finally {
      setLoading(false);
    }
  };

  const urgentArticle = articles.find((art) => art.is_urgent) || articles[0];
  const regularArticles = articles.filter((art) => art.id !== urgentArticle?.id);

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 flex flex-col justify-between" suppressHydrationWarning>
      
      {/* CONTENU PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-16 flex-1 w-full">
        
        {/* BANNIÈRE ADSENSE DYNAMIQUE (s'affiche uniquement si hasAdLoaded === true) */}
        {hasAdLoaded && (
          <div className="w-full mb-8 overflow-hidden transition-all duration-500 ease-in-out">
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center min-h-[250px] text-center shadow-sm relative">
              <div className="absolute top-2 right-3 text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <span>PUBLICITÉ</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
              </div>
              
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 font-bold text-xs rounded-full uppercase tracking-wider">
                  Bannière Google AdSense Dynamique
                </span>
                <p className="text-xs text-gray-400 max-w-md">
                  Cet emplacement se masque automatiquement si Google ne renvoie aucune publicité.
                </p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-bold animate-pulse">
            Chargement des actualités en cours...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <section className="lg:col-span-8 space-y-8">
              {urgentArticle && (
                <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-red-600 text-white text-xs font-bold uppercase px-2.5 py-1 rounded animate-pulse shadow-[0_0_12px_rgba(220,38,38,0.8)]">
                      {urgentArticle.is_urgent ? 'Urgent / À la Une' : urgentArticle.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(urgentArticle.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-4 hover:text-red-600 transition">
                    <Link href={`/article/${urgentArticle.id}`}>
                      {urgentArticle.title}
                    </Link>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <Link href={`/article/${urgentArticle.id}`} className="relative h-64 w-full rounded-lg border border-gray-100 bg-gray-100 overflow-hidden flex items-center justify-center block">
                      {urgentArticle.image_url ? (
                        <img 
                          src={urgentArticle.image_url} 
                          alt={urgentArticle.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm font-semibold">Pas d'image</span>
                      )}
                    </Link>
                    <div className="space-y-3">
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-6">
                        {urgentArticle.content}
                      </p>
                      <Link href={`/article/${urgentArticle.id}`} className="inline-block text-red-600 font-bold text-sm hover:underline pt-2">
                        Lire la suite →
                      </Link>
                    </div>
                  </div>
                </article>
              )}

              <div>
                <h3 className="text-xl font-black text-gray-900 mb-4 border-b pb-2 flex items-center justify-between">
                  <span>Dernières Actualités</span>
                  <span className="h-2 w-2 rounded-full bg-red-600"></span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {regularArticles.map((item) => (
                    <article key={item.id} className="bg-white rounded-lg p-4 border border-gray-200 flex gap-4 hover:shadow-md transition">
                      <Link href={`/article/${item.id}`} className="relative w-28 h-24 flex-shrink-0 rounded-md bg-gray-100 overflow-hidden flex items-center justify-center block">
                        {item.image_url ? (
                          <img 
                            src={item.image_url} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] text-gray-400 font-semibold">Photo</span>
                        )}
                      </Link>
                      <div className="space-y-1.5 flex-1">
                        <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide">
                          {item.category}
                        </span>
                        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 hover:text-red-600 transition">
                          <Link href={`/article/${item.id}`}>
                            {item.title}
                          </Link>
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {item.content}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* SIDEBAR AVEC PUBLICITÉ */}
            <aside className="lg:col-span-4 space-y-8">
              
              <AdSidebar />

              {/* CARD PORTRAIT */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b pb-2">
                  <h2 className="text-lg font-black text-gray-900">Portrait</h2>
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                </div>

                {(() => {
                  const portrait = articles.find((art) => art.category === 'Société & Culture') || articles[0];

                  if (!portrait) return null;

                  return (
                    <Link href={`/article/${portrait.id}`} className="group block space-y-3">
                      {portrait.image_url && (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={portrait.image_url}
                            alt={portrait.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <span className="inline-block text-[10px] font-bold uppercase bg-red-50 text-red-600 px-2 py-0.5 rounded">
                          {portrait.category || 'Portrait'}
                        </span>
                        <h3 className="font-extrabold text-gray-900 text-sm group-hover:text-red-600 transition-colors leading-snug">
                          {portrait.title}
                        </h3>
                        {portrait.content && (
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {portrait.content.split('\n\n')[0]}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })()}
              </div>

            </aside>

          </div>
        )}
      </main>

    </div>
  );
}