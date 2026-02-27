import './Button.css';

const Button = ({
  children,
  variant = 'secondary',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className = '',
  size = 'medium',
  ...props
}) => {
  const buttonClasses = [
    'button',
    `button-${variant}`,
    `button-${size}`,
    fullWidth ? 'button-full-width' : '',
    loading ? 'button-loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="button-spinner" />
      )}
      
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className="button-icon button-icon-left" size={size === 'small' ? 16 : 20} />
      )}
      
      <span className="button-text">{children}</span>
      
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="button-icon button-icon-right" size={size === 'small' ? 16 : 20} />
      )}
    </button>
  );
};

export default Button;
