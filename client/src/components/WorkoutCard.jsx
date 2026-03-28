import './WorkoutCard.css';

export default function WorkoutCard({ day, focus, exercises, isRest }) {
  if (isRest) {
    return (
      <div className="workout-card rest-day">
        <div className="rest-content">
          <div className="rest-icon">🧘 Rest & Recovery</div>
          <div className="rest-subtext">Take it easy today.</div>
        </div>
      </div>
    );
  }

  const displayExercises = exercises.slice(0, 4);
  const remainingCount = exercises.length - 4;

  return (
    <div className="workout-card">
      {/* Header Row */}
      <div className="workout-header">
        <span className="workout-day">{day}</span>
        <span className="focus-pill">{focus}</span>
      </div>

      {/* Exercise List */}
      <div className="exercise-list">
        {displayExercises.map((exercise, index) => (
          <div key={index}>
            <div className="exercise-row">
              <span className="exercise-name">{exercise.name}</span>
              <span className="exercise-sets">{exercise.sets}×{exercise.reps}</span>
              {exercise.notes && (
                <span className="exercise-notes">{exercise.notes}</span>
              )}
            </div>
            {index < displayExercises.length - 1 && <div className="exercise-divider"></div>}
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="more-exercises">+ {remainingCount} more</div>
        )}
      </div>
    </div>
  );
}
