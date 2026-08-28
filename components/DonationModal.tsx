'use client';

import { useState } from 'react';
import { X, Heart, CreditCard, Lock, Copy, Check, ExternalLink, User } from 'lucide-react';
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
  const [paymentMethod, setPaymentMethod] = useState<'om' | 'mtn' | 'moov' | 'wave' | 'card' | 'paypal'>('card');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');

  // Clé publique Paystack (prend la variable Vercel ou la clé de test par défaut)
  const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_0b2ee32c0a6d500062d73de308dc698c2ca";

  if (!isOpen) return null;

  const phoneNumbers: Record<string, { name: string; number: string }> = {
    om: { name: 'Orange Money', number: '0701300391' },
    mtn: { name: 'MTN MoMo', number: '0545946345' },
    moov: { name: 'Moov Money', number: '0171724536' },
    wave: { name: 'Wave', number: '0545946345' },
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(text);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const handleMobileRedirect = (provider: string) => {
    if (!amount || Number(amount) <= 0) {
      alert("Veuillez d'abord saisir un montant valide.");
      return;
    }

    if (provider === 'wave') {
      window.open(`https://wave.com/send?phone=+225${phoneNumbers.wave.number}&amount=${amount}`, '_blank');
    } else if (provider === 'paypal') {
      window.open(`https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=christactu@gmail.com&currency_code=EUR&amount=${amount}`, '_blank');
    } else {
      copyToClipboard(phoneNumbers[provider].number);
      alert(`Numéro ${phoneNumbers[provider].name} (${phoneNumbers[provider].number}) copié !`);
    }
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
          
          {/* IDENTITÉ DONATEUR */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-red-600" /> Vos coordonnées (Optionnel)
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
                placeholder="Adresse Email"
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

          {/* SELECTION MOYEN DE PAIEMENT */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
              Moyen de paiement
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 text-xs font-bold transition ${
                  paymentMethod === 'card' ? 'border-red-600 bg-red-50 text-red-900' : 'border-gray-100 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <CreditCard className="w-4 h-4 text-red-600" />
                Carte / Paystack
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('om')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 text-xs font-bold transition ${
                  paymentMethod === 'om' ? 'border-orange-500 bg-orange-50 text-orange-900' : 'border-gray-100 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                Orange Money
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('mtn')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 text-xs font-bold transition ${
                  paymentMethod === 'mtn' ? 'border-yellow-500 bg-yellow-50 text-yellow-900' : 'border-gray-100 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                MTN MoMo
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('moov')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 text-xs font-bold transition ${
                  paymentMethod === 'moov' ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-gray-100 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                Moov Money
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wave')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 text-xs font-bold transition ${
                  paymentMethod === 'wave' ? 'border-sky-400 bg-sky-50 text-sky-900' : 'border-gray-100 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-sky-400"></span>
                Wave
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 text-xs font-bold transition ${
                  paymentMethod === 'paypal' ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-gray-100 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className="font-extrabold text-indigo-700 italic">PayPal</span>
              </button>
            </div>

            {/* CAS 1 : PAYSTACK (CARTE & MOBILE MONEY INTEGRÉ) */}
            {paymentMethod === 'card' && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 text-center">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-700 mb-1">
                  <Lock className="w-3.5 h-3.5 text-green-600" /> Paiement sécurisé par Carte / Mobile
                </div>
                <p className="text-xs text-gray-600">
                  Réglez votre don de <strong>{amount ? `${Number(amount).toLocaleString()} FCFA` : 'votre choix'}</strong> par carte bancaire ou mobile money.
                </p>
                
                {Number(amount) > 0 ? (
                  <PaystackButton
                    publicKey={paystackPublicKey}
                    email={donorEmail || 'donateur@christactu.com'}
                    amount={Number(amount) * 100}
                    currency="XOF"
                    channels={['card', 'mobile_money']}
                    reference={new Date().getTime().toString()}
                    text={`Payer ${Number(amount).toLocaleString()} FCFA`}
                    onSuccess={(reference: any) => {
                      alert('Merci pour votre don ! Référence : ' + reference.reference);
                      onClose();
                    }}
                    onClose={() => console.log('Transaction annulée')}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => alert('Veuillez d\'abord saisir un montant valide.')}
                    className="w-full bg-gray-400 text-white font-bold py-3 rounded-xl text-xs transition shadow-md cursor-not-allowed"
                  >
                    Saisissez un montant
                  </button>
                )}
              </div>
            )}

            {/* CAS 2 : PAIEMENTS MANUELS DIRECTS */}
            {['om', 'mtn', 'moov', 'wave'].includes(paymentMethod) && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <p className="text-xs text-slate-600">
                  Effectuez votre transfert de <strong className="text-slate-900">{amount ? `${Number(amount).toLocaleString()} FCFA` : 'votre choix'}</strong> sur le numéro ci-dessous :
                </p>
                
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">
                      Numéro {phoneNumbers[paymentMethod].name}
                    </span>
                    <span className="text-base font-mono font-bold text-slate-900">
                      {phoneNumbers[paymentMethod].number}
                    </span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => copyToClipboard(phoneNumbers[paymentMethod].number)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-md transition cursor-pointer"
                  >
                    {copiedNumber === phoneNumbers[paymentMethod].number ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-600" /> Copié
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copier
                      </>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleMobileRedirect(paymentMethod)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Lancer le paiement {phoneNumbers[paymentMethod].name}</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* CAS 3 : PAYPAL */}
            {paymentMethod === 'paypal' && (
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-center space-y-3">
                <p className="text-xs text-indigo-900">
                  Vous allez être redirigé vers <strong>PayPal</strong> pour valider votre don.
                </p>
                <button
                  type="button"
                  onClick={() => handleMobileRedirect('paypal')}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Accéder à PayPal</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}