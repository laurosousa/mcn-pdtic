import { useState } from 'react';
import { Switch, Route, Link as WouterLink, Router } from 'wouter';
import { EvaluationProvider } from '@/context/EvaluationContext';
import { Dashboard } from '@/pages/Dashboard';
import { DimensionPage } from '@/pages/DimensionPage';
import { ReportPage } from '@/pages/ReportPage';
import { GuidePage } from '@/pages/GuidePage';
import { AnalyzePage } from '@/pages/AnalyzePage';
import { UFRRPublicEvalPage } from '@/pages/UFRRPublicEvalPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { Dimension, DIMENSIONS, DIMENSION_COLOR } from '@/data/mcn';
import { useEvaluation } from '@/context/EvaluationContext';
import { REGISTRO } from '@/lib/registro';
import { LayoutDashboard, BarChart3, FileText, BookOpen, BookMarked, Menu, X, ExternalLink } from 'lucide-react';

type Page = 'dashboard' | Dimension | 'report' | 'guide' | 'analyze';

function NavBar({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const { totalEvaluated, totalRequirements } = useEvaluation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems: { id: Page; label: string; icon: React.ReactNode; color?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
    ...DIMENSIONS.map(d => ({
      id: d as Page,
      label: d,
      icon: <BarChart3 size={15} />,
      color: DIMENSION_COLOR[d],
    })),
    { id: 'analyze', label: 'PDTIC', icon: <BookMarked size={15} /> },
    { id: 'report', label: 'Relatório', icon: <FileText size={15} /> },
    { id: 'guide', label: 'Guia', icon: <BookOpen size={15} /> },
  ];

  const progress = Math.round((totalEvaluated / totalRequirements) * 100);

  return (
    <nav className="bg-ufrr text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-gold rounded-md p-1">
              <BarChart3 size={14} className="text-ufrr" />
            </div>
            <span className="font-bold text-sm hidden sm:block">MCN-PDTIC</span>
            
          </div>

          {/* Desktop nav */}
          <div className="hidden xl:flex items-center gap-0.5">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                  page === item.id
                    ? 'bg-white/20 text-white'
                    : item.id === 'analyze'
                    ? 'text-purple-200 hover:bg-white/10 hover:text-white border border-purple-400/40'
                    : 'text-green-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}

            <div className="w-px h-6 bg-white/20 mx-2" />

            <WouterLink
              href="/avaliacoes/ufrr-pdtic-2023-2025"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold text-blue-200 hover:bg-white/10 hover:text-white transition-all whitespace-nowrap border border-blue-400/40"
              data-testid="link-public-eval-desktop"
            >
              <ExternalLink size={14} />
              UFRR 2023-2025
            </WouterLink>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress pill */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="text-xs text-green-200">{progress}%</div>
              <div className="w-14 bg-white/20 rounded-full h-1.5">
                <div className="h-1.5 rounded-full bg-gold transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Mobile menu button */}
            <button className="xl:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="xl:hidden pb-3 border-t border-white/20 pt-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setPage(item.id); setMenuOpen(false); }}
                className={`flex items-center gap-2 w-full px-3 py-2 text-sm font-semibold rounded-md ${
                  page === item.id
                    ? 'bg-white/20 text-white'
                    : item.id === 'analyze'
                    ? 'text-purple-200 hover:bg-white/10'
                    : 'text-green-200 hover:bg-white/10'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}

            <div className="h-px bg-white/20 my-2 mx-3" />

            <WouterLink
              href="/avaliacoes/ufrr-pdtic-2023-2025"
              className="flex items-center gap-2 w-full px-3 py-2 text-sm font-semibold rounded-md text-blue-200 hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
              data-testid="link-public-eval-mobile"
            >
              <ExternalLink size={16} />
              Avaliação Pública UFRR
            </WouterLink>
          </div>
        )}
      </div>
    </nav>
  );
}

function AppContent() {
  const [page, setPage] = useState<Page>('dashboard');

  const renderPage = () => {
    if (page === 'dashboard') return <Dashboard />;
    if (page === 'report') return <ReportPage />;
    if (page === 'guide') return <GuidePage />;
    if (page === 'analyze') return <AnalyzePage />;
    if (DIMENSIONS.includes(page as Dimension)) return <DimensionPage dimension={page as Dimension} />;
    return <Dashboard />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar page={page} setPage={setPage} />
      <main>{renderPage()}</main>
      <footer className="border-t border-gray-200 bg-white mt-10" data-testid="footer-registro">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-gray-500">
          <span><strong className="text-gray-700">{REGISTRO.titulo}</strong></span>
          <span>Registro INPI nº {REGISTRO.processo} · {REGISTRO.direitos}</span>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <EvaluationProvider>
        <Switch>
          <Route path="/">
            <AppContent />
          </Route>
          <Route path="/avaliacoes/ufrr-pdtic-2023-2025">
            <UFRRPublicEvalPage />
          </Route>
          <Route>
            <NotFoundPage />
          </Route>
        </Switch>
      </EvaluationProvider>
    </Router>
  );
}

export default App;
