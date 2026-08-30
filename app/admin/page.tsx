'use client';

export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LogOut, Megaphone, FileText, Calendar } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'articles' | 'annonces' | 'events'>('articles');

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
        .order('created_at', { ascending: false });

      if (!error && data) {
        setArticles(data);
      }
    } catch (err) {
      console.error('Erreur chargement articles:', err);
    }
  };

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setServices(data);
      }
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

      if (!error && data) {
        setEvents(data);
      }
    } catch (err) {
      console.error('Erreur chargement événements:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged');
    router.replace('/admin/login');
  };

  // --- LOGIQUE ARTICLES ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
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
        const { error: updateError } = await supabase
          .from('articles')
          .update(payload)
          .eq('id', editingId);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('articles')
          .insert([payload]);

        if (insertError) throw insertError;

        try {
          await fetch('/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: title,
              message: lead || 'Un nouvel article vient d’être publié sur Christ Actu !',
              url: 'https://christ-actu.vercel.app',
            }),
          });
        } catch (notifyErr) {
          console.error('Erreur lors de l’envoi de la notification Push:', notifyErr);
        }
      }

      handleCancelEdit();
      fetchArticles();
      setMessage(editingId ? 'Article mis à jour avec succès !' : 'Article publié et notification envoyée !');
    } catch (err: any) {
      console.error(err);
      setMessage(`Erreur : ${err.message || 'Une erreur est survenue'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cet article ?')) {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (!error) {
        if (editingId === id) handleCancelEdit();
        fetchArticles();
      }
    }
  };

  // --- LOGIQUE ANNONCES / SERVICES ---
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let imageUrl = currentServiceImageUrl;

      if (serviceImageFile) {
        const fileExt = serviceImageFile.name.split('.').pop();
        const fileName = `service_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('articles')
          .upload(fileName, serviceImageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('articles')
          .getPublicUrl(fileName);

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
      setMessage(editingServiceId ? 'Annonce mise à jour avec succès !' : 'Annonce publiée avec succès !');
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
    if (confirm('Voulez-vous vraiment supprimer cette annonce ?')) {
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
        const { error: uploadError } = await supabase.storage
          .from('articles')
          .upload(fileName, eventImageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('articles')
          .getPublicUrl(fileName);

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
      setMessage(editingEventId ? 'Événement mis à jour avec succès !' : 'Événement ajouté avec succès !');
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
    if (confirm('Voulez-vous vraiment supprimer cet événement ?')) {
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans text-gray-700">
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

        {/* ================= ONGLET ÉVÉNEMENTS ================= */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-2xl font-black text-gray-900">
                  {editingEventId ? 'Modifier l\'événement' : 'Ajouter un événement au programme'}
                </h1>
                {editingEventId && (
                  <button
                    type="button"
                    onClick={handleCancelEventEdit}
                    className="text-xs font-bold text-gray-500 hover:text-gray-800 bg-gray-100 px-3 py-1.5 rounded"
                  >
                    Annuler la modification
                  </button>
                )}
              </div>

              <form onSubmit={handleEventSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Titre de l'événement
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Grande Nuit d'Adoration"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Type d'événement
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Concert, Séminaire, Théâtre, Veillée..."
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Date & Heure
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Samedi 15 Novembre à 18h00"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Lieu / Emplacement
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Palais des Sports, Treichville"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Lien vers la billetterie ou plus d'infos (facultatif)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={eventLink}
                    onChange={(e) => setEventLink(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Affiche / Flyer (facultatif)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && setEventImageFile(e.target.files[0])}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs bg-gray-50"
                  />
                  {currentEventImageUrl && !eventImageFile && (
                    <p className="text-xs text-gray-500 mt-1">Image actuelle conservée.</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-lg uppercase tracking-wider text-sm transition shadow-md disabled:bg-gray-400"
                >
                  {loading ? 'Enregistrement...' : editingEventId ? 'Mettre à jour l\'événement' : 'Ajouter au programme'}
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-3">
                Événements programmés ({events.length})
              </h2>
              {events.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun événement à venir.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {events.map((evt) => (
                    <div key={evt.id} className="py-3 flex justify-between items-center gap-4">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase bg-red-100 text-red-700 px-2 py-0.5 rounded">
                          {evt.type}
                        </span>
                        <h3 className="font-bold text-sm text-gray-800 mt-1">{evt.title}</h3>
                        <p className="text-xs text-gray-500">📅 {evt.date_event} • 📍 {evt.location}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditEvent(evt)}
                          className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded transition"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(evt.id)}
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

        {/* ================= ONGLET ANNONCES ================= */}
        {activeTab === 'annonces' && (
          <div className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-2xl font-black text-gray-900">
                  {editingServiceId ? 'Modifier l\'annonce' : 'Publier une nouvelle annonce'}
                </h1>
                {editingServiceId && (
                  <button
                    type="button"
                    onClick={handleCancelServiceEdit}
                    className="text-xs font-bold text-gray-500 hover:text-gray-800 bg-gray-100 px-3 py-1.5 rounded"
                  >
                    Annuler la modification
                  </button>
                )}
              </div>

              <form onSubmit={handleServiceSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Nom / Nom du prestataire
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Frère Jean - Électricien"
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Domaine d'activité
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Plomberie, Menuiserie, Couture..."
                      value={serviceActivity}
                      onChange={(e) => setServiceActivity(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Téléphone (Appels)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: +225 0700000000"
                      value={servicePhone}
                      onChange={(e) => setServicePhone(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      WhatsApp (avec indicatif)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 2250700000000"
                      value={serviceWhatsapp}
                      onChange={(e) => setServiceWhatsapp(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Ville / Localisation
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Abidjan, Bouaké..."
                      value={serviceLocation}
                      onChange={(e) => setServiceLocation(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Description des services
                  </label>
                  <textarea
                    placeholder="Présentez les prestations proposées..."
                    value={serviceDesc}
                    onChange={(e) => setServiceDesc(e.target.value)}
                    required
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Photo / Logo (facultatif)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && setServiceImageFile(e.target.files[0])}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs bg-gray-50"
                  />
                  {currentServiceImageUrl && !serviceImageFile && (
                    <p className="text-xs text-gray-500 mt-1">Image actuelle conservée.</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-lg uppercase tracking-wider text-sm transition shadow-md disabled:bg-gray-400"
                >
                  {loading ? 'Publication...' : editingServiceId ? 'Mettre à jour l\'annonce' : 'Publier l\'annonce'}
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-3">
                Annonces actives ({services.length})
              </h2>
              {services.length === 0 ? (
                <p className="text-sm text-gray-500">Aucune annonce trouvée.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {services.map((s) => (
                    <div key={s.id} className="py-3 flex justify-between items-center gap-4">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase bg-red-100 text-red-700 px-2 py-0.5 rounded">
                          {s.activity}
                        </span>
                        <h3 className="font-bold text-sm text-gray-800 mt-1">{s.name}</h3>
                        <p className="text-xs text-gray-500">Tél: {s.phone} {s.location && `• ${s.location}`}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditService(s)}
                          className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded transition"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteService(s.id)}
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
                      <option value="Monde">Monde</option>
                      <option value="Églises">Églises</option>
                      <option value="Société & Culture">Société & Culture</option>
                      <option value="Enseignements">Enseignements</option>
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
                        if (e.target.value === 'À la Une') {
                          setIsUrgent(true);
                        }
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
                        if (e.target.checked) {
                          setSubCategory('À la Une');
                        }
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
                    className="w-full p-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-600 file:text-white file:font-bold hover:file:bg-red-700 cursor-pointer text-xs"
                  />
                  {currentImageUrl && !imageFile && (
                    <p className="text-xs text-gray-500 mt-1">Image actuelle conservée.</p>
                  )}
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
                  className={`w-full font-bold py-3.5 rounded-lg transition disabled:opacity-50 text-sm uppercase tracking-wider text-white ${
                    editingId ? 'bg-slate-900 hover:bg-slate-800' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {loading ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Publier et envoyer le Push'}
                </button>
              </form>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-3">
                Articles publiés ({articles.length})
              </h2>

              {articles.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun article trouvé.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {currentArticles.map((item) => (
                    <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          {item.sub_category && (
                            <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              {item.sub_category}
                            </span>
                          )}
                          {item.is_urgent && (
                            <span className="text-[10px] font-bold uppercase bg-red-600 text-white px-2 py-0.5 rounded">
                              À la Une
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-gray-800 text-sm inline-block">
                          {item.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded transition"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="px-3 py-1 bg-gray-100 rounded text-xs font-bold disabled:opacity-50"
                  >
                    Précédent
                  </button>
                  <span className="text-xs text-gray-500 font-semibold">
                    Page {currentPage} sur {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-3 py-1 bg-gray-100 rounded text-xs font-bold disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}