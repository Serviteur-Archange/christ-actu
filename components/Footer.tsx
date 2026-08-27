import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* COLONNE 1 : LOGO ET DESCRIPTION */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black tracking-wider text-white">CHRIST ACTU</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            L’essentiel de l’information chrétienne en Côte d’Ivoire et dans le monde.
          </p>
        </div>

        {/* COLONNE 2 : NAVIGATION (Rubriques aérées) */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Navigation</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li><Link href="/" className="hover:text-red-500 transition">Accueil</Link></li>
            <li><Link href="/category/actualites" className="hover:text-red-500 transition">Actualités</Link></li>
            <li><Link href="/category/eglises" className="hover:text-red-500 transition">Églises</Link></li>
            <li><Link href="/category/societe" className="hover:text-red-500 transition">Société & Culture</Link></li>
            <li><Link href="/contact" className="hover:text-red-500 transition">Contact</Link></li>
          </ul>
        </div>

        {/* COLONNE 3 : CONTACT */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Contact</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li>Bouaké - Côte d'Ivoire</li>
            <li>WhatsApp : <span className="text-white font-medium">+225 0545946345</span></li>
            <li>Service Communication : <span className="text-white font-medium">05946345</span></li>
          </ul>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-gray-900 py-6 text-center text-xs text-gray-500 space-y-2">
        <p>© 2026 CHRIST ACTU - Tous droits réservés</p>
        <Link href="/admin">Espace Admin</Link>
      </div>
    </footer>
  );
}