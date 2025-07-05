"use client";
import { useState, useRef, useEffect } from "react";
import { courses } from "@/utils/lists";
import { ChevronRight, CheckMark } from "@/components/icons/heroicons";
import { ScrollShadow } from "@heroui/scroll-shadow";

export default function CategoryNav({ onCategoriesChange, selectedCategories }) {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef(null);

  const toggleCategory = (categoryName) => {
    if (onCategoriesChange) {
      onCategoriesChange(categoryName);
    }
  };

  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollPosition();
      window.addEventListener('resize', checkScrollPosition);
      container.addEventListener('scroll', checkScrollPosition);
    }
    
    return () => {
      if (container) {
        window.removeEventListener('resize', checkScrollPosition);
        container.removeEventListener('scroll', checkScrollPosition);
      }
    };
  }, []);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = direction === 'left' ? -250 : 250;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="relative flex items-center justify-center w-full shadow-lg shadow-black/[20%]">
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full shadow-md p-2 z-20"
          aria-label="Left scroll"
        >
          <ChevronRight className="text-gray-700 rotate-180" />
        </button>
      )}

      <ScrollShadow
        ref={scrollContainerRef}
        hideScrollBar={true}
        orientation="horizontal"
        className="flex py-4"
        onScroll={checkScrollPosition}
      >
        {courses.map(({ name, icon }) => {
          const isSelected = selectedCategories.includes(name);
          return (
            <button
              key={name}
              onClick={() => toggleCategory(name)}
              className="flex flex-col items-center w-24 shrink-0 focus:outline-none"
            >
              <div className={`relative p-1 h-12 w-12 sm:h-16 sm:w-16 rounded-full mb-1 ${isSelected ? 'bg-green-100' : 'bg-gray-100'}`}>
                <img src={icon} alt={name} className="rounded-full object-cover h-full w-full" />
                {isSelected && (
                  <div className="absolute bottom-0 right-0 bg-[#083d77] rounded-full p-1">
                    <CheckMark size={16} className="text-white text-xs" />
                  </div>
                )}
              </div>
              <span className={`text-xs text-center ${isSelected ? 'text-[#083d77] font-medium' : ''}`}>
                {name}
              </span>
            </button>
          );
        })}
      </ScrollShadow>

      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full shadow-md p-2 z-20"
          aria-label="Right scroll"
        >
          <ChevronRight className="text-gray-700" />
        </button>
      )}
    </div>
  );
}