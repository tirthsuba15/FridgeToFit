import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased flex flex-col">

      {/* Nav */}
      <nav className="w-full flex justify-between items-center px-8 py-6">
        <div className="text-2xl font-black tracking-tighter uppercase text-black">FridgeToFit</div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col justify-center px-8 max-w-screen-xl mx-auto w-full">
        <div className="max-w-3xl">
          <div className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-6">
            Clinical Nutrition System / Protocol 001
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase mb-8 text-black">
            What's In<br />Your Fridge?
          </h1>
          <p className="text-lg text-zinc-500 font-light max-w-md mb-12 border-l-2 border-black pl-6">
            Turn your ingredients into a full week of precision meals and workouts.
          </p>
          <button
            onClick={() => navigate('/onboarding/1')}
            className="bg-primary text-white px-10 py-4 text-xs font-bold uppercase tracking-[0.3em] hover:opacity-90 active:scale-[0.98] transition-all inline-flex items-center gap-3"
          >
            Get Started
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </main>

      {/* Bottom rule */}
      <footer className="px-8 py-8 border-t border-zinc-200/50">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            2026 FridgeToFit. Clinical Precision.
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            Nutrition × Performance
          </span>
        </div>
      </footer>

    </div>
  );
}
