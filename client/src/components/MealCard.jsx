import './MealCard.css';

export default function MealCard({ 
  name, 
  cuisine_tag, 
  macros, 
  prep_time_min, 
  is_leftover, 
  onSwap, 
  onToggleLeftover 
}) {
  return (
    <div className={`meal-card ${is_leftover ? 'leftover' : ''}`}>
      {/* Top Row: Cuisine + Name */}
      <div className="meal-header">
        <span className="cuisine-flag">{cuisine_tag}</span>
        <h3 className={`meal-name ${is_leftover ? 'strikethrough' : ''}`}>
          {name}
        </h3>
      </div>

      {/* Leftover Label */}
      {is_leftover && (
        <div className="leftover-label">🍱 Using leftovers</div>
      )}

      {/* Macro Row */}
      <div className="macro-row">
        <span className="macro-badge">🔥 {macros?.calories ?? '—'} kcal</span>
        <span className="macro-badge">💪 {macros?.protein ?? '—'}g</span>
        <span className="macro-badge">🌾 {macros?.carbs ?? '—'}g</span>
      </div>

      {/* Prep Time Badge */}
      <div className="prep-time-badge">⏱ {prep_time_min} min</div>

      {/* Bottom Row: Action Buttons */}
      <div className="meal-actions">
        <button 
          className="action-btn swap-btn" 
          onClick={onSwap}
          title="Swap meal"
        >
          🔄
        </button>
        <button 
          className={`action-btn leftover-btn ${is_leftover ? 'active' : ''}`}
          onClick={onToggleLeftover}
          title="Mark as leftover"
        >
          🍱
        </button>
      </div>
    </div>
  );
}
