import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, Download, Users, Mail, UserCog, Facebook } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Scroll to top whenever the route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { path: '/library', label: '이팝나무의 서재', icon: <BookOpen size={18} /> },
    { path: '/discussion', label: '토론방', icon: <Users size={18} /> },
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
      <footer className="bg-primary text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-white/10 pb-12">
            
            {/* Logo Section (Span 2 cols on tablet/desktop for better spacing) */}
            <div className="md:col-span-2 flex flex-col items-start justify-center">
              <img 
                src="https://i.imgur.com/qNKF9V9.png" 
                alt="연구그룹 이팝나무" 
                className="h-16 w-auto mb-4 opacity-90 hover:opacity-100 transition-opacity" 
              />
              <p className="text-sm opacity-60 font-light max-w-sm">
                기술의 진보와 인간 삶의 조화로운 공존을 연구합니다.<br/>
                모두를 위한 따뜻한 기술과 경제를 꿈꿉니다.
              </p>
            </div>

            {/* Site Map */}
            <div>
              <h4 className="font-bold text-white mb-6 border-b border-white/10 pb-2 inline-block">Site Map</h4>
              <ul className="space-y-3 text-sm opacity-80">
                <li><Link to="/about" className="hover:text-secondary transition-colors">연구그룹 이팝나무 소개</Link></li>
                <li><Link to="/library" className="hover:text-secondary transition-colors">이팝나무의 서재</Link></li>
                <li><Link to="/resources" className="hover:text-secondary transition-colors">자료실</Link></li>
                <li><Link to="/contact" className="hover:text-secondary transition-colors">강연요청 · 문의</Link></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="font-bold text-white mb-6 border-b border-white/10 pb-2 inline-block">Connect</h4>
              <div className="flex space-x-4">
                <a 
                  href="https://www.facebook.com/epabnamu.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all duration-300 group"
                  aria-label="Facebook"
                >
                  <Facebook size={20} className="group-hover:scale-110 transition-transform"/>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-60 font-light">
            <p>
              © 2025 Research Group Epabnamu. All rights reserved.
            </p>
            <Link to="/admin" className="flex items-center gap-1 hover:text-secondary transition-colors">
              <UserCog size={12} /> 관리자 페이지
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;