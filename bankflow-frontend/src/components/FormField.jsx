export default function FormField({
  label,
  htmlFor,
  hint,
  error,
  prefix,
  children,
}) {
  return (
    <div className="field">
      {label && (
        <label className="field-label" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {prefix ? (
        <div className="input-prefix-wrap">
          <span className="input-prefix">{prefix}</span>
          {children}
        </div>
      ) : (
        children
      )}
      {error ? (
        <span className="field-error" role="alert">{error}</span>
      ) : hint ? (
        <span className="field-hint">{hint}</span>
      ) : null}
    </div>
  );
}
