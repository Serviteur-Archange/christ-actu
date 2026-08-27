'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, MessageCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const whatsappNumber = '2250000000000';
  const whatsappMessage = encodeURIComponent(
    'Bonjour, j\'ai oublié mon mot de passe pour accéder à l\'espace administration de Christ Actu.'
  );

  const handleLogin = () => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Accepte Respo Willy OU Willy Tokpa avec le code 7172
    const isValidUser = cleanUser === 'willy tokpa' || cleanUser === 'respo willy';

    if (isValidUser && cleanPass === '7172') {
      localStorage.setItem('admin_logged', 'true');
      router.push('/admin');
    } else {
      setErrorMsg('Nom d\'utilisateur ou mot de passe incorrect.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans text-gray-900">
      {/* Conteneur div simple sans balise form */}
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full space-y-4">
        <h1 className="text-2xl font-black text-center text-gray-900">Connexion Admin</h1>
        
        {errorMsg && (
          <div className="p-3 bg-red-100 border border-red-200 text-red-800 text-xs font-bold rounded-lg text-center">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase mb-1 text-gray-700">
            Nom d'utilisateur
          </label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none text-sm font-semibold" 
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase mb-1 text-gray-700">
            Mot de passe
          </label>
          <div className="relative">
            <input 
              type={showPassword ? 'text' : 'password'} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none text-sm font-semibold" 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 hover:text-green-700 hover:underline transition"
          >
            <MessageCircle className="w-4 h-4" /> Mot de passe oublié ?
          </a>
        </div>

        <button 
          type="button" 
          onClick={handleLogin}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-lg uppercase text-sm transition"
        >
          Se connecter
        </button>
      </div>
    </div>
  );
}