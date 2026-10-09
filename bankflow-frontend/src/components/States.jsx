import "./States.css";

export function LoadingState({ label = "Loading…", rows = 3 }) {
  return (
    <div className="state-block" role="status" aria-live="polite">
      <span className="visually-hidden">{label}</span>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton state-skeleton-row" />
      ))}
    </div>
  );
}

export function EmptyState({ icon = "○", title, description, action }) {
  return (
    <div className="state-block state-empty">
      <div className="state-icon" aria-hidden="true">{icon}</div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", description, onRetry }) {
  return (
    <div className="state-block state-error">
      <div className="state-icon" aria-hidden="true">!</div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {onRetry && (
        <button className="btn btn-secondary btn-sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
