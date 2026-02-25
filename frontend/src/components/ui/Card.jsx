import './Card.css';

const Card = ({
  children,
  title,
  icon: Icon,
  headerAction,
  padding = 'medium',
  className = '',
  noPadding = false,
}) => {
  const cardClasses = [
    'card',
    `card-padding-${padding}`,
    noPadding ? 'card-no-padding' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses}>
      {(title || Icon || headerAction) && (
        <div className="card-header">
          <div className="card-header-content">
            {Icon && (
              <div className="card-icon">
                <Icon size={20} />
              </div>
            )}
            {title && <h3 className="card-title">{title}</h3>}
          </div>
          {headerAction && (
            <div className="card-header-action">
              {headerAction}
            </div>
          )}
        </div>
      )}
      
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default Card;
