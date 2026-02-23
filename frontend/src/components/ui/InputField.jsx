import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './InputField.css';

const InputField = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  icon: Icon,
  disabled = false,
  required = false,
  autoComplete,
  showPasswordToggle = true,
  fullWidth = true,
  multiline = false,
  rows = 4,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className={`input-field ${fullWidth ? 'full-width' : ''}`}>
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}
      
      <div className={`input-wrapper ${error ? 'error' : ''} ${disabled ? 'disabled' : ''} ${multiline ? 'textarea-wrapper' : ''}`}>
        {Icon && (
          <div className="input-icon">
            <Icon size={20} />
          </div>
        )}
        
        <InputComponent
          id={name}
          name={name}
          type={multiline ? undefined : inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          rows={multiline ? rows : undefined}
          className={`input-control ${Icon ? 'has-icon' : ''} ${type === 'password' && showPasswordToggle ? 'has-password-toggle' : ''} ${multiline ? 'textarea-control' : ''}`}
          {...props}
        />
        
        {type === 'password' && showPasswordToggle && !multiline && (
          <button
            type="button"
            className="password-toggle"
            onClick={handleTogglePassword}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      
      {error && <span className="input-error">{error}</span>}
      {helperText && !error && <span className="input-helper">{helperText}</span>}
    </div>
  );
};

export default InputField;
