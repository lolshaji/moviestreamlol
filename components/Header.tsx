
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../auth';
import MenuIcon from './icons/MenuIcon';
import SearchIcon from './icons/SearchIcon';
import UserIcon from './icons/UserIcon';
import CloseIcon from './icons/CloseIcon';

interface HeaderProps {
  page: string;
  setPage: (page: string) => void;
  onSearchClick: () => void;
}

const NavLink: React.FC<{ page: string; setPage: (page: string) => void; activePage: string; children: React.ReactNode }> = ({ page, setPage, activePage, children }) => (
  <button onClick={() => setPage(page)} className={`transition ${activePage === page ? 'text-white font-semibold' : 'text-gray-400 hover:text-gray-200'}`}>
    {children}
  </button>
);

const Header: React.FC<HeaderProps> = ({ page, setPage, onSearchClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileRef]);

  const navLinks = (
    <>
      <NavLink page="home" setPage={setPage} activePage={page}>Home</NavLink>
      <NavLink page="movies" setPage={setPage} activePage={page}>Movies</NavLink>
      <NavLink page="tvshows" setPage={setPage} activePage={page}>TV Shows</NavLink>
      <NavLink page="downloads" setPage={setPage} activePage={page}>Downloads</NavLink>
      <NavLink page="request" setPage={setPage} activePage={page}>Request Movie</NavLink>
      <NavLink page="rateus" setPage={setPage} activePage={page}>Rate Us</NavLink>
      {user?.email === 'ayahakuttyv@gmail.com' && (
        <NavLink page="admin" setPage={setPage} activePage={page}>Admin</NavLink>
      )}
    </>
  );

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isMenuOpen ? 'bg-black/50 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className='flex items-center space-x-6'>
              <button onClick={() => setPage('home')} className="text-2xl md:text-3xl font-bold text-brand-red tracking-wider uppercase">
                ThelDen
              </button>
              <nav className="hidden md:flex items-center space-x-4">
                {navLinks}
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <button onClick={onSearchClick} className="text-white hover:text-gray-300">
                <SearchIcon className="w-6 h-6" />
              </button>
              <div className="relative" ref={profileRef}>
                <button onClick={() => setIsProfileOpen(prev => !prev)} className="w-8 h-8 rounded-full overflow-hidden bg-gray-600">
                  {user?.profilePic ? <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" /> : <UserIcon />}
                </button>
                {isProfileOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-brand-dark rounded-md shadow-lg py-1 animate-fade-in-down">
                    <button onClick={() => { setPage('profile'); setIsProfileOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">Profile</button>
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">Sign Out</button>
                  </div>
                )}
              </div>
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
                  <MenuIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-brand-black z-40 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
        <div className="pt-24 px-6">
          <nav className="flex flex-col space-y-6">
            {React.Children.map(navLinks.props.children, child => 
               React.isValidElement(child) ? React.cloneElement(child, { setPage: (page: string) => { setPage(page); setIsMenuOpen(false); } }) : child
            )}
          </nav>
        </div>
      </div>
       <style>{`
        .animate-fade-in-down { animation: fadeInDown 0.2s ease-out; }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
};

export default Header;
