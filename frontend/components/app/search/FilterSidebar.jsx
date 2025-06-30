"use client";
import { Funnel } from '@/components/icons/heroicons';

export default function FilterSidebar() {
  return (
    <aside className="hidden lg:block w-56 shrink-0 pt-6 pr-6">
      <h2 className="font-semibold text-lg mb-4">587 locali</h2>

      <ul className="space-y-6 text-sm">
        {['Aperto ora', 'Nuovo', 'Consegna gratuita'].map((label) => (
          <li key={label} className="flex items-center justify-between">
            <span>{label}</span>
            <input type="checkbox" className="toggle toggle-sm" />
          </li>
        ))}

        <li>
          <details className="group">
            <summary className="flex items-center cursor-pointer">
              <Funnel className="h-4 w-4 mr-2" />
              Importo minimo
            </summary>

            <div className="pl-6 mt-2 space-y-2">
              {['Mostra tutti', 'Fino a 10 €', 'Fino a 15 €'].map((txt) => (
                <label key={txt} className="flex items-center space-x-2">
                  <input name="min" type="radio" className="radio radio-sm" />
                  <span>{txt}</span>
                </label>
              ))}
            </div>
          </details>
        </li>
      </ul>
    </aside>
  );
}
