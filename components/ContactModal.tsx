// components/ContactModal.tsx
'use client';

import { useState } from 'react';
import { Mail, MessageCircle, X } from 'lucide-react';

export default function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);

  // Coordonnées de contact
  const whatsappNumber = "2250701300391"; 
  const emailAddress = "agence.williarts@gmail.com"; 

  return (
    <>
      {/* Bouton d'ouverture */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold py-2.5 px-4 rounded-lg transition duration-200 border border-slate-700 text-sm cursor-pointer"
      >
        <Mail className="w-4 h-4 text-red-400" />
        <span>Contactez-nous</span>
      </button>

      {/* Fenêtre Modale */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            {/* Bouton Fermer */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">
              Contactez-nous
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Une question ou une préoccupation ? Rejoignez-nous directement via l'un de nos canaux.
            </p>

            <div className="space-y-3">
              {/* Option WhatsApp */}
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-300 transition"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">WhatsApp</p>
                  <p className="text-xs text-emerald-400">Discussion directe et rapide</p>
                </div>
              </a>

              {/* Option Email */}
              <a
                href={`mailto:${emailAddress}`}
                className="flex items-center gap-4 p-3.5 rounded-xl border border-red-500/20 bg-red-950/30 hover:bg-red-900/40 text-red-300 transition"
              >
                <div className="w-10 h-10 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">E-mail</p>
                  <p className="text-xs text-red-400">{emailAddress}</p>
                </div>
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
}