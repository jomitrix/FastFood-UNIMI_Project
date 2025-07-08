"use client";
import { usePathname } from "next/navigation";
import { useManager } from "@/contexts/ManagerContext";
import { useEffect } from "react";
import { Link } from "@heroui/link";
import { Profile, Orders, Meals, Dashboard } from "@/components/icons/heroicons";


export default function HamburgerMenu({ children }) {
  const pathname = usePathname();
  const { isManHambMenuOpen, setIsManHambMenuOpen, handleToggleManager } = useManager();
  const menuItems = [
    { name: "Dashboard", small: "Dashboard", icon: Dashboard, href: "/manager/dashboard" },
    { name: "Manage Orders", small: "Orders", icon: Orders, href: "/manager/orders" },
    { name: "Account Info", small: "Account", icon: Profile, href: "/manager/account" },
    { name: "Manage Menu", small: "Menu", icon: Meals, href: "/manager/menu" },
  ];

  // Chiude l'hamburger menu in base al viewport
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1023 && isManHambMenuOpen) {
        setIsManHambMenuOpen(false);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isManHambMenuOpen, setIsManHambMenuOpen]);

  return (
    <div className="flex h-full min-h-screen">
      {/* Sidebar Menu */}
      <div className={`hidden sm:block fixed left-0 top-16 bottom-0 z-10 transition-all duration-300 ease-in-out shadow-lg bg-gradient-to-b from-[#ff8844] to-[#ff7733] ${
        isManHambMenuOpen ? 'w-64' : 'w-20'
      }`}>
        <div className={`${isManHambMenuOpen ? 'p-6' : 'p-2 pt-6'} h-full overflow-y-auto`}>
          {/* Menu Header */}
          <div className={`${isManHambMenuOpen ? 'mb-8' : 'mb-5 text-center'}`}>
            <h2 className={`text-black font-bold ${isManHambMenuOpen ? 'text-xl mb-1' : 'text-sm mb-0'}`}>
              {isManHambMenuOpen ? 'Manager Panel' : 'Panel'}
            </h2>
            <div className={`h-1 bg-white/30 rounded-full ${isManHambMenuOpen ? 'w-12' : 'w-8 mx-auto mt-1'}`}></div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex ${isManHambMenuOpen ? 'items-center gap-3 p-3' : 'flex-col items-center p-2'} 
                  text-black/90 hover:text-black text-base font-medium hover:bg-black/5 rounded-lg transition-all duration-200 ease-in-out
                  ${pathname.startsWith(item.href) ? 'bg-black/10 hover:bg-black/15' : ''}`}
                >
                  <IconComponent 
                    size={isManHambMenuOpen ? 20 : 24} 
                    className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200" 
                  />
                  <span className={`${isManHambMenuOpen ? 'truncate' : 'text-xs mt-1 text-center'}`}>
                    {isManHambMenuOpen ? item.name : item.small}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <main 
        className={`flex-1 overflow-x-hidden ${isManHambMenuOpen ? 'sm:ml-64' : 'sm:ml-20'} pb-[4rem] sm:pb-0 transition-all duration-300 ease-in-out`}
      >
        <div className="max-w-full">
          {children}
        </div>
      </main>
      
      {/* Menu Mobile */}
      <nav
        className="
          flex sm:hidden
          fixed bottom-0 left-0 right-0 z-20
          bg-gradient-to-r from-[#ff8844] to-[#ff7733]
          shadow-lg
          justify-around items-center
          h-16
        "
      >
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col w-[${parseInt(100 / menuItems.length)}%] items-center justify-center text-black/90 hover:text-black px-2 py-1 transition-all duration-200`}
            >
              <IconComponent
                size={24}
                className="mb-0.5 group-hover:scale-110 transition-transform duration-200"
              />
              <span className="text-xs">{item.small}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}