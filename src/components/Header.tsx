import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from '../assets/logo.svg'
import Menu from '../assets/menu.svg'
import Cross from '../assets/cros.svg'
import { CHAT_URL, MAIN_URL } from "../config";

const Header = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasShadow(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div className={`h-[55px] sticky top-0 z-10 flex items-center bg-gray-900/70 backdrop-blur-md transition-all duration-300 ${
        hasShadow 
          ? "shadow-lg shadow-black/20" 
          : ""
      }`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to={MAIN_URL} className="flex items-center cursor-pointer no-underline">
            <img src={Logo} alt="Logo" className="w-[30px]" />
            <span className="text-white ml-2 font-medium">WebSparks</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-6">
            <Link to={`${MAIN_URL}/about`} className="text-white/90 hover:text-white transition-colors cursor-pointer no-underline">About</Link>
            <Link to={`${MAIN_URL}/pricing`} className="text-white/90 hover:text-white transition-colors cursor-pointer no-underline">Pricing</Link>
            <Link to={`${MAIN_URL}/blogs`} className="text-white/90 hover:text-white transition-colors cursor-pointer no-underline">Blogs</Link>
            <Link to={`${MAIN_URL}/contact`} className="text-white/90 hover:text-white transition-colors cursor-pointer no-underline">Contact us</Link>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button 
              onClick={()=> window.open(CHAT_URL)} 
              className="px-5 py-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 rounded-full cursor-pointer transition-all duration-300"
            >
              Go Back to Chat
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="block sm:hidden">
            <img
              src={Menu}
              alt="Menu"
              className="cursor-pointer w-6 h-6"
              onClick={() => setIsDrawerOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsDrawerOpen(false)} 
          />
          <div className="absolute right-0 top-0 h-full w-[300px] bg-gray-900/95 backdrop-blur-md border-l border-white/10">
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <Link to={MAIN_URL} className="flex items-center">
                <img src={Logo} alt="Logo" className="w-[30px]" />
                <span className="ml-2 text-white font-medium">WebSparks</span>
              </Link>
              <img
                src={Cross}
                alt="Close"
                className="w-6 h-6 cursor-pointer text-white/70 hover:text-white transition-colors"
                onClick={() => setIsDrawerOpen(false)}
              />
            </div>
            <div className="flex flex-col p-4 space-y-4">
              <Link to={`${MAIN_URL}/about`} className="text-white/90 hover:text-white transition-colors cursor-pointer no-underline">About</Link>
              <Link to={`${MAIN_URL}/pricing`} className="text-white/90 hover:text-white transition-colors cursor-pointer no-underline">Pricing</Link>
              <Link to={`${MAIN_URL}/blogs`} className="text-white/90 hover:text-white transition-colors cursor-pointer no-underline">Blogs</Link>
              <Link to={`${MAIN_URL}/contact`} className="text-white/90 hover:text-white transition-colors cursor-pointer no-underline">Contact us</Link>
            </div>
            <div className="flex flex-col gap-3 p-4 border-t border-white/10">
              <button 
                onClick={()=> window.open(CHAT_URL)} 
                className="w-full px-5 py-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 rounded-full cursor-pointer transition-all duration-300"
              >
                Go Back to Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;