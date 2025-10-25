
import React from 'react';
import { LogoIcon } from './icons';

const Header: React.FC = () => {
  const navItems = ['IA', 'Cómo gestionar cripto', 'Compra y Venta', 'USDT en Venezuela'];

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-700/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <LogoIcon className="h-8 w-8 text-[#f3ba2f]" />
            <span className="text-xl font-bold tracking-tight">CriptoGuía<span className="text-[#f3ba2f]">VE</span></span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-300">
            {navItems.map(item => (
              <a key={item} href="#" className="hover:text-[#f3ba2f] transition-colors duration-200">{item}</a>
            ))}
          </nav>

          <div className="flex items-center">
            <button className="bg-[#f3ba2f] text-gray-900 hover:bg-yellow-400 transition-colors duration-200 font-bold py-2 px-4 rounded-md text-sm">
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
