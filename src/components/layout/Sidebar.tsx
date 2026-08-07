import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useTheme } from '../../contexts/ThemeContext';
import {
  LayoutDashboard,
  Package,
  ArrowUpDown,
  Users,
  Truck,
  ShoppingCart,
  DollarSign,
  Bot,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Building2,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Produtos', path: '/produtos', icon: Package },
    { label: 'Estoque', path: '/estoque', icon: ArrowUpDown },
    { label: 'Clientes', path: '/clientes', icon: Users },
    { label: 'Fornecedores', path: '/fornecedores', icon: Truck },
    { label: 'Vendas (PDV)', path: '/vendas', icon: ShoppingCart },
    { label: 'Financeiro', path: '/financeiro', icon: DollarSign },
    { label: 'Assistente AI', path: '/assistente', icon: Bot, badge: 'IA' },
  ];

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-40 h-screen bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between select-none shadow-xl',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="leading-tight truncate">
                <h1 className="font-bold text-sm text-white tracking-wide">NexERP</h1>
                <p className="text-[10px] text-slate-400 font-medium truncate">Gestão Comercial & Estoque</p>
              </div>
            )}
          </div>

          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title={collapsed ? 'Expandir Menu' : 'Recolher Menu'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all relative group',
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  )
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}

                {/* Badge if present */}
                {item.badge && !collapsed && (
                  <span className="ml-auto px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-xs">
                    {item.badge}
                  </span>
                )}

                {/* Tooltip on Collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50">
                    {item.label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer',
            collapsed && 'justify-center'
          )}
          title="Alternar Tema Claro / Escuro"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <Moon className="w-4 h-4 text-slate-300 shrink-0" />
          )}
          {!collapsed && <span>{theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}</span>}
        </button>

        {/* User profile info */}
        <div className={cn('flex items-center gap-3 p-2 rounded-xl bg-slate-800/40', collapsed && 'justify-center')}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
            FC
          </div>
          {!collapsed && (
            <div className="leading-tight truncate text-left">
              <p className="text-xs font-semibold text-slate-200 truncate">Felipe Comercial</p>
              <p className="text-[10px] text-slate-500 truncate">Administrador</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
