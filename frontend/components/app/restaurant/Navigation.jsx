"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronRight } from "@/components/icons/heroicons";
import { ScrollShadow } from "@heroui/scroll-shadow";

export default function Navigation({ categories, activeCategory, onCategoryChange }) {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef(null);
  
  const defaultCategories = ['All', ...categories];

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
  }, [categories]);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = direction === 'left' ? -250 : 250;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="relative flex items-center rounded-lg w-full bg-white shadow-sm">
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 h-full px-2 z-20 shadow-r flex items-center"
          aria-label="Left scroll"
        >
          <ChevronRight className="text-gray-700 rotate-180" />
        </button>
      )}

      <ScrollShadow
        ref={scrollContainerRef}
        hideScrollBar={true}
        orientation="horizontal"
        className="flex overflow-x-auto py-3 px-2 sticky top-0 z-10"
        onScroll={checkScrollPosition}
      >
        {defaultCategories.map(category => (
          <button 
            key={category} 
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-1.5 mx-1 whitespace-nowrap font-medium rounded-md transition-all ${activeCategory === category 
              ? 'bg-[#083d77] text-white' 
              : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {category}
          </button>
        ))}
      </ScrollShadow>

      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 h-full px-2 z-20 shadow-l flex items-center"
          aria-label="Right scroll"
        >
          <ChevronRight className="text-gray-700" />
        </button>
      )}
    </div>
  );
}
