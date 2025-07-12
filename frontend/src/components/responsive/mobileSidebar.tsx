import Link from 'next/link';
import { FC } from 'react';

interface NavLink {
  href: string;
  title: string;
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
}

const MobileSidebar: FC<MobileSidebarProps> = ({ isOpen, onClose, navLinks }) => {
  return (
    <>
      {/* Sidebar */}
      <div 
        className={`fixed top-0 ${isOpen ? 'left-0' : '-left-full'} w-64 h-full bg-white z-50 shadow-lg transition-all duration-300 ease-in-out`}
        aria-hidden={!isOpen}
      >
        <div className="p-4 flex justify-end">
          <button 
            onClick={onClose}
            className="text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        <nav className="flex flex-col space-y-6 p-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-primary font-semibold text-[18px] hover:text-primary-dark transition-colors"
              onClick={onClose}
            >
              {link.title}
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
          role="button"
          tabIndex={0}
          aria-label="Close menu"
          onKeyDown={(e) => e.key === 'Enter' && onClose()}
        />
      )}
    </>
  );
};

export default MobileSidebar;