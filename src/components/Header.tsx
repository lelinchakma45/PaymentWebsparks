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
      <div className={`h-[55px] sticky top-0 z-10 flex items-center bg-[#121212] transition-shadow duration-300 ${
        hasShadow 
          ? "shadow-lg" 
          : "border-b border-[rgba(99,99,99,0.30)]"
      }`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to={MAIN_URL} className="flex items-center cursor-pointer no-underline">
            <img src={Logo} alt="Logo" className="w-[30px]" />
            <span className="text-white">WebSparks</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:block">
            <Link to={`${MAIN_URL}/about`} className="px-2 py-[10px] text-white cursor-pointer no-underline">About</Link>
            <Link to={`${MAIN_URL}/pricing`} className="px-2 py-[10px] text-white cursor-pointer no-underline">Pricing</Link>
            <Link to={`${MAIN_URL}/blogs`} className="px-2 py-[10px] text-white cursor-pointer no-underline">Blogs</Link>
            <Link to={`${MAIN_URL}/contact`} className="px-2 py-[10px] text-white cursor-pointer no-underline">Contact us</Link>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden sm:flex items-center gap-1">
            <button onClick={()=> window.open(CHAT_URL)} className="flex items-center px-5 py-[5px] text-black bg-white border border-white rounded-full cursor-pointer normal-case">
              Go Back to Chat
            </button>
            <button onClick={()=> window.open(MAIN_URL)} className="flex items-center px-5 py-[5px] text-[#b5b6ba] bg-gradient-to-r from-[#313135] to-[#1F2024] border border-[#49494a] rounded-full cursor-pointer normal-case">
              See to About
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="block sm:hidden">
            <img
              src={Menu}
              alt="Menu"
              className="cursor-pointer"
              onClick={() => setIsDrawerOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsDrawerOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[300px] bg-white">
            <div className="flex justify-between p-4">
              <Link to={MAIN_URL} className="flex items-center">
                <img src={Logo} alt="Logo" className="w-[30px]" />
                <span className="mx-1">WebSparks</span>
              </Link>
              <img
                src={Cross}
                alt="Close"
                className="w-6 h-6 bg-black cursor-pointer"
                onClick={() => setIsDrawerOpen(false)}
              />
            </div>
            <div className="flex flex-col p-4">
              <Link to={`${MAIN_URL}/about`} className="px-2 py-[10px] text-white cursor-pointer no-underline">About</Link>
              <Link to={`${MAIN_URL}/pricing`} className="px-2 py-[10px] text-white cursor-pointer no-underline">Pricing</Link>
              <Link to={`${MAIN_URL}/blogs`} className="px-2 py-[10px] text-white cursor-pointer no-underline">Blogs</Link>
              <Link to={`${MAIN_URL}/contact`} className="px-2 py-[10px] text-white cursor-pointer no-underline">Contact us</Link>
            </div>
            <div className="flex justify-center">
              <button onClick={()=> window.open(CHAT_URL)} className="flex items-center px-5 py-[5px] text-black bg-white border border-white rounded-full cursor-pointer normal-case">
                Go Back to Chat
              </button>
              <button onClick={()=> window.open(MAIN_URL)} className="flex items-center px-5 py-[5px] text-[#b5b6ba] bg-gradient-to-r from-[#313135] to-[#1F2024] border border-[#49494a] rounded-full cursor-pointer normal-case">
                See to About
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;