import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGroceryStore from '../stores/groceryStore';
import useMealPlanStore from '../stores/mealPlanStore';
import { fetchGroceryList } from '../api/endpoints';

export default function Grocery() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading grocery list...</div>;
  if (error) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <p>{error}</p>
      <button onClick={() => navigate('/results')}>← Back to Plan</button>
    </div>
  );

  const grouped = groceryStore.items;
  const aisles = Object.keys(grouped);

  return (
    <div style={{ padding: '24px', maxWidth: 700, margin: '0 auto' }}>
      <button onClick={() => navigate('/results')} style={{ marginBottom: 16, cursor: 'pointer' }}>
        ← Back to Plan
      </button>
      <h1>Grocery List</h1>
      {aisles.length === 0 ? (
        <p>Nothing to buy — all meals are leftovers!</p>
      ) : (
        aisles.map(aisle => (
          <div key={aisle} style={{ marginBottom: 24 }}>
            <h3 style={{ textTransform: 'capitalize', borderBottom: '1px solid #ccc', paddingBottom: 4 }}>
              {aisle}
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {(grouped[aisle] || []).map((item, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span>{item.name} <span style={{ color: '#888', fontSize: 13 }}>({item.quantity_g}g)</span></span>
                  <span style={{ color: '#555' }}>${item.estimated_cost_usd?.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
