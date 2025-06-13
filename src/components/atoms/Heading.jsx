const Heading = ({ children, className = '', level = 1, ...props }) => {
  const Tag = `h${level}`;
  const baseClasses = 'font-heading font-bold text-gray-900';
  const sizeClasses = {
    1: 'text-2xl sm:text-3xl',
    2: 'text-xl sm:text-2xl',
    3: 'text-lg sm:text-xl',
    4: 'text-md sm:text-lg',
    5: 'text-base sm:text-md',
    6: 'text-sm sm:text-base'
  };

  const finalClasses = `${baseClasses} ${sizeClasses[level]} ${className}`;

  return (
    &lt;Tag className={finalClasses} {...props}&gt;
      {children}
    &lt;/Tag&gt;
  );
};

export default Heading;