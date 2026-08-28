'use client';

import { useState } from 'react';
import { X, Heart, CreditCard, Lock, Copy, Check, ExternalLink, User, Smartphone } from 'lucide-react';
import dynamic from 'next/dynamic';

const PaystackButton = dynamic(
  () => import('react-paystack').then((mod) => mod.PaystackButton),
  { ssr: false }
);

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'paystack' | 'paypal'>('paystack');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');

  const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_0b2ee32c0a6d500062d73de308dc698c2ca";

  if (!isOpen) return null;

  const phoneNumbers = {
    wave: '0545946345',
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(text);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        
        {/* EN-TÊTE */}
        <div className="bg-red-700 text-white p-6 relative flex flex-col items-center text-center">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-red-200 hover:text-white transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="bg-white/10 p-3 rounded-full mb-2">
            <Heart className="w-8 h-8 fill-white" />
          </div>
          <h3 className="text-xl font-bold">Soutenir Christ Actu</h3>
          
          <blockquote className="italic text-red-100 text-xs mt-2 px-4 border-t border-red-600/50 pt-2">
            « Que chacun donne comme il l'a résolu en son cœur... »
            <span className="block font-bold not-italic mt-0.5 text-white">— 2 Corinthiens 9:7</span>
          </blockquote>
        </div>

        <div className="p-6 space-y-5">
          
          {/* COORDONNÉES DONATEUR */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-red-600" /> Vos coordonnées
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Nom & Prénom"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="text-xs border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-1 focus:ring-red-600 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Adresse Email (requis pour Paystack)"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                className="text-xs border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-1 focus:ring-red-600 focus:outline-none"
              />
            </div>
          </div>

          {/* MONTANT LIBRE */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
              Montant de votre don (FCFA) *
            </label>
            <div className="relative">
              <input
                type="number"
                min="100"
                required
                placeholder="Entrez le montant de votre choix..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-base font-semibold border-2 border-red-100 rounded-xl p-3 pl-4 pr-16 focus:ring-2 focus:ring-red-600 focus:outline-none text-gray-900"
              />
              <span className="absolute right-4 top-3.5 text-gray-400 font-bold text-sm">FCFA</span>
            </div>
          </div>

          {/* SÉLECTION DU MOYEN DE PAIEMENT */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
              Moyen de paiement
            </label>
            
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('paystack')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 text-xs font-bold transition ${
                  paymentMethod === 'paystack' ? 'border-red-600 bg-red-50 text-red-900' : 'border-gray-100 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Smartphone className="w-4 h-4 text-red-600" />
                <span>Mobile / Carte</span>
                <span className="text-[9px] text-gray-400 font-normal">(Orange, MTN, Moov)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wave')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 text-xs font-bold transition ${
                  paymentMethod === 'wave' ? 'border-sky-400 bg-sky-50 text-sky-900' : 'border-gray-100 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-sky-400"></span>
                <span>Wave</span>
                <span className="text-[9px] text-gray-400 font-normal">(App directe)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 text-xs font-bold transition ${
                  paymentMethod === 'paypal' ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-gray-100 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className="font-extrabold text-indigo-700 italic">PayPal</span>
                <span className="text-[9px] text-gray-400 font-normal">(International)</span>
              </button>
            </div>

            {/* CAS 1 : PAYSTACK (ORANGE, MTN, MOOV & CARTE BANCAIRE) */}
            {paymentMethod === 'paystack' && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 text-center">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-700 mb-1">
                  <Lock className="w-3.5 h-3.5 text-green-600" /> Guichet automatique sécurisé
                </div>
                <p className="text-xs text-gray-600">
                  Validez votre don via <strong>Orange Money, MTN MoMo, Moov Money</strong> ou <strong>Carte bancaire</strong>.
                </p>
                
                {Number(amount) > 0 ? (
                  <PaystackButton
                    publicKey={paystackPublicKey}
                    email={donorEmail || 'donateur@christactu.com'}
                    amount={Number(amount) * 100}
                    currency="XOF"
                    reference={new Date().getTime().toString()}
                    text={`Payer ${Number(amount).toLocaleString()} FCFA via Paystack`}
                    onSuccess={(reference: any) => {
                      alert('Merci pour votre soutien ! Référence : ' + reference.reference);
                      onClose();
                    }}
                    onClose={() => console.log('Transaction annulée')}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => alert('Veuillez d\'abord saisir un montant valide.')}
                    className="w-full bg-gray-400 text-white font-bold py-3.5 rounded-xl text-xs transition shadow-md cursor-not-allowed"
                  >
                    Saisissez un montant ci-dessus
                  </button>
                )}
              </div>
            )}

            {/* CAS 2 : WAVE (REDIRECTION NATIVE APPLI) */}
            {paymentMethod === 'wave' && (
              <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 text-center space-y-3">
                <p className="text-xs text-sky-900 font-bold">
                  Cliquez ci-dessous pour ouvrir directement votre application Wave :
                </p>

                <a 
                  href={`https://pay.wave.com/m/M_ci_qAiPyK_VvoT8/c/ci/?src=p${amount ? `&amount=${amount}` : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#11b3e5] hover:bg-[#0ea5d4] text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs cursor-pointer"
                >
                  <span>📱 Ouvrir Wave et payer</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <div className="pt-2 border-t border-sky-200/60 flex items-center justify-between text-xs text-slate-600">
                  <span>Numéro direct : <strong>{phoneNumbers.wave}</strong></span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(phoneNumbers.wave)}
                    className="flex items-center gap-1 px-2 py-1 bg-white rounded border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
                  >
                    {copiedNumber === phoneNumbers.wave ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* CAS 3 : PAYPAL */}
            {paymentMethod === 'paypal' && (
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-center space-y-3">
                <p className="text-xs text-indigo-900">
                  Vous allez être redirigé vers <strong>PayPal</strong> pour valider votre don.
                </p>
                <a
                  href={`https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=christactu@gmail.com&currency_code=EUR${amount ? `&amount=${amount}` : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer text-xs"
                >
                  <span>Accéder à PayPal</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}