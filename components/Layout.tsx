
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, Download, Users, Mail, Book, UserCog } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: '이팝나무의 서재', icon: <BookOpen size={18} /> },
    // { path: '/books', label: '출간 도서', icon: <Book size={18} /> }, // Integrated into Home
    { path: '/discussion', label: '독자 토론장', icon: <Users size={18} /> },
    { path: '/resources', label: '자료실', icon: <Download size={18} /> },
    { path: '/contact', label: '문의하기', icon: <Mail size={18} /> },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-primary">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 font-serif font-bold text-xl md:text-2xl text-primary tracking-tight">
              <span>연구그룹 이팝나무</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 ${
                    isActive(link.path) ? 'text-secondary' : 'text-gray-500 hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-primary focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-gray-50 text-secondary'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-serif font-bold text-xl text-white mb-4">연구그룹 이팝나무</h3>
              <p className="text-sm leading-relaxed opacity-80">
                미래를 읽는 통찰, 따뜻한 경제학.<br />
                이팝나무의 공식 홈페이지입니다.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Site Map</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link to="/about" className="hover:text-secondary">연구그룹 이팝나무 소개</Link></li>
                <li><Link to="/resources" className="hover:text-secondary">자료실</Link></li>
                <li><Link to="/contact" className="hover:text-secondary">강연 요청</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">B</a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">T</a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">I</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs opacity-60">
              © 2024 Research Group Ipannamoo. All rights reserved.
            </p>
            <Link to="/admin" className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-secondary text-gray-200 text-xs transition-all flex items-center gap-2 border border-white/10">
              <UserCog size={14} /> 관리자 페이지
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
