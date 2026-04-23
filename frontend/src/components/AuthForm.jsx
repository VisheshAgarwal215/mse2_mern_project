import { Link } from "react-router-dom";

const AuthForm = ({
  title,
  fields,
  formData,
  onChange,
  onSubmit,
  isLoading,
  error,
  submitText,
  footerText,
  footerLink,
  footerLinkText,
}) => {
  return (
    <div className="page auth-page">
      <div className="card auth-card">
        <h1>{title}</h1>
        <form onSubmit={onSubmit} className="form">
          {fields.map((field) => (
            <label key={field.name} className="label">
              {field.label}
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={onChange}
                required
                className="input"
                placeholder={field.placeholder}
              />
            </label>
          ))}
          {error ? <p className="error">{error}</p> : null}
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? "Please wait..." : submitText}
          </button>
        </form>
        <p className="hint">
          {footerText} <Link to={footerLink}>{footerLinkText}</Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
