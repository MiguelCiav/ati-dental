import React from 'react';
import './InputField.css'; // Reusing standard input styles

const SelectField = ({
    label,
    name,
    value,
    onChange,
    options = [],
    error,
    helperText,
    icon: Icon,
    disabled = false,
    required = false,
    fullWidth = true,
    ...props
}) => {
    return (
        <div className={`input-field ${fullWidth ? 'full-width' : ''}`}>
            {label && (
                <label htmlFor={name} className="input-label">
                    {label}
                    {required && <span className="required-indicator">*</span>}
                </label>
            )}

            <div className={`input-wrapper ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}>
                {Icon && (
                    <div className="input-icon">
                        <Icon size={20} />
                    </div>
                )}

                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    className={`input-control ${Icon ? 'has-icon' : ''}`}
                    {...props}
                >
                    {options.map((option, index) => (
                        <option key={index} value={option.value} disabled={option.disabled}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {error && <span className="input-error">{error}</span>}
            {helperText && !error && <span className="input-helper">{helperText}</span>}
        </div>
    );
};

export default SelectField;
