'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Phone, MessageCircle, MapPin, X } from 'lucide-react';

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
}

export default function AnnoncesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) setServices(data);
      setLoading(false);
    };

    fetchServices();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="border-l-4 border-red-600 pl-4 mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900">
          Services & Annonces
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Espace dédié aux frères et sœurs de la communauté pour présenter leurs prestations et services professionnels.
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500 font-medium">Chargement des offres de services...</p>
      ) : services.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center border text-gray-600">
          Aucun service enregistré pour le moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedService(item)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition cursor-pointer"
            >
              <div>
                {item.image_url && (
                  <img src={item.image_url} alt={item.name} className="w-full h-48 object-cover" />
                )}
                <div className="p-5">
                  <span className="text-[10px] font-extrabold uppercase bg-red-100 text-red-700 px-2 py-1 rounded">
                    {item.activity}
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 mt-2">{item.name}</h2>
                  {item.location && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" /> {item.location}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mt-3 line-clamp-3">{item.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0 space-y-2">
                <div className="border-t pt-3 flex flex-wrap gap-2 text-xs font-semibold">
                  <a 
                    href={`tel:${item.phone}`} 
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gray-900 text-white py-2 px-3 rounded-lg hover:bg-gray-800 transition"
                  >
                    <Phone className="w-3.5 h-3.5" /> Appeler
                  </a>
                  {item.whatsapp && (
                    <a 
                      href={`https://wa.me/${item.whatsapp}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALE DÉTAILS DE L'ANNONCE */}
      {selectedService && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedService(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            {selectedService.image_url && (
              <img 
                src={selectedService.image_url} 
                alt={selectedService.name} 
                className="w-full h-64 object-cover rounded-xl mb-5" 
              />
            )}

            <span className="text-xs font-extrabold uppercase bg-red-100 text-red-700 px-2.5 py-1 rounded">
              {selectedService.activity}
            </span>

            <h2 className="text-2xl font-black text-gray-900 mt-3">{selectedService.name}</h2>
            
            {selectedService.location && (
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4 text-red-600" /> {selectedService.location}
              </p>
            )}

            <div className="border-t border-b border-gray-100 py-4 my-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description complète</h3>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {selectedService.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a 
                href={`tel:${selectedService.phone}`} 
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-900 text-white py-3 px-4 rounded-xl font-bold hover:bg-gray-800 transition text-sm"
              >
                <Phone className="w-4 h-4" /> Appeler ({selectedService.phone})
              </a>
              {selectedService.whatsapp && (
                <a 
                  href={`https://wa.me/${selectedService.whatsapp}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-green-700 transition text-sm"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}