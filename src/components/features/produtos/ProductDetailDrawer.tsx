import React from 'react';
import { Product } from '../../../types';
import { Drawer } from '../../ui/Drawer';
import { Badge } from '../../ui/Badge';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { Package, Barcode, MapPin, Truck, AlertTriangle, Layers } from 'lucide-react';

interface ProductDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const ProductDetailDrawer: React.FC<ProductDetailDrawerProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  if (!product) return null;

  const isLowStock = product.quantidade <= product.quantidadeMinima;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={product.nome}
      subtitle={`SKU: ${product.codigo} | Categoria: ${product.categoria}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Images Gallery */}
        {product.imagens && product.imagens.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Imagens do Produto</p>
            <div className="grid grid-cols-2 gap-2">
              {product.imagens.map((img) => (
                <div key={img.id} className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                  <img src={img.url} alt={img.name} className="w-full h-36 object-cover" />
                  {img.isMain && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-md">
                      Principal
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status & Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div>
            <p className="text-[11px] text-slate-500 uppercase font-medium">Preço de Venda</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(product.precoVenda)}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 uppercase font-medium">Preço de Custo</p>
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
              {formatCurrency(product.precoCusto)}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 uppercase font-medium">Margem de Lucro</p>
            <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
              {product.margemLucro}%
            </p>
          </div>
        </div>

        {/* Stock Level Alert Card */}
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          isLowStock
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
        }`}>
          <div className="flex items-center gap-3">
            {isLowStock ? <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" /> : <Package className="w-6 h-6 text-emerald-600 shrink-0" />}
            <div>
              <p className="font-bold text-sm">
                Estoque Atual: {product.quantidade} {product.unidade}
              </p>
              <p className="text-xs opacity-90">
                Mínimo exigido: {product.quantidadeMinima} {product.unidade} | Ponto de compra: {product.pontoReabastecimento} {product.unidade}
              </p>
            </div>
          </div>
          <Badge variant={isLowStock ? 'danger' : 'success'}>
            {isLowStock ? 'Estoque Crítico' : 'Estoque Regular'}
          </Badge>
        </div>

        {/* Detailed Information list */}
        <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500 flex items-center gap-2"><Barcode className="w-4 h-4" /> Código de Barras:</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{product.codigoBarras || '-'}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500 flex items-center gap-2"><Layers className="w-4 h-4" /> Marca / Fabricante:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{product.marca}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500 flex items-center gap-2"><Truck className="w-4 h-4" /> Fornecedor Homologado:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{product.fornecedorNome || '-'}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500 flex items-center gap-2"><MapPin className="w-4 h-4" /> Localização no Depósito:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{product.localizacao || 'Não especificada'}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500">Data de Cadastro:</span>
            <span className="text-slate-800 dark:text-slate-200">{formatDate(product.createdAt)}</span>
          </div>
        </div>

        {product.descricao && (
          <div className="space-y-1 pt-2">
            <p className="text-xs font-semibold text-slate-500 uppercase">Descrição Geral</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800">
              {product.descricao}
            </p>
          </div>
        )}
      </div>
    </Drawer>
  );
};
