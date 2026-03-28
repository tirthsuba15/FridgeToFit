import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGroceryStore from '../stores/groceryStore';
import useMealPlanStore from '../stores/mealPlanStore';
import { fetchGroceryList } from '../api/endpoints';

export default function Grocery() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const groceryStore = useGroceryStore();
  const planId = useMealPlanStore(state => state.mealPlanId);

  useEffect(() => {
    if (!planId) {
      setError('No meal plan found. Generate a plan first.');
      setLoading(false);
      return;
    }
    fetchGroceryList(planId)
      .then(data => {
        groceryStore.setItems(data.grouped || {});
        groceryStore.setPlanId(planId);
      })
      .catch(() => setError('Failed to load grocery list.'))
      .finally(() => setLoading(false));
  }, [planId]);

  const toggleItem = (key) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-4 italic">
            Procurement System / Fetching
          </div>
          <div className="text-4xl font-black tracking-tighter uppercase text-black">
            Loading procurement list...
          </div>
          <div className="mt-6 flex justify-center gap-1">
            <div className="w-1 h-1 bg-black animate-pulse"></div>
            <div className="w-1 h-1 bg-black animate-pulse delay-75"></div>
            <div className="w-1 h-1 bg-black animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-8">
        <div className="text-center max-w-md">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-4 italic">
            System Error / Procurement
          </div>
          <div className="text-3xl font-black tracking-tighter uppercase text-black mb-4">
            {error}
          </div>
          <button
            onClick={() => navigate('/results')}
            className="mt-6 bg-primary text-white px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Back to Plan
          </button>
        </div>
      </div>
    );
  }

  const grouped = groceryStore.items;
  const aisles = Object.keys(grouped);

  const totalCost = aisles.reduce((sum, aisle) => {
    return sum + (grouped[aisle] || []).reduce((s, item) => {
      return s + (item.estimated_cost_usd || 0);
    }, 0);
  }, 0);

  const totalItems = aisles.reduce((sum, aisle) => sum + (grouped[aisle] || []).length, 0);
  const itemsToProcure = totalItems - checkedItems.size;

  const handlePrint = () => window.print();

  const handleCopy = () => {
    const lines = aisles.flatMap(aisle =>
      [`\n${aisle.toUpperCase()}`, ...(grouped[aisle] || []).map(item =>
        `  ${item.name}  ${item.quantity_g}g  $${item.estimated_cost_usd?.toFixed(2)}`
      )]
    );
    navigator.clipboard.writeText(lines.join('\n')).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased">

      {/* Fixed Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.06)] flex justify-between items-center px-8 py-6">
        <div className="text-2xl font-black tracking-tighter uppercase text-black">FridgeToFit</div>
        <div className="hidden md:flex items-center gap-8">
          <a
            onClick={() => navigate('/results')}
            className="text-zinc-400 hover:text-black cursor-pointer transition-colors"
          >
            Plan
          </a>
          <a className="text-black border-b-2 border-black pb-1 font-bold cursor-default">
            Groceries
          </a>
        </div>
        <button className="bg-primary text-on-primary px-4 py-2 text-xs font-bold uppercase tracking-widest active:scale-[0.98] duration-200">
          Get Started
        </button>
      </nav>

      {/* Main */}
      <main className="pt-32 pb-48 px-8 max-w-screen-xl mx-auto">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <div className="max-w-2xl">
            <div className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4 italic">
              Inventory Precision / List_042
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase mb-6">
              Groceries
            </h1>
            <p className="text-zinc-500 font-medium max-w-md">
              Weekly procurement plan optimized for clinical nutritional standards and current inventory levels.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="group bg-surface-container-low hover:bg-surface-container-high px-6 py-4 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 transition-all"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Print
            </button>
            <button
              onClick={handleCopy}
              className="group bg-surface-container-low hover:bg-surface-container-high px-6 py-4 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 transition-all"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </button>
          </div>
        </header>

        {/* Aisle Grid */}
        {aisles.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-4 italic">
              Inventory Status
            </div>
            <div className="text-4xl font-black tracking-tighter uppercase text-black">
              Nothing to buy
            </div>
            <p className="text-zinc-400 mt-4 text-sm">All meals are covered by current inventory.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {aisles.map((aisle, aisleIndex) => {
              const items = grouped[aisle] || [];
              return (
                <section key={aisle} className="md:col-span-12">
                  {/* Aisle Header */}
                  <div className="flex items-center justify-between mb-8 border-b border-zinc-200/50 pb-4">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black bg-primary text-white px-2 py-0.5 tracking-tighter">
                        {String(aisleIndex + 1).padStart(2, '0')}
                      </span>
                      <h2 className="text-xl font-black uppercase tracking-tight">
                        {aisle}
                      </h2>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                      {items.length} {items.length === 1 ? 'Item' : 'Items'}
                    </span>
                  </div>

                  {/* Item Rows */}
                  <div className="space-y-4">
                    {items.map((item, itemIndex) => {
                      const itemKey = `${aisle}-${itemIndex}`;
                      const isChecked = checkedItems.has(itemKey);
                      return (
                        <div
                          key={itemIndex}
                          className={`group flex items-center justify-between py-6 px-4 transition-all ${
                            isChecked
                              ? 'opacity-40 bg-surface-container-low'
                              : 'bg-surface-container-lowest hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-6">
                            {/* Checkbox */}
                            <button
                              onClick={() => toggleItem(itemKey)}
                              aria-label={isChecked ? `Uncheck ${item.name}` : `Check ${item.name}`}
                              aria-pressed={isChecked}
                              className={`w-5 h-5 flex items-center justify-center cursor-pointer transition-all flex-shrink-0 ${
                                isChecked
                                  ? 'bg-primary border-primary'
                                  : 'border border-outline-variant group-hover:border-primary'
                              }`}
                            >
                              {isChecked && (
                                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </button>

                            {/* Name + Quantity */}
                            <div>
                              <h3 className={`font-bold uppercase tracking-tight text-sm ${isChecked ? 'line-through decoration-2' : ''}`}>
                                {item.name}
                              </h3>
                              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
                                Qty: {item.quantity_g}g
                              </span>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="flex items-center gap-8">
                            <span className={`text-[10px] font-mono font-bold text-zinc-400 ${isChecked ? 'line-through' : ''}`}>
                              EST. ${item.estimated_cost_usd?.toFixed(2) ?? '—'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      {/* Sticky Footer Totals */}
      <div className="fixed bottom-0 w-full bg-white/95 backdrop-blur-xl z-40 py-8 px-8 border-t border-zinc-200/50">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-12">
            <div>
              <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">
                Items To Procure
              </span>
              <span className="text-3xl font-black tracking-tighter">
                {String(itemsToProcure).padStart(2, '0')}
              </span>
            </div>
            <div>
              <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">
                Checked Off
              </span>
              <span className="text-3xl font-black tracking-tighter text-zinc-300">
                {String(checkedItems.size).padStart(2, '0')}
              </span>
            </div>
            <div className="hidden lg:block">
              <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">
                Total Items
              </span>
              <span className="text-3xl font-black tracking-tighter">
                {String(totalItems).padStart(2, '0')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-12 w-full md:w-auto">
            <div className="text-right">
              <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">
                Estimated Weekly Total
              </span>
              <span className="text-5xl font-black tracking-tighter leading-none">
                ${totalCost.toFixed(2)}
              </span>
            </div>
            <button className="bg-primary text-white h-20 px-12 group relative overflow-hidden flex items-center gap-4 transition-transform active:scale-95">
              <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Checkout List</span>
              <svg
                className="w-4 h-4 translate-x-0 group-hover:translate-x-2 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-zinc-50 w-full py-12 px-8 border-t border-zinc-200/20 text-[10px] uppercase tracking-[0.05em]">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 w-full max-w-screen-2xl mx-auto">
          <div className="font-black text-black">FRIDGETOFIT</div>
          <div className="flex flex-wrap gap-8">
            <a href="#" className="text-zinc-500 hover:text-black underline transition-all">Privacy</a>
            <a href="#" className="text-zinc-500 hover:text-black underline transition-all">Terms</a>
            <a href="#" className="text-zinc-500 hover:text-black underline transition-all">Clinical Standards</a>
            <a href="#" className="text-zinc-500 hover:text-black underline transition-all">Support</a>
          </div>
          <div className="text-zinc-500">2024 FRIDGETOFIT. CLINICAL PRECISION.</div>
        </div>
      </footer>

    </div>
  );
}
