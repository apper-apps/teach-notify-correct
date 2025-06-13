const Select = ({ children, className = '', ...props }) => {
  const selectClasses = `w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${className}`;
  return (
    &lt;select className={selectClasses} {...props}&gt;
      {children}
    &lt;/select&gt;
  );
};

export default Select;