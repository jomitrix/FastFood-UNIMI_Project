import { ChevronRight } from '@/components/icons/heroicons';
import { useRef } from 'react';

export default function HorizontalScroller({ title, children }) {
  const ref = useRef(null);
  const scroll = (dir) => {
    if (ref.current) ref.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="space-x-2 hidden sm:block">
          <button onClick={() => scroll(-1)}>
            <ChevronRight className="h-5 w-5 rotate-[180deg]" />
          </button>
          <button onClick={() => scroll(1)}>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div ref={ref} className="flex space-x-4 overflow-x-auto scrollbar-hide py-4">
        {children}
      </div>
    </section>
  );
}
