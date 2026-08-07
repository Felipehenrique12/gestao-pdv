import React, { useState } from 'react';
import { useCart } from '../../../contexts/CartContext';
import { useProducts } from '../../../hooks/useProducts';
import { useCustomers } from '../../../hooks/useCustomers';
import { useSales } from '../../../hooks/useSales';
import { PageHeader } from '../../layout/PageHeader';
import { SearchInput } from '../../ui/SearchInput';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Modal } from '../../ui/Modal';
import { Badge } from '../../ui/Badge';
import { formatCurrency } from '../../../utils/formatters';
import { Sale } from '../../../types';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Barcode,
  CreditCard,
  QrCode,
  Banknote,
  Printer,
  CheckCircle2,
  User,
  Package,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const PdvView: React.FC = () => {
  const { cart, addItem, removeItem, updateQuantity, updateDiscounts, clearCart, subtotal, totalDiscount, totalSurcharge, total } = useCart();
  const { products } = useProducts();
  const { customers } = useCustomers();
  const { createSale, isCreating } = useSales();

  const [productQuery, setProductQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [globalDiscountInput, setGlobalDiscountInput] = useState<number>(0);
  const [globalSurchargeInput, setGlobalSurchargeInput] = useState<number>(0);

  // Multi-payment split state
  const [pixAmount, setPixAmount] = useState<number>(0);
  const [moneyAmount, setMoneyAmount] = useState<number>(0);
  const [creditAmount, setCreditAmount] = useState<number>(0);
  const [debitAmount, setDebitAmount] = useState<number>(0);

  // Completed sale receipt modal state
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  const filteredProducts = products.filter((p) => {
    return (
      p.nome.toLowerCase().includes(productQuery.toLowerCase()) ||
      p.codigo.toLowerCase().includes(productQuery.toLowerCase()) ||
      p.codigoBarras.includes(productQuery)
    );
  });

  const handleBarcodeScan = () => {
    // Simulate camera/scanner finding a random product from store
    if (products.length > 0) {
      const randomProd = products[Math.floor(Math.random() * products.length)];
      addItem(randomProd);
      toast.success(`Código de Barras Bipado: ${randomProd.nome}`);
    }
  };

  const handleApplyGlobalDiscounts = () => {
    updateDiscounts(globalDiscountInput, globalSurchargeInput);
    toast.success('Desconto e acréscimo aplicados ao carrinho!');
  };

  const totalPaymentsAllocated = pixAmount + moneyAmount + creditAmount + debitAmount;
  const remainingToPay = Math.max(0, total - totalPaymentsAllocated);

  const handleQuickPayFull = (method: 'pix' | 'money' | 'credit' | 'debit') => {
    setPixAmount(method === 'pix' ? total : 0);
    setMoneyAmount(method === 'money' ? total : 0);
    setCreditAmount(method === 'credit' ? total : 0);
    setDebitAmount(method === 'debit' ? total : 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('O carrinho está vazio!');
      return;
    }

    if (totalPaymentsAllocated < total - 0.01) {
      toast.error(`Falta alocar R$ ${(total - totalPaymentsAllocated).toFixed(2)} nos meios de pagamento.`);
      return;
    }

    const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

    const salePayload = {
      clienteId: selectedCustomer?.id,
      clienteNome: selectedCustomer?.nomeRazao || 'Cliente Geral (Balcão)',
      itens: cart.map((item) => ({
        produtoId: item.produto.id,
        produtoNome: item.produto.nome,
        quantidade: item.quantidade,
        precoUnitario: item.produto.precoVenda,
        desconto: item.desconto,
        subtotal: item.subtotal,
      })),
      descontoTotal: totalDiscount,
      acrescimoTotal: totalSurcharge,
      pagamento: {
        pix: pixAmount,
        dinheiro: moneyAmount,
        cartaoCredito: creditAmount,
        cartaoDebito: debitAmount,
      },
      vendedor: 'Felipe Comercial',
    };

    const finishedSale = await createSale(salePayload);
    setCompletedSale(finishedSale);
    clearCart();
    setPixAmount(0);
    setMoneyAmount(0);
    setCreditAmount(0);
    setDebitAmount(0);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ponto de Venda (PDV) - Frente de Caixa"
        description="Faturamento ágil, bipagem por código de barras, múltiplos pagamentos e baixa automática de estoque."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Product Selection Catalog */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <SearchInput
                value={productQuery}
                onChange={(e) => setProductQuery(e.target.value)}
                onClear={() => setProductQuery('')}
                placeholder="Buscar por nome, SKU ou código de barras..."
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Barcode className="w-4 h-4 text-blue-600" />}
                onClick={handleBarcodeScan}
                title="Simular Leitor de Código de Barras"
              >
                Bipar Código
              </Button>
            </div>

            {/* Customer selector */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="">-- Cliente Geral (Consumidor Balcão) --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nomeRazao} ({c.cpfCnpj})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[520px] overflow-y-auto pr-1">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => addItem(prod)}
                className="group p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs cursor-pointer transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-full h-24 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                    {prod.imagens && prod.imagens.length > 0 ? (
                      <img src={prod.imagens[0].url} alt={prod.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Package className="w-6 h-6" />
                      </div>
                    )}
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[10px] font-bold bg-slate-900/80 text-white rounded">
                      Qtd: {prod.quantidade}
                    </span>
                  </div>
                  <p className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-2">{prod.nome}</p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 mt-2">
                  <span className="font-extrabold text-sm text-blue-600 dark:text-blue-400">
                    {formatCurrency(prod.precoVenda)}
                  </span>
                  <span className="p-1 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Cart & Multi-Payment Checkout */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col justify-between min-h-[580px]">
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm">Carrinho de Compras</h3>
              </div>
              <Badge variant="outline" className="text-white border-slate-700">
                {cart.length} itens
              </Badge>
            </div>

            {/* Cart Items List */}
            <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[280px]">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  O carrinho está vazio. Clique nos produtos ao lado para adicionar.
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.produto.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                        {item.produto.nome}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {formatCurrency(item.produto.precoVenda)} UN
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => updateQuantity(item.produto.id, item.quantidade - 1)}
                        className="p-0.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100 w-5 text-center">
                        {item.quantidade}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.produto.id, item.quantidade + 1)}
                        className="p-0.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="font-bold text-xs text-slate-900 dark:text-slate-100 shrink-0">
                      {formatCurrency(item.subtotal)}
                    </p>

                    <button
                      onClick={() => removeItem(item.produto.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Totals & Discounts Form */}
            <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  label="Desconto (R$)"
                  value={globalDiscountInput}
                  onChange={(e) => setGlobalDiscountInput(Number(e.target.value))}
                  className="text-xs"
                />
                <Input
                  type="number"
                  label="Acréscimo (R$)"
                  value={globalSurchargeInput}
                  onChange={(e) => setGlobalSurchargeInput(Number(e.target.value))}
                  className="text-xs"
                />
                <Button variant="secondary" size="sm" className="mt-5 text-xs shrink-0" onClick={handleApplyGlobalDiscounts}>
                  Aplicar
                </Button>
              </div>

              {/* Subtotals list */}
              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-between">
                  <span>Subtotal dos Produtos:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(subtotal)}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Desconto Concedido:</span>
                    <span>- {formatCurrency(totalDiscount)}</span>
                  </div>
                )}
                {totalSurcharge > 0 && (
                  <div className="flex justify-between text-amber-600 dark:text-amber-400">
                    <span>Acréscimo Adicionado:</span>
                    <span>+ {formatCurrency(totalSurcharge)}</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-base text-slate-900 dark:text-slate-100 pt-1">
                  <span>Total Final a Pagar:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Multi-Payment Methods Allocation */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Forma de Pagamento (Múltiplos):</span>
                  {remainingToPay > 0 ? (
                    <span className="text-rose-500 font-semibold">Falta: {formatCurrency(remainingToPay)}</span>
                  ) : (
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Totalmente Alocado
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <QrCode className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="font-medium shrink-0">PIX:</span>
                    <input
                      type="number"
                      value={pixAmount || ''}
                      onChange={(e) => setPixAmount(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full text-right outline-none font-mono font-semibold"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <Banknote className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="font-medium shrink-0">Dinheiro:</span>
                    <input
                      type="number"
                      value={moneyAmount || ''}
                      onChange={(e) => setMoneyAmount(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full text-right outline-none font-mono font-semibold"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <CreditCard className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    <span className="font-medium shrink-0">Crédito:</span>
                    <input
                      type="number"
                      value={creditAmount || ''}
                      onChange={(e) => setCreditAmount(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full text-right outline-none font-mono font-semibold"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <CreditCard className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-medium shrink-0">Débito:</span>
                    <input
                      type="number"
                      value={debitAmount || ''}
                      onChange={(e) => setDebitAmount(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full text-right outline-none font-mono font-semibold"
                    />
                  </div>
                </div>

                {/* Quick Pay Full Shortcut Buttons */}
                <div className="flex gap-1 pt-1">
                  <button
                    onClick={() => handleQuickPayFull('pix')}
                    className="flex-1 text-[10px] py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 rounded font-semibold border border-emerald-200 dark:border-emerald-800"
                  >
                    Tudo PIX
                  </button>
                  <button
                    onClick={() => handleQuickPayFull('money')}
                    className="flex-1 text-[10px] py-1 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 rounded font-semibold border border-blue-200 dark:border-blue-800"
                  >
                    Tudo Dinheiro
                  </button>
                  <button
                    onClick={() => handleQuickPayFull('credit')}
                    className="flex-1 text-[10px] py-1 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 rounded font-semibold border border-purple-200 dark:border-purple-800"
                  >
                    Tudo Crédito
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                variant="success"
                size="lg"
                className="w-full font-bold shadow-lg"
                onClick={handleCheckout}
                isLoading={isCreating}
                disabled={cart.length === 0}
              >
                Finalizar e Emitir Comprovante
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Receipt Thermal Modal */}
      {completedSale && (
        <Modal
          isOpen={!!completedSale}
          onClose={() => setCompletedSale(null)}
          title="Venda Concluída com Sucesso!"
          size="sm"
        >
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-xs space-y-3">
            <div className="text-center border-b border-dashed border-slate-300 dark:border-slate-700 pb-3">
              <h4 className="font-extrabold text-sm uppercase">NEXERP GESTÃO COMERCIAL</h4>
              <p className="text-[10px] text-slate-500">Comprovante de Venda Não Fiscal</p>
              <p className="font-bold mt-1 text-slate-800 dark:text-slate-200">
                Venda #{completedSale.codigoVenda}
              </p>
            </div>

            <div className="space-y-1">
              <p>Cliente: {completedSale.clienteNome}</p>
              <p>Data: {new Date(completedSale.dataHora).toLocaleString('pt-BR')}</p>
              <p>Vendedor: {completedSale.vendedor}</p>
            </div>

            <div className="border-t border-b border-dashed border-slate-300 dark:border-slate-700 py-2 space-y-1">
              <div className="flex justify-between font-bold">
                <span>ITEM</span>
                <span>SUBTOTAL</span>
              </div>
              {completedSale.itens.map((it, idx) => (
                <div key={idx} className="flex justify-between text-[11px]">
                  <span>{it.quantidade}x {it.produtoNome}</span>
                  <span>{formatCurrency(it.subtotal)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-right font-bold pt-1">
              <div className="flex justify-between text-sm">
                <span>VALOR TOTAL:</span>
                <span>{formatCurrency(completedSale.valorTotal)}</span>
              </div>
            </div>

            <div className="text-center pt-3 border-t border-dashed border-slate-300 dark:border-slate-700">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                leftIcon={<Printer className="w-4 h-4" />}
                onClick={() => window.print()}
              >
                Imprimir Comprovante
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
