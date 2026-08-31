'use client';

export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LogOut, Megaphone, FileText, Calendar, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Article {
  id: string;
  title: string;
  category: string;
  sub_category?: string;
  video_url?: string;
  content: string;
  image_url: string;
  is_urgent?: boolean;
  is_portrait?: boolean;
  created_at: string;
}

interface Service {
  id: string;
  name: string;
  activity: string;
  description: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  location?: string;
  image_url?: string;
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

export default function AdminPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  // Ajout de 'enseignements' dans les onglets actifs
  const [activeTab, setActiveTab] = useState<'articles' | 'enseignements' | 'annonces' | 'events'>('articles');

  // --- ÉTATS ARTICLES ---
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('Toutes les actus');
  const [videoUrl, setVideoUrl] = useState('');
  const [lead, setLead] = useState('');
  const [content, setContent] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- ÉTATS ENSEIGNEMENTS ---
  const [ensTitle, setEnsTitle] = useState('');
  const [ensPreacher, setEnsPreacher] = useState('');
  const [ensContent, setEnsContent] = useState('');
  const [ensImageFile, setEnsImageFile] = useState<File | null>(null);
  const [ensEditingId, setEnsEditingId] = useState<string | null>(null);
  const [currentEnsImageUrl, setCurrentEnsImageUrl] = useState('');
  const [enseignements, setEnseignements] = useState<Article[]>([]);

  // --- ÉTATS ANNONCES / SERVICES ---
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceName, setServiceName] = useState('');
  const [serviceActivity, setServiceActivity] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [servicePhone, setServicePhone] = useState('');
  const [serviceWhatsapp, setServiceWhatsapp] = useState('');
  const [serviceLocation, setServiceLocation] = useState('');
  const [serviceImageFile, setServiceImageFile] = useState<File | null>(null);
  const [currentServiceImageUrl, setCurrentServiceImageUrl] = useState('');
  const [services, setServices] = useState<Service[]>([]);

  // --- ÉTATS ÉVÉNEMENTS ---
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventLink, setEventLink] = useState('');
  const [eventImageFile, setEventImageFile] = useState<File | null>(null);
  const [currentEventImageUrl, setCurrentEventImageUrl] = useState('');
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const isLogged = localStorage.getItem('admin_logged');
    
    if (isLogged !== 'true') {
      router.replace('/admin/login');
    } else {
      fetchArticles();
      fetchEnseignements();
      fetchServices();
      fetchEvents();
      setCheckingAuth(false);
    }
  }, [router]);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .neq('category', 'Enseignements')
        .order('created_at', { ascending: false });

      if (!error && data) setArticles(data);
    } catch (err) {
      console.error('Erreur chargement articles:', err);
    }
  };

  const fetchEnseignements = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('category', 'Enseignements')
        .order('created_at', { ascending: false });

      if (!error && data) setEnseignements(data);
    } catch (err) {
      console.error('Erreur chargement enseignements:', err);
    }
  };

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) setServices(data);
    } catch (err) {
      console.error('Erreur chargement services:', err);
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) setEvents(data);
    } catch (err) {
      console.error('Erreur chargement événements:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged');
    router.replace('/admin/login');
  };

  // --- LOGIQUE ENSEIGNEMENTS ---
  const handleEnseignementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let imageUrl = currentEnsImageUrl;

      if (ensImageFile) {
        const fileExt = ensImageFile.name.split('.').pop();
        const fileName = `ens_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('articles')
          .upload(fileName, ensImageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('articles')
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const payload = {
        title: ensTitle,
        category: 'Enseignements',
        sub_category: ensPreacher ? `Orateur: ${ensPreacher}` : 'Enseignement',
        content: ensContent,
        image_url: imageUrl,
      };

      if (ensEditingId) {
        const { error } = await supabase.from('articles').update(payload).eq('id', ensEditingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('articles').insert([payload]);
        if (error) throw error;
      }

      handleCancelEnsEdit();
      fetchEnseignements();
      setMessage(ensEditingId ? 'Enseignement mis à jour !' : 'Enseignement publié avec succès !');
    } catch (err: any) {
      console.error(err);
      setMessage(`Erreur : ${err.message || 'Une erreur est survenue'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditEns = (item: Article) => {
    setEnsEditingId(item.id);
    setEnsTitle(item.title);
    setEnsPreacher(item.sub_category?.replace('Orateur: ', '') || '');
    setEnsContent(item.content);
    setCurrentEnsImageUrl(item.image_url || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEnsEdit = () => {
    setEnsEditingId(null);
    setEnsTitle('');
    setEnsPreacher('');
    setEnsContent('');
    setEnsImageFile(null);
    setCurrentEnsImageUrl('');
  };

  const handleDeleteEns = async (id: string) => {
    if (confirm('Voulez-vous supprimer cet enseignement ?')) {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (!error) {
        if (ensEditingId === id) handleCancelEnsEdit();
        fetchEnseignements();
      }
    }
  };

  // --- LOGIQUE ARTICLES ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const handleEdit = (article: Article) => {
    setEditingId(article.id);
    setTitle(article.title || '');
    setCategory(article.category || '');
    setSubCategory(article.sub_category || 'Toutes les actus');
    setVideoUrl(article.video_url || '');
    setCurrentImageUrl(article.image_url || '');
    setIsUrgent(article.is_urgent || false);
    setIsPortrait(article.is_portrait || false);

    const paragraphs = article.content ? article.content.split('\n\n') : [];
    if (paragraphs.length > 1) {
      setLead(paragraphs[0]);
      setContent(paragraphs.slice(1).join('\n\n'));
    } else {
      setLead('');
      setContent(article.content || '');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setCategory('');
    setSubCategory('Toutes les actus');
    setVideoUrl('');
    setLead('');
    setContent('');
    setIsUrgent(false);
    setIsPortrait(false);
    setImageFile(null);
    setCurrentImageUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let imageUrl = currentImageUrl;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('articles')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('articles')
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const fullContent = lead ? `${lead}\n\n${content}` : content;
      const finalSubCategory = (isUrgent || subCategory === 'À la Une') ? 'À la Une' : subCategory;

      const payload = {
        title,
        category,
        sub_category: finalSubCategory,
        video_url: finalSubCategory === 'Vidéos' ? videoUrl : null,
        content: fullContent,
        image_url: imageUrl,
        is_urgent: isUrgent,
        is_portrait: isPortrait,
      };

      if (editingId) {
        const { error: updateError } = await supabase.from('articles').update(payload).eq('id', editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('articles').insert([payload]);
        if (insertError) throw insertError;
      }

      handleCancelEdit();
      fetchArticles();
      setMessage(editingId ? 'Article mis à jour avec succès !' : 'Article publié !');
    } catch (err: any) {
      console.error(err);
      setMessage(`Erreur : ${err.message || 'Une erreur est survenue'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Voulez-vous supprimer cet article ?')) {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (!error) {
        if (editingId === id) handleCancelEdit();
        fetchArticles();
      }
    }
  };

  // --- LOGIQUE ANNONCES ---
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let imageUrl = currentServiceImageUrl;

      if (serviceImageFile) {
        const fileExt = serviceImageFile.name.split('.').pop();
        const fileName = `service_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('articles').upload(fileName, serviceImageFile);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from('articles').getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }

      const payload = {
        name: serviceName,
        activity: serviceActivity,
        description: serviceDesc,
        phone: servicePhone,
        whatsapp: serviceWhatsapp || null,
        location: serviceLocation || null,
        image_url: imageUrl || null,
      };

      if (editingServiceId) {
        const { error } = await supabase.from('services').update(payload).eq('id', editingServiceId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('services').insert([payload]);
        if (error) throw error;
      }

      handleCancelServiceEdit();
      fetchServices();
      setMessage(editingServiceId ? 'Annonce mise à jour !' : 'Annonce publiée !');
    } catch (err: any) {
      console.error(err);
      setMessage(`Erreur : ${err.message || 'Une erreur est survenue'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = (service: Service) => {
    setEditingServiceId(service.id);
    setServiceName(service.name);
    setServiceActivity(service.activity);
    setServiceDesc(service.description);
    setServicePhone(service.phone);
    setServiceWhatsapp(service.whatsapp || '');
    setServiceLocation(service.location || '');
    setCurrentServiceImageUrl(service.image_url || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelServiceEdit = () => {
    setEditingServiceId(null);
    setServiceName('');
    setServiceActivity('');
    setServiceDesc('');
    setServicePhone('');
    setServiceWhatsapp('');
    setServiceLocation('');
    setServiceImageFile(null);
    setCurrentServiceImageUrl('');
  };

  const handleDeleteService = async (id: string) => {
    if (confirm('Voulez-vous supprimer cette annonce ?')) {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (!error) {
        if (editingServiceId === id) handleCancelServiceEdit();
        fetchServices();
      }
    }
  };

  // --- LOGIQUE ÉVÉNEMENTS ---
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let imageUrl = currentEventImageUrl;

      if (eventImageFile) {
        const fileExt = eventImageFile.name.split('.').pop();
        const fileName = `event_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('articles').upload(fileName, eventImageFile);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from('articles').getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }

      const payload = {
        title: eventTitle,
        date_event: eventDate,
        location: eventLocation,
        type: eventType,
        link_url: eventLink || null,
        image_url: imageUrl || null,
      };

      if (editingEventId) {
        const { error } = await supabase.from('events').update(payload).eq('id', editingEventId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('events').insert([payload]);
        if (error) throw error;
      }

      handleCancelEventEdit();
      fetchEvents();
      setMessage(editingEventId ? 'Événement mis à jour !' : 'Événement ajouté !');
    } catch (err: any) {
      console.error(err);
      setMessage(`Erreur : ${err.message || 'Une erreur est survenue'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = (evt: EventItem) => {
    setEditingEventId(evt.id);
    setEventTitle(evt.title);
    setEventDate(evt.date_event);
    setEventLocation(evt.location);
    setEventType(evt.type);
    setEventLink(evt.link_url || '');
    setCurrentEventImageUrl(evt.image_url || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEventEdit = () => {
    setEditingEventId(null);
    setEventTitle('');
    setEventDate('');
    setEventLocation('');
    setEventType('');
    setEventLink('');
    setEventImageFile(null);
    setCurrentEventImageUrl('');
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm('Voulez-vous supprimer cet événement ?')) {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (!error) {
        if (editingEventId === id) handleCancelEventEdit();
        fetchEvents();
      }
    }
  };

  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentArticles = articles.slice(startIndex, startIndex + itemsPerPage);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700">
        <p className="font-semibold text-sm">Vérification de l'accès...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-12 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-red-600 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm transition">
            <ArrowLeft className="w-4 h-4"/> Retour à l'accueil
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-gray-400">Espace Administration</span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 bg-white px-3 py-2 rounded-lg border border-red-200 shadow-sm transition"
            >
              <LogOut className="w-3.5 h-3.5"/> Déconnexion
            </button>
          </div>
        </div>

        {/* --- BARRE D'ONGLETS COMPRENANT ENSEIGNEMENTS --- */}
        <div className="flex flex-col sm:flex-row gap-2 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
          <button
            onClick={() => { setActiveTab('articles'); setMessage(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'articles' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-4 h-4"/> Articles ({articles.length})
          </button>

          <button
            onClick={() => { setActiveTab('enseignements'); setMessage(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'enseignements' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-4 h-4"/> Enseignements ({enseignements.length})
          </button>

          <button
            onClick={() => { setActiveTab('annonces'); setMessage(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'annonces' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Megaphone className="w-4 h-4"/> Annonces ({services.length})
          </button>

          <button
            onClick={() => { setActiveTab('events'); setMessage(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'events' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-4 h-4"/> Événements ({events.length})
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-lg font-semibold text-sm ${
            message.startsWith('Erreur') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {message}
          </div>
        )}

        {/* ================= ONGLET ENSEIGNEMENTS ================= */}
        {activeTab === 'enseignements' && (
          <div className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-2xl font-black text-gray-900">
                  {ensEditingId ? 'Modifier l\'enseignement' : 'Publier un Enseignement'}
                </h1>
                {ensEditingId && (
                  <button
                    type="button"
                    onClick={handleCancelEnsEdit}
                    className="text-xs font-bold text-gray-500 hover:text-gray-800 bg-gray-100 px-3 py-1.5 rounded"
                  >
                    Annuler
                  </button>
                )}
              </div>

              <form onSubmit={handleEnseignementSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Titre de l'enseignement
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: La puissance de la foi"
                      value={ensTitle}
                      onChange={(e) => setEnsTitle(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Auteur / Orateur (Pasteur, Prédicateur...)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Pasteur Jean Koffi"
                      value={ensPreacher}
                      onChange={(e) => setEnsPreacher(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Image d'illustration (facultatif)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && setEnsImageFile(e.target.files[0])}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Texte de l'enseignement / Prédication
                  </label>
                  <textarea
                    placeholder="Contenu complet de l'enseignement..."
                    value={ensContent}
                    onChange={(e) => setEnsContent(e.target.value)}
                    required
                    rows={8}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-lg uppercase tracking-wider text-sm transition shadow-md disabled:bg-gray-400"
                >
                  {loading ? 'Enregistrement...' : ensEditingId ? 'Mettre à jour' : 'Publier l\'enseignement'}
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-3">
                Enseignements publiés ({enseignements.length})
              </h2>
              {enseignements.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun enseignement publié pour le moment.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {enseignements.map((item) => (
                    <div key={item.id} className="py-3 flex justify-between items-center gap-4">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                          Enseignement
                        </span>
                        <h3 className="font-bold text-sm text-gray-800 mt-1">{item.title}</h3>
                        <p className="text-xs text-gray-500">{item.sub_category}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditEns(item)}
                          className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded transition"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteEns(item.id)}
                          className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= ONGLET ARTICLES ================= */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-2xl font-black text-gray-900">
                  {editingId ? 'Modifier l\'article' : 'Publier un nouvel article'}
                </h1>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="text-xs font-bold text-gray-500 hover:text-gray-800 bg-gray-100 px-3 py-1.5 rounded"
                  >
                    Annuler la modification
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase text-gray-700">
                      Rubrique Principale
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none bg-white font-semibold text-gray-800"
                    >
                      <option value="">-- Sélectionnez une rubrique --</option>
                      <option value="Actualités">Actualités</option>
                      <option value="Églises">Églises</option>
                      <option value="Société & Culture">Société & Culture</option>
                      <option value="Monde">Monde</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase text-gray-700">
                      Genre de l'article (Sous-menu)
                    </label>
                    <select
                      value={subCategory}
                      onChange={(e) => {
                        setSubCategory(e.target.value);
                        if (e.target.value === 'À la Une') setIsUrgent(true);
                      }}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none bg-white font-semibold text-gray-800"
                    >
                      <option value="Toutes les actus">Toutes les actus</option>
                      <option value="À la Une">À la Une</option>
                      <option value="Flash Info">Flash Info</option>
                      <option value="Vidéos">Vidéos</option>
                    </select>
                  </div>
                </div>

                {subCategory === 'Vidéos' && (
                  <div className="space-y-1 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <label className="block text-xs font-bold uppercase text-blue-900">
                      Lien de la vidéo (YouTube, Vimeo, etc.)
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      required
                      className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 bg-red-50 p-3 rounded-lg border border-red-200">
                    <input
                      type="checkbox"
                      id="isUrgent"
                      checked={isUrgent}
                      onChange={(e) => {
                        setIsUrgent(e.target.checked);
                        if (e.target.checked) setSubCategory('À la Une');
                      }}
                      className="w-5 h-5 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                    />
                    <label htmlFor="isUrgent" className="text-sm font-bold text-red-900 cursor-pointer select-none">
                      Mettre À LA UNE (Accueil)
                    </label>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <input
                      type="checkbox"
                      id="isPortrait"
                      checked={isPortrait}
                      onChange={(e) => setIsPortrait(e.target.checked)}
                      className="w-5 h-5 text-slate-800 rounded focus:ring-slate-500 cursor-pointer"
                    />
                    <label htmlFor="isPortrait" className="text-sm font-bold text-slate-900 cursor-pointer select-none">
                      Mettre en PORTRAIT (Accueil)
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase text-gray-700">
                    Titre de l'article
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Présidence : le bilan..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase text-gray-700">
                    Chapeau (Résumé en gras)
                  </label>
                  <textarea
                    placeholder="Résumé ou accroche sous le titre..."
                    value={lead}
                    onChange={(e) => setLead(e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase text-gray-700">
                    Image de l'article
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase text-gray-700">
                    Contenu complet
                  </label>
                  <textarea
                    placeholder="Rédigez l'article..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={8}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-bold py-3.5 rounded-lg transition text-sm uppercase text-white bg-red-600 hover:bg-red-700"
                >
                  {loading ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Publier l\'article'}
                </button>
              </form>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-3">
                Articles publiés ({articles.length})
              </h2>

              <div className="divide-y divide-gray-100">
                {currentArticles.map((item) => (
                  <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded mr-2">
                        {item.category}
                      </span>
                      <h3 className="font-bold text-gray-800 text-sm inline-block">{item.title}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= ONGLET ANNONCES ================= */}
        {activeTab === 'annonces' && (
          <div className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
              <h1 className="text-2xl font-black text-gray-900 mb-6 border-b pb-4">
                {editingServiceId ? 'Modifier l\'annonce' : 'Publier une nouvelle annonce'}
              </h1>
              <form onSubmit={handleServiceSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nom du prestataire"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Domaine d'activité"
                    value={serviceActivity}
                    onChange={(e) => setServiceActivity(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Téléphone"
                  value={servicePhone}
                  onChange={(e) => setServicePhone(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <textarea
                  placeholder="Description"
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  required
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded-lg">
                  Publier l'annonce
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================= ONGLET ÉVÉNEMENTS ================= */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
              <h1 className="text-2xl font-black text-gray-900 mb-6 border-b pb-4">
                {editingEventId ? 'Modifier l\'événement' : 'Ajouter un événement'}
              </h1>
              <form onSubmit={handleEventSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Titre de l'événement"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Type d'événement"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Date & Heure"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Lieu"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded-lg">
                  Ajouter l'événement
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}