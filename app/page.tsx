import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import AdSidebar from '@/components/AdSidebar';
import FeaturedCarousel from '@/components/FeaturedCarousel';

export const revalidate = 0; // Force le rechargement des données à chaque visite

interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
  image_url: string;
  is_urgent?: boolean;
  is_portrait?: boolean;
  created_at: string;
}

interface EventItem {
  id: string;
  title: string;
  date_event: string;
  location: string;
  type: string;
  image_url?: string;
  link_url?: string;
  created_at?: string;
}

// Récupération des articles
async function getArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur Supabase (articles):', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Erreur Fetch articles:', err);
    return [];
  }
}

// Récupération des événements
async function getEvents(): Promise<EventItem[]> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur Supabase (events):', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Erreur Fetch events:', err);
    return [];
  }
}

export default async function HomeJournal() {
  const [articles, events] = await Promise.all([getArticles(), getEvents()]);
  
  // 1. Filtrage des articles "À la Une" (urgent) pour le carrousel
  const urgentArticles = articles.filter((art) => art.is_urgent);
  const featuredList = urgentArticles.length > 0 ? urgentArticles : articles.slice(0, 6);

  // 2. Sélection de l'article Portrait
  const portraitArticle = articles.find((art) => art.is_portrait) || 
                          articles.find((art) => art.category === 'Société & Culture') || 
                          articles[0];

  // 3. Extraction des articles de la rubrique "Enseignements"
  const teachingArticles = articles.filter(
    (art) => art.category === 'Enseignements' || art.category === 'RELIGION • ENSEIGNEMENT & SPIRITUEL'
  );

  // 4. Exclure du fil général ("Dernières Actualités") : les articles du carrousel, le portrait et les enseignements
  const featuredIds = new Set(featuredList.map((a) => a.id));
  const teachingIds = new Set(teachingArticles.map((a) => a.id));
  
  const regularArticles = articles.filter(
    (art) => !featuredIds.has(art.id) && 
             !teachingIds.has(art.id) && 
             art.id !== portraitArticle?.id
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 flex flex-col justify-between" suppressHydrationWarning>
      <main className="max-w-7xl mx-auto px-4 py-6 pb-16 flex-1 w-full">
        
        {/* BANNIÈRE ADSENSE DYNAMIQUE */}
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

        {articles.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm my-8">
            <h3 className="text-lg font-bold text-gray-700 mb-2">Aucun article disponible</h3>
            <p className="text-sm text-gray-500">
              Chargement ou connexion Supabase en cours d'analyse...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* COLONNE PRINCIPALE */}
            <section className="lg:col-span-8 space-y-8">

              {/* CARROUSEL À LA UNE */}
              <FeaturedCarousel articles={featuredList} />

              {/* DERNIÈRES ACTUALITÉS */}
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

              {/* SECTION ENSEIGNEMENTS & SPIRITUALITÉ */}
              {teachingArticles.length > 0 && (
                <div className="pt-2">
                  <h3 className="text-xl font-black text-gray-900 mb-4 border-b pb-2 flex items-center justify-between">
                    <span>📖 Enseignements & Spiritualité</span>
                    <span className="h-2 w-2 rounded-full bg-red-600"></span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {teachingArticles.slice(0, 3).map((item) => (
                      <article key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                        <div>
                          {item.image_url && (
                            <Link href={`/article/${item.id}`} className="block relative w-full h-40 bg-gray-100 overflow-hidden">
                              <img 
                                src={item.image_url} 
                                alt={item.title} 
                                className="w-full h-full object-cover hover:scale-105 transition duration-300"
                              />
                            </Link>
                          )}
                          <div className="p-4">
                            <span className="text-[10px] font-extrabold uppercase bg-red-50 text-red-600 px-2 py-0.5 rounded">
                              Enseignement
                            </span>
                            <h4 className="font-extrabold text-sm text-gray-900 mt-2 mb-1 line-clamp-2 hover:text-red-600 transition">
                              <Link href={`/article/${item.id}`}>{item.title}</Link>
                            </h4>
                            <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed mt-2">
                              {item.content}
                            </p>
                          </div>
                        </div>
                        <div className="p-4 pt-0">
                          <Link href={`/article/${item.id}`} className="text-xs font-bold text-red-600 hover:underline">
                            Lire la prédication →
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION ÉVÉNEMENTS */}
              {events.length > 0 && (
                <div className="pt-4">
                  <h3 className="text-xl font-black text-gray-900 mb-4 border-b pb-2 flex items-center justify-between">
                    <span>📅 Événements & Agenda Chrétien</span>
                    <span className="h-2 w-2 rounded-full bg-red-600"></span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-start">
                    {events.map((evt) => (
                      <div key={evt.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col justify-between hover:border-red-300 hover:shadow-md transition">
                        <div>
                          <div className="mb-2">
                            <span className="text-[10px] font-extrabold uppercase bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full">
                              {evt.type}
                            </span>
                          </div>

                          {evt.image_url && (
                            <div className="w-full rounded-lg overflow-hidden bg-gray-50 mb-3 border border-gray-100">
                              <img 
                                src={evt.image_url} 
                                alt={evt.title} 
                                className="w-full h-auto object-contain block"
                              />
                            </div>
                          )}

                          <h4 className="font-extrabold text-sm text-gray-900 leading-snug">
                            {evt.title}
                          </h4>

                          <div className="mt-2 space-y-1 text-xs text-gray-600">
                            <p className="flex items-center gap-1.5">
                              <span>📅</span> <strong>{evt.date_event}</strong>
                            </p>
                            <p className="flex items-center gap-1.5 text-gray-500 truncate">
                              <span>📍</span> {evt.location}
                            </p>
                          </div>
                        </div>

                        {evt.link_url && (
                          <a
                            href={evt.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 w-full text-center text-xs font-bold text-white bg-red-600 hover:bg-red-700 py-2.5 rounded-lg transition block"
                          >
                            Billetterie / Info
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* SIDEBAR LATÉRALE */}
            <aside className="lg:col-span-4 space-y-8">
              <AdSidebar />

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b pb-2">
                  <h2 className="text-lg font-black text-gray-900">Portrait</h2>
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                </div>

                {portraitArticle && (
                  <Link href={`/article/${portraitArticle.id}`} className="group block space-y-3">
                    {portraitArticle.image_url && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={portraitArticle.image_url}
                          alt={portraitArticle.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <span className="inline-block text-[10px] font-bold uppercase bg-red-50 text-red-600 px-2 py-0.5 rounded">
                        {portraitArticle.category || 'Portrait'}
                      </span>
                      <h3 className="font-extrabold text-gray-900 text-sm group-hover:text-red-600 transition-colors leading-snug">
                        {portraitArticle.title}
                      </h3>
                      {portraitArticle.content && (
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {portraitArticle.content.split('\n\n')[0]}
                        </p>
                      )}
                    </div>
                  </Link>
                )}
              </div>
            </aside>

          </div>
        )}
      </main>
    </div>
  );
}