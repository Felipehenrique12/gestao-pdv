import React, { useState } from 'react';
import { Search, Bell, ShoppingCart, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  collapsed: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ collapsed }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header
        className={`fixed top-0 right-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-all duration-300 flex items-center justify-between px-6 ${
          collapsed ? 'left-20' : 'left-64'
        }`}
      >
        {/* Search trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-medium transition-all w-64 md:w-80 cursor-pointer border border-transparent hover:border-slate-300 dark:hover:border-slate-700"
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">Pesquisar produtos, clientes, vendas...</span>
            <kbd className="ml-auto hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-slate-400">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/vendas')}
            leftIcon={<ShoppingCart className="w-4 h-4" />}
          >
            Abrir PDV
          </Button>

          {/* Notifications button */}
          <button
            className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Notificações do Sistema"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          </button>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
