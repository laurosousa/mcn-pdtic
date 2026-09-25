import { Link } from 'wouter';
import { Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-2xl font-bold text-gray-400">404</span>
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Página não encontrada</h1>
          <p className="text-gray-600 text-sm">A avaliação ou página que você está procurando não existe ou foi movida.</p>
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <Link href="/" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-ufrr text-white font-semibold rounded-lg hover:bg-ufrr/90 transition-colors shadow-sm w-full" data-testid="link-home">
            <Home size={18} />
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}
