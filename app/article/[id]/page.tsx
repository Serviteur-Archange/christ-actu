'use client';

export const dynamic = 'force-dynamic';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Calendar, ArrowLeft, Bookmark, User, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AdSidebar from '@/components/AdSidebar';
import DonationBanner from '@/components/DonationBanner';

interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
  image_url: string;
  author_name?: string;
  author?: string;
  created_at: string;
  views?: number;
}

function ArticleContent({ articleId }: { articleId: string }) {
  const [article, setArticle] = useState<Article | null>(null);
  const [otherArticles, setOtherArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAllData() {
      try {
        setLoading(true);

        // Bloque les doublons en dev / session unique par visiteur
        const viewedKey = `viewed_article_${articleId}`;
        const hasViewed = sessionStorage.getItem(viewedKey);

        if (!hasViewed) {
          sessionStorage.setItem(viewedKey, 'true');
          const { error: rpcError } = await supabase.rpc('increment_views', { 
            article_id: articleId 
          });
          if (rpcError) console.error('Erreur incrémentation vues:', rpcError);
        }

        const [articleRes, othersRes] = await Promise.all([
          supabase.from('articles').select('*').eq('id', articleId).maybeSingle(),
          supabase.from('articles').select('*').neq('id', articleId).order('created_at', { ascending: false }).limit(4)
        ]);

        if (isMounted) {
          if (articleRes.data) setArticle(articleRes.data);
          if (othersRes.data) setOtherArticles(othersRes.data);
        }
      } catch (err) {
        console.error('Erreur Supabase:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (articleId) {
      loadAllData();
    }

    return () => {
      isMounted = false;
    };
  }, [articleId]);

  const paragraphs = article?.content ? article.content.split('\n\n') : [];
  const leadParagraph = paragraphs.length > 0 ? paragraphs[0] : '';
  const bodyParagraphs = paragraphs.slice(1).join('\n\n');
  const authorDisplayName = article?.author_name || article?.author || 'Willy Tokpa';

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900" suppressHydrationWarning>
      
      {/* CONTENU PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 py-8 pb-16">
        {loading ? (
          <div className="text-center py-20 text-gray-500 font-bold animate-pulse">
            Chargement de l'article en cours...
          </div>
        ) : !article ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm max-w-lg mx-auto my-12">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Article introuvable</h2>
            <Link href="/" className="inline-flex items-center gap-2 text-white bg-red-600 px-5 py-2.5 rounded-lg font-bold hover:bg-red-700 transition">
              <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <section className="lg:col-span-8 space-y-8">
              <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6 md:p-10">
                
                <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:underline mb-6">
                  <ArrowLeft className="w-3.5 h-3.5" /> Retour à la Une
                </Link>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="bg-red-600 text-white text-xs font-bold uppercase px-2.5 py-1 rounded">
                    {article.category || 'Actualité'}
                  </span>
                  
                  <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 border-l pl-3 border-gray-300">
                    <User className="w-3.5 h-3.5 text-red-600" />
                    Par <span className="font-bold text-gray-900">{authorDisplayName}</span>
                  </span>

                  <span className="text-xs text-gray-400 flex items-center gap-1 border-l pl-3 border-gray-300">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(article.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>

                  {/* AFFICHAGE DES VUES */}
                  <span className="text-xs font-bold text-gray-600 flex items-center gap-1 border-l pl-3 border-gray-300">
                    <Eye className="w-3.5 h-3.5 text-red-600" />
                    {article.views || 0} Vues
                  </span>
                </div>

                <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight mb-6">
                  {article.title}
                </h1>

                {article.image_url && (
                  <div className="relative w-full h-72 md:h-[420px] rounded-xl overflow-hidden mb-6 bg-gray-100 border border-gray-100">
                    <img 
                      src={article.image_url} 
                      alt={article.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {leadParagraph && (
                  <p className="text-base font-normal italic text-gray-700 leading-relaxed mb-6 border-l-4 border-red-600 pl-4 py-1">
                    {leadParagraph}
                  </p>
                )}

                <div className="w-full bg-gray-50 text-gray-400 text-[11px] font-semibold text-center py-2 uppercase tracking-widest my-6 border-y border-gray-100">
                  La suite après cette publicité
                </div>

                {otherArticles.length > 0 && (
                  <div className="my-6 p-4 rounded-lg bg-gray-50 border-l-4 border-slate-900 flex items-center justify-between gap-4">
                    <div className="text-sm md:text-base leading-snug">
                      <span className="font-extrabold text-gray-900">Lire aussi : </span>
                      <Link 
                        href={`/article/${otherArticles[0].id}`} 
                        className="text-red-700 font-bold hover:underline transition"
                      >
                        {otherArticles[0].title}
                      </Link>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-700 bg-white rounded-full border shadow-sm flex-shrink-0">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="text-gray-800 text-base md:text-lg leading-relaxed whitespace-pre-line pt-4">
                  {bodyParagraphs || article.content}
                </div>
              </article>

              {otherArticles.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-4">
                  <h3 className="text-xl font-black text-gray-900 border-b pb-3 flex items-center justify-between">
                    <span>Autres actualités à découvrir</span>
                    <span className="h-2 w-2 rounded-full bg-red-600"></span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {otherArticles.map((item) => (
                      <Link 
                        key={item.id} 
                        href={`/article/${item.id}`}
                        className="flex gap-3 p-3 rounded-lg border border-gray-100 hover:border-red-200 hover:bg-red-50/30 transition group"
                      >
                        <div className="relative w-24 h-20 flex-shrink-0 rounded bg-gray-100 overflow-hidden">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-gray-400 flex items-center justify-center h-full font-semibold">Photo</span>
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <span className="text-[10px] font-bold text-red-600 uppercase">
                            {item.category}
                          </span>
                          <h4 className="text-xs font-bold text-gray-900 line-clamp-2 group-hover:text-red-600 transition">
                            {item.title}
                          </h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* SIDEBAR PUBLICITÉ ET BLOC DONATIONS */}
            <aside className="lg:col-span-4 space-y-8">
              <AdSidebar />
              <DonationBanner />
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ArticleDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <ArticleContent articleId={resolvedParams.id} />;
}