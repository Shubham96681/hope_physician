import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle,
  actions,
  className = '',
  padding = 'p-6'
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md ${padding} ${className}`}>
      {(title || subtitle || actions) && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;

