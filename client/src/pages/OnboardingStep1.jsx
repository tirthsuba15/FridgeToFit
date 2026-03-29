import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';
import { extractIngredients } from '../api/endpoints';

export default function OnboardingStep1() {
  const navigate = useNavigate();
  const setIngredients = useUserStore((state) => state.setIngredients);

  const [activeTab, setActiveTab] = useState('photo');
  const [typeIngredients, setTypeIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [photoError, setPhotoError] = useState(null);

  const handleAddIngredient = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !typeIngredients.includes(trimmed)) {
      setTypeIngredients([...typeIngredients, trimmed]);
      setInputValue('');
    }
  };

  const handleRemoveIngredient = (ingredient) => {
    setTypeIngredients(typeIngredients.filter((i) => i !== ingredient));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddIngredient();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setSelectedFile(file);
    setPhotoError(null);
    setAnalyzing(false);
  };

  const handleAnalyzeFridge = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    setPhotoError(null);

    try {
      const data = await extractIngredients(selectedFile);
      const names = (data.ingredients || []).map(i => typeof i === 'string' ? i : i.name).filter(Boolean);
      setTypeIngredients(names);
      setActiveTab('type');
    } catch (error) {
      console.error('Failed to analyze fridge photo:', error);
      setPhotoError("Couldn't read your fridge photo. Try typing ingredients instead.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleNext = () => {
    setIngredients(typeIngredients);
    navigate('/onboarding/2');
  };

  const currentIngredients = typeIngredients;
  const canProceed = currentIngredients.length >= 1;

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface antialiased">
      {/* Nav */}
      <nav className="w-full flex items-center px-8 py-6">
        <div
          className="text-2xl font-black tracking-tighter uppercase text-black cursor-pointer hover:opacity-70 transition-opacity"
          onClick={() => navigate('/')}
        >
          FridgeToFit
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10 max-w-5xl mx-auto w-full">

        {/* Header Section */}
        <header className="w-full mb-16 space-y-2">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[0.6875rem] font-bold tracking-[0.2em] uppercase text-primary border-b border-primary pb-1">
              Step 03
            </span>
            <span className="text-[0.6875rem] font-medium tracking-[0.2em] uppercase text-on-surface-variant">
              Inventory Analysis
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] max-w-2xl">
            Scan Your <br /> Environment.
          </h1>
          <p className="text-on-surface-variant text-sm tracking-tight max-w-md pt-4">
            Our clinical vision engine identifies micro and macro nutrients directly from your pantry and refrigerator contents.
          </p>
        </header>

        {/* Two-column grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Upload Zone */}
          <section className="lg:col-span-7">
            {/* Tab switcher */}
            <div className="flex gap-0 mb-4 border-b border-outline-variant/30">
              <button
                onClick={() => setActiveTab('photo')}
                className={`px-4 py-2 text-[0.6875rem] font-bold tracking-[0.15em] uppercase transition-colors ${
                  activeTab === 'photo'
                    ? 'text-primary border-b-2 border-primary -mb-px'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-sm align-middle mr-1">photo_camera</span>
                Photo
              </button>
              <button
                onClick={() => setActiveTab('type')}
                className={`px-4 py-2 text-[0.6875rem] font-bold tracking-[0.15em] uppercase transition-colors ${
                  activeTab === 'type'
                    ? 'text-primary border-b-2 border-primary -mb-px'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-sm align-middle mr-1">edit</span>
                Type
              </button>
            </div>

            {activeTab === 'photo' ? (
              <div className="flex flex-col gap-4">
                {/* Drop zone */}
                <div
                  className={`relative group cursor-pointer aspect-[4/3] bg-surface-container-lowest overflow-hidden transition-all ${
                    dragOver ? 'bg-surface-container-low ring-2 ring-primary' : 'hover:bg-surface-container-low'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input').click()}
                >
                  {/* Preview image (shown when a file is selected) */}
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Fridge preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}

                  {/* Overlay — always present; dims when preview is showing */}
                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-center p-12 border-2 border-dashed border-outline-variant/30 m-4 transition-opacity ${
                      previewUrl ? 'opacity-0 group-hover:opacity-100 bg-primary/60' : 'opacity-100'
                    }`}
                  >
                    <span className="material-symbols-outlined text-4xl mb-4 text-primary group-hover:text-on-primary transition-colors">
                      photo_camera
                    </span>
                    <h3 className="text-sm font-bold tracking-[0.1em] uppercase mb-1">
                      {previewUrl ? 'Replace photo' : 'Take or upload a photo'}
                    </h3>
                    <p className="text-xs text-on-surface-variant tracking-wide">
                      HEIC, JPG, PNG up to 20MB
                    </p>
                    {!previewUrl && (
                      <button
                        className="mt-8 px-8 py-3 bg-primary text-on-primary text-[10px] font-bold uppercase tracking-widest hover:bg-primary-fixed transition-colors active:scale-[0.98]"
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById('file-input').click();
                        }}
                      >
                        Initialize Scan
                      </button>
                    )}
                  </div>

                  {/* Analyzing overlay */}
                  {analyzing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/80 z-10">
                      <span className="material-symbols-outlined text-4xl text-on-primary animate-pulse mb-3">
                        biotech
                      </span>
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-on-primary">
                        Analyzing fridge...
                      </p>
                    </div>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  id="file-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {/* Analyze button — only shown after file selected, not while analyzing */}
                {previewUrl && !analyzing && (
                  <button
                    onClick={handleAnalyzeFridge}
                    className="w-full flex justify-between items-center bg-primary text-on-primary py-4 px-6 hover:bg-primary-fixed transition-all group"
                  >
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase">
                      Analyze Fridge
                    </span>
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                )}

                {/* Error message */}
                {photoError && (
                  <div className="flex items-start gap-2 bg-error-container px-4 py-3">
                    <span className="material-symbols-outlined text-sm text-error mt-0.5">error</span>
                    <p className="text-[10px] font-medium tracking-wide text-on-error-container uppercase">
                      {photoError}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Type tab — manual input lives here on mobile / tab-driven view */
              <div className="aspect-[4/3] bg-surface-container-lowest flex flex-col p-8">
                <label className="text-[0.6875rem] font-bold tracking-[0.1em] uppercase text-on-surface-variant block mb-6">
                  Manual Verification
                </label>
                <div className="relative group mb-6">
                  <input
                    type="text"
                    className="w-full bg-transparent border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary py-4 px-0 text-sm placeholder:text-outline-variant transition-all outline-none"
                    placeholder="Add ingredient (e.g. Spinach)"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    onClick={handleAddIngredient}
                    className="absolute right-0 top-3 p-1 text-outline-variant hover:text-primary transition-colors"
                    aria-label="Add ingredient"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>

                {/* Chips inside the type panel on mobile */}
                {currentIngredients.length > 0 && (
                  <div className="flex flex-wrap gap-2 overflow-y-auto">
                    {currentIngredients.map((ingredient) => (
                      <div
                        key={ingredient}
                        className="inline-flex items-center bg-surface-container-high px-3 py-1.5 rounded-full group hover:bg-surface-container-highest transition-colors"
                      >
                        <span className="text-[10px] font-bold tracking-tight uppercase mr-2">
                          {ingredient}
                        </span>
                        <button
                          onClick={() => handleRemoveIngredient(ingredient)}
                          className="flex items-center"
                          aria-label={`Remove ${ingredient}`}
                        >
                          <span className="material-symbols-outlined text-xs cursor-pointer text-on-surface-variant hover:text-primary transition-colors">
                            close
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Right Column: Manual Verification + Generate Plan */}
          <section className="lg:col-span-5 flex flex-col">
            <div className="flex-grow space-y-8">

              {/* Input field — always visible on desktop */}
              <div>
                <label className="text-[0.6875rem] font-bold tracking-[0.1em] uppercase text-on-surface-variant block mb-4">
                  Manual Verification
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary py-4 px-0 text-sm placeholder:text-outline-variant transition-all outline-none"
                    placeholder="Add ingredient (e.g. Spinach)"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    onClick={handleAddIngredient}
                    className="absolute right-0 top-3 p-1 text-outline-variant hover:text-primary transition-colors"
                    aria-label="Add ingredient"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>

              {/* Ingredient chips */}
              {currentIngredients.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentIngredients.map((ingredient) => (
                    <div
                      key={ingredient}
                      className="inline-flex items-center bg-surface-container-high px-3 py-1.5 rounded-full group hover:bg-surface-container-highest transition-colors"
                    >
                      <span className="text-[10px] font-bold tracking-tight uppercase mr-2">
                        {ingredient}
                      </span>
                      <button
                        onClick={() => handleRemoveIngredient(ingredient)}
                        className="flex items-center"
                        aria-label={`Remove ${ingredient}`}
                      >
                        <span className="material-symbols-outlined text-xs cursor-pointer text-on-surface-variant hover:text-primary transition-colors">
                          close
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Generate Plan CTA — only shown when ingredients exist */}
            {canProceed && (
              <div className="pt-12 border-t border-outline-variant/10 mt-12">
                <button
                  onClick={handleNext}
                  className="w-full flex justify-between items-center bg-primary text-on-primary py-6 px-8 hover:bg-primary-fixed transition-all group active:scale-[0.99]"
                >
                  <span className="text-xs font-black tracking-[0.2em] uppercase">Generate Plan</span>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
                <p className="text-[10px] text-center mt-4 text-on-surface-variant uppercase tracking-widest font-medium">
                  Algorithm will synthesize 14 optimal meal paths.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-8 bg-zinc-50 border-t border-zinc-200/20 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 w-full max-w-screen-2xl mx-auto">
          <div className="font-black text-black text-xs tracking-widest uppercase">FRIDGETOFIT.</div>
          <div className="flex flex-wrap gap-6">
            <a href="#" className="text-[10px] uppercase tracking-[0.05em] text-zinc-500 hover:text-black underline transition-all">
              Privacy
            </a>
            <a href="#" className="text-[10px] uppercase tracking-[0.05em] text-zinc-500 hover:text-black underline transition-all">
              Terms
            </a>
            <a href="#" className="text-[10px] uppercase tracking-[0.05em] text-zinc-500 hover:text-black underline transition-all">
              Clinical Standards
            </a>
            <a href="#" className="text-[10px] uppercase tracking-[0.05em] text-zinc-500 hover:text-black underline transition-all">
              Support
            </a>
          </div>
          <p className="text-[10px] uppercase tracking-[0.05em] text-zinc-500">
            &copy; 2024 FRIDGETOFIT. CLINICAL PRECISION.
          </p>
        </div>
      </footer>
    </div>
  );
}
