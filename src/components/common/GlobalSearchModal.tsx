import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { SearchInput } from '../ui/SearchInput';
import { searchService } from '../../services/searchService';
import { GlobalSearchResultItem } from '../../types';
import { useNavigate } from 'react-router-dom';
import { Package, User, Truck, ShoppingCart, DollarSign, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const data = await searchService.searchGlobal(query);
      setResults(data);
      setIsSearching(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectResult = (url: string) => {
    onClose();
    setQuery('');
    navigate(url);
  };

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'produto': return <Package className="w-4 h-4 text-blue-500" />;
      case 'cliente': return <User className="w-4 h-4 text-emerald-500" />;
      case 'fornecedor': return <Truck className="w-4 h-4 text-purple-500" />;
      case 'venda': return <ShoppingCart className="w-4 h-4 text-amber-500" />;
      case 'despesa': return <DollarSign className="w-4 h-4 text-rose-500" />;
      default: return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-4">
        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery('')}
          placeholder="Pesquisar por produto, cliente, fornecedor, venda ou despesa..."
          className="max-w-full text-base"
          autoFocus
        />

        <div className="min-h-[220px] max-h-[400px] overflow-y-auto">
          {isSearching ? (
            <div className="py-8 text-center text-xs text-slate-400">Buscando no sistema...</div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              {query.length >= 2 ? 'Nenhum resultado encontrado.' : 'Digite pelo menos 2 caracteres para pesquisar.'}
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {results.map((item) => (
                <div
                  key={`${item.tipo}-${item.id}`}
                  onClick={() => handleSelectResult(item.url)}
                  className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                      {getIcon(item.tipo)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                          {item.titulo}
                        </span>
                        {item.badge && <Badge size="sm">{item.badge}</Badge>}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.subtitulo}</p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
